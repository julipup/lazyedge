import { Command, Option } from "commander";

export function BaseCommand() {
  return new Command().option(
    "-c, --config <location>",
    "config file location",
    "lazyedge.js"
  )
}
