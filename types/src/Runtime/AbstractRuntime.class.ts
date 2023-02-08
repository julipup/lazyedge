import { EntrypointOptions } from '../EntrypointOptions.interface';

export abstract class AbstractRuntimeBuilder<Options> {
	constructor(options: Options) {}

    public abstract handleEntrypoint(options: EntrypointOptions): void;
}