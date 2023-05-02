import { BaseEntrypointOptions } from "@lazyedge/types";

export abstract class AbstractLanguageProcessor {
  constructor(options: BaseEntrypointOptions) {}

  public abstract bundleEntrypoint(): void;
  public abstract buildContainer(): void;
}
