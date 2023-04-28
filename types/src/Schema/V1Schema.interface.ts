import { AbstractAdapter } from "../Adapter";
import { AbstractEnvironment } from "../Environment";

export interface AbstractRoute {
  environmentId: string;
  adapter: AbstractAdapter<AbstractRoute, AbstractEnvironment>,
  name: string;
  entrypoint: string;
}

export interface V1SchemaInterface {
  environments: Array<AbstractEnvironment>;
  routes: Array<AbstractRoute>;
}
