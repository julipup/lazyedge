import { AbstractEnvironment } from "@lazyedge/types";
import { KnativeRoute } from "./KnativeRoute";
import { EnvironmentBuilder } from "./helpers";
import { Signale } from "signale";

export interface KnativeEnvironmentConfig {
  registry?: string;
}

export class KnativeEnvironment implements AbstractEnvironment<KnativeRoute> {
  private readonly logger = new Signale();

  constructor(
    public readonly id: string,
    public readonly spaceId: string,
    private readonly registry: string
  ) {}

  public async deployRoute(route: KnativeRoute) {
    this.logger.log("Deploying route:", route);
  }

  public static builder(): EnvironmentBuilder {
    return new EnvironmentBuilder();
  }

  public static configure(
    config: KnativeEnvironmentConfig,
    spaceId?: string
  ): KnativeEnvironment {
    return new KnativeEnvironment(
      KnativeEnvironment.name,
      spaceId ?? "default",
      config.registry ?? "docker.io"
    );
  }
}
