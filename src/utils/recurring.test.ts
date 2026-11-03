import { describe, it, expect } from 'vitest';
import { generateRecurringEvents } from './recurring';

describe('Recurring Events Generator (TDD)', () => {
  it('should generate events from Monday to Friday (weekdays)', () => {
    // 2026-11-02 (Monday) to 2026-11-08 (Sunday) = 5 weekdays (Mon, Tue, Wed, Thu, Fri)
    const events = generateRecurringEvents({
      title: 'Trabalho Matinal',
      color: '#0284C7',
      pattern: {
        frequency: 'weekdays',
        startDate: '2026-11-02',
        endDate: '2026-11-08',
        startTime: '07:00',
        endTime: '12:00',
      },
    });

    expect(events.length).toBe(5);
    expect(events[0].startTime).toBe('07:00');
    expect(events[0].endTime).toBe('12:00');
    expect(events[0].title).toBe('Trabalho Matinal');
    expect(events[0].startDate).toBe('2026-11-02'); // Monday
    expect(events[4].startDate).toBe('2026-11-06'); // Friday
  });

  it('should generate daily events across the specified period', () => {
    const events = generateRecurringEvents({
      title: 'Leitura Noturna',
      color: '#F59E0B',
      pattern: {
        frequency: 'daily',
        startDate: '2026-11-01',
        endDate: '2026-11-03',
        startTime: '21:00',
        endTime: '21:30',
      },
    });

    expect(events.length).toBe(3);
    expect(events[0].startDate).toBe('2026-11-01');
    expect(events[2].startDate).toBe('2026-11-03');
  });

  it('should return empty array if startDate is after endDate', () => {
    const events = generateRecurringEvents({
      title: 'Evento Inválido',
      color: '#EF4444',
      pattern: {
        frequency: 'daily',
        startDate: '2026-11-10',
        endDate: '2026-11-05',
        startTime: '10:00',
        endTime: '11:00',
      },
    });

    expect(events.length).toBe(0);
  });
});
