import React, { useState, useEffect } from 'react';
import { Task, Goal, CalendarEvent, ViewTab, Priority, Book, Workout, Holiday } from './types';
import { useAppState } from './hooks/useAppState';
import { checkUpcomingAlerts, requestNotificationPermission, sendBrowserNotification } from './utils/notifications';
import { Navbar } from './components/layout/Navbar';
import { MobileNav } from './components/layout/MobileNav';
import { CalendarView } from './components/calendar/CalendarView';
import { TodoList } from './components/tasks/TodoList';
import { BooksView } from './components/books/BooksView';
import { HealthView } from './components/health/HealthView';
import { GoalsView } from './components/GoalsView';
import { AIAssistantView } from './components/AIAssistantView';
import { WeeklyReportView } from './components/WeeklyReportView';
import { TaskModal } from './components/TaskModal';
import { EventModal } from './components/EventModal';
import { GoalModal } from './components/GoalModal';
import { BookModal } from './components/books/BookModal';
import { WorkoutModal } from './components/health/WorkoutModal';
import { RecurringEventModal } from './components/calendar/RecurringEventModal';
import { HolidayModal } from './components/calendar/HolidayModal';
import { ICalModal } from './components/ICalModal';
import { UserAuthModal } from './components/auth/UserAuthModal';

