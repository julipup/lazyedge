export class BaseError extends Error {
  constructor(message?: string, prefix = "") {
    super(message ?? "Unknown error");
    this.name = prefix;
  }
}
