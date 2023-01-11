import { textSync } from "figlet";
import type { Context, StructuredReturn } from "faas-js-runtime";

export async function handle(context: Context): Promise<StructuredReturn> {
    return {
        statusCode: 200,
        body: textSync("Hello!"),
    };
};