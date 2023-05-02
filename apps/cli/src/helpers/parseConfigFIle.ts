import { V1SchemaInterface } from "@lazyedge/types";
import { ConfigFileImporter } from "@lazyedge/helpers";

export function parseConfigFile(fileLocation: string): V1SchemaInterface {
  const file = ConfigFileImporter.from(fileLocation);
  return file.asConfig();
}
