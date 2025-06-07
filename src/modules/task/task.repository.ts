// src/modules/task/task.repository.ts
import { prisma } from '../../config/prisma';
import { Prisma, Task, TaskStatus } from '@prisma/client';

export class TaskRepository {
  async create(data: Prisma.TaskCreateInput): Promise<Task> {
    return prisma.task.create({ data });
  }

  async findAllByUser(userId: number): Promise<Task[]> {
    return prisma.task.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' },
    });
  }

  async findById(id: number, userId: number): Promise<Task | null> {
    return prisma.task.findFirst({
      where: {
        id,
        userId,
      },
    });
  }

  async update(id: number, userId: number, data: Prisma.TaskUpdateInput): Promise<Task> {
    return prisma.task.updateMany({
      where: { id, userId },
      data,
    }).then(() => this.findById(id, userId) as Promise<Task>);
  }

  async complete(id: number, userId: number, i: number, status: TaskStatus): Promise<Task | null> {
    return prisma.task.update({
      where: { id, userId },
      data: {
        sequence: {
          increment: i,
        },
        status: status,
      },
    });
  }

  async delete(id: number, userId: number): Promise<void> {
    await prisma.task.deleteMany({
      where: { id, userId },
    });
  }
}
