import React, { useState } from 'react';
import { X, Clock, Target, Sparkles } from 'lucide-react';
import { Task, Goal, Priority } from '../types';

interface TaskModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (task: Task) => void;
  initialTask?: Task | null;
  goals: Goal[];
  initialDate?: string;
}

export const TaskModal: React.FC<TaskModalProps> = ({
  isOpen,
  onClose,
  onSave,
  initialTask,
  goals,
  initialDate,
}) => {
  const [title, setTitle] = useState(initialTask?.title || '');
  const [description, setDescription] = useState(initialTask?.description || '');
  const [priority, setPriority] = useState<Priority>(initialTask?.priority || 'medium');
  const [dueDate, setDueDate] = useState(
    initialTask?.dueDate || initialDate || new Date().toISOString().split('T')[0]
  );
  const [startTime, setStartTime] = useState(initialTask?.startTime || '09:00');
  const [endTime, setEndTime] = useState(initialTask?.endTime || '10:00');
  const [estimatedMinutes, setEstimatedMinutes] = useState(initialTask?.estimatedMinutes || 30);
  const [goalId, setGoalId] = useState(initialTask?.goalId || '');
  const [category, setCategory] = useState(initialTask?.category || 'Geral');
  const [subtasks, setSubtasks] = useState(initialTask?.subtasks || []);
  const [isBreakingDown, setIsBreakingDown] = useState(false);

  if (!isOpen) return null;

  const handleAiBreakdown = async () => {
    if (!title.trim()) return;
    setIsBreakingDown(true);
    try {
      const res = await fetch('/api/gemini/task-breakdown', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ taskTitle: title, taskCategory: category }),
      });
      const data = await res.json();
      if (data.success && data.text) {
        const lines = data.text
          .split('\n')
          .map((l: string) => l.replace(/^[-•*0-9.)\s]+/, '').trim())
          .filter((l: string) => l.length > 3)
          .slice(0, 5);
        setSubtasks((prev) => [
          ...prev,
          ...lines.map((t: string, i: number) => ({ id: `sub-${Date.now()}-${i}`, title: t, completed: false })),
        ]);
      }
    } catch (err) {
      console.warn('AI breakdown error:', err);
    } finally {
      setIsBreakingDown(false);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;

    onSave({
      id: initialTask?.id || 'task-' + Date.now(),
      title: title.trim(),
      description: description.trim() || undefined,
      priority,
      dueDate,
      dueTime: startTime,
      startTime,
      endTime,
      estimatedMinutes: Number(estimatedMinutes) || 30,
      completed: initialTask?.completed || false,
      completedAt: initialTask?.completedAt,
      goalId: goalId || undefined,
      category: category.trim() || 'Geral',
      tags: initialTask?.tags || [],
      subtasks,
    });
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-xs overflow-y-auto">
      <div className="w-full max-w-lg rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-6 shadow-2xl my-6">
        <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
          <h2 className="text-base font-semibold text-slate-900 dark:text-white">
            {initialTask ? 'Editar Atividade' : 'Nova Atividade com Horário'}
          </h2>
          <button onClick={onClose} className="p-1 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-slate-200">
            <X className="w-4 h-4" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="mt-4 space-y-3.5">
          <div>
            <label className="block text-xs font-semibold uppercase text-slate-600 dark:text-slate-400 mb-1">Título *</label>
            <input
              type="text"
              required
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Ex: Reunião de Planejamento ou Estudo React"
              className="w-full px-3 py-2 text-xs rounded-lg bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white"
            />
          </div>

          {/* Priority */}
          <div>
            <label className="block text-xs font-semibold uppercase text-slate-600 dark:text-slate-400 mb-1">Prioridade *</label>
            <div className="grid grid-cols-3 gap-2">
              {(['high', 'medium', 'low'] as Priority[]).map((p) => (
                <button
                  key={p}
                  type="button"
                  onClick={() => setPriority(p)}
                  className={`py-1.5 px-2 text-xs font-medium rounded-lg border capitalize transition ${
                    priority === p
                      ? p === 'high' ? 'bg-rose-50 border-rose-500 text-rose-700 dark:bg-rose-950/40 font-bold'
                        : p === 'medium' ? 'bg-amber-50 border-amber-500 text-amber-700 dark:bg-amber-950/40 font-bold'
                        : 'bg-slate-100 border-slate-500 text-slate-800 dark:bg-slate-800 font-bold'
                      : 'border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-400'
                  }`}
                >
                  {p === 'high' ? 'Alta' : p === 'medium' ? 'Média' : 'Baixa'}
                </button>
              ))}
            </div>
          </div>

          {/* Date, Start Time & End Time */}
          <div className="grid grid-cols-3 gap-2.5">
            <div>
              <label className="block text-xs font-semibold uppercase text-slate-600 dark:text-slate-400 mb-1">Data *</label>
              <input
                type="date"
                required
                value={dueDate}
                onChange={(e) => setDueDate(e.target.value)}
                className="w-full px-2.5 py-1.5 text-xs rounded-lg bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold uppercase text-slate-600 dark:text-slate-400 mb-1">Hora Início *</label>
              <input
                type="time"
                required
                value={startTime}
                onChange={(e) => setStartTime(e.target.value)}
                className="w-full px-2.5 py-1.5 text-xs rounded-lg bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white font-mono"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold uppercase text-slate-600 dark:text-slate-400 mb-1">Hora Término</label>
              <input
                type="time"
                value={endTime}
                onChange={(e) => setEndTime(e.target.value)}
                className="w-full px-2.5 py-1.5 text-xs rounded-lg bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white font-mono"
              />
            </div>
          </div>

          {/* Goal & Category */}
          <div className="grid grid-cols-2 gap-2.5">
            <div>
              <label className="block text-xs font-semibold uppercase text-slate-600 dark:text-slate-400 mb-1">Vincular a Meta</label>
              <select
                value={goalId}
                onChange={(e) => setGoalId(e.target.value)}
                className="w-full px-2.5 py-1.5 text-xs rounded-lg bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white"
              >
                <option value="">Nenhuma meta</option>
                {goals.map((g) => (<option key={g.id} value={g.id}>{g.title}</option>))}
              </select>
            </div>
            <div>
              <label className="block text-xs font-semibold uppercase text-slate-600 dark:text-slate-400 mb-1">Categoria</label>
              <input
                type="text"
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                placeholder="Ex: Trabalho, Estudos"
                className="w-full px-2.5 py-1.5 text-xs rounded-lg bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white"
              />
            </div>
          </div>

          {/* Subtasks with AI */}
          <div className="pt-2 border-t border-slate-100 dark:border-slate-800">
            <div className="flex items-center justify-between mb-1.5">
              <span className="text-xs font-semibold uppercase text-slate-500">Subtarefas ({subtasks.length})</span>
              <button
                type="button"
                onClick={handleAiBreakdown}
                disabled={isBreakingDown || !title.trim()}
                className="flex items-center gap-1 text-xs text-indigo-600 dark:text-indigo-400 font-medium disabled:opacity-50"
              >
                <Sparkles className="w-3 h-3" />
                <span>{isBreakingDown ? 'Dividindo...' : 'Dividir com IA'}</span>
              </button>
            </div>
            {subtasks.length > 0 && (
              <div className="space-y-1 max-h-24 overflow-y-auto pr-1">
                {subtasks.map((st) => (
                  <div key={st.id} className="text-xs p-1.5 rounded bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 truncate">
                    {st.title}
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="flex justify-end gap-2 pt-3 border-t border-slate-100 dark:border-slate-800">
            <button type="button" onClick={onClose} className="px-3.5 py-1.5 text-xs rounded-lg border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300">
              Cancelar
            </button>
            <button type="submit" className="px-4 py-1.5 text-xs font-medium rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white">
              {initialTask ? 'Salvar Alterações' : 'Criar Atividade'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
