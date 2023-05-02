import chalk from "chalk";
import { BaseError } from "../BaseError.class";

export class SpaceNotFound extends BaseError {
    constructor(spaceId: string) {
        // todo
        // send different message if spaceId == "default"?
        super(`Space with id ${chalk.red(spaceId)} not found
            To add space with id ${chalk.blue(spaceId)}, you'll need to call ${chalk.blue(`.inSpace(${spaceId})`)} method on Environment builder
                                                            or
            Initialize your environment with appropriate spaceId. You'll need to consult docs to find out how to do it.
        `);
    }
};