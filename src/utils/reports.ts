import { Task, Goal, CalendarEvent, WeeklyProductivityReport } from '../types';

export function calculateWeeklyStats(tasks: Task[], goals: Goal[]): WeeklyProductivityReport {
  const now = new Date();
  const dayOfWeek = now.getDay(); // 0 is Sunday
  const startOfWeek = new Date(now);
  startOfWeek.setDate(now.getDate() - dayOfWeek);
  const endOfWeek = new Date(startOfWeek);
  endOfWeek.setDate(startOfWeek.getDate() + 6);

  const startStr = startOfWeek.toISOString().split('T')[0];
  const endStr = endOfWeek.toISOString().split('T')[0];
  const weekRange = `${formatDateBR(startStr)} até ${formatDateBR(endStr)}`;

  const totalTasks = tasks.length;
  const completedTasks = tasks.filter((t) => t.completed).length;
  const completionRate = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;

  const highPriorityCompleted = tasks.filter((t) => t.priority === 'high' && t.completed).length;
  const mediumPriorityCompleted = tasks.filter((t) => t.priority === 'medium' && t.completed).length;
  const lowPriorityCompleted = tasks.filter((t) => t.priority === 'low' && t.completed).length;

  const totalMinutesSpent = tasks
    .filter((t) => t.completed)
    .reduce((acc, t) => acc + (t.estimatedMinutes || 30), 0);

  const activeGoalsCount = goals.length;
  const averageDailyCompletion = Math.round((completedTasks / 7) * 10) / 10;

  // Category distribution
  const categoryMap: Record<string, number> = {};
  for (const t of tasks) {
    const cat = t.category || 'Geral';
    categoryMap[cat] = (categoryMap[cat] || 0) + 1;
  }
  const topCategories = Object.entries(categoryMap)
    .map(([category, count]) => ({ category, count }))
    .sort((a, b) => b.count - a.count);

  return {
    weekRange,
    totalTasks,
    completedTasks,
    completionRate,
    highPriorityCompleted,
    mediumPriorityCompleted,
    lowPriorityCompleted,
    totalMinutesSpent,
    activeGoalsCount,
    averageDailyCompletion,
    topCategories,
  };
}

export function formatDateBR(dateStr: string): string {
  if (!dateStr) return '';
  const parts = dateStr.split('-');
  if (parts.length === 3) {
    return `${parts[2]}/${parts[1]}/${parts[0]}`;
  }
  return dateStr;
}

export function generateCSVContent(tasks: Task[], goals: Goal[], events: CalendarEvent[]): string {
  // UTF-8 BOM so Excel opens accents correctly
  let csv = '\uFEFF';

  // Section 1: Resumo de Metas
  csv += '--- RELATÓRIO DE METAS PESSOAIS ---\n';
  csv += 'ID,Título,Categoria,Progresso (%),Valor Atual,Valor Alvo,Unidade,Prazo\n';
  for (const g of goals) {
    csv += `"${g.id}","${escapeCSV(g.title)}","${escapeCSV(g.category)}",${g.progress},${g.currentValue},${g.targetValue},"${escapeCSV(g.unit)}","${g.targetDate}"\n`;
  }

  csv += '\n--- RELATÓRIO DE TAREFAS DIÁRIAS ---\n';
  csv += 'ID,Título,Prioridade,Status,Data de Vencimento,Horário,Tempo Estimado (min),Categoria,Meta Vinculada\n';
  for (const t of tasks) {
    const linkedGoal = goals.find((g) => g.id === t.goalId)?.title || 'Nenhuma';
    csv += `"${t.id}","${escapeCSV(t.title)}","${t.priority.toUpperCase()}","${t.completed ? 'CONCLUÍDA' : 'PENDENTE'}","${t.dueDate}","${t.dueTime || ''}",${t.estimatedMinutes || 30},"${escapeCSV(t.category)}","${escapeCSV(linkedGoal)}"\n`;
  }

  csv += '\n--- EVENTOS E COMPROMISSOS DO CALENDÁRIO ---\n';
  csv += 'ID,Título,Início,Fim,Dia Todo,Local,Origem\n';
  for (const e of events) {
    const start = `${e.startDate} ${e.startTime || ''}`.trim();
    const end = `${e.endDate || e.startDate} ${e.endTime || ''}`.trim();
    csv += `"${e.id}","${escapeCSV(e.title)}","${start}","${end}","${e.isAllDay ? 'Sim' : 'Não'}","${escapeCSV(e.location || '')}","${e.source}"\n`;
  }

  return csv;
}

export function downloadCSV(filename: string, content: string): void {
  const blob = new Blob([content], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.setAttribute('download', filename.endsWith('.csv') ? filename : `${filename}.csv`);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}

function escapeCSV(str: string): string {
  if (!str) return '';
  return str.replace(/"/g, '""');
}
