import { AbstractRuntimeBuilder, EntrypointOptions, LanguageNotSupportedError } from '@lazyedge/types';
import { extname } from 'path';
import { ConstructorOptions } from './ConstructorOptions.interface';
import { AbstractLanguageProcessor, TypescriptProcessor } from './languages';

export class ContainerRuntime implements AbstractRuntimeBuilder<ConstructorOptions> {
	constructor(
        private readonly options: ConstructorOptions,
	) {}

	// HandleEntrypoint function
	public async handleEntrypoint(options: EntrypointOptions): Promise<EntrypointHandlerResult> {
		const ext = extname(options.entrypoint);
		let processor: AbstractLanguageProcessor;

		// Bundling this entrypoint depending on it's extension
		// P.S. Currently only TypeScript is supported
		switch (ext) {
		case '.ts':
			// Using TypescriptProcessor to do this job
			processor = new TypescriptProcessor(options);
			break;
        
		default:
			throw new LanguageNotSupportedError();
		}

		// Bundling entrypoint using
		await processor.bundleEntrypoint();

		// Building docker container
		await processor.buildContainer();

		// Returning results
		return {};
	}
}

export interface EntrypointHandlerResult {

}