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
  .action(async ({ config: configFilePath }) => {
    const logger = getDefaultLogger();
    const interactiveLogger = getInteractiveLogger();
    const context = new ExecutionContext();

    try {
      await context.parseConfiguration(resolvePath(process.cwd(), configFilePath));
    } catch(error) {
      return logger.error(error);
    };

    // Empty string to seperate sections
    logger.log("");
    
    context.routes.forEach((route) => {
      logger.scope("route", route.name).log(`${ chalk.blue(route.entrypoint) }`)
    });

    logger.log("");

    // Asking if user wants to deploy these routes
    const { confirm: doDeploy } = await Enquirer.prompt({
      type: 'confirm',
      name: 'confirm',
      message: `Do you really want to deploy these routes on your currently selected environment?\n\n${chalk.gray("Beware! yeah be aware. of something...")}`,
      initial: false,
    }) as { confirm: boolean };

    if (!doDeploy) return;

    // Deploying all these routes using their adapters
    for (const [_, route] of context.routes.entries()) {
      const adapterName = route.adapter.constructor.name;
      const environmentId = route.environmentId;

      interactiveLogger.scope("route", route.name).info(`Deploying edge function using ${ chalk.blue(route.adapter.constructor.name) }`);
      await route.adapter.handleRoute(context.environments.get(environmentId)!, route);
    };
  });