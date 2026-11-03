import { CalendarEvent, Task } from '../types';

// Format YYYYMMDDTHHMMSSZ for iCalendar
function formatICSDate(dateStr: string, timeStr?: string, isAllDay: boolean = false): string {
  if (!dateStr) return '';
  const cleanDate = dateStr.replace(/-/g, '');
  if (isAllDay || !timeStr) {
    return cleanDate;
  }
  const cleanTime = timeStr.replace(/:/g, '') + '00';
  return `${cleanDate}T${cleanTime}`;
}

// Parse iCal Date formats (YYYYMMDD or YYYYMMDDTHHMMSS or YYYYMMDDTHHMMSSZ)
function parseICSDate(val: string): { date: string; time?: string; isAllDay: boolean } {
  const clean = val.replace(/[^0-9T]/g, '');
  if (clean.includes('T')) {
    const [d, t] = clean.split('T');
    const yyyy = d.substring(0, 4);
    const mm = d.substring(4, 6);
    const dd = d.substring(6, 8);
    const hh = t.substring(0, 2);
    const min = t.substring(2, 4);
    return {
      date: `${yyyy}-${mm}-${dd}`,
      time: `${hh}:${min}`,
      isAllDay: false,
    };
  } else {
    const yyyy = clean.substring(0, 4);
    const mm = clean.substring(4, 6);
    const dd = clean.substring(6, 8);
    return {
      date: `${yyyy}-${mm}-${dd}`,
      isAllDay: true,
    };
  }
}

export function exportToICS(events: CalendarEvent[], tasks: Task[] = []): string {
  const now = new Date().toISOString().replace(/[-:]/g, '').split('.')[0] + 'Z';
  const lines: string[] = [
    'BEGIN:VCALENDAR',
    'VERSION:2.0',
    'PRODID:-//ChronosFlow//PT-BR//EN',
    'CALSCALE:GREGORIAN',
    'METHOD:PUBLISH',
    'X-WR-CALNAME:ChronosFlow Calendário & Tarefas',
    'X-WR-TIMEZONE:America/Sao_Paulo',
  ];

  // Export Events as VEVENT
  for (const event of events) {
    const dtStart = formatICSDate(event.startDate, event.startTime, event.isAllDay);
    const dtEnd = formatICSDate(event.endDate || event.startDate, event.endTime || event.startTime, event.isAllDay);
    
    lines.push('BEGIN:VEVENT');
    lines.push(`UID:${event.id || 'evt-' + Math.random().toString(36).substring(2, 9)}@chronosflow.local`);
    lines.push(`DTSTAMP:${now}`);
    if (event.isAllDay) {
      lines.push(`DTSTART;VALUE=DATE:${dtStart}`);
      lines.push(`DTEND;VALUE=DATE:${dtEnd}`);
    } else {
      lines.push(`DTSTART:${dtStart}`);
      lines.push(`DTEND:${dtEnd}`);
    }
    lines.push(`SUMMARY:${escapeICS(event.title)}`);
    if (event.description) {
      lines.push(`DESCRIPTION:${escapeICS(event.description)}`);
    }
    if (event.location) {
      lines.push(`LOCATION:${escapeICS(event.location)}`);
    }
    lines.push('STATUS:CONFIRMED');
    lines.push('END:VEVENT');
  }

  // Export Tasks as VTODO
  for (const task of tasks) {
    lines.push('BEGIN:VTODO');
    lines.push(`UID:task-${task.id}@chronosflow.local`);
    lines.push(`DTSTAMP:${now}`);
    if (task.dueDate) {
      const dtDue = formatICSDate(task.dueDate, task.dueTime, !task.dueTime);
      lines.push(`DUE:${dtDue}`);
    }
    lines.push(`SUMMARY:${escapeICS(task.title)}`);
    if (task.description) {
      lines.push(`DESCRIPTION:${escapeICS(task.description)}`);
    }
    const icsPriority = task.priority === 'high' ? '1' : task.priority === 'medium' ? '5' : '9';
    lines.push(`PRIORITY:${icsPriority}`);
    lines.push(`STATUS:${task.completed ? 'COMPLETED' : 'NEEDS-ACTION'}`);
    lines.push('END:VTODO');
  }

  lines.push('END:VCALENDAR');
  return lines.join('\r\n');
}

export function parseICS(icsContent: string): CalendarEvent[] {
  const events: CalendarEvent[] = [];
  const lines = icsContent.split(/\r\n|\n|\r/);

  let inEvent = false;
  let currentEvent: Partial<CalendarEvent> = {};

  for (let i = 0; i < lines.length; i++) {
    let line = lines[i];

    // Handle folded lines in iCalendar RFC standard (lines starting with space/tab)
    while (i + 1 < lines.length && (lines[i + 1].startsWith(' ') || lines[i + 1].startsWith('\t'))) {
      i++;
      line += lines[i].substring(1);
    }

    const trimmed = line.trim();
    if (trimmed === 'BEGIN:VEVENT') {
      inEvent = true;
      currentEvent = {
        id: 'ical-' + Math.random().toString(36).substring(2, 9),
        source: 'ical',
        color: '#6366F1',
      };
      continue;
    }

    if (trimmed === 'END:VEVENT') {
      if (currentEvent.title && currentEvent.startDate) {
        events.push({
          id: currentEvent.id || 'ical-' + Date.now(),
          title: unescapeICS(currentEvent.title),
          description: currentEvent.description ? unescapeICS(currentEvent.description) : undefined,
          startDate: currentEvent.startDate,
          startTime: currentEvent.startTime,
          endDate: currentEvent.endDate || currentEvent.startDate,
          endTime: currentEvent.endTime,
          isAllDay: !!currentEvent.isAllDay,
          color: currentEvent.color || '#6366F1',
          location: currentEvent.location ? unescapeICS(currentEvent.location) : undefined,
          source: 'ical',
        });
      }
      inEvent = false;
      currentEvent = {};
      continue;
    }

    if (inEvent) {
      const colonIdx = line.indexOf(':');
      if (colonIdx === -1) continue;

      const keyPart = line.substring(0, colonIdx);
      const val = line.substring(colonIdx + 1);
      const [key] = keyPart.split(';');

      switch (key.toUpperCase()) {
        case 'SUMMARY':
          currentEvent.title = val;
          break;
        case 'DESCRIPTION':
          currentEvent.description = val;
          break;
        case 'LOCATION':
          currentEvent.location = val;
          break;
        case 'DTSTART': {
          const parsed = parseICSDate(val);
          currentEvent.startDate = parsed.date;
          currentEvent.startTime = parsed.time;
          currentEvent.isAllDay = parsed.isAllDay;
          break;
        }
        case 'DTEND': {
          const parsed = parseICSDate(val);
          currentEvent.endDate = parsed.date;
          currentEvent.endTime = parsed.time;
          break;
        }
        case 'UID':
          currentEvent.id = val.replace(/[^a-zA-Z0-9-]/g, '');
          break;
      }
    }
  }

  return events;
}

export function downloadICSFile(filename: string, content: string): void {
  const blob = new Blob([content], { type: 'text/calendar;charset=utf-8' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.setAttribute('download', filename.endsWith('.ics') ? filename : `${filename}.ics`);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}

function escapeICS(str: string): string {
  return str.replace(/\\/g, '\\\\').replace(/;/g, '\\;').replace(/,/g, '\\,').replace(/\n/g, '\\n');
}

function unescapeICS(str: string): string {
  return str.replace(/\\n/g, '\n').replace(/\\,/g, ',').replace(/\\;/g, ';').replace(/\\\\/g, '\\');
}
