import express, { Request, Response } from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';
import { GoogleGenAI } from '@google/genai';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT ? parseInt(process.env.PORT, 10) : 3000;

app.use(express.json());

// Initialize Google GenAI client server-side
const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY,
  httpOptions: {
    headers: {
      'User-Agent': 'aistudio-build',
    },
  },
});

// Endpoint: AI Productivity Assistant & Workload Optimizer
app.post('/api/gemini/productivity-assistant', async (req: Request, res: Response): Promise<void> => {
  try {
    const { promptType, tasks, goals, events, customPrompt } = req.body;

    const systemInstruction = `Você é o ChronosFlow AI, um estrategista sênior de produtividade pessoal e gestão de tempo baseado no calendário.
Seu objetivo é ajudar o usuário a conciliar seus compromissos da rotina diária com suas metas pessoais de médio e longo prazo.
Forneça sempre orientações estruturadas, pragmáticas, calorosas e acionáveis em Português do Brasil.
Evite clichês vazios; proponha blocos de tempo específicos (Time Blocking), pausas estratégicas, técnicas de foco e redução de atrito para tarefas de alta prioridade.
Ao sugerir horários para tarefas, leve em consideração os compromissos existentes no calendário.`;

    const contextData = `
Contexto atual do usuário:
- Tarefas cadastradas (${tasks?.length || 0}):
${(tasks || [])
  .map(
    (t: any) =>
      `• [${t.priority?.toUpperCase() || 'MÉDIA'}] ${t.title} (Prazo: ${t.dueDate || 'sem data'} ${t.dueTime || ''}, Est.: ${t.estimatedMinutes || 30} min, Concluída: ${t.completed ? 'Sim' : 'Não'})`
  )
  .join('\n')}

- Metas Pessoais (${goals?.length || 0}):
${(goals || [])
  .map(
    (g: any) =>
      `• Meta: "${g.title}" (Categoria: ${g.category || 'Geral'}, Progresso: ${g.progress || 0}%, Alvo: ${g.currentValue || 0}/${g.targetValue || 100} ${g.unit || ''}, Prazo: ${g.targetDate || 'sem prazo'})`
  )
  .join('\n')}

- Compromissos e Eventos no Calendário (${events?.length || 0}):
${(events || [])
  .map(
    (e: any) =>
      `• Evento: "${e.title}" (${e.startDate} ${e.startTime || '00:00'} até ${e.endDate || e.startDate} ${e.endTime || '23:59'}, Dia todo: ${e.isAllDay ? 'Sim' : 'Não'})`
  )
  .join('\n')}
`;

    let userPromptText = '';
    if (promptType === 'optimize_day') {
      userPromptText = `Analise minhas tarefas e compromissos de hoje e crie uma proposta de rotina otimizada em blocos de tempo (time blocks). Priorize as tarefas de ALTA prioridade nos momentos de maior energia mental e garanta que haja avanço em pelo menos uma das minhas metas pessoais. Apresente em formato de cronograma limpo com horários sugeridos.`;
    } else if (promptType === 'balance_goals') {
      userPromptText = `Analise o alinhamento entre minhas tarefas da semana e minhas metas pessoais. Aponte se alguma meta está sendo negligenciada e sugira 3 ações concretas e rápidas para destravar o progresso nesta semana.`;
    } else if (promptType === 'anti_procrastination') {
      userPromptText = `Identifique as tarefas de alta prioridade ou mais antigas que ainda não foram concluídas. Dê orientações psicológicas e práticas (como regra dos 2 minutos, micro-passos e método Pomodoro) para executar essas tarefas hoje sem paralisia.`;
    } else {
      userPromptText = customPrompt || `Dê uma recomendação personalizada de produtividade para o meu dia atual com base nos dados.`;
    }

    const response = await ai.models.generateContent({
      model: 'gemini-3.8-flash',
      contents: `${contextData}\n\nSolicitação: ${userPromptText}`,
      config: {
        systemInstruction,
      },
    });

    const reply = response.text || 'Não foi possível gerar a recomendação no momento. Verifique sua conexão e tente novamente.';
    res.json({ success: true, text: reply });
  } catch (error: any) {
    console.error('Gemini API Error:', error);
    res.status(500).json({
      success: false,
      error: error?.message || 'Falha ao processar a requisição com o assistente inteligente.',
    });
  }
});

// Endpoint: AI Quick Task Breakdown
app.post('/api/gemini/task-breakdown', async (req: Request, res: Response): Promise<void> => {
  try {
    const { taskTitle, taskCategory } = req.body;
    if (!taskTitle) {
      res.status(400).json({ error: 'Título da tarefa é obrigatório' });
      return;
    }

    const prompt = `Para a tarefa "${taskTitle}" (Categoria: ${taskCategory || 'Geral'}), divida-a em 3 a 5 subtarefas práticas, sequenciais e acionáveis com tempo estimado em minutos para cada uma. Retorne em formato direto e conciso com marcadores.`;

    const response = await ai.models.generateContent({
      model: 'gemini-3.8-flash',
      contents: prompt,
      config: {
        systemInstruction: 'Você é um assistente de decomposição de tarefas para máxima clareza e execução.',
      },
    });

    res.json({ success: true, text: response.text || '' });
  } catch (error: any) {
    console.error('Gemini breakdown error:', error);
    res.status(500).json({ success: false, error: error?.message });
  }
});

// Health check endpoint
app.get('/api/health', (_req: Request, res: Response) => {
  res.json({ status: 'healthy', timestamp: new Date().toISOString() });
});

// Setup Vite middleware in dev or static files in production
async function startServer() {
  if (process.env.NODE_ENV === 'production') {
    // Serve production build
    app.use(express.static(path.resolve(__dirname, 'dist')));
    app.get('*', (_req: Request, res: Response) => {
      res.sendFile(path.resolve(__dirname, 'dist', 'index.html'));
    });
  } else {
    // Development mode with Vite middleware
    const { createServer } = await import('vite');
    const vite = await createServer({
      server: {
        middlewareMode: true,
        host: '0.0.0.0',
        port: PORT,
      },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`ChronosFlow Server running at http://0.0.0.0:${PORT}`);
  });
}

startServer();
