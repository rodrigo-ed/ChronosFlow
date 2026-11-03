import React, { useState } from 'react';
import { X, Activity, Clock, Flame } from 'lucide-react';
import { Workout, WorkoutType, WorkoutIntensity } from '../../types/health';

interface WorkoutModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (workout: Workout) => void;
  initialWorkout?: Workout | null;
  initialDate?: string;
}

export const WorkoutModal: React.FC<WorkoutModalProps> = ({
  isOpen,
  onClose,
  onSave,
  initialWorkout,
  initialDate,
}) => {
  const [type, setType] = useState<WorkoutType>(initialWorkout?.type || 'corrida');
  const [date, setDate] = useState(
    initialWorkout?.date || initialDate || new Date().toISOString().split('T')[0]
  );
  const [startTime, setStartTime] = useState(initialWorkout?.startTime || '07:00');
  const [durationMinutes, setDurationMinutes] = useState(initialWorkout?.durationMinutes || 45);
  const [distanceKm, setDistanceKm] = useState<number | undefined>(initialWorkout?.distanceKm);
  const [intensity, setIntensity] = useState<WorkoutIntensity>(initialWorkout?.intensity || 'moderada');
  const [calories, setCalories] = useState<number | undefined>(initialWorkout?.calories);
  const [notes, setNotes] = useState(initialWorkout?.notes || '');

  if (!isOpen) return null;

  const workoutTypes: { value: WorkoutType; label: string; icon: string }[] = [
    { value: 'corrida', label: 'Corrida', icon: '🏃' },
    { value: 'ciclismo', label: 'Ciclismo', icon: '🚴' },
    { value: 'academia', label: 'Academia / Musculação', icon: '🏋️' },
    { value: 'funcional', label: 'Funcional / Cross', icon: '⚡' },
    { value: 'caminhada', label: 'Caminhada', icon: '🚶' },
    { value: 'outro', label: 'Outro Esporte', icon: '🎯' },
  ];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    // Calculate endTime
    const [h, m] = startTime.split(':').map((v) => parseInt(v, 10));
    const totalMin = h * 60 + m + Number(durationMinutes);
    const endH = String(Math.floor(totalMin / 60) % 24).padStart(2, '0');
    const endM = String(totalMin % 60).padStart(2, '0');
    const endTime = `${endH}:${endM}`;

    const workout: Workout = {
      id: initialWorkout?.id || 'workout-' + Date.now(),
      type,
      date,
      startTime,
      endTime,
      durationMinutes: Math.max(5, Number(durationMinutes)),
      distanceKm: distanceKm ? Number(distanceKm) : undefined,
      intensity,
      calories: calories ? Number(calories) : undefined,
      notes: notes.trim() || undefined,
    };

    onSave(workout);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-xs overflow-y-auto">
      <div className="w-full max-w-md rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-6 shadow-2xl my-6">
        <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
          <div className="flex items-center gap-2">
            <Activity className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
            <h3 className="text-base font-semibold text-slate-900 dark:text-white">
              {initialWorkout ? 'Editar Atividade Física' : 'Nova Atividade Física'}
            </h3>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="mt-4 space-y-3.5">
          {/* Activity Type Selector */}
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-slate-600 dark:text-slate-400 mb-1.5">
              Tipo de Atividade *
            </label>
            <div className="grid grid-cols-2 gap-2">
              {workoutTypes.map((w) => (
                <button
                  key={w.value}
                  type="button"
                  onClick={() => setType(w.value)}
                  className={`p-2 rounded-lg text-xs font-medium border text-left transition flex items-center gap-2 ${
                    type === w.value
                      ? 'bg-emerald-50 border-emerald-500 text-emerald-800 dark:bg-emerald-950/40 dark:text-emerald-300 font-semibold shadow-2xs'
                      : 'border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800'
                  }`}
                >
                  <span className="text-base">{w.icon}</span>
                  <span className="truncate">{w.label}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Date, Start Time & Duration */}
          <div className="grid grid-cols-3 gap-2.5">
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-slate-600 dark:text-slate-400 mb-1">
                Data *
              </label>
              <input
                type="date"
                required
                value={date}
                onChange={(e) => setDate(e.target.value)}
                className="w-full px-2.5 py-1.5 text-xs rounded-lg bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-slate-600 dark:text-slate-400 mb-1">
                Hora Início *
              </label>
              <input
                type="time"
                required
                value={startTime}
                onChange={(e) => setStartTime(e.target.value)}
                className="w-full px-2.5 py-1.5 text-xs rounded-lg bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white font-mono"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-slate-600 dark:text-slate-400 mb-1">
                Duração (min)
              </label>
              <input
                type="number"
                min="5"
                step="5"
                value={durationMinutes}
                onChange={(e) => setDurationMinutes(parseInt(e.target.value, 10) || 30)}
                className="w-full px-2.5 py-1.5 text-xs rounded-lg bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white font-mono"
              />
            </div>
          </div>

          {/* Optional Distance & Calories */}
          <div className="grid grid-cols-2 gap-2.5">
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-slate-600 dark:text-slate-400 mb-1">
                Distância (km)
              </label>
              <input
                type="number"
                step="0.1"
                min="0"
                value={distanceKm !== undefined ? distanceKm : ''}
                onChange={(e) => setDistanceKm(e.target.value ? parseFloat(e.target.value) : undefined)}
                placeholder="Ex: 5.2"
                className="w-full px-2.5 py-1.5 text-xs rounded-lg bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white font-mono"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-slate-600 dark:text-slate-400 mb-1">
                Calorias (kcal)
              </label>
              <input
                type="number"
                min="0"
                value={calories !== undefined ? calories : ''}
                onChange={(e) => setCalories(e.target.value ? parseInt(e.target.value, 10) : undefined)}
                placeholder="Ex: 350"
                className="w-full px-2.5 py-1.5 text-xs rounded-lg bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white font-mono"
              />
            </div>
          </div>

          {/* Intensity */}
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-slate-600 dark:text-slate-400 mb-1">
              Intensidade
            </label>
            <div className="grid grid-cols-3 gap-2">
              {(['leve', 'moderada', 'intensa'] as WorkoutIntensity[]).map((lvl) => (
                <button
                  key={lvl}
                  type="button"
                  onClick={() => setIntensity(lvl)}
                  className={`py-1.5 text-xs font-medium rounded-lg border capitalize transition ${
                    intensity === lvl
                      ? 'bg-emerald-50 border-emerald-500 text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-300 font-semibold'
                      : 'border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-400'
                  }`}
                >
                  {lvl}
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-slate-600 dark:text-slate-400 mb-1">
              Anotações / Foco do Treino
            </label>
            <textarea
              rows={2}
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Ex: Treino intervalado 5x 1km ou treino de pernas com agachamento..."
              className="w-full px-2.5 py-1.5 text-xs rounded-lg bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white resize-none"
            />
          </div>

          <div className="flex justify-end gap-2 pt-3 border-t border-slate-100 dark:border-slate-800">
            <button
              type="button"
              onClick={onClose}
              className="px-3.5 py-1.5 text-xs rounded-lg border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300"
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="px-4 py-1.5 text-xs font-medium rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white"
            >
              {initialWorkout ? 'Salvar Treino' : 'Agendar Treino'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
