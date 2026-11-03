import React, { useState } from 'react';
import { X, BookOpen, Clock, Check } from 'lucide-react';
import { Book, ReadingStatus } from '../../types/book';

interface BookModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (book: Book) => void;
  initialBook?: Book | null;
}

export const BookModal: React.FC<BookModalProps> = ({
  isOpen,
  onClose,
  onSave,
  initialBook,
}) => {
  const [title, setTitle] = useState(initialBook?.title || '');
  const [author, setAuthor] = useState(initialBook?.author || '');
  const [totalPages, setTotalPages] = useState(initialBook?.totalPages || 200);
  const [currentPage, setCurrentPage] = useState(initialBook?.currentPage || 0);
  const [dailyGoalMinutes, setDailyGoalMinutes] = useState(initialBook?.dailyGoalMinutes || 30);
  const [status, setStatus] = useState<ReadingStatus>(initialBook?.status || 'reading');
  const [notes, setNotes] = useState(initialBook?.notes || '');
  const [coverColor, setCoverColor] = useState(initialBook?.coverColor || '#4F46E5');

  if (!isOpen) return null;

  const colorOptions = ['#4F46E5', '#10B981', '#F59E0B', '#EF4444', '#8B5CF6', '#06B6D4'];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;

    const book: Book = {
      id: initialBook?.id || 'book-' + Date.now(),
      title: title.trim(),
      author: author.trim() || 'Autor desconhecido',
      totalPages: Math.max(1, Number(totalPages)),
      currentPage: Math.max(0, Math.min(Number(totalPages), Number(currentPage))),
      dailyGoalMinutes: Math.max(5, Number(dailyGoalMinutes)),
      status,
      notes: notes.trim() || undefined,
      coverColor,
      sessions: initialBook?.sessions || [],
      lastReadDate: initialBook?.lastReadDate,
    };

    onSave(book);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-xs overflow-y-auto">
      <div className="w-full max-w-md rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-6 shadow-2xl my-6">
        <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
          <div className="flex items-center gap-2">
            <BookOpen className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
            <h3 className="text-base font-semibold text-slate-900 dark:text-white">
              {initialBook ? 'Editar Livro' : 'Novo Livro para Leitura'}
            </h3>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="mt-4 space-y-3.5">
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-slate-600 dark:text-slate-400 mb-1">
              Título do Livro *
            </label>
            <input
              type="text"
              required
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Ex: Hábitos Atômicos"
              className="w-full px-3 py-2 text-xs rounded-lg bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-slate-600 dark:text-slate-400 mb-1">
              Autor
            </label>
            <input
              type="text"
              value={author}
              onChange={(e) => setAuthor(e.target.value)}
              placeholder="Ex: James Clear"
              className="w-full px-3 py-2 text-xs rounded-lg bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white"
            />
          </div>

          {/* Status selector */}
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-slate-600 dark:text-slate-400 mb-1">
              Status de Leitura
            </label>
            <div className="grid grid-cols-3 gap-2">
              <button
                type="button"
                onClick={() => setStatus('reading')}
                className={`py-1.5 px-2 rounded-lg text-xs font-medium border text-center transition ${
                  status === 'reading'
                    ? 'bg-indigo-50 border-indigo-500 text-indigo-700 dark:bg-indigo-950/50 dark:text-indigo-300 font-semibold'
                    : 'border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-400'
                }`}
              >
                Lendo Agora
              </button>
              <button
                type="button"
                onClick={() => setStatus('want_to_read')}
                className={`py-1.5 px-2 rounded-lg text-xs font-medium border text-center transition ${
                  status === 'want_to_read'
                    ? 'bg-amber-50 border-amber-500 text-amber-700 dark:bg-amber-950/50 dark:text-amber-300 font-semibold'
                    : 'border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-400'
                }`}
              >
                Quero Ler
              </button>
              <button
                type="button"
                onClick={() => setStatus('completed')}
                className={`py-1.5 px-2 rounded-lg text-xs font-medium border text-center transition ${
                  status === 'completed'
                    ? 'bg-emerald-50 border-emerald-500 text-emerald-700 dark:bg-emerald-950/50 dark:text-emerald-300 font-semibold'
                    : 'border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-400'
                }`}
              >
                Concluído
              </button>
            </div>
          </div>

          {/* Pages & Daily minutes */}
          <div className="grid grid-cols-3 gap-2.5">
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-slate-600 dark:text-slate-400 mb-1">
                Total Páginas
              </label>
              <input
                type="number"
                min="1"
                required
                value={totalPages}
                onChange={(e) => setTotalPages(parseInt(e.target.value, 10) || 1)}
                className="w-full px-3 py-2 text-xs rounded-lg bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white font-mono"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-slate-600 dark:text-slate-400 mb-1">
                Página Atual
              </label>
              <input
                type="number"
                min="0"
                value={currentPage}
                onChange={(e) => setCurrentPage(parseInt(e.target.value, 10) || 0)}
                className="w-full px-3 py-2 text-xs rounded-lg bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white font-mono"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-slate-600 dark:text-slate-400 mb-1">
                Meta Diária (min)
              </label>
              <input
                type="number"
                min="5"
                step="5"
                value={dailyGoalMinutes}
                onChange={(e) => setDailyGoalMinutes(parseInt(e.target.value, 10) || 30)}
                className="w-full px-3 py-2 text-xs rounded-lg bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white font-mono"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-slate-600 dark:text-slate-400 mb-1">
              Cor de Capa / Destaque
            </label>
            <div className="flex items-center gap-2.5">
              {colorOptions.map((c) => (
                <button
                  key={c}
                  type="button"
                  onClick={() => setCoverColor(c)}
                  className={`w-5 h-5 rounded-full transition-transform ${
                    coverColor === c ? 'ring-2 ring-offset-2 ring-slate-800 dark:ring-white scale-110' : 'opacity-70'
                  }`}
                  style={{ backgroundColor: c }}
                />
              ))}
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-slate-600 dark:text-slate-400 mb-1">
              Anotações e Insights
            </label>
            <textarea
              rows={2}
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Principais lições e reflexões..."
              className="w-full px-3 py-2 text-xs rounded-lg bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white resize-none"
            />
          </div>

          <div className="flex justify-end gap-2 pt-3 border-t border-slate-100 dark:border-slate-800">
            <button
              type="button"
              onClick={onClose}
              className="px-3.5 py-1.5 text-xs rounded-lg border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300"
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="px-4 py-1.5 text-xs font-medium rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white"
            >
              {initialBook ? 'Salvar Alterações' : 'Adicionar Livro'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
