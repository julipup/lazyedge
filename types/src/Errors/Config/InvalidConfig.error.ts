import chalk from "chalk";
import { BaseError } from "../BaseError.class";
import { ValidationError } from "json-schema";

export class InvalidConfigError extends BaseError {
  constructor(errors: Array<ValidationError>) {
    // Tabulation is a bit cringy, but it'll work for now
    super(`Invalid config provided.
            ${errors
              .map((error, index) => {
                const propertyPath =
                  error.path.length > 0
                    ? `Property ${chalk.white(error.path.join("."))}`
                    : "Config";

                return `
                ${chalk.red(index + 1)}. ${propertyPath} ${error.message}`;
              })
              .join("")}
        `);
  }
}
