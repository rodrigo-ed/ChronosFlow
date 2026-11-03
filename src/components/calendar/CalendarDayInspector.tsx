import React from 'react';
import { Plus, Clock, MapPin, Target, Edit2, Trash2, Landmark } from 'lucide-react';
import { CalendarEvent, Task, Goal, Holiday } from '../../types';
import { formatDateBR } from '../../utils/reports';

interface CalendarDayInspectorProps {
  selectedDate: string;
  events: CalendarEvent[];
  tasks: Task[];
  goals: Goal[];
  holiday?: Holiday;
  onOpenNewEventModal: (date: string) => void;
  onEditEvent: (event: CalendarEvent) => void;
  onDeleteEvent: (id: string) => void;
  onSelectDateForTask: (date: string) => void;
}

export const CalendarDayInspector: React.FC<CalendarDayInspectorProps> = ({
  selectedDate,
  events,
  tasks,
  goals,
  holiday,
  onOpenNewEventModal,
  onEditEvent,
  onDeleteEvent,
  onSelectDateForTask,
}) => {
  const dayEvents = events.filter((e) => e.startDate === selectedDate);
  const dayTasks = tasks.filter((t) => t.dueDate === selectedDate);

  return (
    <div className="rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-5 shadow-xs flex flex-col justify-between">
      <div>
        <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
          <div>
            <h3 className="text-sm font-semibold text-slate-900 dark:text-white">
              Agenda do Dia
            </h3>
            <p className="text-xs text-slate-500 font-mono tabular-nums">
              {formatDateBR(selectedDate)}
            </p>
          </div>
          <button
            onClick={() => onOpenNewEventModal(selectedDate)}
            className="p-1 rounded-lg text-indigo-600 dark:text-indigo-400 hover:bg-indigo-50 dark:hover:bg-slate-800"
            title="Novo compromisso neste dia"
          >
            <Plus className="w-4 h-4" />
          </button>
        </div>

        {/* Holiday Banner if present on this date */}
        {holiday && (
          <div className="mt-3 p-2.5 rounded-xl bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-800/80 flex items-center gap-2 text-xs text-amber-800 dark:text-amber-200">
            <Landmark className="w-4 h-4 text-amber-600 shrink-0" />
            <div>
              <span className="font-bold">{holiday.name}</span>
              <span className="text-[11px] block capitalize opacity-80">
                Feriado {holiday.type}
              </span>
            </div>
          </div>
        )}

        {/* Day Events List */}
        <div className="mt-4 space-y-3">
          <span className="text-[11px] font-semibold uppercase tracking-wider text-slate-400">
            Compromissos ({dayEvents.length})
          </span>

          {dayEvents.length === 0 ? (
            <p className="text-xs text-slate-400 italic py-1">Nenhum compromisso marcado.</p>
          ) : (
            <div className="space-y-2 max-h-48 overflow-y-auto pr-1">
              {dayEvents.map((ev) => {
                const linkedGoal = goals.find((g) => g.id === ev.relatedGoalId);
                return (
                  <div
                    key={ev.id}
                    className="p-2.5 rounded-xl border border-slate-100 dark:border-slate-800 bg-slate-50/60 dark:bg-slate-800/40 group relative"
                  >
                    <div className="flex items-start justify-between gap-1">
                      <h5 className="text-xs font-semibold text-slate-900 dark:text-white truncate">
                        {ev.title}
                      </h5>
                      <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                        <button
                          onClick={() => onEditEvent(ev)}
                          className="p-0.5 text-slate-400 hover:text-indigo-600"
                        >
                          <Edit2 className="w-3 h-3" />
                        </button>
                        <button
                          onClick={() => onDeleteEvent(ev.id)}
                          className="p-0.5 text-slate-400 hover:text-rose-500"
                        >
                          <Trash2 className="w-3 h-3" />
                        </button>
                      </div>
                    </div>

                    <div className="mt-1 flex items-center gap-1.5 text-[11px] text-slate-500 font-mono">
                      <Clock className="w-3 h-3 text-slate-400" />
                      <span>
                        {ev.isAllDay ? 'Dia todo' : `${ev.startTime} - ${ev.endTime || ''}`}
                      </span>
                    </div>

                    {ev.location && (
                      <div className="mt-1 flex items-center gap-1 text-[11px] text-slate-400 truncate">
                        <MapPin className="w-3 h-3 shrink-0" />
                        <span>{ev.location}</span>
                      </div>
                    )}

                    {linkedGoal && (
                      <div className="mt-1 flex items-center gap-1 text-[11px] text-indigo-600 dark:text-indigo-400 truncate">
                        <Target className="w-3 h-3 shrink-0" />
                        <span>{linkedGoal.title}</span>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Day Tasks List with Hours */}
        <div className="mt-5 space-y-2 border-t border-slate-100 dark:border-slate-800 pt-3">
          <span className="text-[11px] font-semibold uppercase tracking-wider text-slate-400">
            Tarefas ({dayTasks.length})
          </span>

          {dayTasks.length === 0 ? (
            <p className="text-xs text-slate-400 italic py-1">Nenhuma tarefa para este dia.</p>
          ) : (
            <div className="space-y-1.5 max-h-40 overflow-y-auto pr-1">
              {dayTasks.map((t) => (
                <div
                  key={t.id}
                  className="p-2 rounded-lg bg-slate-50 dark:bg-slate-800/40 border border-slate-100 dark:border-slate-800 text-xs flex items-center justify-between gap-1"
                >
                  <div className="truncate">
                    <span
                      className={`truncate text-slate-800 dark:text-slate-200 block ${
                        t.completed ? 'line-through text-slate-400' : ''
                      }`}
                    >
                      {t.title}
                    </span>
                    {(t.startTime || t.dueTime) && (
                      <span className="text-[10px] text-slate-400 font-mono">
                        {t.startTime ? `${t.startTime} - ${t.endTime || ''}` : `às ${t.dueTime}`}
                      </span>
                    )}
                  </div>
                  <span
                    className={`text-[9px] uppercase font-bold px-1.5 py-0.5 rounded shrink-0 ${
                      t.priority === 'high'
                        ? 'bg-rose-100 text-rose-700 dark:bg-rose-950 dark:text-rose-300'
                        : t.priority === 'medium'
                        ? 'bg-amber-100 text-amber-700 dark:bg-amber-950 dark:text-amber-300'
                        : 'bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-400'
                    }`}
                  >
                    {t.priority === 'high' ? 'Alta' : t.priority === 'medium' ? 'Média' : 'Baixa'}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      <button
        onClick={() => onSelectDateForTask(selectedDate)}
        className="mt-4 w-full py-2 px-3 text-xs font-medium rounded-lg border border-slate-200 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-200 transition"
      >
        + Nova Tarefa para este Dia
      </button>
    </div>
  );
};
