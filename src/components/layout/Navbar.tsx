import React from 'react';
import {
  Calendar,
  CheckSquare,
  BookOpen,
  Activity,
  Target,
  Sparkles,
  BarChart2,
  Moon,
  Sun,
  Bell,
  BellOff,
  Plus,
  User as UserIcon,
} from 'lucide-react';
import { User } from 'firebase/auth';
import { ViewTab } from '../../types';
import { PWAInstallButton } from '../PWAInstallButton';

interface NavbarProps {
  activeTab: ViewTab;
  onTabChange: (tab: ViewTab) => void;
  isDarkMode: boolean;
  onToggleDarkMode: () => void;
  notificationsEnabled: boolean;
  onToggleNotifications: () => void;
  onQuickNewTask: () => void;
  user: User | null;
  onOpenAuthModal: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  activeTab,
  onTabChange,
  isDarkMode,
  onToggleDarkMode,
  notificationsEnabled,
  onToggleNotifications,
  onQuickNewTask,
  user,
  onOpenAuthModal,
}) => {
  const tabs: { id: ViewTab; label: string; icon: React.FC<{ className?: string }> }[] = [
    { id: 'calendar', label: 'Calendário', icon: Calendar },
    { id: 'tasks', label: 'Tarefas', icon: CheckSquare },
    { id: 'books', label: 'Leitura', icon: BookOpen },
    { id: 'health', label: 'Saúde', icon: Activity },
    { id: 'goals', label: 'Metas', icon: Target },
    { id: 'assistant', label: 'IA Gemini', icon: Sparkles },
    { id: 'reports', label: 'Relatórios', icon: BarChart2 },
  ];

  return (
    <header className="no-print sticky top-0 z-40 w-full border-b border-slate-200 dark:border-slate-800 bg-white/95 dark:bg-slate-900/95 backdrop-blur-md">
      <div className="max-w-7xl mx-auto px-3 sm:px-6 flex items-center justify-between gap-3 h-16">
        {/* Zone 1: Single text element Brand wordmark */}
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-indigo-600 to-indigo-800 flex items-center justify-center text-white font-bold text-sm shadow-xs shrink-0">
            C
          </div>
          <span className="text-lg font-bold tracking-tight text-slate-900 dark:text-white whitespace-nowrap shrink-0">
            ChronosFlow
          </span>
        </div>

        {/* Zone 2: Navigation Links for Desktop */}
        <nav className="hidden lg:flex items-center gap-1">
          {tabs.map(({ id, label, icon: Icon }) => {
            const isActive = activeTab === id;
            return (
              <button
                key={id}
                onClick={() => onTabChange(id)}
                className={`flex items-center gap-1.5 px-2.5 py-1.5 text-xs font-medium rounded-lg transition whitespace-nowrap shrink-0 ${
                  isActive
                    ? 'bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400 font-semibold'
                    : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-50 dark:hover:bg-slate-800/60'
                }`}
              >
                <Icon className="w-3.5 h-3.5" />
                <span>{label}</span>
              </button>
            );
          })}
        </nav>

        {/* Zone 3: Actions & User Profile */}
        <div className="flex items-center gap-2 shrink-0">
          <PWAInstallButton />

          {/* User Account / Google Login Button */}
          <button
            onClick={onOpenAuthModal}
            className="flex items-center gap-1.5 p-1 sm:px-2.5 sm:py-1 text-xs font-medium rounded-lg border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-800 transition cursor-pointer"
            title={user ? `Conectado como ${user.email}` : 'Fazer login com Conta Google'}
          >
            {user?.photoURL ? (
              <img
                src={user.photoURL}
                alt={user.displayName || 'Usuário'}
                className="w-5 h-5 rounded-full ring-1 ring-indigo-500"
                referrerPolicy="no-referrer"
              />
            ) : (
              <UserIcon className="w-4 h-4 text-slate-500" />
            )}
            <span className="hidden sm:inline truncate max-w-[90px]">
              {user?.displayName?.split(' ')[0] || 'Entrar'}
            </span>
          </button>

          {/* Notification Alert Toggle */}
          <button
            onClick={onToggleNotifications}
            className={`p-2 rounded-lg border transition cursor-pointer ${
              notificationsEnabled
                ? 'border-indigo-200 dark:border-indigo-900 text-indigo-600 dark:text-indigo-400 bg-indigo-50/50 dark:bg-indigo-950/40'
                : 'border-slate-200 dark:border-slate-800 text-slate-400 hover:text-slate-600 dark:hover:text-slate-300'
            }`}
            title={notificationsEnabled ? 'Notificações ativas' : 'Ativar notificações'}
          >
            {notificationsEnabled ? <Bell className="w-4 h-4" /> : <BellOff className="w-4 h-4" />}
          </button>

          {/* Dark / Light Mode Switch */}
          <button
            onClick={onToggleDarkMode}
            className="p-2 rounded-lg border border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition cursor-pointer"
            title={isDarkMode ? 'Modo Claro' : 'Modo Escuro'}
            aria-label="Alternar tema"
          >
            {isDarkMode ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4" />}
          </button>

          {/* Quick Create Task */}
          <button
            onClick={onQuickNewTask}
            className="hidden sm:flex items-center gap-1 px-3 py-1.5 text-xs font-semibold rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white shadow-xs transition cursor-pointer shrink-0"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Criar</span>
          </button>
        </div>
      </div>
    </header>
  );
};
