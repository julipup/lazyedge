import { Command } from "commander";
import { existsSync, mkdirSync, rmSync, writeFileSync } from "fs";
import { resolve } from "path";
import { getValidatedConfig } from "../helpers";
import { Route, ValidatedConfig } from "../types";
import { BaseCommand } from "./Base.command";
import esbuild, { ImportKind } from "esbuild";
import PackageJson from "@npmcli/package-json";
import { findSync as findPackageJson } from 'new-find-package-json';
import { stringify as stringifyYaml } from "yaml";
import { execFile } from "child_process";

interface ImportInfo {
    path: string;
    kind: ImportKind | 'file-loader';
    external?: boolean;
};

// This function will use esbuild to bundle
// and transpile (to js) our route entrypoint
async function buildRoute(deployId: string, route: Route) {
    const outfile = `.lazyedge/deploy/${ deployId }/index.js`;

    // Building
    const result = esbuild.buildSync({
        entryPoints: [route.entrypoint],
        platform: "node",
        bundle: true,
        metafile: true,
        outfile,
    });
};

async function buildPackageJson(deployId: string, route: Route) {    
    // Generating new package.json
    const packageJson = {
        name: route.name,
        version: "1.0.0",
        description: `LazyEdge generated route with entrypoint ${ route.entrypoint } and name ${ route.name }`,
        main: "index.js",
        scripts: {
            start: "faas-js-runtime ./index.js",
        },
        keywords: [],
        author: "",
        license: "Apache-2.0",
        dependencies: {
            "faas-js-runtime": "^0.9.0",
        },
        devDependencies: {},
    };

    // Saving it to .lazyedge/tmp-deploy folder
    writeFileSync(`.lazyedge/deploy/${ deployId }/package.json`, JSON.stringify(packageJson));
};

async function buildFuncYaml(deployId: string, route: Route, config: ValidatedConfig) {
    // Generating basic func.yaml file and writing it
    const file = {
        specVersion: "0.34.0",
        name: route.name,
        runtime: "node",
        registry: config.deploy?.registry,
        image: "",
        imageDigest: "",
        created: new Date().toISOString(),
        invocation: {
            format: "http"
        },
        build: {
            buildpacks: [],
            builder: config.deploy?.builder?.type ?? "pack",
            buildEnvs: [],
        },
        run: {
            volumes: [],
            envs: [],
        },
        deploy: {
            namespace: config.deploy?.namespace ?? "default",
            annotations: {},
            options: {},
            labels: [],
            healthEndpoints: {
                liveness: "/health/liveness",
                readiness: "/health/readiness"
            }
        }
    };

    writeFileSync(`.lazyedge/deploy/${ deployId }/func.yaml`, stringifyYaml(file));
};

// Deploy command itself
export const DeployCommand = BaseCommand()
    .name("deploy")
    .description("Validate and then deploy all functions to Kubernetes cluster using knative func cli tool")
    .action(async ({ config: configFilePath, preserve }) => {
        // Getting our config
        const config = getValidatedConfig(configFilePath);
        if (!config) throw new Error("LazyEdge config not found");
        
        // Creating .lazyedge folder
        if (!existsSync(".lazyedge")) {
            mkdirSync(".lazyedge")
        };

        // Working with routes
        config.routes.forEach(async (route) => {
            const deployId = Buffer.from(`${ route.name }-${ route.entrypoint }`).toString("base64");

            // Clearing .lazyedge/tmp-deploy folder
            if (existsSync(`.lazyedge/deploy/${ deployId }`)) rmSync(`.lazyedge/deploy/${ deployId }`, { recursive: true, force: true });
            if (!existsSync(route.entrypoint)) throw new Error(`Entrypoint ${ route.entrypoint } for route with name ${ route.name } not found`);

            // Building our route
            await buildRoute(deployId, route);

            // Building package.json
            await buildPackageJson(deployId, route);

            // Generating func.yaml file
            await buildFuncYaml(deployId, route, config);

            // Asking knative func cli to build and deploy our function from .lazyedge/tmp-deploy
            const funcCli = resolve(__dirname, "..", "assets", "func", process.platform == "win32" ? "windows.exe" : "linux");
            
            // Preparing cli options
            const options: Array<string> = [];

            if (config.deploy.builder?.type) options.push(`--builder=${ config.deploy.builder.type }`);
            if (config.deploy.builder?.platform) options.push(`--platform=${ config.deploy.builder.platform }`);

            // Running func cli with global options
            const func = execFile(`${funcCli}`, ['deploy', ...options], {
                cwd: `.lazyedge/deploy/${ deployId }`,
            });

            console.log(`[${ route.name } deploy command]`, funcCli, "deploy", ...options);

            func.on("spawn", () => {
                console.log(`[${ route.name }] Builder spawned`);
            })
            .on("message", (message) => {
                console.log(`[${ route.name } message] ${ message }`)
            })
            .on("exit", () => {
                console.log(`[${ route.name }] Builder exited`);
            })
            .on("error", (error) => {
                console.log(`[${ route.name }] ${ error.name }: ${ error.message }`)
            })
            .stdout?.on('data', (data) => {
                console.log(`[${ route.name }] ${ data }`);
            })
            
            func.stderr?.on('data', (data) => {
                console.log(`[${ route.name } error] ${ data }`);
            });
        });
    });