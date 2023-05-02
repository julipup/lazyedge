import { BaseCommand } from "./Base.command";
import { getDefaultLogger, getInteractiveLogger } from "../logger.instance";
import { resolve as resolvePath } from "path";
import Enquirer from "enquirer";
import chalk from "chalk";
import { ExecutionContext } from "../context";

// Deploy command itself
export const DeployCommand = BaseCommand()
  .name("deploy")
  .description(
    "Validate and then deploy all functions to Kubernetes cluster using knative func cli tool"
  )
  .option(
    "-s, --space <space>",
    "specify space name, in which we should deploy all these edge functions",
    "default"
  )
  .action(async ({ config: configFilePath, space: spaceId }) => {
    const logger = getDefaultLogger();
    const interactiveLogger = getInteractiveLogger();
    const context = new ExecutionContext(spaceId);

    try {
      await context.parseConfiguration(
        resolvePath(process.cwd(), configFilePath)
      );
    } catch (error) {
      return logger.error(error);
    }

    // Empty string to seperate sections
    logger.log("");

    const routesArray = [...context.routes.values()].sort((x, y) =>
      x.willBeDeployed ? -1 : 1
    );

    // todo
    // prettify this damn message
    routesArray.forEach((route) => {
      logger
        .scope(
          "route",
          route.spaceIds.length > 0
            ? route.spaceIds
                .map((x) => (x == spaceId ? chalk.blue(x) : x))
                .join(", ")
            : chalk.red("no environments, no space"),
          route.willBeDeployed ? chalk.green("Deploy") : chalk.red("Skip")
        )
        .log(`${chalk.blue(route.entrypoint)}`);
    });

    logger.log("");

    // Asking if user wants to deploy these routes
    const { confirm: isRoutesCorrect } = (await Enquirer.prompt({
      type: "confirm",
      name: "confirm",
      message: `Do you really want to deploy these routes in ${chalk.blue(
        spaceId
      )} space?\n\n${chalk.gray("Beware!...")}`,
      initial: false,
    })) as { confirm: boolean };

    if (!isRoutesCorrect) return;

    // todo
    // show selected environments? and their configurations? (overkill, probably)

    // Deploying all these routes using their adapters
    for (const route of routesArray.filter((route) => route.willBeDeployed)) {
      const adapterName = route.adapter.constructor.name;
      const environmentId = route.environmentId;

      interactiveLogger
        .scope("route", route.name)
        .info(
          `Deploying edge function ${chalk.blue(route.name)} on ${chalk.blue(
            spaceId
          )} space using ${chalk.blue(route.adapter.constructor.name)}`
        );
      await route.adapter.handleRoute(
        context.getEnvironment(environmentId)!,
        route
      );
    }
  });
