import { InvalidConfigError, V1SchemaInterface } from "@lazyedge/types";
import { V1Schema } from "../schemas";
import { validate } from "jsonschema";

export class SchemaParser {
  constructor(schema: Object) {
    const result = validate(schema, V1Schema, {
      required: true,
    });

    if (!result.valid) throw new InvalidConfigError(result.errors);

    this.schema = schema as V1SchemaInterface;
  }

  private schema: V1SchemaInterface;

  public raw(): V1SchemaInterface {
    return this.schema;
  }
}
