import { describe, it, expect } from 'vitest';
import { calculateWeeklyStats, generateCSVContent } from './reports';
import { Task, Goal, CalendarEvent } from '../types';

describe('Reports Utility (TDD)', () => {
  const mockTasks: Task[] = [
    {
      id: 't-1',
      title: 'Tarefa Alta Prioridade',
      priority: 'high',
      dueDate: '2026-11-03',
      estimatedMinutes: 60,
      completed: true,
      category: 'Trabalho',
      tags: [],
    },
    {
      id: 't-2',
      title: 'Tarefa Média Prioridade',
      priority: 'medium',
      dueDate: '2026-11-03',
      estimatedMinutes: 30,
      completed: false,
      category: 'Trabalho',
      tags: [],
    },
  ];

  const mockGoals: Goal[] = [
    {
      id: 'g-1',
      title: 'Aprender React 19',
      category: 'Estudos',
      color: '#4F46E5',
      targetDate: '2026-12-01',
      targetValue: 10,
      currentValue: 5,
      unit: 'aulas',
      progress: 50,
      linkedTaskIds: ['t-1'],
    },
  ];

  const mockEvents: CalendarEvent[] = [
    {
      id: 'e-1',
      title: 'Reunião Semanal',
      startDate: '2026-11-03',
      endDate: '2026-11-03',
      isAllDay: false,
      color: '#4F46E5',
      source: 'manual',
    },
  ];

  it('should calculate weekly productivity completion rate and minutes', () => {
    const stats = calculateWeeklyStats(mockTasks, mockGoals);
    expect(stats.totalTasks).toBe(2);
    expect(stats.completedTasks).toBe(1);
    expect(stats.completionRate).toBe(50);
    expect(stats.highPriorityCompleted).toBe(1);
    expect(stats.totalMinutesSpent).toBe(60);
  });

  it('should generate CSV with UTF-8 BOM and correct table headers', () => {
    const csv = generateCSVContent(mockTasks, mockGoals, mockEvents);
    // Starts with UTF-8 BOM
    expect(csv.charCodeAt(0)).toBe(0xfeff);
    expect(csv).toContain('RELATÓRIO DE METAS PESSOAIS');
    expect(csv).toContain('RELATÓRIO DE TAREFAS DIÁRIAS');
    expect(csv).toContain('Tarefa Alta Prioridade');
    expect(csv).toContain('Aprender React 19');
  });
});
