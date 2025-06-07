// src/modules/task/task.schema.ts
import { z } from 'zod';

export const createTaskSchema = z.object({
    title: z.string().min(1, 'Título é obrigatório'),
    description: z.string().min(1, 'Descrição é obrigatória'),
    date: z.preprocess((arg) => {
        // Transforma string "2025-06-07" em Date
        if (typeof arg === 'string' || arg instanceof Date) {
            const parsedDate = new Date(arg);
            return isNaN(parsedDate.getTime()) ? undefined : parsedDate;
        }
        return undefined;
    }, z.date().refine((date) => {
        const today = new Date();
        const due = new Date(date);
        today.setHours(0, 0, 0, 0);
        due.setHours(0, 0, 0, 0);
        return due >= today;
    }, {
        message: 'A data deve ser maior ou igual à data atual',
    })),
    interval: z.number().int().positive().optional(),
    sequence: z.number().int().positive().optional(),
    emergency: z.boolean().optional(),
    status: z.enum(['PENDING', 'IN_PROGRESS', 'COMPLETED']).optional(),
});

export const updateTaskSchema = createTaskSchema.partial();

export type CreateTaskDTO = z.infer<typeof createTaskSchema>;
export type UpdateTaskDTO = z.infer<typeof updateTaskSchema>;
