import { EntrypointAnnotations } from '@lazyedge/types';

export function fetchAnnotation<T>(from: EntrypointAnnotations, named: string): T | undefined {
	// Trying to get this annotation
	if (from[named]) {
		const value = from[named];

		// Parsing CallableFunction
		switch (typeof value) {
		case 'function':
			// todo
			// pass some kind of a Context object? I dunno
			return value();
				
		default:
			return value as T;
		}
	}

	return;
}