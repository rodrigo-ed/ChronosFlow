export type HolidayType = 'nacional' | 'municipal' | 'estadual';

export interface Holiday {
  id: string;
  name: string;
  date: string; // YYYY-MM-DD
  type: HolidayType;
  isCustom?: boolean;
}
