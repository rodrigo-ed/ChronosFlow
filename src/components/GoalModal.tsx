import React, { useState } from 'react';
import { X, Target } from 'lucide-react';
import { Goal } from '../types';

interface GoalModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (goal: Goal) => void;
  initialGoal?: Goal | null;
}

export const GoalModal: React.FC<GoalModalProps> = ({
  isOpen,
  onClose,
  onSave,
  initialGoal,
}) => {
  const [title, setTitle] = useState(initialGoal?.title || '');
  const [description, setDescription] = useState(initialGoal?.description || '');
  const [category, setCategory] = useState(initialGoal?.category || 'Carreira');
  const [color, setColor] = useState(initialGoal?.color || '#4F46E5');
  const [targetDate, setTargetDate] = useState(
    initialGoal?.targetDate || new Date(Date.now() + 30 * 86400000).toISOString().split('T')[0]
  );
  const [targetValue, setTargetValue] = useState(initialGoal?.targetValue || 100);
  const [currentValue, setCurrentValue] = useState(initialGoal?.currentValue || 0);
  const [unit, setUnit] = useState(initialGoal?.unit || 'tarefas');

  if (!isOpen) return null;

  const colorOptions = ['#4F46E5', '#10B981', '#F59E0B', '#EF4444', '#8B5CF6', '#06B6D4'];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;

    const tVal = Number(targetValue) || 1;
    const cVal = Number(currentValue) || 0;
    const progress = Math.min(100, Math.max(0, Math.round((cVal / tVal) * 100)));

    const goal: Goal = {
      id: initialGoal?.id || 'goal-' + Date.now(),
      title: title.trim(),
      description: description.trim() || undefined,
      category: category.trim() || 'Geral',
      color,
      targetDate,
      targetValue: tVal,
      currentValue: cVal,
      unit: unit.trim() || 'tarefas',
      progress,
      linkedTaskIds: initialGoal?.linkedTaskIds || [],
    };

    onSave(goal);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-xs overflow-y-auto">
      <div className="relative w-full max-w-md rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-2xl p-6 my-8">
        <div className="flex items-center justify-between pb-4 border-b border-slate-100 dark:border-slate-800">
          <div>
            <h2 className="text-lg font-semibold text-slate-900 dark:text-white">
              {initialGoal ? 'Editar Meta Pessoal' : 'Nova Meta Pessoal'}
            </h2>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Conecte suas tarefas e compromissos aos seus grandes objetivos.
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="mt-4 space-y-4">
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-slate-600 dark:text-slate-400 mb-1">
              Título da Meta *
            </label>
            <input
              type="text"
              required
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Ex: Aprender TypeScript Avançado ou Correr 10km"
              className="w-full px-3.5 py-2 text-sm rounded-lg bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white placeholder-slate-400"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-slate-600 dark:text-slate-400 mb-1">
              Descrição e Motivação
            </label>
            <textarea
              rows={2}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Por que esta meta é crucial para o seu momento?"
              className="w-full px-3.5 py-2 text-sm rounded-lg bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white placeholder-slate-400 resize-none"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-slate-600 dark:text-slate-400 mb-1">
                Categoria
              </label>
              <input
                type="text"
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                placeholder="Ex: Carreira, Finanças, Saúde"
                className="w-full px-3 py-2 text-xs rounded-lg bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-slate-600 dark:text-slate-400 mb-1">
                Prazo Alvo
              </label>
              <input
                type="date"
                required
                value={targetDate}
                onChange={(e) => setTargetDate(e.target.value)}
                className="w-full px-3 py-2 text-xs rounded-lg bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white"
              />
            </div>
          </div>

          {/* Metric target values */}
          <div className="grid grid-cols-3 gap-3">
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-slate-600 dark:text-slate-400 mb-1">
                Valor Atual
              </label>
              <input
                type="number"
                min="0"
                value={currentValue}
                onChange={(e) => setCurrentValue(parseFloat(e.target.value) || 0)}
                className="w-full px-3 py-2 text-xs rounded-lg bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white font-mono"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-slate-600 dark:text-slate-400 mb-1">
                Meta Alvo
              </label>
              <input
                type="number"
                min="1"
                value={targetValue}
                onChange={(e) => setTargetValue(parseFloat(e.target.value) || 1)}
                className="w-full px-3 py-2 text-xs rounded-lg bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white font-mono"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-slate-600 dark:text-slate-400 mb-1">
                Unidade
              </label>
              <input
                type="text"
                value={unit}
                onChange={(e) => setUnit(e.target.value)}
                placeholder="horas, km, lições"
                className="w-full px-3 py-2 text-xs rounded-lg bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white"
              />
            </div>
          </div>

          {/* Color picker */}
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-slate-600 dark:text-slate-400 mb-1.5">
              Cor de Destaque
            </label>
            <div className="flex items-center gap-3">
              {colorOptions.map((hex) => (
                <button
                  key={hex}
                  type="button"
                  onClick={() => setColor(hex)}
                  className={`w-6 h-6 rounded-full transition-transform ${
                    color === hex ? 'ring-2 ring-offset-2 ring-slate-900 dark:ring-white scale-110' : 'opacity-80 hover:opacity-100'
                  }`}
                  style={{ backgroundColor: hex }}
                />
              ))}
            </div>
          </div>

          <div className="flex items-center justify-end gap-2 pt-4 border-t border-slate-100 dark:border-slate-800">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-xs font-medium rounded-lg border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 transition"
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="px-5 py-2 text-xs font-medium rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white shadow-sm transition"
            >
              {initialGoal ? 'Salvar Alterações' : 'Criar Meta'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
