import { ConfigNotFoundError, UnknownError, V1SchemaInterface } from "@lazyedge/types";
import { SchemaParser } from "./SchemaParser.class";
import { esmRequire } from "@poppinss/utils";
import path, { ParsedPath } from 'path';

class ImporterResult {
    constructor(
        private readonly data: any,
    ) {}

    public raw(): any {
        return this.data;
    };

    public asSchemaParser(): SchemaParser {
        return new SchemaParser(this.data);
    };

    public asConfig(): V1SchemaInterface {
        return this.asSchemaParser().raw();
    };
};

export class ConfigFileImporter {
    public static from(file: string): ImporterResult {
        // Trying to import config
        try {
            const imported = esmRequire(file);
            return new ImporterResult(imported);
        } catch(error: any) {
            console.log("error:", error);
            if (error?.code == "MODULE_NOT_FOUND") {
                throw new ConfigNotFoundError();
            };

            throw new UnknownError();
        };
    };
};