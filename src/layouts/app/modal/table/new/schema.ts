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
	// logo: z.instanceof(File, { message: 'Campo obrigatório' }),
	config: z.object({
		layout: z.enum(['grid', 'list']),
	}),
});

export type Type = z.infer<typeof Schema>;
