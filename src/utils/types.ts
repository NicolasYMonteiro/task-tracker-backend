// types.ts
type TaskStatus = 'PENDING' | 'COMPLETED' | 'IN_PROGRESS';

interface Task {
  id: number;
  title: string;
  description: string;
  date: Date;
  interval?: number | null;
  sequence?: number | null;
  emergency?: boolean | null;
  status: TaskStatus;
  userId: number;
  createdAt: Date;
}

interface UserProfile {
  id: number;
  name: string;
  email: string;
  createdAt: Date;
  taskStats: {
    total: number;
    completed: number;
    pending: number;
    overdue: number;
    highPriority: number;
    averageCompletionTime: number;
  };
  recentTasks: {
    id: number;
    title: string;
    status: TaskStatus;
    date: Date;
  }[];
}

export { Task, UserProfile, TaskStatus };