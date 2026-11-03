import React, { useState } from 'react';
import confetti from 'canvas-confetti';
import { BookOpen, Plus } from 'lucide-react';
import { Book, ReadingStatus } from '../../types/book';
import { BookCard } from './BookCard';

interface BooksViewProps {
  books: Book[];
  onOpenNewBookModal: () => void;
  onEditBook: (book: Book) => void;
  onDeleteBook: (id: string) => void;
  onLogReadingSession: (bookId: string, pagesRead: number, minutesRead: number) => void;
}

export const BooksView: React.FC<BooksViewProps> = ({
  books,
  onOpenNewBookModal,
  onEditBook,
  onDeleteBook,
  onLogReadingSession,
}) => {
  const [filter, setFilter] = useState<ReadingStatus | 'all'>('reading');

  const filtered = books.filter((b) => (filter === 'all' ? true : b.status === filter));
  const totalPagesRead = books.reduce((acc, b) => acc + b.currentPage, 0);
  const currentlyReadingCount = books.filter((b) => b.status === 'reading').length;
  const completedBooksCount = books.filter((b) => b.status === 'completed').length;

  const handleSession = (book: Book, pages: number, minutes: number) => {
    onLogReadingSession(book.id, pages, minutes);
    if (book.currentPage + pages >= book.totalPages) {
      confetti({ particleCount: 40, spread: 60, origin: { y: 0.6 } });
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-200 dark:border-slate-800">
        <div>
          <h2 className="text-xl font-bold tracking-tight text-slate-900 dark:text-white flex items-center gap-2">
            <BookOpen className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
            <span>Acompanhamento de Leitura & Livros</span>
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
            Mantenha o hábito diário de leitura consistente com metas de minutos e páginas.
          </p>
        </div>

        <button
          onClick={onOpenNewBookModal}
          className="flex items-center gap-1.5 px-3.5 py-2 text-xs font-medium rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white shadow-sm transition cursor-pointer shrink-0"
        >
          <Plus className="w-3.5 h-3.5" />
          <span>Novo Livro</span>
        </button>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <div className="p-3.5 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-2xs">
          <span className="text-[11px] text-slate-500">Lendo Agora</span>
          <div className="text-xl font-bold text-slate-900 dark:text-white font-mono">{currentlyReadingCount}</div>
        </div>
        <div className="p-3.5 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-2xs">
          <span className="text-[11px] text-slate-500">Páginas Lidas</span>
          <div className="text-xl font-bold text-indigo-600 dark:text-indigo-400 font-mono">{totalPagesRead}</div>
        </div>
        <div className="p-3.5 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-2xs">
          <span className="text-[11px] text-slate-500">Livros Concluídos</span>
          <div className="text-xl font-bold text-emerald-600 dark:text-emerald-400 font-mono">{completedBooksCount}</div>
        </div>
        <div className="p-3.5 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-2xs">
          <span className="text-[11px] text-slate-500">Meta Diária Média</span>
          <div className="text-xl font-bold text-slate-900 dark:text-white font-mono">30 <span className="text-xs font-normal text-slate-400">min/dia</span></div>
        </div>
      </div>

      <div className="flex items-center gap-1.5 p-1 rounded-lg bg-slate-100 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800 w-fit">
        {(['reading', 'want_to_read', 'completed', 'all'] as const).map((st) => (
          <button
            key={st}
            onClick={() => setFilter(st)}
            className={`px-3 py-1 text-xs font-medium rounded-md transition ${filter === st ? 'bg-white dark:bg-slate-800 text-slate-900 dark:text-white shadow-xs' : 'text-slate-500'}`}
          >
            {st === 'reading' ? 'Lendo Agora' : st === 'want_to_read' ? 'Quero Ler' : st === 'completed' ? 'Concluídos' : 'Todos'}
          </button>
        ))}
      </div>

      {filtered.length === 0 ? (
        <div className="p-10 text-center rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
          <BookOpen className="w-8 h-8 text-slate-400 mx-auto mb-2" />
          <p className="text-xs text-slate-500">Nenhum livro cadastrado nesta categoria.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filtered.map((b) => (
            <BookCard
              key={b.id}
              book={b}
              onEditBook={onEditBook}
              onDeleteBook={onDeleteBook}
              onLogReadingSession={handleSession}
            />
          ))}
        </div>
      )}
    </div>
  );
};
