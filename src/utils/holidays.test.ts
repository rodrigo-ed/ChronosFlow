import { describe, it, expect } from 'vitest';
import { getNationalHolidays, getAllHolidays, findHolidayOnDate } from './holidays';
import { Holiday } from '../types/holiday';

describe('Holidays Utility (TDD)', () => {
  it('should generate all official Brazilian national holidays for a given year', () => {
    const holidays2026 = getNationalHolidays(2026);
    expect(holidays2026.length).toBeGreaterThanOrEqual(12);

    const christmas = holidays2026.find((h) => h.name === 'Natal');
    expect(christmas).toBeDefined();
    expect(christmas?.date).toBe('2026-12-25');

    const conscienciaNegra = holidays2026.find((h) => h.name === 'Dia da Consciência Negra');
    expect(conscienciaNegra).toBeDefined();
    expect(conscienciaNegra?.date).toBe('2026-11-20');

    const tiradentes = holidays2026.find((h) => h.name === 'Tiradentes');
    expect(tiradentes).toBeDefined();
    expect(tiradentes?.date).toBe('2026-04-21');
  });

  it('should combine national holidays with custom municipal holidays', () => {
    const customHolidays: Holiday[] = [
      {
        id: 'cust-1',
        name: 'Aniversário de São Paulo',
        date: '2026-01-25',
        type: 'municipal',
        isCustom: true,
      },
    ];

    const all = getAllHolidays(2026, customHolidays);
    const spHoliday = all.find((h) => h.name === 'Aniversário de São Paulo');
    expect(spHoliday).toBeDefined();
    expect(spHoliday?.type).toBe('municipal');
  });

  it('should accurately find if a given date is a holiday', () => {
    const holidays = getNationalHolidays(2026);
    const holiday = findHolidayOnDate('2026-01-01', holidays);
    expect(holiday).toBeDefined();
    expect(holiday?.name).toBe('Confraternização Universal');

    const nonHoliday = findHolidayOnDate('2026-01-15', holidays);
    expect(nonHoliday).toBeUndefined();
  });
});
