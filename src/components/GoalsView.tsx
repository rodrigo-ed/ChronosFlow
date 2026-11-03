import React from 'react';
import { Plus, Target, CheckCircle2, Calendar, Clock, Edit2, Trash2 } from 'lucide-react';
import { Goal, Task, CalendarEvent } from '../types';
import { formatDateBR } from '../utils/reports';

interface GoalsViewProps {
  goals: Goal[];
  tasks: Task[];
  events: CalendarEvent[];
  onOpenNewGoalModal: () => void;
  onEditGoal: (goal: Goal) => void;
  onDeleteGoal: (id: string) => void;
  onUpdateGoalProgress: (goalId: string, delta: number) => void;
}

export const GoalsView: React.FC<GoalsViewProps> = ({
  goals,
  tasks,
  events,
  onOpenNewGoalModal,
  onEditGoal,
  onDeleteGoal,
  onUpdateGoalProgress,
}) => {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-200 dark:border-slate-800">
        <div>
          <h2 className="text-xl font-bold tracking-tight text-slate-900 dark:text-white">
            Metas Pessoais & Objetivos
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
            Conecte suas tarefas diárias aos seus objetivos de longo prazo para garantir evolução contínua.
          </p>
        </div>

        <button
          onClick={onOpenNewGoalModal}
          className="flex items-center gap-1.5 px-3.5 py-2 text-xs font-medium rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white shadow-sm transition cursor-pointer shrink-0"
        >
          <Plus className="w-3.5 h-3.5" />
          <span>Nova Meta</span>
        </button>
      </div>

      {/* Goals Cards Grid */}
      {goals.length === 0 ? (
        <div className="p-12 text-center rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
          <Target className="w-10 h-10 text-slate-400 mx-auto mb-3" />
          <p className="text-sm font-medium text-slate-700 dark:text-slate-300">
            Você ainda não cadastrou nenhuma meta pessoal.
          </p>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Defina metas claras para que o ChronosFlow e a IA sugiram tarefas alinhadas.
          </p>
          <button
            onClick={onOpenNewGoalModal}
            className="mt-4 px-4 py-2 text-xs font-medium rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white"
          >
            + Cadastrar Primeira Meta
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {goals.map((goal) => {
            const linkedTasks = tasks.filter((t) => t.goalId === goal.id);
            const completedLinkedTasks = linkedTasks.filter((t) => t.completed).length;
            const linkedEvents = events.filter((e) => e.relatedGoalId === goal.id);

            return (
              <div
                key={goal.id}
                className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs flex flex-col justify-between group hover:border-slate-300 dark:hover:border-slate-700 transition"
              >
                <div>
                  <div className="flex items-start justify-between gap-2">
                    <span
                      className="text-[11px] font-semibold uppercase tracking-wider px-2 py-0.5 rounded"
                      style={{
                        backgroundColor: `${goal.color}15`,
                        color: goal.color,
                      }}
                    >
                      {goal.category}
                    </span>

                    <div className="flex items-center gap-1 opacity-100 md:opacity-0 md:group-hover:opacity-100 transition-opacity">
                      <button
                        onClick={() => onEditGoal(goal)}
                        className="p-1.5 text-slate-400 hover:text-indigo-600 rounded-lg touch-manipulation cursor-pointer"
                        title="Editar meta"
                      >
                        <Edit2 className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={() => onDeleteGoal(goal.id)}
                        className="p-1.5 text-slate-400 hover:text-rose-500 rounded-lg touch-manipulation cursor-pointer"
                        title="Excluir meta"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>

                  <h3 className="mt-2 text-base font-semibold text-slate-900 dark:text-white leading-snug">
                    {goal.title}
                  </h3>

                  {goal.description && (
                    <p className="mt-1.5 text-xs text-slate-500 dark:text-slate-400 leading-relaxed line-clamp-2">
                      {goal.description}
                    </p>
                  )}

                  {/* Progress Bar & Numeric Indicator */}
                  <div className="mt-4">
                    <div className="flex items-center justify-between text-xs mb-1.5 font-mono tabular-nums">
                      <span className="text-slate-500 dark:text-slate-400">
                        {goal.currentValue} / {goal.targetValue} {goal.unit}
                      </span>
                      <span className="font-bold text-slate-900 dark:text-white">
                        {goal.progress}%
                      </span>
                    </div>

                    <div className="w-full h-2 rounded-full bg-slate-100 dark:bg-slate-800 overflow-hidden">
                      <div
                        className="h-full rounded-full transition-all duration-500"
                        style={{
                          width: `${Math.min(100, goal.progress)}%`,
                          backgroundColor: goal.color,
                        }}
                      />
                    </div>
                  </div>

                  {/* Quick increment buttons */}
                  <div className="mt-3 flex items-center gap-1.5">
                    <span className="text-[11px] text-slate-400 mr-1">Registrar progresso:</span>
                    <button
                      onClick={() => onUpdateGoalProgress(goal.id, 1)}
                      className="px-2 py-0.5 text-[11px] font-mono rounded bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300"
                    >
                      +1 {goal.unit}
                    </button>
                    <button
                      onClick={() => onUpdateGoalProgress(goal.id, 5)}
                      className="px-2 py-0.5 text-[11px] font-mono rounded bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300"
                    >
                      +5 {goal.unit}
                    </button>
                  </div>
                </div>

                {/* Footer metadata */}
                <div className="mt-5 pt-3 border-t border-slate-100 dark:border-slate-800/80 flex items-center justify-between text-xs text-slate-500 dark:text-slate-400">
                  <span className="flex items-center gap-1">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" />
                    <span>{completedLinkedTasks}/{linkedTasks.length} tarefas</span>
                  </span>

                  <span className="font-mono tabular-nums text-[11px]">
                    Prazo: {formatDateBR(goal.targetDate)}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
