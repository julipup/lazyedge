import { Command, Option } from "commander";
import { copyFile, copyFileSync, existsSync, mkdirSync } from "fs";
import { resolve } from "path";

export const InitializeCommand = new Command()
    .name("init")
    .aliases(["initialize", "i"])
    .description("Initialize new LazyEdge configuration file")
    .argument("[folder]", "folder in which we'll bootstrap new project", ".")
    .addOption(
        new Option("-p, --preset", "project preset")
            .choices(["default"])
            .default("default")
        )
    .action((folder, { preset }) => {
        // Trying to initialize this project
        if (!existsSync(folder)) {
            mkdirSync(folder);
        };

        // Checking if we already have LazyEdge config
        // file in there
        if (existsSync(resolve(folder, "lazyedge.yaml"))) {
            console.log("LazyEdge configuration file already exists");
        };

        // Copying lazyedge configuration file
        copyFileSync(`./assets/configs/${ preset }.yaml`, resolve(folder, "lazyedge.yaml"));
    });