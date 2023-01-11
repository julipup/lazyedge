import { Schema } from 'jsonschema';

export default {
    type: "object",
    properties: {
        deploy: {
            type: "object",
            properties: {
                namespace: {
                    type: "string",
                },
                registry: {
                    type: "string",
                    required: true,
                },
                builder: {
                    type: "object",
                    properties: {
                        type: {
                            type: "string",
                            enum: ["s2i", "pack"]
                        },
                        platform: {
                            type: "string"
                        }
                    }
                }
            }
        },

        routes: {
            type: "array",
            items: {
                type: "object",
                properties: {
                    name: {
                        type: "string",
                        required: true,
                    },
                    entrypoint: {
                        type: "string",
                        required: true
                    }
                }
            },
            minItems: 0
        }
    }
} as Schema;