import { BaseError } from "../BaseError.class";
import chalk from "chalk";

export class ConfigNotFoundError extends BaseError {
    constructor(filePath: string) {
        super(`Config not found.
            Expected lazyedge's config file at ${chalk.red(filePath)}, but it wasn't found there.
            Try explicitly specifying config file location using ${chalk.blue("--config")} argument
                                            or
            try creating new lazyedge config file using ${chalk.blue("lazyedge init")} command.\n\n`
        );
    }
}
