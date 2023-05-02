# lazyedge

This is as much of a test and uncooked product as possible. Its main goal (for now) is to use the Knative Func CLI to publish functions.

In the future - most likely - I will make something more useful out of this project.

# Plans

- [x] Rewrite lazyedge config file to use JS instead of YAML (and try to include TypeScript definitions in bundled package)
  - [x] Add ability to import CommonJS, ESM or TypeScript configs
  - [ ] Include type definitions in bundled package
- [x] Rewrite build and deploy logic to use abstract JS classes like **AbstractAdapter** and **AbstractRuntime**
- [ ] Write first **adapter** plugin:
  - [ ] _@lazyedge/adapters/knative_: Knative adapter, that deploys builded container to Knative instance on kubernetes cluster
    - [x] Implement TypeScript language processor
    - [ ] Implement environment configuration
    - [ ] Fully implement deployment logic
- [ ] Create some samples and templates
- [ ] Global and per-function configuration:
  - [ ] Environmental variables
  - [ ] Kubernetes labels
- [ ] Fix tests
- [ ] Add new tests to cover new logic and features
- [x] Add more fancy and easy-to-understand errors
- [ ] Add automatically generated route typings

  Every serverless service has different runtime globals and imports, and we need to account them while we're developing our functions. My proposition is to add `.generateTypings(...)` function to _AbstractAdapter_. This function will take our route's location and generate language-specific type helpers, which will tell our IDE which globals and imports are available.
- [ ] Fix config file importing issues - because it, for some reason, can not import esm files correctly.
- [x] Space system
- [ ] Add documentation for spaces system