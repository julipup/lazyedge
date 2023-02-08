import { InvalidConfigError, V1SchemaInterface } from '@lazyedge/types';
import { V1Schema } from '../schemas';
import { validate } from 'jsonschema';
import { fetchAnnotation } from '../../annotations';

export class SchemaParser {
    constructor(schema: Object) {
        const result = validate(schema, V1Schema, {
            required: true,
        });

        if (!result.valid) throw new InvalidConfigError();

        this.schema = schema as V1SchemaInterface;
    }

    private schema: V1SchemaInterface;

    public raw(): V1SchemaInterface {
        return this.schema;
    };

    public computed(): V1SchemaInterface {
        const computed = this.raw();

        // Computing computable annotations
        for (const route of computed.routes) {
            if (route.annotations) {
                for (const key of Object.keys(route.annotations)) {
                    route.annotations[key] = fetchAnnotation<any>(route.annotations, key);
                };
            };
        };

        return computed;
    };
};