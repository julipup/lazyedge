import {
  BaseEntrypointOptions,
  EntrypointNotFound,
  LanguageNotSupportedError,
} from "@lazyedge/types";
import { extname } from "path";
import { AbstractLanguageProcessor, TypescriptProcessor } from "./languages";
import { existsSync as isFileExists } from "fs";
import { Signale } from "signale";

export class ContainerRuntime {
  private readonly logger = new Signale().scope("container runtime");

  // HandleEntrypoint function
  public async handleEntrypoint(
    options: BaseEntrypointOptions
  ): Promise<void> {
    const ext = extname(options.entrypoint);
    let processor: AbstractLanguageProcessor;

    // Checking if our entrypoint even exists
    if (!isFileExists(options.entrypoint)) {
      throw new EntrypointNotFound(options.entrypoint);
    };

    // Bundling this entrypoint depending on it's extension
    // P.S. Currently only TypeScript is supported
    switch (ext) {
      case ".ts":
        // Using TypescriptProcessor to do this job
        processor = new TypescriptProcessor({ ...options, logger: this.logger });
        break;

      default:
        throw new LanguageNotSupportedError();
    }

    // Bundling entrypoint using
    await processor.bundleEntrypoint();

    // Building docker container
    await processor.buildContainer();

    // Returning results
    return;
  }
}