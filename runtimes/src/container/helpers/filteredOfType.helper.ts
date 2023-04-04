type Constructor<T> = new (...args: any[]) => T;

export function filteredOfType<TElements, TFilter extends TElements>(
  array: unknown,
  filterType: Constructor<TFilter>
): TFilter[] {
  if (!Array.isArray(array)) return [];

  return <TFilter[]>array.filter((e) => e instanceof filterType);
}
