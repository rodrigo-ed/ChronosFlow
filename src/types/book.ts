export type ReadingStatus = 'reading' | 'completed' | 'want_to_read';

export interface ReadingSession {
  id: string;
  date: string; // YYYY-MM-DD
  minutesRead: number;
  pagesRead: number;
  notes?: string;
}

export interface Book {
  id: string;
  title: string;
  author: string;
  totalPages: number;
  currentPage: number;
  dailyGoalMinutes: number; // e.g. 30 minutes
  status: ReadingStatus;
  notes?: string;
  coverColor?: string;
  sessions?: ReadingSession[];
  lastReadDate?: string;
}
