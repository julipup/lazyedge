import { Command } from "commander";
import { existsSync, readFileSync } from "fs";
import { BaseCommand } from "./Base.command";
import { parse } from "yaml";
import { Validator, ErrorDetail } from 'jsonschema';

// Schemas
import V1Schema from "../schemas/v1.schema";
import { ValidatedConfig } from "../types";

interface ValidationError {
    errors: Array<ErrorDetail>;
};

// Exporting validate function to
// use it somewhere else in our project
export function validateConfig(config: Object): ValidationError | null {
    // Validating schema
    const validator = new Validator();
    const result = validator.validate(config, V1Schema);
    const validatedConfig = config as ValidatedConfig;

    if (result.valid) {
        // Checking route names
        validatedConfig.routes.forEach((route) => {
            if (validatedConfig.routes.find((r) => r.name == route.name && r != route)) throw new Error(`Found duplicate of route named ${ route.name }`);
        });

        return null;
    } else {
        return {
            errors: result.errors,
        };
    };
};

// Exporting command
export const ValidateCommand = BaseCommand()
    .name("validate")
    .description("Validate LazyEdge configuration file")
    .action(({ config }) => {
        // Checking config file
        if (!existsSync(config)) {
            throw new Error("Could not find configuration file");
        };

        // Reading and parsing this file
        const contents = readFileSync(config);
        const parsed = parse(contents.toString());
        
        // Validating config
        const error = validateConfig(parsed);
        if (error) throw new Error(String(error));

        console.log("Validated with 0 errors");
    });