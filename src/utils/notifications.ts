import { Task, CalendarEvent } from '../types';

let audioCtx: AudioContext | null = null;

export function playNotificationSound(): void {
  try {
    const AudioContextClass = window.AudioContext || (window as any).webkitAudioContext;
    if (!AudioContextClass) return;

    if (!audioCtx) {
      audioCtx = new AudioContextClass();
    }

    if (audioCtx.state === 'suspended') {
      audioCtx.resume();
    }

    const now = audioCtx.currentTime;

    // Pleasant 2-chord productivity chime (C5 -> G5)
    const osc1 = audioCtx.createOscillator();
    const osc2 = audioCtx.createOscillator();
    const gainNode = audioCtx.createGain();

    osc1.type = 'sine';
    osc1.frequency.setValueAtTime(523.25, now); // C5
    osc1.frequency.exponentialRampToValueAtTime(783.99, now + 0.15); // G5

    osc2.type = 'triangle';
    osc2.frequency.setValueAtTime(659.25, now); // E5
    osc2.frequency.exponentialRampToValueAtTime(1046.5, now + 0.18); // C6

    gainNode.gain.setValueAtTime(0.001, now);
    gainNode.gain.linearRampToValueAtTime(0.2, now + 0.05);
    gainNode.gain.exponentialRampToValueAtTime(0.001, now + 0.45);

    osc1.connect(gainNode);
    osc2.connect(gainNode);
    gainNode.connect(audioCtx.destination);

    osc1.start(now);
    osc2.start(now);
    osc1.stop(now + 0.45);
    osc2.stop(now + 0.45);
  } catch (err) {
    console.warn('Audio chime could not play:', err);
  }
}

export async function requestNotificationPermission(): Promise<NotificationPermission> {
  if (!('Notification' in window)) {
    return 'denied';
  }
  if (Notification.permission === 'granted') {
    return 'granted';
  }
  return await Notification.requestPermission();
}

export function sendBrowserNotification(title: string, body: string, playSound: boolean = true): void {
  if (playSound) {
    playNotificationSound();
  }

  if (!('Notification' in window)) {
    return;
  }

  if (Notification.permission === 'granted') {
    try {
      new Notification(title, {
        body,
        icon: '/icon.svg',
        badge: '/icon.svg',
      });
    } catch (err) {
      console.warn('Notification failed:', err);
    }
  }
}

// Track fired reminder IDs to prevent duplicate alerts in the same session
const firedReminders = new Set<string>();

export function checkUpcomingAlerts(
  tasks: Task[],
  events: CalendarEvent[],
  leadMinutes: number = 15,
  soundEnabled: boolean = true
): void {
  const now = new Date();
  const todayStr = now.toISOString().split('T')[0];
  const currentMinutes = now.getHours() * 60 + now.getMinutes();

  // Check today's tasks
  for (const task of tasks) {
    if (task.completed || !task.dueTime || task.dueDate !== todayStr) continue;

    const [h, m] = task.dueTime.split(':').map((v) => parseInt(v, 10));
    const taskMinutes = h * 60 + m;
    const diff = taskMinutes - currentMinutes;

    const reminderKey = `task-${task.id}-${todayStr}-${task.dueTime}`;
    if (diff > 0 && diff <= leadMinutes && !firedReminders.has(reminderKey)) {
      firedReminders.add(reminderKey);
      sendBrowserNotification(
        `Lembrete de Tarefa: ${task.title}`,
        `Prazo em ${diff} minutos (${task.dueTime}) · Prioridade: ${task.priority.toUpperCase()}`,
        soundEnabled
      );
    }
  }

  // Check today's events
  for (const event of events) {
    if (event.isAllDay || !event.startTime || event.startDate !== todayStr) continue;

    const [h, m] = event.startTime.split(':').map((v) => parseInt(v, 10));
    const eventMinutes = h * 60 + m;
    const diff = eventMinutes - currentMinutes;

    const reminderKey = `event-${event.id}-${todayStr}-${event.startTime}`;
    if (diff > 0 && diff <= leadMinutes && !firedReminders.has(reminderKey)) {
      firedReminders.add(reminderKey);
      sendBrowserNotification(
        `Compromisso no Calendário: ${event.title}`,
        `Inicia em ${diff} minutos (${event.startTime}) ${event.location ? '· Local: ' + event.location : ''}`,
        soundEnabled
      );
    }
  }
}
