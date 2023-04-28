import chalk from "chalk";
import { BaseError } from "../BaseError.class";

export class EnvironmentNotFound extends BaseError {
    constructor(name: string) {
        super(`Environment ${chalk.red(name)} not found.
            You'll need to add ${chalk.blue(name + ".configure({ ... })")} to ${chalk.blue("environments")} array in your lazyedge config.
        `);
    }
}