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
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());

    // Calcular estatísticas das tarefas
    const completedTasks = user.tasks.filter(t => t.status === 'COMPLETED');
    const pendingTasks = user.tasks.filter(t => t.status === 'PENDING');
    const overdueTasks = pendingTasks.filter(t => {
      const taskDate = new Date(t.date);
      const taskDateOnly = new Date(taskDate.getFullYear(), taskDate.getMonth(), taskDate.getDate());
      return taskDateOnly < today;
    });
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

  async getProductivityData(id: number): Promise<any> {
    const user = await this.userRepository.findByIdWithTasks(id);
    if (!user) return null;

    const now = new Date();
    const last30Days = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);

    // Dados para gráfico de tarefas por dia (últimos 30 dias)
    const dailyTasks = [];
    for (let i = 29; i >= 0; i--) {
      const date = new Date(now.getTime() - i * 24 * 60 * 60 * 1000);
      const dateStr = date.toISOString().split('T')[0];
      
      const dayTasks = user.tasks.filter(task => {
        const taskDate = new Date(task.date).toISOString().split('T')[0];
        return taskDate === dateStr;
      });

      dailyTasks.push({
        date: dateStr,
        total: dayTasks.length,
        completed: dayTasks.filter(t => t.status === 'COMPLETED').length,
        pending: dayTasks.filter(t => t.status === 'PENDING').length,
        overdue: dayTasks.filter(t => {
          const taskDate = new Date(t.date);
          return taskDate < new Date(date.getFullYear(), date.getMonth(), date.getDate()) && t.status === 'PENDING';
        }).length
      });
    }

    // Dados para gráfico de produtividade semanal
    const weeklyData = [];
    for (let i = 3; i >= 0; i--) {
      const weekStart = new Date(now.getTime() - (i * 7 + now.getDay()) * 24 * 60 * 60 * 1000);
      const weekEnd = new Date(weekStart.getTime() + 6 * 24 * 60 * 60 * 1000);
      
      const weekTasks = user.tasks.filter(task => {
        const taskDate = new Date(task.date);
        return taskDate >= weekStart && taskDate <= weekEnd;
      });

      weeklyData.push({
        week: `Semana ${4 - i}`,
        completed: weekTasks.filter(t => t.status === 'COMPLETED').length,
        total: weekTasks.length,
        efficiency: weekTasks.length > 0 ? 
          Math.round((weekTasks.filter(t => t.status === 'COMPLETED').length / weekTasks.length) * 100) : 0
      });
    }

    // Dados para gráfico de prioridades
    const priorityData = [
      {
        priority: 'Alta',
        count: user.tasks.filter(t => t.emergency).length,
        color: '#ef4444'
      },
      {
        priority: 'Média',
        count: user.tasks.filter(t => !t.emergency && t.status === 'PENDING').length,
        color: '#f59e0b'
      },
      {
        priority: 'Concluída',
        count: user.tasks.filter(t => t.status === 'COMPLETED').length,
        color: '#10b981'
      }
    ];

    // Dados para gráfico de tendência mensal
    const monthlyTrend = [];
    for (let i = 5; i >= 0; i--) {
      const monthStart = new Date(now.getFullYear(), now.getMonth() - i, 1);
      const monthEnd = new Date(now.getFullYear(), now.getMonth() - i + 1, 0);
      
      const monthTasks = user.tasks.filter(task => {
        const taskDate = new Date(task.date);
        return taskDate >= monthStart && taskDate <= monthEnd;
      });

      monthlyTrend.push({
        month: monthStart.toLocaleDateString('pt-BR', { month: 'short', year: 'numeric' }),
        completed: monthTasks.filter(t => t.status === 'COMPLETED').length,
        created: monthTasks.length
      });
    }

    return {
      dailyTasks,
      weeklyData,
      priorityData,
      monthlyTrend,
      summary: {
        totalTasks: user.tasks.length,
        completedTasks: user.tasks.filter(t => t.status === 'COMPLETED').length,
        completionRate: user.tasks.length > 0 ? 
          Math.round((user.tasks.filter(t => t.status === 'COMPLETED').length / user.tasks.length) * 100) : 0,
        averageTasksPerDay: dailyTasks.reduce((sum, day) => sum + day.total, 0) / 30,
        streak: this.calculateStreak(user.tasks)
      }
    };
  }

  private calculateStreak(tasks: any[]): number {
    const completedTasks = tasks
      .filter(t => t.status === 'COMPLETED')
      .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

    if (completedTasks.length === 0) return 0;

    let streak = 0;
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    for (let i = 0; i < 30; i++) {
      const checkDate = new Date(today.getTime() - i * 24 * 60 * 60 * 1000);
      const hasTaskOnDate = completedTasks.some(task => {
        const taskDate = new Date(task.date);
        taskDate.setHours(0, 0, 0, 0);
        return taskDate.getTime() === checkDate.getTime();
      });

      if (hasTaskOnDate) {
        streak++;
      } else {
        break;
      }
    }

    return streak;
  }
}
