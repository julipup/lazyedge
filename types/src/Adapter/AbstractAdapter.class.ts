import { AbstractEnvironment } from "../Environment";
import { AbstractRoute } from "../Schema";

export interface AbstractAdapter<TRouteConfig extends AbstractRoute, TEnvironment extends AbstractEnvironment<AbstractRoute>> {
    handleRoute(environment: TEnvironment, route: TRouteConfig): Promise<void>;
}