export default function App() {
  const state = useAppState();
  const [activeTab, setActiveTab] = useState<ViewTab>('tasks');
  const [isDarkMode, setIsDarkMode] = useState<boolean>(() => {
    if (typeof window !== 'undefined') {
      const s = localStorage.getItem('chronosflow_dark_mode');
      return s !== null ? s === 'true' : window.matchMedia('(prefers-color-scheme: dark)').matches;
    }
    return false;
  });

  // Modal controls
  const [taskModal, setTaskModal] = useState<{ open: boolean; task?: Task | null; date?: string }>({ open: false });
  const [eventModal, setEventModal] = useState<{ open: boolean; event?: CalendarEvent | null; date?: string }>({ open: false });
  const [goalModal, setGoalModal] = useState<{ open: boolean; goal?: Goal | null }>({ open: false });
  const [bookModal, setBookModal] = useState<{ open: boolean; book?: Book | null }>({ open: false });
  const [workoutModal, setWorkoutModal] = useState<{ open: boolean; workout?: Workout | null }>({ open: false });
  const [recurringModal, setRecurringModal] = useState(false);
  const [holidayModal, setHolidayModal] = useState(false);
  const [iCalModal, setICalModal] = useState(false);
  const [authModal, setAuthModal] = useState(false);

  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add('dark');
      localStorage.setItem('chronosflow_dark_mode', 'true');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('chronosflow_dark_mode', 'false');
    }
  }, [isDarkMode]);

  // Periodic reminder alerts
  useEffect(() => {
    if (!state.notificationSettings.enabled) return;
    checkUpcomingAlerts(state.tasks, state.events, state.notificationSettings.leadMinutes, state.notificationSettings.sound);
    const id = setInterval(() => {
      checkUpcomingAlerts(state.tasks, state.events, state.notificationSettings.leadMinutes, state.notificationSettings.sound);
    }, 60000);
    return () => clearInterval(id);
  }, [state.tasks, state.events, state.notificationSettings]);

  const handleToggleTask = (id: string) => {
    state.updateTasks(state.tasks.map((t) => (t.id === id ? { ...t, completed: !t.completed, completedAt: !t.completed ? new Date().toISOString() : undefined } : t)));
  };

  const handleQuickAddTask = (title: string, priority: Priority, dueDate: string, estimatedMinutes: number, startTime: string, endTime: string) => {
    const newTask: Task = { id: `task-${Date.now()}`, title, priority, dueDate, startTime, endTime, dueTime: startTime, estimatedMinutes, completed: false, category: 'Geral', tags: [] };
    state.updateTasks([newTask, ...state.tasks]);
  };

  const handleSaveWorkout = (workout: Workout) => {
    const exists = state.workouts.some((w) => w.id === workout.id);
    const updated = exists ? state.workouts.map((w) => (w.id === workout.id ? workout : w)) : [workout, ...state.workouts];
    state.updateWorkouts(updated);

    // Sync workout as an event in calendar
    const workoutEvent: CalendarEvent = {
      id: `evt-wo-${workout.id}`,
      title: `Treino: ${workout.type.toUpperCase()}`,
      description: workout.notes,
      startDate: workout.date,
      startTime: workout.startTime,
      endDate: workout.date,
      endTime: workout.endTime,
      isAllDay: false,
      color: '#10B981',
      source: 'workout',
    };
    state.updateEvents([...state.events.filter((e) => e.id !== workoutEvent.id), workoutEvent]);
  };

  const handleLogReadingSession = (bookId: string, pagesRead: number, minutesRead: number) => {
    state.updateBooks(state.books.map((b) => {
      if (b.id !== bookId) return b;
      const newPage = Math.min(b.totalPages, b.currentPage + pagesRead);
      const isFinished = newPage >= b.totalPages;
      const session = { id: `s-${Date.now()}`, date: new Date().toISOString().split('T')[0], pagesRead, minutesRead };
      return { ...b, currentPage: newPage, status: isFinished ? 'completed' : b.status, lastReadDate: session.date, sessions: [...(b.sessions || []), session] };
    }));
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 flex flex-col transition-colors pb-16 md:pb-0">
      <Navbar
        activeTab={activeTab}
        onTabChange={setActiveTab}
        isDarkMode={isDarkMode}
        onToggleDarkMode={() => setIsDarkMode(!isDarkMode)}
        notificationsEnabled={state.notificationSettings.enabled}
        onToggleNotifications={async () => {
          if (!state.notificationSettings.enabled) {
            const p = await requestNotificationPermission();
            if (p === 'granted') { state.setNotificationSettings({ ...state.notificationSettings, enabled: true }); sendBrowserNotification('ChronosFlow', 'Notificações ativadas!'); }
          } else { state.setNotificationSettings({ ...state.notificationSettings, enabled: false }); }
        }}
        onQuickNewTask={() => setTaskModal({ open: true })}
        user={state.user}
        onOpenAuthModal={() => setAuthModal(true)}
      />

      <main className="flex-1 max-w-7xl w-full mx-auto px-3 sm:px-6 py-5 sm:py-7">
        {activeTab === 'calendar' && (
          <CalendarView
            events={state.events}
            tasks={state.tasks}
            goals={state.goals}
            customHolidays={state.customHolidays}
            onOpenNewEventModal={(d) => setEventModal({ open: true, date: d })}
            onOpenRecurringModal={() => setRecurringModal(true)}
            onOpenHolidayModal={() => setHolidayModal(true)}
            onEditEvent={(e) => setEventModal({ open: true, event: e })}
            onDeleteEvent={(id) => state.updateEvents(state.events.filter((e) => e.id !== id))}
            onOpenICalModal={() => setICalModal(true)}
            onSelectDateForTask={(d) => setTaskModal({ open: true, date: d })}
          />
        )}
        {activeTab === 'tasks' && (
          <TodoList
            tasks={state.tasks}
            goals={state.goals}
            onToggleTask={handleToggleTask}
            onDeleteTask={(id) => state.updateTasks(state.tasks.filter((t) => t.id !== id))}
            onEditTask={(t) => setTaskModal({ open: true, task: t })}
            onOpenNewTaskModal={(d) => setTaskModal({ open: true, date: d })}
            onQuickAddTask={handleQuickAddTask}
            onToggleSubtask={(tId, sId) => state.updateTasks(state.tasks.map((t) => t.id === tId && t.subtasks ? { ...t, subtasks: t.subtasks.map((s) => s.id === sId ? { ...s, completed: !s.completed } : s) } : t))}
          />
        )}
        {activeTab === 'books' && (
          <BooksView
            books={state.books}
            onOpenNewBookModal={() => setBookModal({ open: true })}
            onEditBook={(b) => setBookModal({ open: true, book: b })}
            onDeleteBook={(id) => state.updateBooks(state.books.filter((b) => b.id !== id))}
            onLogReadingSession={handleLogReadingSession}
          />
        )}
        {activeTab === 'health' && (
          <HealthView
            workouts={state.workouts}
            onOpenNewWorkoutModal={() => setWorkoutModal({ open: true })}
            onEditWorkout={(w) => setWorkoutModal({ open: true, workout: w })}
            onDeleteWorkout={(id) => state.updateWorkouts(state.workouts.filter((w) => w.id !== id))}
          />
        )}
        {activeTab === 'goals' && (
          <GoalsView
            goals={state.goals}
            tasks={state.tasks}
            events={state.events}
            onOpenNewGoalModal={() => setGoalModal({ open: true })}
            onEditGoal={(g) => setGoalModal({ open: true, goal: g })}
            onDeleteGoal={(id) => state.updateGoals(state.goals.filter((g) => g.id !== id))}
            onUpdateGoalProgress={(id, delta) => state.updateGoals(state.goals.map((g) => g.id === id ? { ...g, currentValue: Math.max(0, g.currentValue + delta), progress: Math.min(100, Math.round(((Math.max(0, g.currentValue + delta)) / g.targetValue) * 100)) } : g))}
          />
        )}
        {activeTab === 'assistant' && <AIAssistantView tasks={state.tasks} goals={state.goals} events={state.events} />}
        {activeTab === 'reports' && <WeeklyReportView tasks={state.tasks} goals={state.goals} events={state.events} />}
      </main>

      <MobileNav activeTab={activeTab} onTabChange={setActiveTab} />

      <TaskModal isOpen={taskModal.open} onClose={() => setTaskModal({ open: false })} onSave={(t) => state.updateTasks(state.tasks.some((x) => x.id === t.id) ? state.tasks.map((x) => (x.id === t.id ? t : x)) : [t, ...state.tasks])} initialTask={taskModal.task} goals={state.goals} initialDate={taskModal.date} />
      <EventModal isOpen={eventModal.open} onClose={() => setEventModal({ open: false })} onSave={(e) => state.updateEvents(state.events.some((x) => x.id === e.id) ? state.events.map((x) => (x.id === e.id ? e : x)) : [...state.events, e])} initialEvent={eventModal.event} goals={state.goals} initialDate={eventModal.date} />
      <GoalModal isOpen={goalModal.open} onClose={() => setGoalModal({ open: false })} onSave={(g) => state.updateGoals(state.goals.some((x) => x.id === g.id) ? state.goals.map((x) => (x.id === g.id ? g : x)) : [...state.goals, g])} initialGoal={goalModal.goal} />
      <BookModal isOpen={bookModal.open} onClose={() => setBookModal({ open: false })} onSave={(b) => state.updateBooks(state.books.some((x) => x.id === b.id) ? state.books.map((x) => (x.id === b.id ? b : x)) : [b, ...state.books])} initialBook={bookModal.book} />
      <WorkoutModal isOpen={workoutModal.open} onClose={() => setWorkoutModal({ open: false })} onSave={handleSaveWorkout} initialWorkout={workoutModal.workout} />
      <RecurringEventModal isOpen={recurringModal} onClose={() => setRecurringModal(false)} onSaveEvents={(newEvs) => state.updateEvents([...state.events, ...newEvs])} goals={state.goals} />
      <HolidayModal isOpen={holidayModal} onClose={() => setHolidayModal(false)} customHolidays={state.customHolidays} onAddHoliday={(h) => state.updateCustomHolidays([...state.customHolidays, h])} onDeleteHoliday={(id) => state.updateCustomHolidays(state.customHolidays.filter((h) => h.id !== id))} />
      <ICalModal isOpen={iCalModal} onClose={() => setICalModal(false)} events={state.events} tasks={state.tasks} onImportEvents={(evs) => state.updateEvents([...state.events, ...evs])} />
      <UserAuthModal isOpen={authModal} onClose={() => setAuthModal(false)} user={state.user} />
    </div>
  );
}
