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
      audioCtx.resume().catch(() => {});
    }

    const now = audioCtx.currentTime;

    // Pleasant 2-chord productivity chime (C5 -> G5)
    const osc1 = audioCtx.createOscillator();
    const osc2 = audioCtx.createOscillator();
    const gainNode = audioCtx.createGain();

    osc1.type = 'sine';
    osc1.frequency.setValueAtTime(523.25, now);
    osc1.frequency.exponentialRampToValueAtTime(783.99, now + 0.15);

    osc2.type = 'triangle';
    osc2.frequency.setValueAtTime(659.25, now);
    osc2.frequency.exponentialRampToValueAtTime(1046.5, now + 0.18);

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
  try {
    if (typeof window === 'undefined' || !('Notification' in window)) {
      return 'denied';
    }
    if (Notification.permission === 'granted') {
      return 'granted';
    }
    return await Notification.requestPermission();
  } catch (err) {
    console.warn('Could not request notification permission:', err);
    return 'denied';
  }
}

export function sendBrowserNotification(title: string, body: string, playSound: boolean = true): void {
  if (playSound) {
    try {
      playNotificationSound();
    } catch {}
  }

  if (typeof window === 'undefined' || !('Notification' in window)) {
    return;
  }

  try {
    if (Notification.permission === 'granted') {
      if ('serviceWorker' in navigator && navigator.serviceWorker.controller) {
        navigator.serviceWorker.ready.then((reg) => {
          reg.showNotification(title, { body, icon: '/icon.svg', badge: '/icon.svg' });
        }).catch(() => {
          try {
            new Notification(title, { body, icon: '/icon.svg', badge: '/icon.svg' });
          } catch {}
        });
      } else {
        new Notification(title, { body, icon: '/icon.svg', badge: '/icon.svg' });
      }
    }
  } catch (err) {
    console.warn('Notification could not be displayed:', err);
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
  try {
    const now = new Date();
    const todayStr = now.toISOString().split('T')[0];
    const currentMinutes = now.getHours() * 60 + now.getMinutes();

    // Check today's tasks
    for (const task of tasks || []) {
      if (task.completed || !task.dueTime || task.dueDate !== todayStr) continue;

      const parts = (task.dueTime || '').split(':');
      if (parts.length < 2) continue;
      const h = parseInt(parts[0], 10);
      const m = parseInt(parts[1], 10);
      if (isNaN(h) || isNaN(m)) continue;
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
    for (const event of events || []) {
      if (event.isAllDay || !event.startTime || event.startDate !== todayStr) continue;

      const parts = (event.startTime || '').split(':');
      if (parts.length < 2) continue;
      const h = parseInt(parts[0], 10);
      const m = parseInt(parts[1], 10);
      if (isNaN(h) || isNaN(m)) continue;
      const eventMinutes = h * 60 + m;
      const diff = eventMinutes - currentMinutes;

      const reminderKey = `event-${event.id}-${todayStr}-${event.startTime}`;
      if (diff > 0 && diff <= leadMinutes && !firedReminders.has(reminderKey)) {
        firedReminders.add(reminderKey);
        sendBrowserNotification(
          `Compromisso: ${event.title}`,
          `Inicia em ${diff} minutos (${event.startTime}) ${event.location ? '· Local: ' + event.location : ''}`,
          soundEnabled
        );
      }
    }
  } catch (err) {
    console.warn('Error checking alerts:', err);
  }
}
