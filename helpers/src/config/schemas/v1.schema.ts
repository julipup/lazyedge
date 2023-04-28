import { Schema } from "jsonschema";

export default {
  type: "object",
  properties: {
    environments: {
      type: "array",
      required: true,
      items: {
        type: "object",
        properties: {

        },
      },
    },

    routes: {
      type: "array",
      required: true,
      items: {
        type: "object",
        properties: {
          adapter: {
            type: "object",
            required: true
          },
          name: {
            type: "string",
            required: true,
          },
          entrypoint: {
            type: "string",
            required: true,
          },
        },
      },
      minItems: 0,
    },
  },
  additionalProperties: false,
} as Schema;
