type AnnotationValue = string | boolean | number | Array<string> | CallableFunction;
export type EntrypointAnnotations = Record<string, AnnotationValue>;
export type ComputedEntrypointAnnotations = Record<string, Omit<AnnotationValue, 'CallableFunction'>>;

export interface EntrypointOptions {
    entrypoint: string,
    outfile: string,
    annotations: ComputedEntrypointAnnotations,
}