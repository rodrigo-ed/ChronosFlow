export type Priority = 'high' | 'medium' | 'low';

export interface Subtask {
  id: string;
  title: string;
  completed: boolean;
}

export interface Task {
  id: string;
  title: string;
  description?: string;
  priority: Priority;
  dueDate: string; // YYYY-MM-DD
  dueTime?: string; // HH:mm
  startTime?: string; // HH:mm (Horário em que a atividade será realizada)
  endTime?: string; // HH:mm (Horário de término da atividade)
  estimatedMinutes: number;
  completed: boolean;
  completedAt?: string;
  goalId?: string;
  category: string;
  tags: string[];
  subtasks?: Subtask[];
}

export interface Goal {
  id: string;
  title: string;
  description?: string;
  category: string;
  color: string;
  targetDate: string; // YYYY-MM-DD
  targetValue: number;
  currentValue: number;
  unit: string;
  progress: number; // 0 to 100
  linkedTaskIds: string[];
}

export interface RecurringPattern {
  frequency: 'daily' | 'weekdays' | 'custom_days';
  selectedDays?: number[]; // 0 = Dom, 1 = Seg, ..., 6 = Sab
  startDate: string; // YYYY-MM-DD
  endDate: string; // YYYY-MM-DD
  startTime: string; // HH:mm
  endTime: string; // HH:mm
}

export interface CalendarEvent {
  id: string;
  title: string;
  description?: string;
  startDate: string; // YYYY-MM-DD
  startTime?: string; // HH:mm
  endDate: string; // YYYY-MM-DD
  endTime?: string; // HH:mm
  isAllDay: boolean;
  color: string;
  location?: string;
  relatedGoalId?: string;
  recurringPattern?: RecurringPattern;
  source: 'manual' | 'ical' | 'recurring' | 'workout';
}

export interface NotificationSetting {
  enabled: boolean;
  sound: boolean;
  leadMinutes: number;
}

export type ViewTab =
  | 'calendar'
  | 'tasks'
  | 'books'
  | 'health'
  | 'goals'
  | 'assistant'
  | 'reports';

export type CalendarViewMode = 'month' | 'week' | 'day';

export interface WeeklyProductivityReport {
  weekRange: string;
  totalTasks: number;
  completedTasks: number;
  completionRate: number;
  highPriorityCompleted: number;
  mediumPriorityCompleted: number;
  lowPriorityCompleted: number;
  totalMinutesSpent: number;
  activeGoalsCount: number;
  averageDailyCompletion: number;
  topCategories: { category: string; count: number }[];
}

export * from './book';
export * from './health';
export * from './holiday';
