type AnnotationValue = string | boolean | number | Array<string> | CallableFunction;
export type EntrypointAnnotations = Record<string, AnnotationValue>;
export type ComputedEntrypointAnnotations = Record<string, Omit<AnnotationValue, 'CallableFunction'>>;
import { Signale } from 'signale';

export interface EntrypointOptions {
    entrypoint: string,
    tmpDir: string,
    annotations: ComputedEntrypointAnnotations,
    logger?: Signale
}