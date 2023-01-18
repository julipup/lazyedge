import { Command, Option } from "commander";

export function BaseCommand() {
    return new Command()
        .option("-c, --config", "config file location", "lazyedge.yaml");
};