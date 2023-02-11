import { test } from "@japa/runner";
import { resolve as resolvePath } from 'path';
import { TypescriptProcessor } from '@lazyedge/runtimes/src/container/languages';
import { EntrypointOptions } from "@lazyedge/types";

test.group('Container Runtime -> TypeScript Processor', (group) => {
    group.tap((test) => test.tags(['container-runtime', 'cr-typescript-processor']));
    
    test('bundle simple handler function', async ({ assert }) => {
        const entrypointPath = resolvePath(__dirname, './sources/base.ts');
        const outfilePath = resolvePath(__dirname, 'tmp', 'base.js');
        
        const options = {
            entrypoint: entrypointPath,
            outfile: outfilePath,
            annotations: {},
        } as EntrypointOptions;

        const processor = new TypescriptProcessor(options);
        await processor.bundleEntrypoint();

        // Testing output file
        const handler = await require('./tmp/base.js');
        assert.isFunction(handler.default);
        assert.equal(handler.default(), "hello world");
    });

    // todo
    // build docker container
})