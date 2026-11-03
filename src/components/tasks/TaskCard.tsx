import React, { useState } from 'react';
import confetti from 'canvas-confetti';
import {
  CheckCircle2,
  Circle,
  Clock,
  Target,
  Edit2,
  Trash2,
  ChevronDown,
  ChevronRight,
} from 'lucide-react';
import { Task, Goal } from '../../types';
import { formatDateBR } from '../../utils/reports';

interface TaskCardProps {
  task: Task;
  goal?: Goal;
  todayStr: string;
  onToggleTask: (id: string) => void;
  onDeleteTask: (id: string) => void;
  onEditTask: (task: Task) => void;
  onToggleSubtask: (taskId: string, subtaskId: string) => void;
}

export const TaskCard: React.FC<TaskCardProps> = ({
  task,
  goal,
  todayStr,
  onToggleTask,
  onDeleteTask,
  onEditTask,
  onToggleSubtask,
}) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const hasSubtasks = (task.subtasks?.length || 0) > 0;
  const completedSubtasks = task.subtasks?.filter((s) => s.completed).length || 0;

  const handleCheck = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!task.completed) {
      const rect = (e.target as HTMLElement).getBoundingClientRect();
      confetti({
        particleCount: 25,
        spread: 50,
        origin: { x: (rect.left + rect.width / 2) / window.innerWidth, y: (rect.top + rect.height / 2) / window.innerHeight },
        colors: ['#4F46E5', '#10B981', '#38BDF8', '#F59E0B'],
      });
    }
    onToggleTask(task.id);
  };

  return (
    <div
      className={`group p-3.5 rounded-xl border transition-all ${
        task.completed
          ? 'bg-slate-50/70 dark:bg-slate-900/40 border-slate-200 dark:border-slate-800/60 opacity-70'
          : 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700 shadow-2xs'
      }`}
    >
      <div className="flex items-start gap-3">
        <button
          onClick={handleCheck}
          className="mt-0.5 text-slate-400 hover:text-indigo-600 transition cursor-pointer"
          title={task.completed ? 'Marcar pendente' : 'Concluir atividade'}
        >
          {task.completed ? (
            <CheckCircle2 className="w-5 h-5 text-emerald-500 fill-emerald-100 dark:fill-emerald-950" />
          ) : (
            <Circle className="w-5 h-5 text-slate-300 dark:text-slate-600 hover:text-indigo-500" />
          )}
        </button>

        <div className="flex-1 min-w-0">
          <div className="flex items-center justify-between gap-2">
            <h4
              className={`text-sm font-medium transition ${
                task.completed ? 'line-through text-slate-400 dark:text-slate-500' : 'text-slate-900 dark:text-slate-100'
              }`}
            >
              {task.title}
            </h4>

            <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
              <button onClick={() => onEditTask(task)} className="p-1 text-slate-400 hover:text-indigo-600 rounded">
                <Edit2 className="w-3.5 h-3.5" />
              </button>
              <button onClick={() => onDeleteTask(task.id)} className="p-1 text-slate-400 hover:text-rose-500 rounded">
                <Trash2 className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

          {task.description && (
            <p className="mt-1 text-xs text-slate-500 dark:text-slate-400 line-clamp-2">
              {task.description}
            </p>
          )}

          {/* Horários e Metadados com Zero-Pill */}
          <div className="mt-2.5 flex flex-wrap items-center gap-2 text-xs text-slate-500 dark:text-slate-400">
            {/* Start and End execution time */}
            {(task.startTime || task.dueTime) && (
              <span className="flex items-center gap-1 font-mono font-medium text-indigo-600 dark:text-indigo-400">
                <Clock className="w-3 h-3 text-slate-400" />
                <span>
                  {task.startTime ? `${task.startTime} - ${task.endTime || ''}` : task.dueTime}
                </span>
              </span>
            )}

            <span aria-hidden="true" className="text-slate-300 dark:text-slate-700">·</span>
            <span className="font-mono">
              {task.dueDate === todayStr ? 'Hoje' : formatDateBR(task.dueDate)}
            </span>

            <span aria-hidden="true" className="text-slate-300 dark:text-slate-700">·</span>
            <span className="font-mono tabular-nums">{task.estimatedMinutes} min</span>

            {goal && (
              <>
                <span aria-hidden="true" className="text-slate-300 dark:text-slate-700">·</span>
                <span className="flex items-center gap-1 text-indigo-600 dark:text-indigo-400 truncate max-w-[160px]">
                  <Target className="w-3 h-3 shrink-0" />
                  <span className="truncate">{goal.title}</span>
                </span>
              </>
            )}

            {hasSubtasks && (
              <>
                <span aria-hidden="true" className="text-slate-300 dark:text-slate-700">·</span>
                <button
                  onClick={() => setIsExpanded(!isExpanded)}
                  className="flex items-center gap-0.5 text-indigo-600 dark:text-indigo-400 hover:underline cursor-pointer"
                >
                  <span>{completedSubtasks}/{task.subtasks!.length} subtarefas</span>
                  {isExpanded ? <ChevronDown className="w-3 h-3" /> : <ChevronRight className="w-3 h-3" />}
                </button>
              </>
            )}
          </div>

          {/* Collapsible Subtasks */}
          {hasSubtasks && isExpanded && (
            <div className="mt-2.5 pt-2 pl-2 border-t border-slate-100 dark:border-slate-800 space-y-1">
              {task.subtasks!.map((sub) => (
                <label key={sub.id} className="flex items-center gap-2 text-xs cursor-pointer">
                  <input
                    type="checkbox"
                    checked={sub.completed}
                    onChange={() => onToggleSubtask(task.id, sub.id)}
                    className="rounded text-indigo-600 focus:ring-indigo-500 w-3.5 h-3.5 cursor-pointer"
                  />
                  <span className={sub.completed ? 'line-through text-slate-400' : 'text-slate-700 dark:text-slate-300'}>
                    {sub.title}
                  </span>
                </label>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
