import React, { useState } from 'react';
import {
  ChevronLeft,
  ChevronRight,
  Plus,
  Repeat,
  Landmark,
  FileDown,
} from 'lucide-react';
import { CalendarEvent, Task, Goal, CalendarViewMode, Holiday } from '../../types';
import { CalendarDayInspector } from './CalendarDayInspector';
import { getAllHolidays, findHolidayOnDate } from '../../utils/holidays';

interface CalendarViewProps {
  events: CalendarEvent[];
  tasks: Task[];
  goals: Goal[];
  customHolidays: Holiday[];
  onOpenNewEventModal: (date?: string) => void;
  onOpenRecurringModal: () => void;
  onOpenHolidayModal: () => void;
  onEditEvent: (event: CalendarEvent) => void;
  onDeleteEvent: (id: string) => void;
  onOpenICalModal: () => void;
  onSelectDateForTask: (date: string) => void;
}

export const CalendarView: React.FC<CalendarViewProps> = ({
  events,
  tasks,
  goals,
  customHolidays,
  onOpenNewEventModal,
  onOpenRecurringModal,
  onOpenHolidayModal,
  onEditEvent,
  onDeleteEvent,
  onOpenICalModal,
  onSelectDateForTask,
}) => {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [viewMode, setViewMode] = useState<CalendarViewMode>('month');
  const todayStr = new Date().toISOString().split('T')[0];
  const [selectedDate, setSelectedDate] = useState<string>(todayStr);

  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();
  const allHolidays = getAllHolidays(year, customHolidays);

  const prevPeriod = () => {
    const next = new Date(currentDate);
    if (viewMode === 'month') next.setMonth(next.getMonth() - 1);
    else if (viewMode === 'week') next.setDate(next.getDate() - 7);
    else next.setDate(next.getDate() - 1);
    setCurrentDate(next);
  };

  const nextPeriod = () => {
    const next = new Date(currentDate);
    if (viewMode === 'month') next.setMonth(next.getMonth() + 1);
    else if (viewMode === 'week') next.setDate(next.getDate() + 7);
    else next.setDate(next.getDate() + 1);
    setCurrentDate(next);
  };

  const monthNames = [
    'Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho',
    'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro',
  ];

  // Month grid generation
  const firstDay = new Date(year, month, 1).getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const daysInPrev = new Date(year, month, 0).getDate();

  const cells: { dateStr: string; dayNum: number; isCurrentMonth: boolean }[] = [];
  for (let i = firstDay - 1; i >= 0; i--) {
    const d = daysInPrev - i;
    const m = month === 0 ? 11 : month - 1;
    const y = month === 0 ? year - 1 : year;
    cells.push({ dateStr: `${y}-${String(m + 1).padStart(2, '0')}-${String(d).padStart(2, '0')}`, dayNum: d, isCurrentMonth: false });
  }
  for (let d = 1; d <= daysInMonth; d++) {
    cells.push({ dateStr: `${year}-${String(month + 1).padStart(2, '0')}-${String(d).padStart(2, '0')}`, dayNum: d, isCurrentMonth: true });
  }
  const rem = 35 - cells.length > 0 ? 35 - cells.length : 42 - cells.length;
  for (let d = 1; d <= rem && cells.length < 35; d++) {
    const m = month === 11 ? 0 : month + 1;
    const y = month === 11 ? year + 1 : year;
    cells.push({ dateStr: `${y}-${String(m + 1).padStart(2, '0')}-${String(d).padStart(2, '0')}`, dayNum: d, isCurrentMonth: false });
  }

  const selectedHoliday = findHolidayOnDate(selectedDate, allHolidays);

  return (
    <div className="space-y-5">
      {/* Top Header & View Controls */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-200 dark:border-slate-800">
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1">
            <button onClick={prevPeriod} className="p-1.5 rounded-lg border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800">
              <ChevronLeft className="w-4 h-4" />
            </button>
            <button onClick={nextPeriod} className="p-1.5 rounded-lg border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800">
              <ChevronRight className="w-4 h-4" />
            </button>
            <button onClick={() => { setCurrentDate(new Date()); setSelectedDate(todayStr); }} className="px-2.5 py-1 text-xs font-medium rounded-lg border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800">
              Hoje
            </button>
          </div>
          <h2 className="text-xl font-bold tracking-tight text-slate-900 dark:text-white capitalize">
            {monthNames[month]} <span className="font-mono text-slate-500">{year}</span>
          </h2>
        </div>

        <div className="flex flex-wrap items-center gap-1.5">
          {/* View mode */}
          <div className="flex items-center gap-1 p-0.5 rounded-lg bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700">
            {(['month', 'week', 'day'] as CalendarViewMode[]).map((mode) => (
              <button
                key={mode}
                onClick={() => setViewMode(mode)}
                className={`px-2.5 py-1 text-xs font-medium rounded-md capitalize transition ${
                  viewMode === mode ? 'bg-white dark:bg-slate-700 text-slate-900 dark:text-white shadow-xs' : 'text-slate-500'
                }`}
              >
                {mode === 'month' ? 'Mês' : mode === 'week' ? 'Semana' : 'Dia'}
              </button>
            ))}
          </div>

          <button onClick={onOpenRecurringModal} className="flex items-center gap-1 px-2.5 py-1.5 text-xs font-medium rounded-lg border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 transition" title="Agendar atividade recorrente (ex: Seg a Sex 07 às 12)">
            <Repeat className="w-3.5 h-3.5 text-indigo-500" />
            <span className="hidden sm:inline">Recorrência</span>
          </button>

          <button onClick={onOpenHolidayModal} className="flex items-center gap-1 px-2.5 py-1.5 text-xs font-medium rounded-lg border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 transition" title="Feriados municipais e nacionais">
            <Landmark className="w-3.5 h-3.5 text-amber-500" />
            <span className="hidden sm:inline">Feriados</span>
          </button>

          <button onClick={onOpenICalModal} className="p-1.5 sm:px-2.5 sm:py-1.5 text-xs font-medium rounded-lg border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 transition" title="Exportar/Importar .ics">
            <FileDown className="w-3.5 h-3.5 text-slate-400" />
          </button>

          <button onClick={() => onOpenNewEventModal(selectedDate)} className="flex items-center gap-1 px-3 py-1.5 text-xs font-medium rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white shadow-xs transition">
            <Plus className="w-3.5 h-3.5" />
            <span>Evento</span>
          </button>
        </div>
      </div>

      {/* Main Grid + Inspector */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-5">
        <div className="lg:col-span-3 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 overflow-hidden shadow-xs">
          <div className="grid grid-cols-7 border-b border-slate-200 dark:border-slate-800 bg-slate-50/60 dark:bg-slate-800/40 text-center py-2 text-xs font-semibold uppercase tracking-wider text-slate-500">
            {['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb'].map((w) => (<div key={w}>{w}</div>))}
          </div>

          <div className="grid grid-cols-7 auto-rows-fr">
            {cells.map((cell, idx) => {
              const isToday = cell.dateStr === todayStr;
              const isSel = cell.dateStr === selectedDate;
              const cellEvs = events.filter((e) => e.startDate === cell.dateStr);
              const cellTsks = tasks.filter((t) => t.dueDate === cell.dateStr);
              const holiday = findHolidayOnDate(cell.dateStr, allHolidays);

              return (
                <div
                  key={idx}
                  onClick={() => setSelectedDate(cell.dateStr)}
                  className={`min-h-[85px] sm:min-h-[98px] p-1.5 border-b border-r border-slate-100 dark:border-slate-800/70 transition cursor-pointer flex flex-col justify-between ${
                    isSel ? 'bg-indigo-50/40 dark:bg-indigo-950/20 ring-1 ring-inset ring-indigo-500' : cell.isCurrentMonth ? 'bg-white dark:bg-slate-900 hover:bg-slate-50 dark:hover:bg-slate-800/40' : 'bg-slate-50/40 dark:bg-slate-950/40 opacity-40'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className={`text-xs font-mono tabular-nums inline-flex items-center justify-center w-5 h-5 rounded-full ${
                      isToday ? 'bg-indigo-600 text-white font-bold' : isSel ? 'font-bold text-indigo-600' : 'text-slate-700 dark:text-slate-300'
                    }`}>
                      {cell.dayNum}
                    </span>
                    {cellTsks.length > 0 && (
                      <span className="text-[10px] font-mono text-slate-400">
                        {cellTsks.filter((t) => t.completed).length}/{cellTsks.length}
                      </span>
                    )}
                  </div>

                  {/* Holiday Badge */}
                  {holiday && (
                    <div className="px-1 py-0.5 rounded text-[9px] bg-amber-50 dark:bg-amber-950/40 text-amber-700 dark:text-amber-300 border border-amber-200 dark:border-amber-800/60 font-medium truncate flex items-center gap-0.5" title={holiday.name}>
                      <span className="truncate">{holiday.name}</span>
                    </div>
                  )}

                  {/* Events Mini Pills */}
                  <div className="space-y-0.5 overflow-hidden">
                    {cellEvs.slice(0, 2).map((ev) => (
                      <div key={ev.id} className="px-1 py-0.5 rounded text-[10px] font-medium truncate" style={{ backgroundColor: `${ev.color}15`, color: ev.color, borderLeft: `2px solid ${ev.color}` }}>
                        {ev.title}
                      </div>
                    ))}
                    {cellEvs.length > 2 && (
                      <span className="text-[9px] text-slate-400 block px-0.5">+{cellEvs.length - 2} mais</span>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        <CalendarDayInspector
          selectedDate={selectedDate}
          events={events}
          tasks={tasks}
          goals={goals}
          holiday={selectedHoliday}
          onOpenNewEventModal={onOpenNewEventModal}
          onEditEvent={onEditEvent}
          onDeleteEvent={onDeleteEvent}
          onSelectDateForTask={onSelectDateForTask}
        />
      </div>
    </div>
  );
};
