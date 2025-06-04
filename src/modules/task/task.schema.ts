// src/modules/task/task.schema.ts
import { z } from 'zod';

export const createTaskSchema = z.object({
    title: z.string().min(1, 'Título é obrigatório'),
    description: z.string().min(1, 'Descrição é obrigatória'),
    date: z.string().refine((date) => !isNaN(Date.parse(date)), {
        message: 'Data inválida',
    }).refine((date) => new Date(date) >= new Date(), {
        message: 'A data deve maior ou igual à data atual',
    }),
    interval: z.number().int().positive().optional(),
    sequence: z.number().int().positive().optional(),
    emergency: z.boolean().optional(),
    status: z.enum(['PENDING', 'IN_PROGRESS', 'COMPLETED']).optional(),
});

export const updateTaskSchema = createTaskSchema.partial();

export type CreateTaskDTO = z.infer<typeof createTaskSchema>;
export type UpdateTaskDTO = z.infer<typeof updateTaskSchema>;
