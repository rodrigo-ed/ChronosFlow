import React, { useState } from 'react';
import { Plus, Search, Flame, AlertTriangle, ArrowDown } from 'lucide-react';
import { Task, Goal, Priority } from '../../types';
import { TaskCard } from './TaskCard';
import { TaskQuickAdd } from './TaskQuickAdd';

interface TodoListProps {
  tasks: Task[];
  goals: Goal[];
  onToggleTask: (id: string) => void;
  onDeleteTask: (id: string) => void;
  onEditTask: (task: Task) => void;
  onOpenNewTaskModal: (date?: string) => void;
  onQuickAddTask: (
    title: string,
    priority: Priority,
    dueDate: string,
    estimatedMinutes: number,
    startTime: string,
    endTime: string
  ) => void;
  onToggleSubtask: (taskId: string, subtaskId: string) => void;
}

export const TodoList: React.FC<TodoListProps> = ({
  tasks,
  goals,
  onToggleTask,
  onDeleteTask,
  onEditTask,
  onOpenNewTaskModal,
  onQuickAddTask,
  onToggleSubtask,
}) => {
  const [priorityFilter, setPriorityFilter] = useState<'all' | Priority>('all');
  const [goalFilter, setGoalFilter] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [dateFilter, setDateFilter] = useState<'today' | 'tomorrow' | 'all'>('today');

  const todayStr = new Date().toISOString().split('T')[0];
  const tomorrowDate = new Date();
  tomorrowDate.setDate(tomorrowDate.getDate() + 1);
  const tomorrowStr = tomorrowDate.toISOString().split('T')[0];

  const filteredTasks = tasks.filter((t) => {
    if (priorityFilter !== 'all' && t.priority !== priorityFilter) return false;
    if (goalFilter !== 'all' && t.goalId !== goalFilter) return false;
    if (dateFilter === 'today' && t.dueDate !== todayStr) return false;
    if (dateFilter === 'tomorrow' && t.dueDate !== tomorrowStr) return false;
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      if (!t.title.toLowerCase().includes(q) && !t.description?.toLowerCase().includes(q)) {
        return false;
      }
    }
    return true;
  });

  const highTasks = filteredTasks.filter((t) => t.priority === 'high');
  const mediumTasks = filteredTasks.filter((t) => t.priority === 'medium');
  const lowTasks = filteredTasks.filter((t) => t.priority === 'low');
  const pendingCount = filteredTasks.filter((t) => !t.completed).length;
  const completedCount = filteredTasks.filter((t) => t.completed).length;

  return (
    <div className="space-y-5">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-200 dark:border-slate-800">
        <div>
          <h2 className="text-xl font-bold tracking-tight text-slate-900 dark:text-white">
            Lista de Afazeres & Horários
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
            Gerencie tarefas diárias com horários precisos de execução e prioridade.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <div className="text-xs text-slate-500 font-mono tabular-nums mr-2">
            <span>{pendingCount} pendentes</span> · <span>{completedCount} concluídas</span>
          </div>
          <button
            onClick={() => onOpenNewTaskModal(dateFilter === 'tomorrow' ? tomorrowStr : todayStr)}
            className="flex items-center gap-1.5 px-3.5 py-2 text-xs font-medium rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white shadow-xs transition"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Nova Atividade</span>
          </button>
        </div>
      </div>

      {/* Quick Add Bar with Hours */}
      <TaskQuickAdd
        targetDate={dateFilter === 'tomorrow' ? tomorrowStr : todayStr}
        onQuickAdd={onQuickAddTask}
      />

      {/* Filters Bar */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-2.5 p-2.5 rounded-xl bg-slate-100/70 dark:bg-slate-900/40 border border-slate-200 dark:border-slate-800">
        <div className="flex items-center gap-1 bg-white dark:bg-slate-800 p-0.5 rounded-lg border border-slate-200 dark:border-slate-700">
          {(['today', 'tomorrow', 'all'] as const).map((d) => (
            <button
              key={d}
              onClick={() => setDateFilter(d)}
              className={`px-3 py-1 text-xs font-medium rounded-md transition ${
                dateFilter === d ? 'bg-indigo-600 text-white shadow-2xs' : 'text-slate-600 dark:text-slate-400'
              }`}
            >
              {d === 'today' ? 'Hoje' : d === 'tomorrow' ? 'Amanhã' : 'Todas as Datas'}
            </button>
          ))}
        </div>

        <div className="flex flex-wrap items-center gap-2 text-xs">
          <select
            value={priorityFilter}
            onChange={(e) => setPriorityFilter(e.target.value as any)}
            className="px-2 py-1 rounded-lg bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-200"
          >
            <option value="all">Todas Prioridades</option>
            <option value="high">Alta Prioridade</option>
            <option value="medium">Média Prioridade</option>
            <option value="low">Baixa Prioridade</option>
          </select>

          <select
            value={goalFilter}
            onChange={(e) => setGoalFilter(e.target.value)}
            className="px-2 py-1 rounded-lg bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-200 max-w-[130px] truncate"
          >
            <option value="all">Todas as Metas</option>
            {goals.map((g) => (<option key={g.id} value={g.id}>{g.title}</option>))}
          </select>

          <div className="relative">
            <Search className="w-3.5 h-3.5 text-slate-400 absolute left-2 top-2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Buscar..."
              className="pl-7 pr-2 py-1 text-xs rounded-lg bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white w-32 focus:w-44 transition-all"
            />
          </div>
        </div>
      </div>

      {/* Task Sections */}
      {filteredTasks.length === 0 ? (
        <div className="p-10 text-center rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
          <p className="text-xs text-slate-500">Nenhuma atividade encontrada para os filtros selecionados.</p>
        </div>
      ) : (
        <div className="space-y-5">
          {(priorityFilter === 'all' || priorityFilter === 'high') && highTasks.length > 0 && (
            <div className="space-y-2">
              <div className="flex items-center gap-1.5 pb-0.5">
                <Flame className="w-4 h-4 text-rose-500" />
                <h3 className="text-xs font-bold uppercase tracking-wider text-rose-600 dark:text-rose-400">
                  Alta Prioridade ({highTasks.length})
                </h3>
              </div>
              <div className="space-y-2">
                {highTasks.map((t) => (
                  <TaskCard
                    key={t.id}
                    task={t}
                    goal={goals.find((g) => g.id === t.goalId)}
                    todayStr={todayStr}
                    onToggleTask={onToggleTask}
                    onDeleteTask={onDeleteTask}
                    onEditTask={onEditTask}
                    onToggleSubtask={onToggleSubtask}
                  />
                ))}
              </div>
            </div>
          )}

          {(priorityFilter === 'all' || priorityFilter === 'medium') && mediumTasks.length > 0 && (
            <div className="space-y-2">
              <div className="flex items-center gap-1.5 pb-0.5">
                <AlertTriangle className="w-4 h-4 text-amber-500" />
                <h3 className="text-xs font-bold uppercase tracking-wider text-amber-600 dark:text-amber-400">
                  Média Prioridade ({mediumTasks.length})
                </h3>
              </div>
              <div className="space-y-2">
                {mediumTasks.map((t) => (
                  <TaskCard
                    key={t.id}
                    task={t}
                    goal={goals.find((g) => g.id === t.goalId)}
                    todayStr={todayStr}
                    onToggleTask={onToggleTask}
                    onDeleteTask={onDeleteTask}
                    onEditTask={onEditTask}
                    onToggleSubtask={onToggleSubtask}
                  />
                ))}
              </div>
            </div>
          )}

          {(priorityFilter === 'all' || priorityFilter === 'low') && lowTasks.length > 0 && (
            <div className="space-y-2">
              <div className="flex items-center gap-1.5 pb-0.5">
                <ArrowDown className="w-4 h-4 text-slate-400" />
                <h3 className="text-xs font-bold uppercase tracking-wider text-slate-600 dark:text-slate-400">
                  Baixa Prioridade ({lowTasks.length})
                </h3>
              </div>
              <div className="space-y-2">
                {lowTasks.map((t) => (
                  <TaskCard
                    key={t.id}
                    task={t}
                    goal={goals.find((g) => g.id === t.goalId)}
                    todayStr={todayStr}
                    onToggleTask={onToggleTask}
                    onDeleteTask={onDeleteTask}
                    onEditTask={onEditTask}
                    onToggleSubtask={onToggleSubtask}
                  />
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
