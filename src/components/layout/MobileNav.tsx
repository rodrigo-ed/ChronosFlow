import React from 'react';
import {
  Calendar,
  CheckSquare,
  BookOpen,
  Activity,
  Target,
  Sparkles,
  BarChart2,
} from 'lucide-react';
import { ViewTab } from '../../types';

interface MobileNavProps {
  activeTab: ViewTab;
  onTabChange: (tab: ViewTab) => void;
}

export const MobileNav: React.FC<MobileNavProps> = ({ activeTab, onTabChange }) => {
  const tabs: { id: ViewTab; label: string; icon: React.FC<{ className?: string }> }[] = [
    { id: 'calendar', label: 'Agenda', icon: Calendar },
    { id: 'tasks', label: 'Tarefas', icon: CheckSquare },
    { id: 'books', label: 'Leitura', icon: BookOpen },
    { id: 'health', label: 'Saúde', icon: Activity },
    { id: 'goals', label: 'Metas', icon: Target },
    { id: 'assistant', label: 'IA', icon: Sparkles },
    { id: 'reports', label: 'Relatórios', icon: BarChart2 },
  ];

  return (
    <nav className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-white/95 dark:bg-slate-900/95 backdrop-blur-md border-t border-slate-200 dark:border-slate-800 px-1 py-1 safe-area-pb">
      <div className="flex items-center justify-around overflow-x-auto no-scrollbar">
        {tabs.map(({ id, label, icon: Icon }) => {
          const isActive = activeTab === id;
          return (
            <button
              key={id}
              onClick={() => onTabChange(id)}
              className={`flex flex-col items-center justify-center min-w-[44px] min-h-[44px] py-1 px-1.5 rounded-lg transition-colors ${
                isActive
                  ? 'text-indigo-600 dark:text-indigo-400 font-semibold'
                  : 'text-slate-500 hover:text-slate-800 dark:text-slate-400 dark:hover:text-slate-200'
              }`}
            >
              <Icon className={`w-4 h-4 ${isActive ? 'scale-110' : ''} transition-transform`} />
              <span className="text-[10px] mt-0.5 tracking-tight truncate max-w-[48px]">
                {label}
              </span>
            </button>
          );
        })}
      </div>
    </nav>
  );
};
