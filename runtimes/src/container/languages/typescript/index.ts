import { EntrypointOptions } from '@lazyedge/types';
import { AbstractLanguageProcessor } from '../AbstractLanguageProcessor.class';
import esbuild from 'esbuild';
import { resolve } from 'path';
import { filteredOfType, isArrayOfType } from '../../helpers';

export class TypescriptProcessor implements AbstractLanguageProcessor {
	constructor(
        private readonly options: EntrypointOptions,
	) {}

	public async bundleEntrypoint(): Promise<void> {
		// Bundling entrypoint using esbuild
		const external: Array<string> = [];
		if (this.options.annotations['esbuild.external']) {
			const filtered = filteredOfType(this.options.annotations['esbuild.external'], String);
			filtered.forEach((value) => external.push(value));
		}
        
		await esbuild.build({
			entryPoints: [this.options.entrypoint],
			platform: 'node',
			bundle: true,
			outfile: resolve(this.options.workdir, 'index.js'),

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