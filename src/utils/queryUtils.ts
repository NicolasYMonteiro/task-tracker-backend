import { startOfToday, endOfToday, startOfWeek, startOfMonth } from 'date-fns';
import { Prisma } from '@prisma/client';

export type FilterType = 'today' | 'week' | 'month' | 'completed' | 'all';
export type OrderType = 'asc' | 'desc';

export const isValidFilter = (filter: string): filter is FilterType =>
  ['today', 'week', 'month', 'completed', 'all'].includes(filter);

export const isValidOrder = (order: string): order is OrderType =>
  ['asc', 'desc'].includes(order);

export function buildWhereFilter(userId: number, filter: FilterType): Prisma.TaskWhereInput {
  const now = new Date();
  const baseWhere: Prisma.TaskWhereInput = { userId };

  switch (filter) {
    case 'today':
      return {
        ...baseWhere,
        date: {
          gte: startOfToday(),
          lte: endOfToday(),
        },
      };
    case 'week':
      return {
        ...baseWhere,
        date: {
          gte: startOfWeek(now, { weekStartsOn: 1 }),
        },
      };
    case 'month':
      return {
        ...baseWhere,
        date: {
          gte: startOfMonth(now),
        },
      };
    case 'completed':
      return {
        ...baseWhere,
        status: 'COMPLETED',
      };
    case 'all':
    default:
      return baseWhere;
  }
}

export function buildOrderBy(order: OrderType): Prisma.TaskOrderByWithRelationInput {
  return { date: order };
}
