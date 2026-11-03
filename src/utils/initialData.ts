import { Task, Goal, CalendarEvent, Book, Workout } from '../types';

export function getRelativeDate(offsetDays: number = 0): string {
  const d = new Date();
  d.setDate(d.getDate() + offsetDays);
  return d.toISOString().split('T')[0];
}

export const INITIAL_GOALS: Goal[] = [
  {
    id: 'goal-1',
    title: 'Dominar Arquitetura Frontend & React 19',
    description: 'Estudar padrões modernos, Server Components e otimização de renderização.',
    category: 'Carreira',
    color: '#4F46E5',
    targetDate: getRelativeDate(30),
    targetValue: 40,
    currentValue: 24,
    unit: 'horas',
    progress: 60,
    linkedTaskIds: ['task-1', 'task-4'],
  },
  {
    id: 'goal-2',
    title: 'Condicionamento Físico & Saúde',
    description: 'Completar 16 sessões de corrida e treinos funcionais no mês.',
    category: 'Saúde',
    color: '#10B981',
    targetDate: getRelativeDate(20),
    targetValue: 16,
    currentValue: 10,
    unit: 'treinos',
    progress: 62,
    linkedTaskIds: ['task-2'],
  },
  {
    id: 'goal-3',
    title: 'Ler 2 Livros de Não-Ficção',
    description: 'Leitura diária de pelo menos 30 minutos antes de dormir.',
    category: 'Desenvolvimento',
    color: '#F59E0B',
    targetDate: getRelativeDate(25),
    targetValue: 600,
    currentValue: 380,
    unit: 'páginas',
    progress: 63,
    linkedTaskIds: ['task-3'],
  },
];

export const INITIAL_TASKS: Task[] = [
  {
    id: 'task-1',
    title: 'Revisar arquitetura do sistema e refatorar hooks',
    description: 'Garantir desacoplamento dos componentes do calendário e gerenciador de estado.',
    priority: 'high',
    dueDate: getRelativeDate(0),
    dueTime: '10:00',
    startTime: '10:00',
    endTime: '11:00',
    estimatedMinutes: 60,
    completed: false,
    goalId: 'goal-1',
    category: 'Carreira',
    tags: ['Frontend', 'Código', 'Urgente'],
    subtasks: [
      { id: 'sub-1', title: 'Mapear fluxo de dados do calendário', completed: true },
      { id: 'sub-2', title: 'Implementar debounce nos filtros', completed: false },
    ],
  },
  {
    id: 'task-2',
    title: 'Treino intervalado de corrida (5km)',
    description: 'Aquecimento 10 min + corrida moderada no parque.',
    priority: 'high',
    dueDate: getRelativeDate(0),
    dueTime: '17:30',
    startTime: '17:30',
    endTime: '18:15',
    estimatedMinutes: 45,
    completed: false,
    goalId: 'goal-2',
    category: 'Saúde',
    tags: ['Exercício', 'Aeróbico'],
  },
  {
    id: 'task-3',
    title: 'Leitura: Capítulo 4 sobre Hábitos Atômicos',
    description: 'Fazer anotações no caderno de aprendizados.',
    priority: 'medium',
    dueDate: getRelativeDate(0),
    dueTime: '21:00',
    startTime: '21:00',
    endTime: '21:30',
    estimatedMinutes: 30,
    completed: true,
    completedAt: new Date().toISOString(),
    goalId: 'goal-3',
    category: 'Desenvolvimento',
    tags: ['Leitura', 'Foco'],
  },
];

export const INITIAL_EVENTS: CalendarEvent[] = [
  {
    id: 'event-1',
    title: 'Alinhamento Semanal de Metas & Prioridades',
    startDate: getRelativeDate(0),
    startTime: '09:00',
    endDate: getRelativeDate(0),
    endTime: '09:45',
    isAllDay: false,
    color: '#4F46E5',
    location: 'Google Meet',
    relatedGoalId: 'goal-1',
    source: 'manual',
  },
  {
    id: 'event-2',
    title: 'Trabalho / Deep Work',
    description: 'Bloco de foco matinal',
    startDate: getRelativeDate(0),
    startTime: '07:00',
    endDate: getRelativeDate(0),
    endTime: '12:00',
    isAllDay: false,
    color: '#0284C7',
    source: 'recurring',
  },
];

export const INITIAL_BOOKS: Book[] = [
  {
    id: 'book-1',
    title: 'Hábitos Atômicos',
    author: 'James Clear',
    totalPages: 320,
    currentPage: 180,
    dailyGoalMinutes: 30,
    status: 'reading',
    notes: 'Excelente reflexão sobre como pequenas mudanças de 1% geram resultados exponenciais.',
    coverColor: '#4F46E5',
    lastReadDate: getRelativeDate(0),
    sessions: [
      { id: 's-1', date: getRelativeDate(0), minutesRead: 30, pagesRead: 15 },
    ],
  },
  {
    id: 'book-2',
    title: 'Trabalho Focado (Deep Work)',
    author: 'Cal Newport',
    totalPages: 280,
    currentPage: 0,
    dailyGoalMinutes: 25,
    status: 'want_to_read',
    coverColor: '#10B981',
  },
];

export const INITIAL_WORKOUTS: Workout[] = [
  {
    id: 'workout-1',
    type: 'corrida',
    date: getRelativeDate(0),
    startTime: '17:30',
    endTime: '18:15',
    durationMinutes: 45,
    distanceKm: 5.2,
    intensity: 'moderada',
    calories: 380,
    notes: 'Treino no parque, ritmo constante.',
  },
  {
    id: 'workout-2',
    type: 'academia',
    date: getRelativeDate(-1),
    startTime: '07:00',
    endTime: '08:00',
    durationMinutes: 60,
    intensity: 'intensa',
    calories: 420,
    notes: 'Membros superiores e core.',
  },
];
