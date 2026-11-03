import React, { useState } from 'react';
import { X, LogIn, LogOut, CheckCircle2, Shield, Cloud } from 'lucide-react';
import { User } from 'firebase/auth';
import { signInWithGoogle, logoutUser } from '../../services/auth';

interface UserAuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  user: User | null;
  onAuthSuccess?: (user: User) => void;
}

export const UserAuthModal: React.FC<UserAuthModalProps> = ({
  isOpen,
  onClose,
  user,
  onAuthSuccess,
}) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleLogin = async () => {
    setLoading(true);
    setError(null);
    try {
      const loggedUser = await signInWithGoogle();
      if (onAuthSuccess) onAuthSuccess(loggedUser);
      onClose();
    } catch (err: any) {
      setError(err?.message || 'Falha ao autenticar com o Google');
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = async () => {
    setLoading(true);
    try {
      await logoutUser();
      onClose();
    } catch (err: any) {
      setError(err?.message || 'Falha ao sair');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-xs">
      <div className="w-full max-w-sm rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-6 shadow-2xl">
        <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
          <div className="flex items-center gap-2">
            <Shield className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
            <h3 className="text-base font-semibold text-slate-900 dark:text-white">
              Conta & Autenticação
            </h3>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="py-5">
          {user ? (
            <div className="text-center space-y-4">
              {user.photoURL ? (
                <img
                  src={user.photoURL}
                  alt={user.displayName || 'Usuário'}
                  className="w-16 h-16 rounded-full mx-auto ring-2 ring-indigo-500 shadow-sm"
                  referrerPolicy="no-referrer"
                />
              ) : (
                <div className="w-16 h-16 rounded-full mx-auto bg-indigo-600 text-white font-bold flex items-center justify-center text-xl">
                  {user.displayName?.[0] || 'U'}
                </div>
              )}

              <div>
                <h4 className="text-sm font-bold text-slate-900 dark:text-white">
                  {user.displayName || 'Usuário Conectado'}
                </h4>
                <p className="text-xs text-slate-500 font-mono mt-0.5">{user.email}</p>
              </div>

              <div className="p-3 rounded-xl bg-emerald-50 dark:bg-emerald-950/30 border border-emerald-200 dark:border-emerald-800/60 flex items-center justify-center gap-2 text-xs text-emerald-700 dark:text-emerald-300">
                <Cloud className="w-4 h-4 text-emerald-500" />
                <span>Sincronização em nuvem ativa via Firebase</span>
              </div>

              <button
                onClick={handleLogout}
                disabled={loading}
                className="w-full py-2 px-3 text-xs font-medium rounded-lg border border-slate-200 dark:border-slate-700 text-rose-600 dark:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/30 transition flex items-center justify-center gap-1.5 cursor-pointer"
              >
                <LogOut className="w-3.5 h-3.5" />
                <span>Encerrar Sessão</span>
              </button>
            </div>
          ) : (
            <div className="space-y-4">
              <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed text-center">
                Conecte-se com sua <strong>Conta Google</strong> para salvar suas tarefas, livros,
                metas e treinos com segurança na nuvem e sincronizar em múltiplos dispositivos.
              </p>

              {error && (
                <div className="p-2.5 rounded-lg bg-rose-50 dark:bg-rose-950/30 border border-rose-200 text-xs text-rose-600 text-center">
                  {error}
                </div>
              )}

              <button
                onClick={handleLogin}
                disabled={loading}
                className="w-full py-2.5 px-4 rounded-xl bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-700/80 text-slate-800 dark:text-slate-100 font-medium text-xs transition flex items-center justify-center gap-2.5 shadow-xs cursor-pointer disabled:opacity-50"
              >
                <svg className="w-4 h-4" viewBox="0 0 24 24">
                  <path
                    fill="#4285F4"
                    d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                  />
                  <path
                    fill="#34A853"
                    d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                  />
                  <path
                    fill="#FBBC05"
                    d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
                  />
                  <path
                    fill="#EA4335"
                    d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
                  />
                </svg>
                <span>{loading ? 'Conectando...' : 'Entrar com Conta Google'}</span>
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
