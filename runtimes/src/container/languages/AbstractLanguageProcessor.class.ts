import { EntrypointOptions } from "@lazyedge/types";

export abstract class AbstractLanguageProcessor {
  constructor(options: EntrypointOptions) {}

  public abstract bundleEntrypoint(): void;
  public abstract buildContainer(): void;
}
