import { EntrypointOptions, UnimplementedFeatureError } from '@lazyedge/types';
import { AbstractLanguageProcessor } from '../AbstractLanguageProcessor.class';
import { filteredOfType } from '../../helpers';
import esbuild from 'esbuild';
import { resolve as resolvePath } from 'path';
import { getAssetsDirectoryPath } from '../../assets';
import { copyFile, writeFile } from 'fs/promises';

export class TypescriptProcessor implements AbstractLanguageProcessor {
	constructor(
        private readonly options: EntrypointOptions,
	) {}

	public async bundleEntrypoint(): Promise<void> {
		// Bundling entrypoint using esbuild
		await esbuild.build({
			entryPoints: [this.options.entrypoint],
			platform: 'node',
			bundle: true,
			outfile: this.options.tmpDir + '/index.js',

			// Customizable options
			external: this.getExternalPackages(),
		});

		// Generating package.json (with custom packages and information,
		// if specified in annotations)
		
	}

	public async buildContainer(): Promise<void> {
		// Let's generate our package.json and copy-paste our .Dockerfile.typescript
		// from assets folder
		const { tmpDir } = this.options;
		const assetsPath = getAssetsDirectoryPath();

		// todo
		// implement custom dockerfile feature
		if (this.options.annotations['typescript.dockerfile']) throw new UnimplementedFeatureError();
		
		await copyFile(resolvePath(assetsPath, 'dockerfiles/Dockerfile.typescript'), resolvePath(tmpDir, 'Dockerfile'));
	
		// Generating package.json
		const externalPackages = this.getExternalPackages();
		const packageJson = this.getDefaultPackageJson();
		
		for (const externalPackage in externalPackages) {
			packageJson.dependencies[externalPackage] = 'latest';
		}

		await writeFile(resolvePath(tmpDir, 'package.json'), JSON.stringify(packageJson));
		
		// todo
		// Asking docker to build our image
	}

	private getExternalPackages(): Array<string> {
		const packages: Array<string> = [];
		if (this.options.annotations['esbuild.external']) {
			const filtered = filteredOfType(this.options.annotations['esbuild.external'], String);
			filtered.forEach((value) => packages.push(value as string));
		}

		return packages;
	}

	private getDefaultPackageJson() {
		return {
			name: 'lazyedge-function',
			private: true,
			scripts: {
				'start': 'faas-js-runtime ./index.js'
			},
			dependencies: {
				// todo
				// change to express.js-based framework
				'faas-js-runtime': '1.0.0'
			} as Record<string, string>,
		};
	}
}