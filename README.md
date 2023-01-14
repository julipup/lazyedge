# lazyedge

This is as much of a test and uncooked product as possible. Its main goal (for now) is to use the Knative Func CLI to publish functions.

In the future - most likely - I will make something more useful out of this project.

# Plans

- [ ] Rewrite lazyedge config file to use JS instead of YAML (and try to include TypeScript definitions in bundled package)
- [ ] Rewrite build and deploy logic to use abstract JS classes like AbstractBuilder or AbstractDeployer
    - [ ] We also need to create some kind of an "actions" system, so plugins *(which will implement these abstracted classes)* will be able to do something. Example actions: `createFolder()`, `execCommand()`, `moveFiles()`, `customAction()` *<- customAction with custom, plugin-provided code*
- [ ] Write test **build** and **deploy** plugins:
    - [ ] *@lazyedge/typescript*: bundle function's entrypoint using esbuild *(with --bundle flag, for now)*, create package.json with function information and used packages
        - [ ] Add ability to customize bundled application's package.json
        - [ ] Add ability to include custom files and folder into bundle
    - [ ] *@lazyedge/knative*: build function container using custom Dockerfile
        - [ ] Add ability to specify custom Dockerfile for deployments
- [ ] Create some samples and templates
- [ ] Global and per-function configuration:
    - [ ] Environmental variables
    - [ ] Kubernetes labels
- [ ] *@lazyedge/docker*: deploy builded function containerss to docker?
