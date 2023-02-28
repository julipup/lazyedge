import { test } from '@japa/runner';
import { resolve as resolvePath } from 'path';
import { TypescriptProcessor } from '@lazyedge/runtimes/src/container/languages';
import { EntrypointOptions } from '@lazyedge/types';

test.group('Container Runtime -> TypeScript Processor', (group) => {
	group.tap((test) => test.tags(['container-runtime', 'cr-typescript-processor']));
    
	const entrypointPath = resolvePath(__dirname, './sources/base.ts');
	const tmpDirPath = resolvePath(__dirname, 'tmp');
	
	const options = {
		entrypoint: entrypointPath,
		tmpDir: tmpDirPath,
		annotations: {},
	} as EntrypointOptions;

	test('bundle simple handler function', async ({ assert }) => {
		const processor = new TypescriptProcessor(options);
		await processor.bundleEntrypoint();

		// Testing output file
		const handlerPackage = await require('./tmp/index.js');
		assert.isFunction(handlerPackage.handle);
		assert.equal(handlerPackage.handle(), 'hello world');
	});

	test('build docker container', async () => {
		const processor = new TypescriptProcessor(options);

		await processor.bundleEntrypoint();
		await processor.buildContainer();
	});
});