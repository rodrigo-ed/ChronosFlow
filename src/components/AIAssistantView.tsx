import React, { useState } from 'react';
import { Sparkles, Calendar, Target, Zap, Send, Copy, Check, RefreshCw } from 'lucide-react';
import { Task, Goal, CalendarEvent } from '../types';

interface AIAssistantViewProps {
  tasks: Task[];
  goals: Goal[];
  events: CalendarEvent[];
}

export const AIAssistantView: React.FC<AIAssistantViewProps> = ({
  tasks,
  goals,
  events,
}) => {
  const [responseMarkdown, setResponseMarkdown] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [customPrompt, setCustomPrompt] = useState('');
  const [copied, setCopied] = useState(false);
  const [lastPromptTitle, setLastPromptTitle] = useState<string>('');

  const runAssistant = async (promptType: string, promptLabel: string, userText?: string) => {
    setIsLoading(true);
    setLastPromptTitle(promptLabel);
    try {
      const res = await fetch('/api/gemini/productivity-assistant', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          promptType,
          tasks,
          goals,
          events,
          customPrompt: userText,
        }),
      });
      const data = await res.json();
      if (data.success && data.text) {
        setResponseMarkdown(data.text);
      } else {
        setResponseMarkdown(
          data.error || 'Não foi possível gerar a resposta. Certifique-se de que a chave do Gemini está configurada.'
        );
      }
    } catch (err: any) {
      setResponseMarkdown('Erro de comunicação com o servidor: ' + (err?.message || 'verifique sua rede'));
    } finally {
      setIsLoading(false);
    }
  };

  const handleCopy = () => {
    if (!responseMarkdown) return;
    navigator.clipboard.writeText(responseMarkdown);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      {/* Header */}
      <div className="pb-4 border-b border-slate-200 dark:border-slate-800">
        <div className="flex items-center gap-2">
          <div className="p-2 rounded-xl bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400">
            <Sparkles className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-xl font-bold tracking-tight text-slate-900 dark:text-white">
              Assistente Inteligente de Produtividade & Calendário
            </h2>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Alimentado por Gemini 3.8 Flash para conciliar compromissos, tarefas e metas sem estresse.
            </p>
          </div>
        </div>
      </div>

      {/* Action Prompt Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
        <button
          onClick={() => runAssistant('optimize_day', 'Otimização da Rotina de Hoje (Time Blocking)')}
          disabled={isLoading}
          className="p-4 rounded-xl text-left bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 hover:border-indigo-400 dark:hover:border-indigo-600 transition shadow-xs group cursor-pointer disabled:opacity-50"
        >
          <div className="p-2 w-fit rounded-lg bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400 mb-2.5">
            <Calendar className="w-4 h-4" />
          </div>
          <h4 className="text-sm font-semibold text-slate-900 dark:text-white group-hover:text-indigo-600 transition">
            Otimizar Rotina de Hoje
          </h4>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 leading-relaxed">
            Gera um cronograma em blocos de tempo integrando suas tarefas de alta prioridade com seus eventos.
          </p>
        </button>

        <button
          onClick={() => runAssistant('balance_goals', 'Alinhamento com Metas Pessoais')}
          disabled={isLoading}
          className="p-4 rounded-xl text-left bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 hover:border-emerald-400 dark:hover:border-emerald-600 transition shadow-xs group cursor-pointer disabled:opacity-50"
        >
          <div className="p-2 w-fit rounded-lg bg-emerald-50 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400 mb-2.5">
            <Target className="w-4 h-4" />
          </div>
          <h4 className="text-sm font-semibold text-slate-900 dark:text-white group-hover:text-emerald-600 transition">
            Alinhar com Metas
          </h4>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 leading-relaxed">
            Identifica quais metas estão sem progresso e sugere tarefas estratégicas para destravá-las.
          </p>
        </button>

        <button
          onClick={() => runAssistant('anti_procrastination', 'Estratégia Anti-Procrastinação')}
          disabled={isLoading}
          className="p-4 rounded-xl text-left bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 hover:border-amber-400 dark:hover:border-amber-600 transition shadow-xs group cursor-pointer disabled:opacity-50"
        >
          <div className="p-2 w-fit rounded-lg bg-amber-50 dark:bg-amber-950/60 text-amber-600 dark:text-amber-400 mb-2.5">
            <Zap className="w-4 h-4" />
          </div>
          <h4 className="text-sm font-semibold text-slate-900 dark:text-white group-hover:text-amber-600 transition">
            Anti-Procrastinação
          </h4>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 leading-relaxed">
            Dicas práticas e micro-ações para vencer o atrito inicial nas tarefas de alta prioridade.
          </p>
        </button>
      </div>

      {/* Custom Prompt Box */}
      <form
        onSubmit={(e) => {
          e.preventDefault();
          if (!customPrompt.trim()) return;
          runAssistant('custom', 'Consulta Personalizada', customPrompt.trim());
        }}
        className="flex items-center gap-2 p-2 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs"
      >
        <input
          type="text"
          value={customPrompt}
          onChange={(e) => setCustomPrompt(e.target.value)}
          placeholder="Ex: Como posso planejar minha quinta-feira para focar na meta de estudos?"
          className="flex-1 px-3 py-2 text-xs rounded-lg bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white focus:outline-none focus:ring-1 focus:ring-indigo-500"
        />
        <button
          type="submit"
          disabled={isLoading || !customPrompt.trim()}
          className="flex items-center gap-1.5 px-4 py-2 text-xs font-medium rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white disabled:opacity-40 transition cursor-pointer shrink-0"
        >
          <Send className="w-3.5 h-3.5" />
          <span>Enviar</span>
        </button>
      </form>

      {/* Loading Indicator */}
      {isLoading && (
        <div className="p-8 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-center space-y-3">
          <RefreshCw className="w-6 h-6 text-indigo-600 dark:text-indigo-400 animate-spin mx-auto" />
          <p className="text-xs text-slate-600 dark:text-slate-300 font-medium">
            O ChronosFlow AI está analisando seus compromissos, tarefas e metas...
          </p>
        </div>
      )}

      {/* Response Card */}
      {!isLoading && responseMarkdown && (
        <div className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
            <div className="flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-indigo-500" />
              <h3 className="text-sm font-semibold text-slate-900 dark:text-white">
                {lastPromptTitle || 'Recomendação de Produtividade'}
              </h3>
            </div>
            <button
              onClick={handleCopy}
              className="flex items-center gap-1 text-xs text-slate-500 hover:text-slate-900 dark:hover:text-white px-2 py-1 rounded hover:bg-slate-100 dark:hover:bg-slate-800 transition"
              title="Copiar texto da recomendação"
            >
              {copied ? <Check className="w-3.5 h-3.5 text-emerald-500" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{copied ? 'Copiado!' : 'Copiar'}</span>
            </button>
          </div>

          <div className="text-xs sm:text-sm text-slate-700 dark:text-slate-300 leading-relaxed whitespace-pre-wrap font-sans">
            {responseMarkdown}
          </div>
        </div>
      )}
    </div>
  );
};
