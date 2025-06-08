// src/modules/task/task.service.ts
import { TaskRepository } from './task.repository';
import { Prisma, Task } from '@prisma/client';
import { buildWhereFilter, buildOrderBy, FilterType, OrderType } from '../../utils/queryUtils';
import { add } from 'date-fns';
import { log } from 'console';

interface ListAllParams {
  filter: FilterType;
  order: OrderType;
}

export class TaskService {
  constructor(private readonly taskRepository = new TaskRepository()) { }

  async create(userId: number, data: Omit<Prisma.TaskCreateInput, 'user'>): Promise<Task> {
    return this.taskRepository.create({
      ...data,
      sequence: data.interval !== undefined ? 0 : data.sequence,
      user: { connect: { id: userId } },
    });
  }

  async listAll(userId: number, { filter, order }: ListAllParams): Promise<Task[]> {
    const where = buildWhereFilter(userId, filter);
    const orderBy = buildOrderBy(order);

    return this.taskRepository.findAllByUser(userId, where, orderBy);
  }

  async getById(id: number, userId: number): Promise<Task | null> {
    return this.taskRepository.findById(id, userId);
  }

  async update(id: number, userId: number, data: Prisma.TaskUpdateInput): Promise<Task> {
    return this.taskRepository.update(id, userId, data);
  }

  async complete(id: number, userId: number): Promise<Task | null> {
    const task = await this.getById(id, userId);
    const i = task?.status === 'COMPLETED' ? -1 : 1;
    const status = task?.status === 'COMPLETED' ? 'PENDING' : 'COMPLETED';

    return this.taskRepository.complete(id, userId, i, status);

  }

  async delete(id: number, userId: number): Promise<void> {
    return this.taskRepository.delete(id, userId);
  }

  async resetInterval(idUser: number) {
    const now = new Date();

    const tasks = await this.taskRepository.findAllByUser(idUser);

    for (const task of tasks) {
      if (!task.interval) continue;
      const resetTime = add(new Date(task.date), { days: task.interval ?? 0 });

      if (task.date <= now) {
        if (task.status === 'COMPLETED') {
          await this.update(task.id, idUser, {
            status: 'PENDING',
            date: resetTime
          });
        } else if (task.status === 'PENDING') {
          await this.update(task.id, idUser, {
            date: resetTime,
            sequence: 0
          });
        }

      }
    }
  }

}
