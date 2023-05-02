import { AbstractEnvironment, AbstractRoute, ConflictingEntrypoints, EntrypointNotFound, EnvironmentNotFound, SpaceNotFound, V1SchemaInterface } from "@lazyedge/types";
import { parseConfigFile } from "../helpers";
import { existsSync as doFileExists } from "fs";
import chalk from "chalk";

export class ExecutionContext {
    // Map of spaces, which contains map of environments
    public readonly spaces: Map<string, Map<string, AbstractEnvironment<AbstractRoute>>> = new Map();
    public readonly routes: Map<String, AbstractRoute & { spaceIds: string[], willBeDeployed: boolean }> = new Map();
    
    constructor(
        public readonly spaceId = "default",
    ) {};

    private configuration: V1SchemaInterface | undefined;

    public async parseConfiguration(filePath: string) {
        this.configuration = parseConfigFile(filePath);

        // Checking all environments
        for (const environment of this.configuration.environments) {
            await this.checkEnvironment(environment);
        };

        // Checking our routes
        for (const route of this.configuration.routes) {
            await this.checkRoute(route);
        };

        // Checking our current space
        if (!this.spaces.has(this.spaceId)) {
            throw new SpaceNotFound(this.spaceId);
        };

        // todo
        // terraform-like thingie?
        // something like "these ... routes on production deployment will be updated, two routes will be removed and three added"
        // and so we'll need to add environment configurations and connectors and a lot more...
    };

    public async checkRoute(route: AbstractRoute) {
        const adapterName = route.adapter.constructor.name;
        const availableEnvironments = this.findEnvironments(route.environmentId);
        const currentEnvironment = availableEnvironments.find((x) => x.spaceId == this.spaceId);
        
        const spaceIds: Array<string> = [];
        availableEnvironments.forEach((env) => {
            if (!spaceIds.includes(env.spaceId)) {
                spaceIds.push(env.spaceId);
            };
        });

        // Checking if this route exists
        if (!doFileExists(route.entrypoint)) {
            throw new EntrypointNotFound(route.entrypoint);
        };

        if (this.routes.has(route.entrypoint)) {
            const entriesIndecies = this.configuration!.routes.map((mappedRoute, index) => mappedRoute.entrypoint == route.entrypoint ? index : null).filter((index) => index != null) as Array<number>;
            throw new ConflictingEntrypoints(route.entrypoint, entriesIndecies);
        };
        
        // todo
        // call adapter-specific method to check this route?

        this.routes.set(route.entrypoint, {
            ...route,
            spaceIds,
            willBeDeployed: spaceIds.includes(this.spaceId),
        });
    };

    public async checkEnvironment(environment: AbstractEnvironment<AbstractRoute>) {
        const spaceId = environment.spaceId;
        const environmentId = environment.id ?? environment.constructor.name;

        // todo
        // Calling environment-specific function to check itself
        
        if (!this.spaces.has(spaceId)) this.spaces.set(spaceId, new Map());
        
        const spaceMap = this.spaces.get(spaceId);
        if (!spaceMap) throw new SpaceNotFound(spaceId);

        spaceMap.set(environmentId, environment);
    };

    public getEnvironment(environmentId: string): AbstractEnvironment<AbstractRoute> | null;
    public getEnvironment(environmentId: string, spaceId = "default", doThrowError = true): AbstractEnvironment<AbstractRoute> | null {
        const spaceMap = this.spaces.get(spaceId);
        if (!spaceMap && doThrowError) throw new SpaceNotFound(spaceId);

        return spaceMap?.get(environmentId) ?? null;
    };

    public findEnvironments(environmentId: string): Array<AbstractEnvironment<AbstractRoute>> {
        // Trying to find all environments with this id in all spaces
        const foundEnvironments: Array<AbstractEnvironment<AbstractRoute>> = [];

        for (const [_, enviroments] of this.spaces.entries()) {
            if (enviroments.has(environmentId)) {
                foundEnvironments.push(enviroments.get(environmentId)!);
            };
        };

        return foundEnvironments;
    };
};