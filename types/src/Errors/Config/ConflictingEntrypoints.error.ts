import chalk from "chalk";
import { BaseError } from "../BaseError.class";

export class ConflictingEntrypoints extends BaseError {
  constructor(filePath: string, entriesIndecies: Array<number>) {
    super(`Found conflicting entrypoint configuration
            Configurations at indecies ${chalk.red(
              entriesIndecies.join(", ")
            )} points to the same entrypoint file.
            This is an error - one entrypoint can only have one configuration.
        `);
  }
}
