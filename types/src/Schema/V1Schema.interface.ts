import { EntrypointAnnotations } from '../EntrypointOptions.interface';

interface DeploymentConfiguration {
    namespace?: string
    registry: string,
    builder?: {
        platform?: string,
    }
}

interface Route {
    name: string,
    entrypoint: string,
    annotations?: EntrypointAnnotations,
}

export interface V1SchemaInterface {
    deploy: DeploymentConfiguration,
    routes: Array<Route>
}