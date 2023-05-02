import { AbstractAdapter } from "../Adapter";
import { AbstractEnvironment } from "../Environment";

export interface AbstractRoute {
  environmentId: string;
  adapter: AbstractAdapter<AbstractRoute, AbstractEnvironment<AbstractRoute>>,
  name: string;
  entrypoint: string;
}

export interface V1SchemaInterface {
  environments: Array<AbstractEnvironment<AbstractRoute>>;
  routes: Array<AbstractRoute>;
}
