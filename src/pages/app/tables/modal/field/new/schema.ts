import { COLUMN_FORMAT, COLUMN_TYPE } from '@models/base.model';
import { z } from 'zod';

const config = z.object({
	format: z
		.nativeEnum(COLUMN_FORMAT, {
			message: 'Formato obrigatório',
		})
		.optional(),
	required: z.boolean().default(false),
	display: z.boolean().default(false),
	filter: z.boolean().default(false),
	multiple: z.boolean().default(false),
	accept: z
		.array(
			z.object({
				value: z.string().trim(),
				label: z.string().trim(),
			}),
		)
		.optional(),
	default: z.string().optional(),
	relation: z
		.object({
			collection: z.string().trim(),
			path: z.string().trim(),
			slug: z.string().trim(),
		})
		.optional(),
	options: z
		.array(
			z.object({
				name: z.string().trim(),
			}),
		)
		.optional(),
});

export const Schema = z.object({
	title: z
		.string({
			message: 'Nome obrigatório',
		})
		.trim(),

	type: z.nativeEnum(COLUMN_TYPE, {
		message: 'Tipo obrigatório',
	}),
	config: config.optional(),
});

export type Type = z.infer<typeof Schema>;
