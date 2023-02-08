import { Schema } from 'jsonschema';

export default {
	type: 'object',
	properties: {
		deploy: {
			type: 'object',
			required: true,
			properties: {
				namespace: {
					type: 'string',
					required: false,
				},
				registry: {
					type: 'string',
					required: true,
				},
				builder: {
					type: 'object',
					required: false,
					properties: {
						type: {
							type: 'string',
							required: false,
							enum: ['s2i', 'pack']
						},
						platform: {
							type: 'string',
							required: false,
						}
					}
				}
			}
		},
		
		routes: {
			type: 'array',
			required: true,
			items: {
				type: 'object',
				properties: {
					name: {
						type: 'string',
						required: true,
					},
					entrypoint: {
						type: 'string',
						required: true
					}
				}
			},
			minItems: 0
		}
	}
} as Schema;