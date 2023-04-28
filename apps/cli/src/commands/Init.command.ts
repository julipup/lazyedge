import { Command } from "commander";
import { existsSync as isFileExists } from "fs";
import { resolve as resolvePath } from "path";
import enquirer from "enquirer";
import { copyFile } from "fs/promises";
import { getAssetsDirectoryPath } from "../helpers";
import chalk from "chalk";
import { Signale } from "signale";

export const InitCommand = new Command()
    .name("init")
    .description(
        "Initialize new lazyedge config file"
    )
    .action(async () => {
        const logger = new Signale();

        // Checking if we need to create new lazyedge config file (or recreate it)
        const doConfigExists = isFileExists(resolvePath(process.cwd(), "lazyedge.js")) || isFileExists(resolvePath(process.cwd(), "lazyedge.ts"));
        if (doConfigExists) {
            // Asking if user wants to recreate existing file
            const { confirm: doRecreate } = await enquirer.prompt({
                type: 'confirm',
                name: 'confirm',
                message: `Config file already exists in this directory.\nDo you want to ${chalk.red("recreate it?")}`,
                initial: false,
            }) as { confirm: boolean };

            if (!doRecreate) return;
        };
        
        // Copying lazyedge config file
        // @todo determine which file (lazyedge.js or .ts) we should copy
        //       depending on... current folder's contents?
        await copyFile(
            resolvePath(getAssetsDirectoryPath(), "configs/lazyedge.js"),
            resolvePath(process.cwd(), "lazyedge.js")
        );

        logger.success(`${doConfigExists ? "Lazyedge config recreated" : "New lazyedge config created"}`);
    });