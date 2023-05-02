import { AbstractRoute } from "../Schema";

export interface AbstractEnvironment<TRouteConfig extends AbstractRoute> {
  id?: string;
  spaceId: string;
  deployRoute(route: TRouteConfig): Promise<void>;
}
