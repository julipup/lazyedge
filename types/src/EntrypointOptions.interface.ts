export type EntrypointAnnotations = Record<string, string | boolean | number | Array<string> | CallableFunction>;

export interface EntrypointOptions {
    entrypoint: string,
    workdir: string,
    annotations: EntrypointAnnotations,
}