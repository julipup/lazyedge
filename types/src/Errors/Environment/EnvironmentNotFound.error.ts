import chalk from "chalk";
import { BaseError } from "../BaseError.class";

export class EnvironmentNotFound extends BaseError {
  constructor(name: string, spaceId: string) {
    // todo
    // somehow use spaceId argument
    super(`Environment ${chalk.red(name)} not found.
            You'll need to add ${chalk.blue(
              name + ".configure({ ... })"
            )} to ${chalk.blue("environments")} array in your lazyedge config.
        `);
  }
}
