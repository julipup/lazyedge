import { EntrypointOptions, UnimplementedFeatureError } from "@lazyedge/types";
import { AbstractLanguageProcessor } from "../AbstractLanguageProcessor.class";
import { filteredOfType } from "../../helpers";
import esbuild from "esbuild";
import { resolve as resolvePath } from "path";
import { getAssetsDirectoryPath } from "../../assets";
import { copyFile, writeFile } from "fs/promises";
import { DockerInstance } from "../../Docker.instance";

export class TypescriptProcessor implements AbstractLanguageProcessor {
  constructor(private readonly options: EntrypointOptions) {}

  public async bundleEntrypoint(): Promise<void> {
    const { tmpDir, entrypoint } = this.options;

    // Bundling entrypoint using esbuild
    await esbuild.build({
      entryPoints: [entrypoint],
      platform: "node",
      bundle: true,
      outfile: tmpDir + "/index.js",

      // Customizable options
      external: this.getExternalPackages(),
    });

    // Generating package.json (with custom packages and information,
    // if specified in annotations)
    const externalPackages = this.getExternalPackages();
    const packageJson = this.getDefaultPackageJson();

    for (const externalPackage in externalPackages) {
      packageJson.dependencies[externalPackage] = "latest";
    }

    await writeFile(
      resolvePath(tmpDir, "package.json"),
      JSON.stringify(packageJson)
    );
  }

  public async buildContainer(): Promise<void> {
    // Let's generate our package.json and copy-paste our .Dockerfile.typescript
    // from assets folder
    const { tmpDir, logger } = this.options;
    const assetsPath = getAssetsDirectoryPath();

    // todo
    // implement custom dockerfile feature
    if (this.options.annotations["typescript.dockerfile"])
      throw new UnimplementedFeatureError();

    await copyFile(
      resolvePath(assetsPath, "dockerfiles/Dockerfile.typescript"),
      resolvePath(tmpDir, "Dockerfile")
    );

    // todo
    // add ability to add custom files to this bundle

    // Asking docker to build our image
    const buildStream = await DockerInstance.buildImage({
      context: tmpDir,
      // todo
      // add user-defined files to this list
      src: ["package.json", "index.js", "Dockerfile"],
    });

    function onFinished(error: Error | null, response: any) {
      if (error) {
        console.log("error!");
      } else {
        if (logger)
          logger.scope("build").success("Container successfully built!");
      }
    }

    function onProgress(message: any) {
      if (!message.stream) return;

      if (message.stream.startsWith("Step")) {
        if (logger) logger.scope("build", "container").await(message.stream);
      }
    }

    DockerInstance.modem.followProgress(buildStream, onFinished, onProgress);
  }

  private getExternalPackages(): Array<string> {
    const packages: Array<string> = [];
    if (this.options.annotations["esbuild.external"]) {
      const filtered = filteredOfType(
        this.options.annotations["esbuild.external"],
        String
      );
      filtered.forEach((value) => packages.push(value as string));
    }

    return packages;
  }

  private getDefaultPackageJson() {
    return {
      name: "lazyedge-function",
      private: true,
      scripts: {
        start: "faas-js-runtime ./index.js",
      },
      dependencies: {
        // todo
        // change to express.js-based framework
        "faas-js-runtime": "1.0.0",
      } as Record<string, string>,
    };
  }
}
