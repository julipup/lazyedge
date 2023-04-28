import {
  EntrypointOptions,
  EntrypointNotFound,
  LanguageNotSupportedError,
} from "@lazyedge/types";
import { extname } from "path";
import { AbstractLanguageProcessor, TypescriptProcessor } from "./languages";
import { existsSync as isFileExists } from "fs";

export class ContainerRuntime {
  // HandleEntrypoint function
  public async handleEntrypoint(
    options: EntrypointOptions
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
        processor = new TypescriptProcessor(options);
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