import React, { useState } from 'react';
import { Priority } from '../../types';

interface TaskQuickAddProps {
  onQuickAdd: (
    title: string,
    priority: Priority,
    dueDate: string,
    estimatedMinutes: number,
    startTime: string,
    endTime: string
  ) => void;
  targetDate: string;
}

export const TaskQuickAdd: React.FC<TaskQuickAddProps> = ({ onQuickAdd, targetDate }) => {
  const [title, setTitle] = useState('');
  const [priority, setPriority] = useState<Priority>('high');
  const [startTime, setStartTime] = useState('09:00');
  const [endTime, setEndTime] = useState('10:00');
  const [minutes, setMinutes] = useState(60);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;
    onQuickAdd(title.trim(), priority, targetDate, minutes, startTime, endTime);
    setTitle('');
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="p-3 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs flex flex-col md:flex-row items-center gap-2"
    >
      <input
        type="text"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        placeholder="Postar atividade rápida (ex: Estudo 09h às 10h)..."
        className="w-full md:flex-1 px-3 py-1.5 text-xs rounded-lg bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white focus:outline-none"
      />

      {/* Start and end time inputs */}
      <div className="flex items-center gap-1.5 w-full md:w-auto font-mono text-xs">
        <input
          type="time"
          value={startTime}
          onChange={(e) => setStartTime(e.target.value)}
          className="px-2 py-1 text-xs rounded bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300"
          title="Hora de Início"
        />
        <span className="text-slate-400">às</span>
        <input
          type="time"
          value={endTime}
          onChange={(e) => setEndTime(e.target.value)}
          className="px-2 py-1 text-xs rounded bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300"
          title="Hora de Término"
        />
      </div>

      {/* Priority */}
      <div className="flex items-center gap-1 w-full md:w-auto justify-between md:justify-start">
        {(['high', 'medium', 'low'] as Priority[]).map((p) => (
          <button
            key={p}
            type="button"
            onClick={() => setPriority(p)}
            className={`px-2.5 py-1 text-xs font-medium rounded-md capitalize transition ${
              priority === p
                ? p === 'high'
                  ? 'bg-rose-100 text-rose-700 dark:bg-rose-950 dark:text-rose-300 font-bold'
                  : p === 'medium'
                  ? 'bg-amber-100 text-amber-700 dark:bg-amber-950 dark:text-amber-300 font-bold'
                  : 'bg-slate-200 text-slate-800 dark:bg-slate-800 font-bold'
                : 'text-slate-500 hover:text-slate-900 dark:hover:text-slate-300'
            }`}
          >
            {p === 'high' ? 'Alta' : p === 'medium' ? 'Média' : 'Baixa'}
          </button>
        ))}

        <button
          type="submit"
          disabled={!title.trim()}
          className="px-3.5 py-1 text-xs font-medium rounded-md bg-indigo-600 hover:bg-indigo-700 text-white disabled:opacity-40 transition"
        >
          Postar
        </button>
      </div>
    </form>
  );
};
