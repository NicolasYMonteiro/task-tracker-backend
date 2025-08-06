import { UserRepository } from './user.repository';
import { hashPassword, comparePassword } from '../../utils/hash';
import { generateToken } from '../../utils/jwt';
import { User } from '@prisma/client';
import { Task, TaskStatus, UserProfile } from '../../utils/types'; // Supondo que você tenha um tipo UserProfile definido

interface CreateUserDTO {
  name: string;
  email: string;
  password: string;
}

interface LoginDTO {
  email: string;
  password: string;
}

export class UserService {
  private userRepository = new UserRepository();

  async register(data: CreateUserDTO): Promise<Omit<User, 'password'>> {
    const existingUser = await this.userRepository.findByEmail(data.email);
    if (existingUser) throw new Error('Email já está em uso.');

    const hashedPassword = await hashPassword(data.password);
    const newUser = await this.userRepository.create({
      ...data,
      password: hashedPassword,
    });

    const { password, ...userWithoutPassword } = newUser;
    return userWithoutPassword;
  }

  async login(data: LoginDTO): Promise<{ token: string; user: Omit<User, 'password'> }> {
    const user = await this.userRepository.findByEmail(data.email);
    if (!user) {
      throw new Error('Credenciais inválidas.');
    }

    const passwordMatch = await comparePassword(data.password, user.password);
    if (!passwordMatch) throw new Error('Credenciais inválidas.');

    const token = generateToken({ userId: user.id });

    const { password, ...userWithoutPassword } = user;
    return { token, user: userWithoutPassword };
  }

  /*async getById(id: number): Promise<Omit<User, 'password'> | null> {
    const user = await this.userRepository.findById(id);
    if (!user) return null;

    const { password, ...userWithoutPassword } = user;
    return userWithoutPassword;
  }*/
  // user.service.ts
  async getProfileData(id: number): Promise<UserProfile | null> {
    const user = await this.userRepository.findByIdWithTasks(id);
    if (!user) return null;

    const now = new Date();

    // Calcular estatísticas das tarefas
    const completedTasks = user.tasks.filter(t => t.status === 'COMPLETED');
    const pendingTasks = user.tasks.filter(t => t.status === 'PENDING');
    const overdueTasks = pendingTasks.filter(t => t.date < now);

    // Calcular tempo médio de conclusão
    let averageCompletionTime = 0;
    if (completedTasks.length > 0) {
      const totalDays = completedTasks.reduce((sum, task) => {
        const diffTime = task.date.getTime() - task.createdAt.getTime();
        return sum + Math.ceil(diffTime / (1000 * 60 * 60 * 24));
      }, 0);
      averageCompletionTime = parseFloat((totalDays / completedTasks.length).toFixed(1));
    }

    // Pegar tarefas recentes (últimas 5 ordenadas por data)
    const recentTasks = user.tasks
      .sort((a, b) => b.date.getTime() - a.date.getTime())
      .slice(0, 5)
      .map(task => ({
        id: task.id,
        title: task.title,
        status: task.status,
        date: task.date
      }));

    return {
      id: user.id,
      name: user.name,
      email: user.email,
      createdAt: user.createdAt,
      taskStats: {
        total: user.tasks.length,
        completed: completedTasks.length,
        pending: pendingTasks.length,
        overdue: overdueTasks.length,
        highPriority: user.tasks.filter(t => t.emergency).length,
        averageCompletionTime
      },
      recentTasks
    };
  }

  async deleteUser(id: number): Promise<void> {
    await this.userRepository.deleteById(id);
  }

  async updateUser(id: number, data: Partial<Omit<User, 'id' | 'createdAt' | 'password'>>): Promise<Omit<User, 'password'>> {
    const updated = await this.userRepository.update(id, data);
    const { password, ...userWithoutPassword } = updated;
    return userWithoutPassword;
  }
}
