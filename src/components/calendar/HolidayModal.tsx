import React, { useState } from 'react';
import { X, Calendar as CalendarIcon, Plus, Trash2, Landmark } from 'lucide-react';
import { Holiday, HolidayType } from '../../types/holiday';
import { formatDateBR } from '../../utils/reports';

interface HolidayModalProps {
  isOpen: boolean;
  onClose: () => void;
  customHolidays: Holiday[];
  onAddHoliday: (holiday: Holiday) => void;
  onDeleteHoliday: (id: string) => void;
}

export const HolidayModal: React.FC<HolidayModalProps> = ({
  isOpen,
  onClose,
  customHolidays,
  onAddHoliday,
  onDeleteHoliday,
}) => {
  const [name, setName] = useState('');
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [type, setType] = useState<HolidayType>('municipal');

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !date) return;

    const newHoliday: Holiday = {
      id: 'custom-hol-' + Date.now(),
      name: name.trim(),
      date,
      type,
      isCustom: true,
    };

    onAddHoliday(newHoliday);
    setName('');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-xs overflow-y-auto">
      <div className="w-full max-w-md rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-6 shadow-2xl my-6">
        <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
          <div className="flex items-center gap-2">
            <Landmark className="w-5 h-5 text-amber-500" />
            <h3 className="text-base font-semibold text-slate-900 dark:text-white">
              Feriados Municipais & Regionais
            </h3>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Add custom holiday form */}
        <form onSubmit={handleSubmit} className="mt-4 p-3 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700/60 space-y-3">
          <div className="text-xs font-semibold text-slate-700 dark:text-slate-300">
            Adicionar Novo Feriado
          </div>
          <div>
            <input
              type="text"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Ex: Aniversário da Cidade, Padroeiro..."
              className="w-full px-2.5 py-1.5 text-xs rounded-lg bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white"
            />
          </div>
          <div className="grid grid-cols-2 gap-2">
            <div>
              <input
                type="date"
                required
                value={date}
                onChange={(e) => setDate(e.target.value)}
                className="w-full px-2 py-1.5 text-xs rounded-lg bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white"
              />
            </div>
            <div>
              <select
                value={type}
                onChange={(e) => setType(e.target.value as HolidayType)}
                className="w-full px-2 py-1.5 text-xs rounded-lg bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white"
              >
                <option value="municipal">Municipal</option>
                <option value="estadual">Estadual</option>
                <option value="nacional">Nacional</option>
              </select>
            </div>
          </div>
          <button
            type="submit"
            className="w-full py-1.5 text-xs font-medium rounded-lg bg-amber-600 hover:bg-amber-700 text-white transition flex items-center justify-center gap-1"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Adicionar Feriado</span>
          </button>
        </form>

        {/* List of custom holidays */}
        <div className="mt-4">
          <h4 className="text-xs font-semibold uppercase tracking-wider text-slate-500 mb-2">
            Feriados Cadastrados ({customHolidays.length})
          </h4>
          {customHolidays.length === 0 ? (
            <p className="text-xs text-slate-400 italic text-center py-3">
              Nenhum feriado municipal adicionado ainda.
            </p>
          ) : (
            <div className="space-y-1.5 max-h-40 overflow-y-auto pr-1">
              {customHolidays.map((h) => (
                <div
                  key={h.id}
                  className="flex items-center justify-between p-2 rounded-lg bg-slate-50 dark:bg-slate-800/40 border border-slate-200 dark:border-slate-700/60 text-xs"
                >
                  <div>
                    <span className="font-semibold text-slate-800 dark:text-slate-200">
                      {h.name}
                    </span>
                    <span className="ml-2 text-slate-400 font-mono text-[11px]">
                      {formatDateBR(h.date)}
                    </span>
                  </div>
                  <button
                    onClick={() => onDeleteHoliday(h.id)}
                    className="p-1 text-slate-400 hover:text-rose-500 rounded"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="mt-4 pt-3 border-t border-slate-100 dark:border-slate-800 flex justify-end">
          <button
            onClick={onClose}
            className="px-3.5 py-1.5 text-xs rounded-lg border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300"
          >
            Fechar
          </button>
        </div>
      </div>
    </div>
  );
};
