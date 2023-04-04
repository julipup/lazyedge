import { test } from "@japa/runner";
import { resolve as resolvePath } from "path";
import { TypescriptProcessor } from "@lazyedge/runtimes/src/container/languages";
import { EntrypointOptions } from "@lazyedge/types";
import signale from "signale";

test.group("Container Runtime -> TypeScript Processor", (group) => {
  group.tap((test) =>
    test.tags(["container-runtime", "cr-typescript-processor"])
  );

  const entrypointPath = resolvePath(__dirname, "./sources/base.ts");
  const tmpDirPath = resolvePath(__dirname, "tmp");

  const options = {
    entrypoint: entrypointPath,
    tmpDir: tmpDirPath,
    logger: new signale.Signale(),
    annotations: {},
  } as EntrypointOptions;

  test("bundle simple handler function", async ({ assert }) => {
    const processor = new TypescriptProcessor(options);
    await processor.bundleEntrypoint();

    // Testing output file
    const handlerPackage = await require("./tmp/index.js");
    assert.isFunction(handlerPackage.handle);
    assert.equal(handlerPackage.handle(), "hello world");
  });

  test("build docker container", async ({ assert }) => {
    const processor = new TypescriptProcessor(options);

    assert.doesNotThrows(async () => {
      await processor.bundleEntrypoint();
      await processor.buildContainer();
    });
  }).timeout(-1);
});
