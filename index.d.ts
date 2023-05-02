declare module "json-schema" {
  interface ValidationError {
    path: Array<string>;
    property: string;
    message: string;
  }
}
