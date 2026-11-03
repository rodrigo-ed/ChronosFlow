import React from 'react';
import { Printer, Download, CheckCircle, Clock, Target, TrendingUp, Award, Flame } from 'lucide-react';
import { Task, Goal, CalendarEvent } from '../types';
import { calculateWeeklyStats, generateCSVContent, downloadCSV, formatDateBR } from '../utils/reports';

interface WeeklyReportViewProps {
  tasks: Task[];
  goals: Goal[];
  events: CalendarEvent[];
}

export const WeeklyReportView: React.FC<WeeklyReportViewProps> = ({
  tasks,
  goals,
  events,
}) => {
  const stats = calculateWeeklyStats(tasks, goals);

  const handleExportCSV = () => {
    const csv = generateCSVContent(tasks, goals, events);
    downloadCSV(`chronosflow-relatorio-semanal-${new Date().toISOString().split('T')[0]}`, csv);
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      {/* Header and export buttons (Hidden in print) */}
      <div className="no-print flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-200 dark:border-slate-800">
        <div>
          <h2 className="text-xl font-bold tracking-tight text-slate-900 dark:text-white">
            Relatório Semanal de Desempenho
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
            Semana: <span className="font-mono text-slate-700 dark:text-slate-300">{stats.weekRange}</span>
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={handleExportCSV}
            className="flex items-center gap-1.5 px-3.5 py-2 text-xs font-medium rounded-lg border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition cursor-pointer"
            title="Baixar planilha de dados compatível com Excel e Google Sheets"
          >
            <Download className="w-3.5 h-3.5 text-indigo-500" />
            <span>Exportar CSV</span>
          </button>

          <button
            onClick={handlePrint}
            className="flex items-center gap-1.5 px-3.5 py-2 text-xs font-medium rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white shadow-sm transition cursor-pointer"
            title="Imprimir ou salvar como PDF limpo"
          >
            <Printer className="w-3.5 h-3.5" />
            <span>Imprimir / Salvar PDF</span>
          </button>
        </div>
      </div>

      {/* Printable Report Document Card */}
      <div className="p-6 sm:p-8 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs space-y-6">
        {/* Document Title for Print */}
        <div className="border-b border-slate-200 dark:border-slate-800 pb-4 flex items-center justify-between">
          <div>
            <div className="text-xs uppercase tracking-widest text-indigo-600 dark:text-indigo-400 font-bold mb-1">
              ChronosFlow Analytics
            </div>
            <h1 className="text-2xl font-bold text-slate-900 dark:text-white">
              Balanço de Produtividade & Metas
            </h1>
            <p className="text-xs text-slate-500 font-mono mt-1">
              Período: {stats.weekRange} · Emitido em {formatDateBR(new Date().toISOString().split('T')[0])}
            </p>
          </div>

          <div className="text-right">
            <span className="text-3xl font-extrabold text-indigo-600 dark:text-indigo-400 font-mono tabular-nums">
              {stats.completionRate}%
            </span>
            <div className="text-[11px] text-slate-400 font-medium">Taxa de Conclusão</div>
          </div>
        </div>

        {/* 4-KPI Row */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-800">
            <div className="text-slate-500 dark:text-slate-400 text-xs mb-1">Tarefas Entregues</div>
            <div className="text-xl font-bold text-slate-900 dark:text-white font-mono tabular-nums">
              {stats.completedTasks} <span className="text-xs font-normal text-slate-400">/ {stats.totalTasks}</span>
            </div>
          </div>

          <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-800">
            <div className="text-slate-500 dark:text-slate-400 text-xs mb-1">Tempo Focado</div>
            <div className="text-xl font-bold text-slate-900 dark:text-white font-mono tabular-nums">
              {Math.round((stats.totalMinutesSpent / 60) * 10) / 10} <span className="text-xs font-normal text-slate-400">horas</span>
            </div>
          </div>

          <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-800">
            <div className="text-slate-500 dark:text-slate-400 text-xs mb-1">Alta Prioridade</div>
            <div className="text-xl font-bold text-rose-600 dark:text-rose-400 font-mono tabular-nums">
              {stats.highPriorityCompleted} <span className="text-xs font-normal text-slate-400">concluídas</span>
            </div>
          </div>

          <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-800">
            <div className="text-slate-500 dark:text-slate-400 text-xs mb-1">Média Diária</div>
            <div className="text-xl font-bold text-slate-900 dark:text-white font-mono tabular-nums">
              {stats.averageDailyCompletion} <span className="text-xs font-normal text-slate-400">tarefas/dia</span>
            </div>
          </div>
        </div>

        {/* Priority Breakdown Progress */}
        <div className="space-y-3 pt-2">
          <h3 className="text-sm font-semibold text-slate-900 dark:text-white">
            Distribuição de Tarefas por Grau de Prioridade
          </h3>

          <div className="space-y-2">
            <div>
              <div className="flex justify-between text-xs mb-1">
                <span className="text-slate-600 dark:text-slate-300 font-medium">Alta Prioridade</span>
                <span className="font-mono tabular-nums text-slate-500">{stats.highPriorityCompleted} tarefas</span>
              </div>
              <div className="w-full h-2 rounded-full bg-slate-100 dark:bg-slate-800 overflow-hidden">
                <div
                  className="h-full bg-rose-500 rounded-full"
                  style={{ width: `${stats.totalTasks > 0 ? (stats.highPriorityCompleted / stats.totalTasks) * 100 : 0}%` }}
                />
              </div>
            </div>

            <div>
              <div className="flex justify-between text-xs mb-1">
                <span className="text-slate-600 dark:text-slate-300 font-medium">Média Prioridade</span>
                <span className="font-mono tabular-nums text-slate-500">{stats.mediumPriorityCompleted} tarefas</span>
              </div>
              <div className="w-full h-2 rounded-full bg-slate-100 dark:bg-slate-800 overflow-hidden">
                <div
                  className="h-full bg-amber-500 rounded-full"
                  style={{ width: `${stats.totalTasks > 0 ? (stats.mediumPriorityCompleted / stats.totalTasks) * 100 : 0}%` }}
                />
              </div>
            </div>

            <div>
              <div className="flex justify-between text-xs mb-1">
                <span className="text-slate-600 dark:text-slate-300 font-medium">Baixa Prioridade</span>
                <span className="font-mono tabular-nums text-slate-500">{stats.lowPriorityCompleted} tarefas</span>
              </div>
              <div className="w-full h-2 rounded-full bg-slate-100 dark:bg-slate-800 overflow-hidden">
                <div
                  className="h-full bg-slate-400 rounded-full"
                  style={{ width: `${stats.totalTasks > 0 ? (stats.lowPriorityCompleted / stats.totalTasks) * 100 : 0}%` }}
                />
              </div>
            </div>
          </div>
        </div>

        {/* Goals Progress Table */}
        <div className="space-y-3 pt-4 border-t border-slate-100 dark:border-slate-800">
          <h3 className="text-sm font-semibold text-slate-900 dark:text-white">
            Status das Metas Pessoais
          </h3>

          <div className="divide-y divide-slate-100 dark:divide-slate-800">
            {goals.map((g) => (
              <div key={g.id} className="py-2.5 flex items-center justify-between text-xs">
                <div className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: g.color }} />
                  <span className="font-medium text-slate-900 dark:text-white">{g.title}</span>
                </div>
                <div className="flex items-center gap-4 font-mono tabular-nums">
                  <span className="text-slate-500">{g.currentValue} / {g.targetValue} {g.unit}</span>
                  <span className="font-bold text-indigo-600 dark:text-indigo-400">{g.progress}%</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Top Categories */}
        <div className="space-y-3 pt-4 border-t border-slate-100 dark:border-slate-800">
          <h3 className="text-sm font-semibold text-slate-900 dark:text-white">
            Distribuição por Área / Categoria
          </h3>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
            {stats.topCategories.map((c) => (
              <div
                key={c.category}
                className="p-2.5 rounded-lg bg-slate-50 dark:bg-slate-800/40 border border-slate-100 dark:border-slate-800 text-xs flex justify-between"
              >
                <span className="text-slate-700 dark:text-slate-300 font-medium">{c.category}</span>
                <span className="font-mono tabular-nums text-slate-500">{c.count} tarefas</span>
              </div>
            ))}
          </div>
        </div>

        {/* Executive summary footer for PDF */}
        <div className="pt-4 border-t border-slate-200 dark:border-slate-800 text-center text-xs text-slate-400">
          Relatório gerado automaticamente pelo ChronosFlow · Sistema Inteligente de Gestão de Produtividade & Calendário
        </div>
      </div>
    </div>
  );
};
