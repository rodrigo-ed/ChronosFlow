import React, { useState, useRef } from 'react';
import { X, Upload, Download, CheckCircle2, AlertCircle } from 'lucide-react';
import { CalendarEvent, Task } from '../types';
import { exportToICS, parseICS, downloadICSFile } from '../utils/ical';

interface ICalModalProps {
  isOpen: boolean;
  onClose: () => void;
  events: CalendarEvent[];
  tasks: Task[];
  onImportEvents: (newEvents: CalendarEvent[]) => void;
}

export const ICalModal: React.FC<ICalModalProps> = ({
  isOpen,
  onClose,
  events,
  tasks,
  onImportEvents,
}) => {
  const [importedCount, setImportedCount] = useState<number | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  if (!isOpen) return null;

  const handleExport = () => {
    const icsContent = exportToICS(events, tasks);
    downloadICSFile('chronosflow-agenda', icsContent);
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setErrorMsg(null);
    setImportedCount(null);

    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const text = event.target?.result as string;
        const parsed = parseICS(text);
        if (parsed.length === 0) {
          setErrorMsg('Nenhum evento VEVENT válido foi encontrado no arquivo .ics selecionado.');
        } else {
          onImportEvents(parsed);
          setImportedCount(parsed.length);
        }
      } catch (err: any) {
        setErrorMsg('Erro ao processar arquivo .ics: ' + (err?.message || 'formato inválido'));
      }
    };
    reader.onerror = () => {
      setErrorMsg('Falha ao ler o arquivo selecionado.');
    };
    reader.readAsText(file);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-xs overflow-y-auto">
      <div className="relative w-full max-w-md rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-2xl p-6 my-8">
        <div className="flex items-center justify-between pb-4 border-b border-slate-100 dark:border-slate-800">
          <div>
            <h2 className="text-lg font-semibold text-slate-900 dark:text-white">
              Sincronização iCal (.ics)
            </h2>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Importe ou exporte seus compromissos para Google Agenda, Apple ou Outlook.
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="mt-4 space-y-4">
          {/* Export Section */}
          <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700/60">
            <h3 className="text-sm font-semibold text-slate-900 dark:text-white mb-1 flex items-center gap-1.5">
              <Download className="w-4 h-4 text-indigo-500" />
              Exportar para iCalendar (.ics)
            </h3>
            <p className="text-xs text-slate-600 dark:text-slate-400 mb-3">
              Gera um arquivo padrão RFC 5545 com {events.length} compromissos e {tasks.length} tarefas pendentes.
            </p>
            <button
              onClick={handleExport}
              className="w-full py-2 px-3 text-xs font-medium rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white transition flex items-center justify-center gap-1.5 shadow-sm"
            >
              <Download className="w-3.5 h-3.5" />
              Baixar Arquivo .ics Completo
            </button>
          </div>

          {/* Import Section */}
          <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700/60">
            <h3 className="text-sm font-semibold text-slate-900 dark:text-white mb-1 flex items-center gap-1.5">
              <Upload className="w-4 h-4 text-emerald-500" />
              Importar Calendário (.ics)
            </h3>
            <p className="text-xs text-slate-600 dark:text-slate-400 mb-3">
              Adicione compromissos de qualquer arquivo .ics exportado de outro app.
            </p>

            <input
              type="file"
              ref={fileInputRef}
              accept=".ics,text/calendar"
              onChange={handleFileUpload}
              className="hidden"
            />

            <button
              onClick={() => fileInputRef.current?.click()}
              className="w-full py-2 px-3 text-xs font-medium rounded-lg border border-slate-300 dark:border-slate-600 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-200 transition flex items-center justify-center gap-1.5 cursor-pointer"
            >
              <Upload className="w-3.5 h-3.5" />
              Selecionar Arquivo .ics do Computador
            </button>

            {importedCount !== null && (
              <div className="mt-3 p-2.5 rounded-lg bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 flex items-center gap-2 text-xs text-emerald-700 dark:text-emerald-300">
                <CheckCircle2 className="w-4 h-4 shrink-0 text-emerald-500" />
                <span>{importedCount} eventos importados com sucesso para o calendário!</span>
              </div>
            )}

            {errorMsg && (
              <div className="mt-3 p-2.5 rounded-lg bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-800 flex items-center gap-2 text-xs text-rose-700 dark:text-rose-300">
                <AlertCircle className="w-4 h-4 shrink-0 text-rose-500" />
                <span>{errorMsg}</span>
              </div>
            )}
          </div>
        </div>

        <div className="mt-6 flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-2 text-xs font-medium rounded-lg bg-slate-200 dark:bg-slate-800 text-slate-800 dark:text-slate-200 hover:bg-slate-300 dark:hover:bg-slate-700 transition"
          >
            Fechar
          </button>
        </div>
      </div>
    </div>
  );
};
