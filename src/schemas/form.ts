import * as z from "zod"

export interface CreateFormBtnProps {
    tableName: string,
    tableId: string
}

export const formSchema = z.object({
    title: z.string().min(4),
    description: z.string().optional()
})