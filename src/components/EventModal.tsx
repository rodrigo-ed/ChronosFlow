import React, { useState } from 'react';
import { X, Calendar as CalendarIcon, MapPin, Target } from 'lucide-react';
import { CalendarEvent, Goal } from '../types';

interface EventModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (event: CalendarEvent) => void;
  initialEvent?: CalendarEvent | null;
  goals: Goal[];
  initialDate?: string;
}

export const EventModal: React.FC<EventModalProps> = ({
  isOpen,
  onClose,
  onSave,
  initialEvent,
  goals,
  initialDate,
}) => {
  const [title, setTitle] = useState(initialEvent?.title || '');
  const [description, setDescription] = useState(initialEvent?.description || '');
  const [startDate, setStartDate] = useState(
    initialEvent?.startDate || initialDate || new Date().toISOString().split('T')[0]
  );
  const [startTime, setStartTime] = useState(initialEvent?.startTime || '09:00');
  const [endDate, setEndDate] = useState(
    initialEvent?.endDate || initialDate || new Date().toISOString().split('T')[0]
  );
  const [endTime, setEndTime] = useState(initialEvent?.endTime || '10:00');
  const [isAllDay, setIsAllDay] = useState(initialEvent?.isAllDay || false);
  const [color, setColor] = useState(initialEvent?.color || '#4F46E5');
  const [location, setLocation] = useState(initialEvent?.location || '');
  const [relatedGoalId, setRelatedGoalId] = useState(initialEvent?.relatedGoalId || '');

  if (!isOpen) return null;

  const colorOptions = ['#4F46E5', '#10B981', '#F59E0B', '#EC4899', '#06B6D4', '#8B5CF6'];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;

    onSave({
      id: initialEvent?.id || 'event-' + Date.now(),
      title: title.trim(),
      description: description.trim() || undefined,
      startDate,
      startTime: isAllDay ? undefined : startTime,
      endDate: endDate || startDate,
      endTime: isAllDay ? undefined : endTime,
      isAllDay,
      color,
      location: location.trim() || undefined,
      relatedGoalId: relatedGoalId || undefined,
      source: initialEvent?.source || 'manual',
    });
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-xs overflow-y-auto">
      <div className="w-full max-w-md rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-6 shadow-2xl my-6">
        <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
          <h2 className="text-base font-semibold text-slate-900 dark:text-white">
            {initialEvent ? 'Editar Compromisso' : 'Novo Compromisso'}
          </h2>
          <button onClick={onClose} className="p-1 rounded-lg text-slate-400 hover:text-slate-600">
            <X className="w-4 h-4" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="mt-4 space-y-3">
          <div>
            <label className="block text-xs font-semibold uppercase text-slate-500 mb-1">Título *</label>
            <input
              type="text"
              required
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Ex: Sessão de Foco ou Reunião"
              className="w-full px-3 py-1.5 text-xs rounded-lg bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white"
            />
          </div>

          <label className="flex items-center gap-2 text-xs text-slate-700 dark:text-slate-300 cursor-pointer">
            <input
              type="checkbox"
              checked={isAllDay}
              onChange={(e) => setIsAllDay(e.target.checked)}
              className="rounded text-indigo-600 w-3.5 h-3.5"
            />
            <span>Evento de dia inteiro</span>
          </label>

          <div className="grid grid-cols-2 gap-2">
            <div>
              <label className="block text-xs font-semibold text-slate-500 mb-1">Data Início</label>
              <input
                type="date"
                required
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                className="w-full px-2 py-1 text-xs rounded-lg bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white"
              />
            </div>
            {!isAllDay && (
              <div>
                <label className="block text-xs font-semibold text-slate-500 mb-1">Hora Início</label>
                <input
                  type="time"
                  required
                  value={startTime}
                  onChange={(e) => setStartTime(e.target.value)}
                  className="w-full px-2 py-1 text-xs rounded-lg bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white font-mono"
                />
              </div>
            )}
          </div>

          {!isAllDay && (
            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className="block text-xs font-semibold text-slate-500 mb-1">Data Fim</label>
                <input
                  type="date"
                  value={endDate}
                  onChange={(e) => setEndDate(e.target.value)}
                  className="w-full px-2 py-1 text-xs rounded-lg bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-500 mb-1">Hora Fim</label>
                <input
                  type="time"
                  value={endTime}
                  onChange={(e) => setEndTime(e.target.value)}
                  className="w-full px-2 py-1 text-xs rounded-lg bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white font-mono"
                />
              </div>
            </div>
          )}

          <div>
            <label className="block text-xs font-semibold text-slate-500 mb-1">Vincular a Meta</label>
            <select
              value={relatedGoalId}
              onChange={(e) => setRelatedGoalId(e.target.value)}
              className="w-full px-2 py-1 text-xs rounded-lg bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white"
            >
              <option value="">Nenhuma meta associada</option>
              {goals.map((g) => (<option key={g.id} value={g.id}>{g.title}</option>))}
            </select>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-500 mb-1">Local / Link</label>
            <input
              type="text"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              placeholder="Ex: Google Meet, Sala 4B..."
              className="w-full px-2 py-1 text-xs rounded-lg bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-500 mb-1">Cor</label>
            <div className="flex items-center gap-2">
              {colorOptions.map((c) => (
                <button
                  key={c}
                  type="button"
                  onClick={() => setColor(c)}
                  className={`w-5 h-5 rounded-full transition ${color === c ? 'ring-2 ring-indigo-500 scale-110' : 'opacity-70'}`}
                  style={{ backgroundColor: c }}
                />
              ))}
            </div>
          </div>

          <div className="flex justify-end gap-2 pt-3 border-t border-slate-100 dark:border-slate-800">
            <button type="button" onClick={onClose} className="px-3.5 py-1.5 text-xs rounded-lg border border-slate-200 dark:border-slate-700 text-slate-600">
              Cancelar
            </button>
            <button type="submit" className="px-4 py-1.5 text-xs font-medium rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white">
              {initialEvent ? 'Salvar' : 'Adicionar'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
