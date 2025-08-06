import { prisma } from '../../config/prisma';
import { User } from '@prisma/client';
import { Task } from '../../utils/types';

export class UserRepository {
  async findByEmail(email: string): Promise<User | null> {
    return await prisma.user.findUnique({ where: { email } });
  }

  /*async findById(id: number): Promise<User | null> {
    return await prisma.user.findUnique({ where: { id } });
  }*/

  async findByIdWithTasks(id: number): Promise<(User & { tasks: Task[] }) | null> {
    return await prisma.user.findUnique({
      where: { id },
      include: {
        tasks: {
          orderBy: {
            date: 'desc'
          }
        }
      }
    });
  }

  async create(data: { name: string; email: string; password: string }): Promise<User> {
    return await prisma.user.create({ data });
  }

  async deleteById(id: number): Promise<void> {
    await prisma.user.delete({ where: { id } });
  }

  async update(id: number, data: Partial<Omit<User, 'id' | 'createdAt'>>): Promise<User> {
    return await prisma.user.update({ where: { id }, data });
  }
}
