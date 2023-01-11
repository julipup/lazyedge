export interface DeployConfig {
    namespace?: string
    registry: string,
    builder?: {
        type?: "s2i" | "pack",
        platform?: string,
    }
};

export interface Route {
    name: string,
    entrypoint: string,
};

// Validated config interface
export interface ValidatedConfig {
    deploy: DeployConfig,
    routes: Array<Route>,
};