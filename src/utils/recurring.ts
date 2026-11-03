import { CalendarEvent, RecurringPattern } from '../types';

export interface RecurringEventConfig {
  title: string;
  description?: string;
  color: string;
  location?: string;
  relatedGoalId?: string;
  pattern: RecurringPattern;
}

export function generateRecurringEvents(config: RecurringEventConfig): CalendarEvent[] {
  const { title, description, color, location, relatedGoalId, pattern } = config;
  const { startDate, endDate, startTime, endTime, frequency, selectedDays = [] } = pattern;

  const events: CalendarEvent[] = [];
  const current = new Date(`${startDate}T12:00:00Z`);
  const stop = new Date(`${endDate}T12:00:00Z`);

  if (current > stop) {
    return events;
  }

  const baseId = 'rec-' + Date.now() + '-' + Math.random().toString(36).substring(2, 6);
  let counter = 0;

  // Maximum 365 days safety guard
  while (current <= stop && counter < 365) {
    const dayOfWeek = current.getUTCDay(); // 0 is Sunday, 1 is Monday ... 6 is Saturday
    let isApplicable = false;

    if (frequency === 'daily') {
      isApplicable = true;
    } else if (frequency === 'weekdays') {
      isApplicable = dayOfWeek >= 1 && dayOfWeek <= 5;
    } else if (frequency === 'custom_days') {
      isApplicable = selectedDays.includes(dayOfWeek);
    }

    if (isApplicable) {
      const dateStr = current.toISOString().split('T')[0];
      events.push({
        id: `${baseId}-${counter}`,
        title,
        description,
        startDate: dateStr,
        startTime,
        endDate: dateStr,
        endTime,
        isAllDay: false,
        color,
        location,
        relatedGoalId,
        recurringPattern: pattern,
        source: 'recurring',
      });
      counter++;
    }

    current.setUTCDate(current.getUTCDate() + 1);
  }

  return events;
}
