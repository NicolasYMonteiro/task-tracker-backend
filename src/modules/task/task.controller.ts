// src/modules/task/task.controller.ts
import { Request, Response } from 'express';
import { TaskService } from './task.service';
import { createTaskSchema, updateTaskSchema } from './task.schema';
import { AuthRequest } from '../../middlewares/ensureAuth';

export class TaskController {
    constructor(private readonly taskService = new TaskService()) { }

    async create(req: AuthRequest, res: Response) {
        try {
            const userId = Number(req.userId);
            const data = createTaskSchema.parse(req.body);
            const task = await this.taskService.create(userId, {
                ...data,
                date: new Date(data.date),
            });
            return res.status(201).json(task);
        } catch (error: any) {
            if (error instanceof Error && 'issues' in error) {
                return res.status(400).json({ message: 'Erro de validação', details: error });
            }
            return res.status(500).json({ message: 'Erro ao criar tarefa', details: error.message });
        }
    }

    async listAll(req: AuthRequest, res: Response) {
        const userId = Number(req.userId);
        const tasks = await this.taskService.listAll(userId);
        return res.json(tasks);
    }

    async getById(req: AuthRequest, res: Response) {
        const userId = Number(req.userId);
        const id = Number(req.params.id);
        const task = await this.taskService.getById(id, userId);
        if (!task) return res.status(404).json({ message: 'Tarefa não encontrada' });
        return res.json(task);
    }

    async update(req: AuthRequest, res: Response) {
        try {
            const userId = Number(req.userId);
            const id = Number(req.params.id);
            const data = updateTaskSchema.parse(req.body);
            const updated = await this.taskService.update(id, userId, data);
            return res.json(updated);
        } catch (error) {
            return res.status(400).json({ message: 'Erro ao atualizar tarefa', details: error });
        }
    }

    async delete(req: AuthRequest, res: Response) {
        const userId = Number(req.userId);
        const id = Number(req.params.id);
        await this.taskService.delete(id, userId);
        return res.status(204).send();
    }
}
