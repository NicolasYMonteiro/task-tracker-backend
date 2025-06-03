import { prisma } from '../../config/prisma';
import { User } from '@prisma/client';

export class UserRepository {
  async findByEmail(email: string): Promise<User | null> {
    return await prisma.user.findUnique({ where: { email } });
  }

  async findById(id: number): Promise<User | null> {
    return await prisma.user.findUnique({ where: { id } });
  }

  async create(data: { name: string; email: string; password: string }): Promise<User> {
    return await prisma.user.create({ data });
  }

  async listAll(): Promise<Array<{ id: number; name: string; email: string }>> {
    return await prisma.user.findMany({ select: { id: true, name: true, email: true } });
  }

  async deleteById(id: number): Promise<void> {
    await prisma.user.delete({ where: { id } });
  }

  async update(id: number, data: Partial<Omit<User, 'id' | 'createdAt'>>): Promise<User> {
    return await prisma.user.update({ where: { id }, data });
  }
}
