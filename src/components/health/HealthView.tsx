import React, { useState } from 'react';
import {
  Activity,
  Plus,
  Clock,
  Flame,
  MapPin,
  Calendar,
  Edit2,
  Trash2,
} from 'lucide-react';
import { Workout, WorkoutType } from '../../types/health';
import { formatDateBR } from '../../utils/reports';

interface HealthViewProps {
  workouts: Workout[];
  onOpenNewWorkoutModal: () => void;
  onEditWorkout: (workout: Workout) => void;
  onDeleteWorkout: (id: string) => void;
}

export const HealthView: React.FC<HealthViewProps> = ({
  workouts,
  onOpenNewWorkoutModal,
  onEditWorkout,
  onDeleteWorkout,
}) => {
  const [selectedType, setSelectedType] = useState<WorkoutType | 'all'>('all');

  const filtered = workouts.filter((w) =>
    selectedType === 'all' ? true : w.type === selectedType
  );

  const totalMinutes = workouts.reduce((acc, w) => acc + w.durationMinutes, 0);
  const totalKm = workouts.reduce((acc, w) => acc + (w.distanceKm || 0), 0);
  const totalCalories = workouts.reduce((acc, w) => acc + (w.calories || 0), 0);

  const typeIcons: Record<WorkoutType, string> = {
    corrida: '🏃',
    ciclismo: '🚴',
    academia: '🏋️',
    funcional: '⚡',
    caminhada: '🚶',
    outro: '🎯',
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-200 dark:border-slate-800">
        <div>
          <h2 className="text-xl font-bold tracking-tight text-slate-900 dark:text-white flex items-center gap-2">
            <Activity className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
            <span>Saúde & Atividades Físicas</span>
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
            Agende e acompanhe corridas, musculação, ciclismo e treinos com horários precisos.
          </p>
        </div>

        <button
          onClick={onOpenNewWorkoutModal}
          className="flex items-center gap-1.5 px-3.5 py-2 text-xs font-medium rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white shadow-sm transition cursor-pointer shrink-0"
        >
          <Plus className="w-3.5 h-3.5" />
          <span>Agendar Treino</span>
        </button>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <div className="p-3.5 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-2xs">
          <span className="text-[11px] text-slate-500">Total de Treinos</span>
          <div className="text-xl font-bold text-slate-900 dark:text-white font-mono tabular-nums">
            {workouts.length}
          </div>
        </div>
        <div className="p-3.5 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-2xs">
          <span className="text-[11px] text-slate-500">Minutos Ativos</span>
          <div className="text-xl font-bold text-emerald-600 dark:text-emerald-400 font-mono tabular-nums">
            {totalMinutes} <span className="text-xs font-normal text-slate-400">min</span>
          </div>
        </div>
        <div className="p-3.5 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-2xs">
          <span className="text-[11px] text-slate-500">Distância Total</span>
          <div className="text-xl font-bold text-slate-900 dark:text-white font-mono tabular-nums">
            {Math.round(totalKm * 10) / 10} <span className="text-xs font-normal text-slate-400">km</span>
          </div>
        </div>
        <div className="p-3.5 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-2xs">
          <span className="text-[11px] text-slate-500">Gasto Calórico</span>
          <div className="text-xl font-bold text-amber-600 dark:text-amber-400 font-mono tabular-nums">
            {totalCalories} <span className="text-xs font-normal text-slate-400">kcal</span>
          </div>
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="flex flex-wrap items-center gap-1.5 p-1 rounded-lg bg-slate-100 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800/80 w-fit">
        <button
          onClick={() => setSelectedType('all')}
          className={`px-3 py-1 text-xs font-medium rounded-md transition ${
            selectedType === 'all'
              ? 'bg-white dark:bg-slate-800 text-slate-900 dark:text-white shadow-xs'
              : 'text-slate-600 dark:text-slate-400'
          }`}
        >
          Todos
        </button>
        {(['corrida', 'ciclismo', 'academia', 'funcional', 'caminhada'] as WorkoutType[]).map((t) => (
          <button
            key={t}
            onClick={() => setSelectedType(t)}
            className={`px-3 py-1 text-xs font-medium rounded-md capitalize transition ${
              selectedType === t
                ? 'bg-white dark:bg-slate-800 text-slate-900 dark:text-white shadow-xs'
                : 'text-slate-600 dark:text-slate-400'
            }`}
          >
            {typeIcons[t]} {t}
          </button>
        ))}
      </div>

      {/* Workout Cards */}
      {filtered.length === 0 ? (
        <div className="p-10 text-center rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
          <Activity className="w-8 h-8 text-slate-400 mx-auto mb-2" />
          <p className="text-xs text-slate-500">Nenhum treino encontrado para este filtro.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filtered.map((w) => (
            <div
              key={w.id}
              className="p-4 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs flex flex-col justify-between group hover:border-slate-300 dark:hover:border-slate-700 transition"
            >
              <div>
                <div className="flex items-start justify-between gap-2">
                  <div className="flex items-center gap-2">
                    <span className="text-xl">{typeIcons[w.type]}</span>
                    <div>
                      <h4 className="text-sm font-bold capitalize text-slate-900 dark:text-white">
                        {w.type}
                      </h4>
                      <span className="text-[11px] font-mono text-slate-500">
                        {formatDateBR(w.date)}
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center gap-1 opacity-100 md:opacity-0 md:group-hover:opacity-100 transition-opacity">
                    <button
                      onClick={() => onEditWorkout(w)}
                      className="p-1.5 text-slate-400 hover:text-emerald-600 rounded-lg touch-manipulation cursor-pointer"
                      title="Editar treino"
                    >
                      <Edit2 className="w-3.5 h-3.5" />
                    </button>
                    <button
                      onClick={() => onDeleteWorkout(w.id)}
                      className="p-1.5 text-slate-400 hover:text-rose-500 rounded-lg touch-manipulation cursor-pointer"
                      title="Excluir treino"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>

                {/* Time & Duration badge */}
                <div className="mt-3.5 flex flex-wrap items-center gap-2 text-xs text-slate-600 dark:text-slate-300 font-mono">
                  <span className="flex items-center gap-1 bg-slate-50 dark:bg-slate-800 px-2 py-0.5 rounded border border-slate-200 dark:border-slate-700">
                    <Clock className="w-3 h-3 text-slate-400" />
                    {w.startTime} {w.endTime ? `às ${w.endTime}` : ''}
                  </span>
                  <span>·</span>
                  <span>{w.durationMinutes} min</span>
                  {w.distanceKm && (
                    <>
                      <span>·</span>
                      <span>{w.distanceKm} km</span>
                    </>
                  )}
                  {w.calories && (
                    <>
                      <span>·</span>
                      <span className="text-amber-600 dark:text-amber-400">{w.calories} kcal</span>
                    </>
                  )}
                </div>

                {w.notes && (
                  <p className="mt-2 text-xs text-slate-500 dark:text-slate-400 line-clamp-2">
                    {w.notes}
                  </p>
                )}
              </div>

              <div className="mt-4 pt-2.5 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-[11px]">
                <span className="capitalize text-slate-400">Intensidade: {w.intensity}</span>
                <span className="text-emerald-600 dark:text-emerald-400 font-medium">
                  Sincronizado na agenda
                </span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
