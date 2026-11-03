export type WorkoutType =
  | 'corrida'
  | 'ciclismo'
  | 'academia'
  | 'funcional'
  | 'caminhada'
  | 'outro';

export type WorkoutIntensity = 'leve' | 'moderada' | 'intensa';

export interface Workout {
  id: string;
  type: WorkoutType;
  date: string; // YYYY-MM-DD
  startTime: string; // HH:mm
  endTime?: string; // HH:mm
  durationMinutes: number;
  distanceKm?: number;
  intensity: WorkoutIntensity;
  calories?: number;
  notes?: string;
}
