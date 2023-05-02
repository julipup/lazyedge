import { AbstractAdapter, AbstractRoute } from "@lazyedge/types";
import { ContainerRuntime } from "./ContainerRuntime";
import { Signale } from "signale";
import { resolve as resolvePath } from "path";
import { KnativeRoute } from "./KnativeRoute";
import { KnativeEnvironment } from "./Environment";

interface KnativeRouteConfiguration {
    name?: string,
    entrypoint: string,
};

export class KnativeAdapter implements AbstractAdapter<KnativeRoute, KnativeEnvironment> {
    private readonly logger = new Signale();

    public async handleRoute(environment: KnativeEnvironment, route: KnativeRoute): Promise<void> {
        const tmpDir = resolvePath(process.cwd(), "tmp", encodeURI(route.entrypoint));

        // Asking our runtime to build this route
        const runtime = new ContainerRuntime();
        try {
            await runtime.handleEntrypoint({
                entrypoint: route.entrypoint,
                tmpDir,
            });
        } catch(error) {
            this.logger.error(error);
        };

        // todo
        // Deploying this container to knative
    }

    public static route(options: KnativeRouteConfiguration, environmentId?: string): KnativeRoute {
        return {
            environmentId: environmentId ?? KnativeEnvironment.name,
            adapter: new KnativeAdapter(),
            entrypoint: options.entrypoint,
            name: options.name ?? options.entrypoint,
        };
    }

    public static routes(list: Array<KnativeRouteConfiguration>, environmentId?: string): Array<KnativeRoute> {
        return list.map((route) => ({
            environmentId: environmentId ?? KnativeEnvironment.name,
            adapter: new KnativeAdapter(),
            entrypoint: route.entrypoint,
            name: route.name ?? route.entrypoint,
        }));
    };
}
