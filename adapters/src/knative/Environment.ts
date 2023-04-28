import { AbstractEnvironment } from "@lazyedge/types";

export interface KnativeEnvironmentConfig {
    registry?: string,
};

export class KnativeEnvironment implements AbstractEnvironment {
    constructor(
        private readonly registry: string,
    ) {}

    public static configure(config: KnativeEnvironmentConfig): KnativeEnvironment {
        return new KnativeEnvironment(
            config.registry ?? "docker.io",
        );
    };
};