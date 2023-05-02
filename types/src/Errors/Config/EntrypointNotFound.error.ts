import chalk from "chalk";
import { BaseError } from "../BaseError.class";

export class EntrypointNotFound extends BaseError {
  constructor(filePath: string) {
    super(`Entrypoint file not found
            Entrypoint file at ${chalk.blue(filePath)} not found.
            You'll probably need to create it :)
        `);
  }
}
