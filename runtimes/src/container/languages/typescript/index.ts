import { EntrypointOptions } from '@lazyedge/types';
import { AbstractLanguageProcessor } from '../AbstractLanguageProcessor.class';
import { filteredOfType } from '../../helpers';
import esbuild from 'esbuild';

export class TypescriptProcessor implements AbstractLanguageProcessor {
	constructor(
        private readonly options: EntrypointOptions,
	) {}

	public async bundleEntrypoint(): Promise<void> {
		// Bundling entrypoint using esbuild
		const external: Array<String> = [];
		if (this.options.annotations['esbuild.external']) {
			const filtered = filteredOfType(this.options.annotations['esbuild.external'], String);
			filtered.forEach((value) => external.push(value));
		};
        
		await esbuild.build({
			entryPoints: [this.options.entrypoint],
			platform: 'node',
			bundle: true,
			outfile: this.options.outfile,

			// Customizable options
			external: external as Array<string>,
		});

		// Generating package.json (with custom packages and information,
		// if specified in annotations)
		
	}

	public async buildContainer(): Promise<void> {
		// Using assets to just copy-and-paste default typescript dockerfile
	}
}