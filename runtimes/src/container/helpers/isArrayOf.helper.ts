type Constructor<T> = new (...args: any[]) => T;

export function isArrayOfType<T>(
  array: unknown,
  type: Constructor<T>
): boolean {
  // checking if this object is array or no
  if (!Array.isArray(array)) return false;

  // Checking if each element of array is of generic type
  for (const value of array) {
    if (!(value instanceof type)) return false;
  }

  return true;
}
