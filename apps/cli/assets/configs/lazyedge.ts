import { V1SchemaInterface } from "@lazyedge/types";

export default {
  deploy: {
    registry: "https://registry.odzi.dog",
  },
  routes: [
    {
      name: "test",
      entrypoint: "./routes/index.ts",
    },
  ],
} as V1SchemaInterface;