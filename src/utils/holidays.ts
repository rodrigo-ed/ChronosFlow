import { Holiday } from '../types/holiday';

// Computes Easter Sunday for a given year using Meeus/Jones/Butcher algorithm
function calculateEaster(year: number): Date {
  const a = year % 19;
  const b = Math.floor(year / 100);
  const c = year % 100;
  const d = Math.floor(b / 4);
  const e = b % 4;
  const f = Math.floor((b + 8) / 25);
  const g = Math.floor((b - f + 1) / 3);
  const h = (19 * a + b - d - g + 15) % 30;
  const i = Math.floor(c / 4);
  const k = c % 4;
  const l = (32 + 2 * e + 2 * i - h - k) % 7;
  const m = Math.floor((a + 11 * h + 22 * l) / 451);
  const month = Math.floor((h + l - 7 * m + 114) / 31);
  const day = ((h + l - 7 * m + 114) % 31) + 1;
  return new Date(Date.UTC(year, month - 1, day));
}

function formatDate(date: Date): string {
  return date.toISOString().split('T')[0];
}

export function getNationalHolidays(year: number): Holiday[] {
  const easter = calculateEaster(year);

  // Carnival is 47 days before Easter
  const carnival = new Date(easter);
  carnival.setDate(carnival.getDate() - 47);

  // Good Friday is 2 days before Easter
  const goodFriday = new Date(easter);
  goodFriday.setDate(goodFriday.getDate() - 2);

  // Corpus Christi is 60 days after Easter
  const corpusChristi = new Date(easter);
  corpusChristi.setDate(corpusChristi.getDate() + 60);

  return [
    { id: `br-${year}-01-01`, name: 'Confraternização Universal', date: `${year}-01-01`, type: 'nacional' },
    { id: `br-${year}-carnaval`, name: 'Carnaval', date: formatDate(carnival), type: 'nacional' },
    { id: `br-${year}-sexta-santa`, name: 'Sexta-feira Santa', date: formatDate(goodFriday), type: 'nacional' },
    { id: `br-${year}-pascoa`, name: 'Páscoa', date: formatDate(easter), type: 'nacional' },
    { id: `br-${year}-04-21`, name: 'Tiradentes', date: `${year}-04-21`, type: 'nacional' },
    { id: `br-${year}-05-01`, name: 'Dia do Trabalho', date: `${year}-05-01`, type: 'nacional' },
    { id: `br-${year}-corpus-christi`, name: 'Corpus Christi', date: formatDate(corpusChristi), type: 'nacional' },
    { id: `br-${year}-09-07`, name: 'Independência do Brasil', date: `${year}-09-07`, type: 'nacional' },
    { id: `br-${year}-10-12`, name: 'Nossa Senhora Aparecida', date: `${year}-10-12`, type: 'nacional' },
    { id: `br-${year}-11-02`, name: 'Finados', date: `${year}-11-02`, type: 'nacional' },
    { id: `br-${year}-11-15`, name: 'Proclamação da República', date: `${year}-11-15`, type: 'nacional' },
    { id: `br-${year}-11-20`, name: 'Dia da Consciência Negra', date: `${year}-11-20`, type: 'nacional' },
    { id: `br-${year}-12-25`, name: 'Natal', date: `${year}-12-25`, type: 'nacional' },
  ];
}

export function getAllHolidays(year: number, customHolidays: Holiday[] = []): Holiday[] {
  const national = getNationalHolidays(year);
  const relevantCustom = customHolidays.filter((h) => h.date.startsWith(`${year}-`));
  return [...national, ...relevantCustom].sort((a, b) => a.date.localeCompare(b.date));
}

export function findHolidayOnDate(dateStr: string, holidays: Holiday[]): Holiday | undefined {
  return holidays.find((h) => h.date === dateStr);
}
