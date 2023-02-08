import { EntrypointAnnotations } from '@lazyedge/types';
import { fetchAnnotation } from './FetchAnnotation.helper';

export class Annotations {
	constructor(
        private readonly annotations: EntrypointAnnotations
	) {}

	public named<T>(name: string): T | undefined {
		return fetchAnnotation<T>(this.annotations, name);
	}
}