import {
  Task,
  Goal,
  CalendarEvent,
  NotificationSetting,
  Book,
  Workout,
  Holiday,
} from '../types';
import {
  INITIAL_GOALS,
  INITIAL_TASKS,
  INITIAL_EVENTS,
  INITIAL_BOOKS,
  INITIAL_WORKOUTS,
} from './initialData';

const KEYS = {
  TASKS: 'chronosflow_tasks_v2',
  GOALS: 'chronosflow_goals_v2',
  EVENTS: 'chronosflow_events_v2',
  BOOKS: 'chronosflow_books_v2',
  WORKOUTS: 'chronosflow_workouts_v2',
  HOLIDAYS: 'chronosflow_custom_holidays_v2',
  NOTIFICATIONS: 'chronosflow_notifications_v2',
};

function getItem<T>(key: string, fallback: T): T {
  try {
    const raw = localStorage.getItem(key);
    return raw ? JSON.parse(raw) : fallback;
  } catch (err) {
    console.warn(`Error reading ${key}:`, err);
    return fallback;
  }
}

function setItem<T>(key: string, value: T): void {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch (err) {
    console.warn(`Error writing ${key}:`, err);
  }
}

export function loadTasks(): Task[] {
  const tasks = getItem<Task[]>(KEYS.TASKS, INITIAL_TASKS);
  if (!localStorage.getItem(KEYS.TASKS)) saveTasks(INITIAL_TASKS);
  return tasks;
}
export function saveTasks(tasks: Task[]): void {
  setItem(KEYS.TASKS, tasks);
}

export function loadGoals(): Goal[] {
  const goals = getItem<Goal[]>(KEYS.GOALS, INITIAL_GOALS);
  if (!localStorage.getItem(KEYS.GOALS)) saveGoals(INITIAL_GOALS);
  return goals;
}
export function saveGoals(goals: Goal[]): void {
  setItem(KEYS.GOALS, goals);
}

export function loadEvents(): CalendarEvent[] {
  const events = getItem<CalendarEvent[]>(KEYS.EVENTS, INITIAL_EVENTS);
  if (!localStorage.getItem(KEYS.EVENTS)) saveEvents(INITIAL_EVENTS);
  return events;
}
export function saveEvents(events: CalendarEvent[]): void {
  setItem(KEYS.EVENTS, events);
}

export function loadBooks(): Book[] {
  const books = getItem<Book[]>(KEYS.BOOKS, INITIAL_BOOKS);
  if (!localStorage.getItem(KEYS.BOOKS)) saveBooks(INITIAL_BOOKS);
  return books;
}
export function saveBooks(books: Book[]): void {
  setItem(KEYS.BOOKS, books);
}

export function loadWorkouts(): Workout[] {
  const workouts = getItem<Workout[]>(KEYS.WORKOUTS, INITIAL_WORKOUTS);
  if (!localStorage.getItem(KEYS.WORKOUTS)) saveWorkouts(INITIAL_WORKOUTS);
  return workouts;
}
export function saveWorkouts(workouts: Workout[]): void {
  setItem(KEYS.WORKOUTS, workouts);
}

export function loadCustomHolidays(): Holiday[] {
  return getItem<Holiday[]>(KEYS.HOLIDAYS, []);
}
export function saveCustomHolidays(holidays: Holiday[]): void {
  setItem(KEYS.HOLIDAYS, holidays);
}

export function loadNotificationSettings(): NotificationSetting {
  return getItem<NotificationSetting>(KEYS.NOTIFICATIONS, {
    enabled: true,
    sound: true,
    leadMinutes: 15,
  });
}
export function saveNotificationSettings(settings: NotificationSetting): void {
  setItem(KEYS.NOTIFICATIONS, settings);
}
