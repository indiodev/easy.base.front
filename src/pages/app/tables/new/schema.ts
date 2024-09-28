import { z } from 'zod';

export const Schema = z.object({
	title: z
		.string({
			message: 'Título obrigatório',
		})
		.min(1, { message: 'Título obrigatório' })
		.trim(),
});

export type Type = z.infer<typeof Schema>;
