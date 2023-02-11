import { V1SchemaInterface } from '@lazyedge/types';

export default {
	deploy: {
		registry: 'unknown registry'
	},
	routes: [
		{
			name: 'test',
			entrypoint: './routes/index.ts',
		}
	]
} as V1SchemaInterface;