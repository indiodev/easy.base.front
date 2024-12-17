import { z } from 'zod';

export const Schema = z.object({
	title: z
		.string({
			message: 'Título obrigatório',
		})
		.min(1, { message: 'Título obrigatório' })
		.trim(),
	description: z
		.string({
			message: 'Descrição obrigatória',
		})
		.trim(),
	logo: z.instanceof(File, { message: 'Campo obrigatório' }).optional(),
	config: z.object({
		layout: z
			.boolean()
			.default(false)
			.transform((v) => (v ? 'grid' : 'list')),
		visibility: z
			.enum(['PUBLIC', 'FOR_LOGGED_IN', 'FOR_ADMINISTRATORS'])
			.default('PUBLIC'),
		collaboration: z.enum(['RESTRICTED', 'OPEN']).default('RESTRICTED'),
		administrators: z.array(z.string()).default([]),
	}),
});

export type Type = z.infer<typeof Schema>;
