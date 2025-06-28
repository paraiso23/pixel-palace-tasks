
export interface User {
  id: 'eli' | 'orlando';
  name: string;
  tokens: number;
  weeklyTokens: number;
}

export interface Task {
  id: string;
  name: string;
  energy: number;
  tokens: number;
  icon: string;
}

export interface ScheduledTask {
  id: string;
  taskId: string;
  date: string;
  timeSlot: 'morning' | 'afternoon';
  assignedTo?: 'eli' | 'orlando';
  status: 'pending' | 'in-progress' | 'completed';
  completedBy?: 'eli' | 'orlando';
  completedAt?: Date;
}

export interface GameState {
  users: Record<string, User>;
  tasks: Record<string, Task>;
  scheduledTasks: ScheduledTask[];
  currentWeek: number;
  isCatchUpMode: boolean;
}

export type TimeSlot = 'morning' | 'afternoon';
export type TaskStatus = 'pending' | 'in-progress' | 'completed';
