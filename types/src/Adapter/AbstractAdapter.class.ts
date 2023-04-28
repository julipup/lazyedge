import { AbstractEnvironment } from "../Environment";
import { AbstractRoute } from "../Schema";

export interface AbstractAdapter<TRouteConfig extends AbstractRoute, TEnvironment extends AbstractEnvironment> {
    handleRoute(environment: TEnvironment, route: TRouteConfig): Promise<void>;
}
