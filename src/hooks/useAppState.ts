import { useState, useEffect } from 'react';
import { User } from 'firebase/auth';
import {
  Task,
  Goal,
  CalendarEvent,
  Book,
  Workout,
  Holiday,
  NotificationSetting,
  Priority,
} from '../types';
import {
  loadTasks,
  saveTasks,
  loadGoals,
  saveGoals,
  loadEvents,
  saveEvents,
  loadBooks,
  saveBooks,
  loadWorkouts,
  saveWorkouts,
  loadCustomHolidays,
  saveCustomHolidays,
  loadNotificationSettings,
  saveNotificationSettings,
} from '../utils/storage';
import { onUserAuthStateChanged, checkRedirectResult } from '../services/auth';
import { saveUserItems, loadUserItems } from '../services/firestoreSync';

export function useAppState() {
  const [user, setUser] = useState<User | null>(null);
  const [tasks, setTasks] = useState<Task[]>([]);
  const [goals, setGoals] = useState<Goal[]>([]);
  const [events, setEvents] = useState<CalendarEvent[]>([]);
  const [books, setBooks] = useState<Book[]>([]);
  const [workouts, setWorkouts] = useState<Workout[]>([]);
  const [customHolidays, setCustomHolidays] = useState<Holiday[]>([]);
  const [notificationSettings, setNotificationSettings] = useState<NotificationSetting>({
    enabled: true,
    sound: true,
    leadMinutes: 15,
  });

  // Initial local load & check redirect auth
  useEffect(() => {
    setTasks(loadTasks());
    setGoals(loadGoals());
    setEvents(loadEvents());
    setBooks(loadBooks());
    setWorkouts(loadWorkouts());
    setCustomHolidays(loadCustomHolidays());
    setNotificationSettings(loadNotificationSettings());

    checkRedirectResult().catch((e) => {
      console.warn('Redirect auth check error:', e);
    });
  }, []);

  // Listen to Google Auth changes
  useEffect(() => {
    const unsubscribe = onUserAuthStateChanged(async (currentUser) => {
      setUser(currentUser);
      if (currentUser) {
        // Load cloud data if available
        const [cloudTasks, cloudGoals, cloudEvents, cloudBooks, cloudWorkouts, cloudHolidays] =
          await Promise.all([
            loadUserItems<Task>(currentUser.uid, 'tasks'),
            loadUserItems<Goal>(currentUser.uid, 'goals'),
            loadUserItems<CalendarEvent>(currentUser.uid, 'events'),
            loadUserItems<Book>(currentUser.uid, 'books'),
            loadUserItems<Workout>(currentUser.uid, 'workouts'),
            loadUserItems<Holiday>(currentUser.uid, 'holidays'),
          ]);

        if (cloudTasks.length > 0) { setTasks(cloudTasks); saveTasks(cloudTasks); }
        if (cloudGoals.length > 0) { setGoals(cloudGoals); saveGoals(cloudGoals); }
        if (cloudEvents.length > 0) { setEvents(cloudEvents); saveEvents(cloudEvents); }
        if (cloudBooks.length > 0) { setBooks(cloudBooks); saveBooks(cloudBooks); }
        if (cloudWorkouts.length > 0) { setWorkouts(cloudWorkouts); saveWorkouts(cloudWorkouts); }
        if (cloudHolidays.length > 0) { setCustomHolidays(cloudHolidays); saveCustomHolidays(cloudHolidays); }
      }
    });
    return () => unsubscribe();
  }, []);

  // Update Tasks & auto-recalculate goals
  const updateTasks = (newTasks: Task[]) => {
    setTasks(newTasks);
    saveTasks(newTasks);
    if (user) saveUserItems(user.uid, 'tasks', newTasks);

    setGoals((prev) => {
      const updated = prev.map((g) => {
        const linked = newTasks.filter((t) => t.goalId === g.id);
        if (linked.length === 0) return g;
        const comp = linked.filter((t) => t.completed).length;
        return { ...g, progress: Math.min(100, Math.round((comp / linked.length) * 100)) };
      });
      saveGoals(updated);
      if (user) saveUserItems(user.uid, 'goals', updated);
      return updated;
    });
  };

  const updateEvents = (newEvents: CalendarEvent[]) => {
    setEvents(newEvents);
    saveEvents(newEvents);
    if (user) saveUserItems(user.uid, 'events', newEvents);
  };

  const updateGoals = (newGoals: Goal[]) => {
    setGoals(newGoals);
    saveGoals(newGoals);
    if (user) saveUserItems(user.uid, 'goals', newGoals);
  };

  const updateBooks = (newBooks: Book[]) => {
    setBooks(newBooks);
    saveBooks(newBooks);
    if (user) saveUserItems(user.uid, 'books', newBooks);
  };

  const updateWorkouts = (newWorkouts: Workout[]) => {
    setWorkouts(newWorkouts);
    saveWorkouts(newWorkouts);
    if (user) saveUserItems(user.uid, 'workouts', newWorkouts);
  };

  const updateCustomHolidays = (newHolidays: Holiday[]) => {
    setCustomHolidays(newHolidays);
    saveCustomHolidays(newHolidays);
    if (user) saveUserItems(user.uid, 'holidays', newHolidays);
  };

  return {
    user,
    tasks,
    goals,
    events,
    books,
    workouts,
    customHolidays,
    notificationSettings,
    setNotificationSettings: (s: NotificationSetting) => {
      setNotificationSettings(s);
      saveNotificationSettings(s);
    },
    updateTasks,
    updateEvents,
    updateGoals,
    updateBooks,
    updateWorkouts,
    updateCustomHolidays,
  };
}
