import type { StructuredReturn } from "faas-js-runtime";

export function handle(): StructuredReturn {
    return {
        statusCode: 200,
        body: "Hello there!",
    };
};