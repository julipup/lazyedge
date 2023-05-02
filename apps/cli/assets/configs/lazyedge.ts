const { V1SchemaInterface } = require("@lazyedge/types");
const { KnativeAdapter, KnativeEnvironment } = require("@lazyedge/adapters");

module.exports = {
  environments: [KnativeEnvironment.configure({})],
  routes: [
    ...KnativeAdapter.routes([
      {
        entrypoint: "./routes/test.ts",
      },
    ]),
  ],
} as typeof V1SchemaInterface;
