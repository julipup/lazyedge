import { existsSync, readFileSync } from "fs";
import { parse } from "yaml";
import { validateConfig } from "../commands";
import { ValidatedConfig } from "../types";

export function getValidatedConfig(config = "lazyedge.yaml"): ValidatedConfig | undefined {
    // Checking if config file exists
    if (!existsSync(config)) return;

    // Getting and returning file contents
    const contents = readFileSync(config);
    const parsed = parse(contents.toString());

    const error = validateConfig(parsed);
    if (error) return;

    return parsed as ValidatedConfig;
};