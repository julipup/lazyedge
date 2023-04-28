import { AbstractAdapter, AbstractRoute } from "@lazyedge/types";
import { ContainerRuntime } from "./ContainerRuntime";
import { Signale } from "signale";
import { resolve as resolvePath } from "path";
import { KnativeRoute } from "./KnativeRoute.config";
import { KnativeEnvironment } from "./Environment";

interface KnativeRouteConfiguration {
    name?: string,
    entrypoint: string,
};

export class KnativeAdapter implements AbstractAdapter<KnativeRoute, KnativeEnvironment> {
    public async handleRoute(environment: KnativeEnvironment, route: KnativeRoute): Promise<void> {
        const logger = new Signale({});
        const tmpDir = resolvePath(process.cwd(), "tmp", encodeURI(route.entrypoint));

        // Asking our runtime to build this route
        const runtime = new ContainerRuntime();
        try {
            await runtime.handleEntrypoint({
                entrypoint: route.entrypoint,
                annotations: {},
                tmpDir,
                logger
            });
        } catch(error) {
            logger.error(error);
        };

        // todo
        // Deploying this container to knative
    }

    public static route(options: KnativeRouteConfiguration): KnativeRoute {
        return {
            environmentId: KnativeEnvironment.name,
            adapter: new KnativeAdapter(),
            entrypoint: options.entrypoint,
            name: options.name ?? options.entrypoint,
        };
    }

    public static routes(list: Array<KnativeRouteConfiguration>): Array<KnativeRoute> {
        return list.map((route) => ({
            environmentId: KnativeEnvironment.name,
            adapter: new KnativeAdapter(),
            entrypoint: route.entrypoint,
            name: route.name ?? route.entrypoint,
        }));
    };
}
