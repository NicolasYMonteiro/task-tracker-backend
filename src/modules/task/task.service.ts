// src/modules/task/task.service.ts
import { TaskRepository } from './task.repository';
import { Prisma, Task } from '@prisma/client';

export class TaskService {
  constructor(private readonly taskRepository = new TaskRepository()) {}

  async create(userId: number, data: Omit<Prisma.TaskCreateInput, 'user'>): Promise<Task> {
    return this.taskRepository.create({
      ...data,
      user: { connect: { id: userId } },
    });
  }

  async listAll(userId: number): Promise<Task[]> {
    return this.taskRepository.findAllByUser(userId);
  }

  async getById(id: number, userId: number): Promise<Task | null> {
    return this.taskRepository.findById(id, userId);
  }

  async update(id: number, userId: number, data: Prisma.TaskUpdateInput): Promise<Task> {
    return this.taskRepository.update(id, userId, data);
  }

  async delete(id: number, userId: number): Promise<void> {
    return this.taskRepository.delete(id, userId);
  }
}
