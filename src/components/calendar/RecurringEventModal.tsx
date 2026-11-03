import React, { useState } from 'react';
import { X, Repeat } from 'lucide-react';
import { CalendarEvent, Goal, RecurringPattern } from '../../types';
import { generateRecurringEvents } from '../../utils/recurring';

interface RecurringEventModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSaveEvents: (events: CalendarEvent[]) => void;
  goals: Goal[];
}

export const RecurringEventModal: React.FC<RecurringEventModalProps> = ({
  isOpen,
  onClose,
  onSaveEvents,
  goals,
}) => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [frequency, setFrequency] = useState<'weekdays' | 'daily' | 'custom_days'>('weekdays');
  const [selectedDays, setSelectedDays] = useState<number[]>([1, 2, 3, 4, 5]);

  const todayStr = new Date().toISOString().split('T')[0];
  const nextMonth = new Date();
  nextMonth.setMonth(nextMonth.getMonth() + 1);
  const nextMonthStr = nextMonth.toISOString().split('T')[0];

  const [startDate, setStartDate] = useState(todayStr);
  const [endDate, setEndDate] = useState(nextMonthStr);
  const [startTime, setStartTime] = useState('07:00');
  const [endTime, setEndTime] = useState('12:00');
  const [color, setColor] = useState('#0284C7');
  const [location, setLocation] = useState('');
  const [relatedGoalId, setRelatedGoalId] = useState('');

  if (!isOpen) return null;

  const weekDayLabels = ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb'];

  const toggleDay = (day: number) => {
    setSelectedDays((prev) =>
      prev.includes(day) ? prev.filter((d) => d !== day) : [...prev, day].sort()
    );
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;

    const pattern: RecurringPattern = {
      frequency,
      selectedDays: frequency === 'custom_days' ? selectedDays : frequency === 'weekdays' ? [1, 2, 3, 4, 5] : [0, 1, 2, 3, 4, 5, 6],
      startDate,
      endDate,
      startTime,
      endTime,
    };

    const generated = generateRecurringEvents({
      title: title.trim(),
      description: description.trim() || undefined,
      color,
      location: location.trim() || undefined,
      relatedGoalId: relatedGoalId || undefined,
      pattern,
    });

    onSaveEvents(generated);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-xs overflow-y-auto">
      <div className="w-full max-w-md rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-6 shadow-2xl my-6">
        <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
          <div className="flex items-center gap-2">
            <Repeat className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
            <h3 className="text-base font-semibold text-slate-900 dark:text-white">
              Agendamento Recorrente
            </h3>
          </div>
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
              placeholder="Ex: Trabalho, Estágio (07h às 12h)"
              className="w-full px-2.5 py-1.5 text-xs rounded-lg bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold uppercase text-slate-500 mb-1">Frequência</label>
            <div className="grid grid-cols-3 gap-2">
              <button
                type="button"
                onClick={() => { setFrequency('weekdays'); setSelectedDays([1, 2, 3, 4, 5]); }}
                className={`py-1.5 text-xs rounded-lg border transition ${frequency === 'weekdays' ? 'bg-indigo-50 border-indigo-500 text-indigo-700 font-bold' : 'border-slate-200 text-slate-500'}`}
              >
                Seg a Sex
              </button>
              <button
                type="button"
                onClick={() => { setFrequency('daily'); setSelectedDays([0, 1, 2, 3, 4, 5, 6]); }}
                className={`py-1.5 text-xs rounded-lg border transition ${frequency === 'daily' ? 'bg-indigo-50 border-indigo-500 text-indigo-700 font-bold' : 'border-slate-200 text-slate-500'}`}
              >
                Todos os dias
              </button>
              <button
                type="button"
                onClick={() => setFrequency('custom_days')}
                className={`py-1.5 text-xs rounded-lg border transition ${frequency === 'custom_days' ? 'bg-indigo-50 border-indigo-500 text-indigo-700 font-bold' : 'border-slate-200 text-slate-500'}`}
              >
                Personalizado
              </button>
            </div>
          </div>

          {frequency === 'custom_days' && (
            <div className="flex justify-between gap-1 p-2 rounded-lg bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700">
              {weekDayLabels.map((lbl, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={() => toggleDay(idx)}
                  className={`w-7 h-7 rounded-full text-xs font-medium ${selectedDays.includes(idx) ? 'bg-indigo-600 text-white' : 'text-slate-500'}`}
                >
                  {lbl}
                </button>
              ))}
            </div>
          )}

          <div className="grid grid-cols-2 gap-2">
            <div>
              <label className="block text-xs font-semibold text-slate-500 mb-1">Hora Início *</label>
              <input
                type="time"
                required
                value={startTime}
                onChange={(e) => setStartTime(e.target.value)}
                className="w-full px-2 py-1 text-xs rounded-lg bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 font-mono"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-500 mb-1">Hora Fim *</label>
              <input
                type="time"
                required
                value={endTime}
                onChange={(e) => setEndTime(e.target.value)}
                className="w-full px-2 py-1 text-xs rounded-lg bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 font-mono"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-2">
            <div>
              <label className="block text-xs font-semibold text-slate-500 mb-1">A Partir De</label>
              <input
                type="date"
                required
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                className="w-full px-2 py-1 text-xs rounded-lg bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-500 mb-1">Até (Data Final)</label>
              <input
                type="date"
                required
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
                className="w-full px-2 py-1 text-xs rounded-lg bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700"
              />
            </div>
          </div>

          <div className="flex justify-end gap-2 pt-3 border-t border-slate-100 dark:border-slate-800">
            <button type="button" onClick={onClose} className="px-3.5 py-1.5 text-xs rounded-lg border border-slate-200 text-slate-600">
              Cancelar
            </button>
            <button type="submit" className="px-4 py-1.5 text-xs font-medium rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white">
              Agendar no Calendário
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
