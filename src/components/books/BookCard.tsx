import React, { useState } from 'react';
import { Clock, Bookmark, Edit2, Trash2, Check } from 'lucide-react';
import { Book } from '../../types/book';

interface BookCardProps {
  book: Book;
  onEditBook: (book: Book) => void;
  onDeleteBook: (id: string) => void;
  onLogReadingSession: (book: Book, pages: number, minutes: number) => void;
}

export const BookCard: React.FC<BookCardProps> = ({
  book,
  onEditBook,
  onDeleteBook,
  onLogReadingSession,
}) => {
  const [isLogging, setIsLogging] = useState(false);
  const [pages, setPages] = useState(10);
  const [minutes, setMinutes] = useState(book.dailyGoalMinutes || 30);

  const pct = Math.min(100, Math.round((book.currentPage / book.totalPages) * 100));

  const handleConfirm = () => {
    onLogReadingSession(book, pages, minutes);
    setIsLogging(false);
  };

  return (
    <div className="p-4 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs flex flex-col justify-between group hover:border-slate-300 dark:hover:border-slate-700 transition">
      <div>
        <div className="flex items-start justify-between gap-2">
          <span className="w-2.5 h-2.5 rounded-full shrink-0 mt-1" style={{ backgroundColor: book.coverColor || '#4F46E5' }} />
          <div className="flex items-center gap-1 opacity-100 md:opacity-0 md:group-hover:opacity-100 transition-opacity">
            <button
              onClick={() => onEditBook(book)}
              className="p-1.5 text-slate-400 hover:text-indigo-600 dark:hover:text-indigo-400 rounded-lg touch-manipulation cursor-pointer"
              title="Editar livro"
            >
              <Edit2 className="w-3.5 h-3.5" />
            </button>
            <button
              onClick={() => onDeleteBook(book.id)}
              className="p-1.5 text-slate-400 hover:text-rose-500 rounded-lg touch-manipulation cursor-pointer"
              title="Excluir livro"
            >
              <Trash2 className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        <h3 className="text-sm font-bold text-slate-900 dark:text-white mt-1">{book.title}</h3>
        <p className="text-xs text-slate-500 dark:text-slate-400">{book.author}</p>

        <div className="mt-3">
          <div className="flex justify-between text-xs font-mono tabular-nums mb-1">
            <span className="text-slate-500">{book.currentPage} / {book.totalPages} págs</span>
            <span className="font-semibold text-slate-900 dark:text-white">{pct}%</span>
          </div>
          <div className="w-full h-2 rounded-full bg-slate-100 dark:bg-slate-800 overflow-hidden">
            <div className="h-full rounded-full transition-all duration-300" style={{ width: `${pct}%`, backgroundColor: book.coverColor || '#4F46E5' }} />
          </div>
        </div>

        <div className="mt-2.5 flex items-center gap-1.5 text-[11px] text-slate-500 font-mono">
          <Clock className="w-3 h-3 text-slate-400" />
          <span>Meta: {book.dailyGoalMinutes} min/dia</span>
        </div>
      </div>

      <div className="mt-4 pt-3 border-t border-slate-100 dark:border-slate-800">
        {isLogging ? (
          <div className="space-y-2 p-2 rounded-lg bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 text-xs">
            <div className="flex items-center justify-between font-semibold">
              <span>Registrar Leitura</span>
              <button onClick={() => setIsLogging(false)} className="text-slate-400">✕</button>
            </div>
            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className="text-[10px] text-slate-400 block">Páginas lidas</label>
                <input type="number" min="1" value={pages} onChange={(e) => setPages(Number(e.target.value))} className="w-full px-2 py-1 text-xs rounded bg-white dark:bg-slate-900 border font-mono" />
              </div>
              <div>
                <label className="text-[10px] text-slate-400 block">Minutos gastos</label>
                <input type="number" min="1" value={minutes} onChange={(e) => setMinutes(Number(e.target.value))} className="w-full px-2 py-1 text-xs rounded bg-white dark:bg-slate-900 border font-mono" />
              </div>
            </div>
            <button onClick={handleConfirm} className="w-full py-1 text-xs font-medium rounded bg-indigo-600 hover:bg-indigo-700 text-white flex items-center justify-center gap-1">
              <Check className="w-3 h-3" />
              <span>Confirmar</span>
            </button>
          </div>
        ) : (
          <button
            onClick={() => setIsLogging(true)}
            className="w-full py-1.5 px-3 text-xs font-medium rounded-lg border border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-200 transition flex items-center justify-center gap-1.5"
          >
            <Bookmark className="w-3.5 h-3.5 text-indigo-500" />
            <span>Registrar Leitura</span>
          </button>
        )}
      </div>
    </div>
  );
};
