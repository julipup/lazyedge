import { BaseCommand } from "./Base.command";

// Deploy command itself
export const DeployCommand = BaseCommand()
  .name("deploy")
  .description(
    "Validate and then deploy all functions to Kubernetes cluster using knative func cli tool"
  )
  .action(async ({ config: configFilePath, preserve }) => {
    // Parsing configuration file
  });
