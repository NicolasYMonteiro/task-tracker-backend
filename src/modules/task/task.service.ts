// src/modules/task/task.service.ts
import { TaskRepository } from './task.repository';
import { Prisma, Task, TaskStatus } from '@prisma/client';

export class TaskService {
  constructor(private readonly taskRepository = new TaskRepository()) {}

  async create(userId: number, data: Omit<Prisma.TaskCreateInput, 'user'>): Promise<Task> {
    return this.taskRepository.create({
      ...data,
      sequence: data.interval !== undefined ? 0 :data.sequence,
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

  async complete(id: number, userId:number): Promise<Task | null> {
    const task = await this.getById(id, userId);
    const i = task?.status === 'COMPLETED' ? -1 : 1;
    const status = task?.status === 'COMPLETED' ? 'PENDING' : 'COMPLETED';

    return this.taskRepository.complete(id, userId, i, status);
  }

  async delete(id: number, userId: number): Promise<void> {
    return this.taskRepository.delete(id, userId);
  }
}
