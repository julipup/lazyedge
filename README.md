# lazyedge

This is as much of a test and uncooked product as possible. Its main goal (for now) is to use the Knative Func CLI to publish functions.

In the future - most likely - I will make something more useful out of this project.

# Plans

- [x] Rewrite lazyedge config file to use JS instead of YAML (and try to include TypeScript definitions in bundled package)
  - [x] Add ability to import CommonJS, ESM or TypeScript configs
  - [ ] Include type definitions in bundled package
- [x] Rewrite build and deploy logic to use abstract JS classes like **AbstractAdapter** and **AbstractRuntime**
- [ ] Write first **adapter** and **runtime** plugins:
  - [ ] _@lazyedge/runtimes/container_: Container runtime
    - [ ] Add ability to customize bundled application's package.json
    - [ ] Add ability to include custom files and folder into bundle
    - [ ] Add ability to specify custom Dockerfile for deployments
  - [ ] _@lazyedge/adapters/knative_: Knative adapter, that deploys builded container _(that was built using @lazyedge/runtimes/container)_ to Knative instance on kubernetes cluster
- [ ] Create some samples and templates
- [ ] Global and per-function configuration:
  - [ ] Environmental variables
  - [ ] Kubernetes labels
- [x] Per-function annotations
  - [x] Boolean, number and string type annotations
  - [x] Computable annotations
