import { AbstractEnvironment, AbstractRoute, ConflictingEntrypoints, EntrypointNotFound, EnvironmentNotFound, V1SchemaInterface } from "@lazyedge/types";
import { parseConfigFile } from "../helpers";
import { existsSync as doFileExists } from "fs";

export class ExecutionContext {
    public readonly environments: Map<String, AbstractEnvironment> = new Map();
    public readonly routes: Map<String, AbstractRoute> = new Map();

    private rawConfiguration: V1SchemaInterface | undefined;

    public async parseConfiguration(filePath: string) {
        this.rawConfiguration = parseConfigFile(filePath);

        // Checking all environments
        for (const environment of this.rawConfiguration.environments) {
            await this.checkEnvironment(environment);
        };

        // Checking our routes
        for (const route of this.rawConfiguration.routes) {
            await this.checkRoute(route);
        };

        // todo
        // terraform-like thingie?
        // something like "these ... routes on production deployment will be updated, two routes will be removed and three added"
        // and so we'll need to add environment configurations and connectors and a lot more...
    };

    public async checkRoute(route: AbstractRoute) {
        const adapterName = route.adapter.constructor.name;
        const environmentId = route.environmentId;

        // Checking if this route exists
        if (!doFileExists(route.entrypoint)) {
            throw new EntrypointNotFound(route.entrypoint);
        };

        if (this.routes.has(route.entrypoint)) {
            const entriesIndecies = this.rawConfiguration!.routes.map((mappedRoute, index) => mappedRoute.entrypoint == route.entrypoint ? index : null).filter((index) => index != null) as Array<number>;
            throw new ConflictingEntrypoints(route.entrypoint, entriesIndecies);
        };
        
        // Asking this route's adapter to check it's environment (if it wasn't checked before)
        console.log(this.environments.entries());
        if (!this.environments.has(environmentId)) {
            throw new EnvironmentNotFound(environmentId);
        };

        this.routes.set(route.entrypoint, route);
    };

    public async checkEnvironment(environment: AbstractEnvironment) {
        const environmentName = environment.constructor.name;

        // Calling environment-specific function to check itself
        
        this.environments.set(environmentName, environment);
    };
};