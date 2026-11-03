# ChronosFlow — Gerenciador Inteligente de Tarefas, Metas, Saúde e Calendário

> Aplicativo multiplataforma para sincronização de rotinas diárias e compromissos com metas pessoais de longo prazo, combinando visão de calendário, to-do list priorizada com horários, acompanhamento de leitura de livros, rastreamento de saúde e treinos, feriados nacionais/municipais, assistente de produtividade alimentado por IA Gemini, notificações push e relatórios de desempenho semanais em PDF e CSV.

---

## 📋 Sumário

1. [Visão Geral](#-visão-geral)
2. [Arquitetura e Stack Tecnológica](#-arquitetura-e-stack-tecnológica)
3. [Principais Módulos e Funcionalidades](#-principais-módulos-e-funcionalidades)
   - [1. Autenticação Segura com Conta Google (Firebase)](#1-autenticação-segura-com-conta-google-firebase)
   - [2. Calendário com Feriados & Agendamento Recorrente](#2-calendário-com-feriados--agendamento-recorrente)
   - [3. To-Do List Priorizada com Horários de Execução](#3-to-do-list-priorizada-com-horários-de-execução)
   - [4. Acompanhamento de Leitura de Livros](#4-acompanhamento-de-leitura-de-livros)
   - [5. Saúde & Atividades Físicas (Treinos)](#5-saúde--atividades-físicas-treinos)
   - [6. Hub de Metas Pessoais](#6-hub-de-metas-pessoais)
   - [7. Assistente IA de Produtividade (Gemini 3.8 Flash)](#7-assistente-ia-de-produtividade-gemini-38-flash)
   - [8. Notificações Push & Lembretes Sonoros](#8-notificações-push--lembretes-sonoros)
   - [9. Relatórios Semanais (PDF & CSV)](#9-relatórios-semanais-pdf--csv)
   - [10. Otimização Mobile, Modo Escuro & PWA](#10-otimização-mobile-modo-escuro--pwa)
4. [Regras de Desenvolvimento & Qualidade de Código](#-regras-de-desenvolvimento--qualidade-de-código)
5. [Modelo de Dados (TypeScript)](#-modelo-de-dados-typescript)
6. [Guia de Instalação e Testes (TDD)](#-guia-de-instalação-e-testes-tdd)

---

## 🎯 Visão Geral

O **ChronosFlow** une rotina operacional, saúde, desenvolvimento intelectual e metas de longo prazo em uma única interface coerente, eliminando a fragmentação entre calendário, afazeres diários e hábitos.

Com o ChronosFlow, o usuário programa sua semana de trabalho (ex: "Segunda a Sexta das 07h às 12h"), planeja suas tarefas com início e fim previstos, monitora seus treinos físicos sincronizados com o calendário, mantém o hábito diário de leitura e recebe sugestões inteligentes da IA Gemini.

---

## 🛠 Arquitetura e Stack Tecnológica

```
┌─────────────────────────────────────────────────────────────────┐
│                        Client Layer                             │
│  • React 19 SPA + TypeScript                                    │
│  • Tailwind CSS v4 (@custom-variant dark)                       │
│  • Firebase Auth (Google Sign-In com popup e persistência)       │
│  • Firestore SDK (Sincronização em nuvem e fallback local)       │
│  • Mobile Bottom Nav (Touch targets >= 44px e área segura)      │
│  • Web Audio API (Chime de alarme)                              │
│  • Web Notifications API (Push local / Lembretes)               │
│  • PWA (Manifest + Service Worker offline)                      │
└────────────────────────────────┬────────────────────────────────┘
                                 │ HTTP / JSON
                                 ▼
┌─────────────────────────────────────────────────────────────────┐
│                   Node.js / Express Server                      │
│  • server.ts (Middlewares Vite em dev / Static em prod)         │
│  • @google/genai SDK Oficial (gemini-3.8-flash)                 │
│  • Endpoints server-side seguros para produtividade e IA        │
└─────────────────────────────────────────────────────────────────┘
```

---

## ⚡ Principais Módulos e Funcionalidades

### 1. Autenticação Segura com Conta Google (Firebase)
- Login direto via popup oficial do Google (`GoogleAuthProvider` via Firebase Auth).
- Perfil do usuário exibido no topo (foto, nome, email).
- Sincronização automática em nuvem das tarefas, livros, treinos, metas e feriados via Firestore.
- Fallback automático e transparente para `localStorage` para navegação sem login ou offline.

### 2. Calendário com Feriados & Agendamento Recorrente
- **Feriados Nacionais e Municipais**:
  - Algoritmo astronômico embutido para cálculo de feriados móveis brasileiros (Carnaval, Sexta-feira Santa, Páscoa, Corpus Christi) e fixos (Tiradentes, Independência, Consciência Negra, Natal).
  - Modal para cadastrar feriados municipais/regionais personalizados com exibição destacada no calendário.
- **Agendamento Recorrente Multi-dias**:
  - Configuração de rotinas repetitivas (ex: "Trabalho das 07h às 12h de Segunda a Sexta").
  - Suporte a "Seg a Sex", "Todos os dias" ou seleção livre de dias da semana (Dom a Sáb) por períodos de semanas ou meses.
- **Sincronização iCal (`.ics`)**: Importação e exportação RFC 5545 compatível com Google Agenda, Apple e Outlook.

### 3. To-Do List Priorizada com Horários de Execução
- **Horários das Atividades**: Cada atividade registra o horário de início e término planejado (ex: "09:00 - 10:30"), além de tempo estimado.
- **Classificação**: Alta Prioridade (vermelho suave), Média (âmbar) e Baixa (slate).
- **Postagem Rápida (*Quick Add*)**: Adição imediata com horário de início/fim, prioridade e tempo estimado.
- **Subtarefas com Divisão por IA**: Decomposição automática de tarefas com o Gemini 3.8 Flash.
- **Micro-interação tátil**: Efeito de confetes ao concluir tarefas.

### 4. Acompanhamento de Leitura de Livros
- Cadastro de livros com título, autor, total de páginas, página atual e meta diária de minutos (ex: 30 min/dia).
- Status: Lendo Agora, Quero Ler e Concluídos.
- Registro diário de sessão de leitura (páginas lidas e minutos dedicados).
- Barra de progresso visual com estimativa de conclusão.

### 5. Saúde & Atividades Físicas (Treinos)
- Registro de atividades físicas: Corrida, Ciclismo, Academia / Musculação, Funcional, Caminhada e outros esportes.
- Campos detalhados: Dia, hora de início, hora de término, duração em minutos, distância em km, calorias e intensidade (leve, moderada, intensa).
- **Sincronização Automática com a Agenda**: Cada treino agendado gera automaticamente um bloco correspondente no calendário.

### 6. Hub de Metas Pessoais
- Metas com métricas concretas (horas, treinos, páginas, sessões).
- Vínculo direto de tarefas e compromissos: a conclusão de tarefas avança automaticamente a porcentagem da meta.

### 7. Assistente IA de Produtividade (Gemini 3.8 Flash)
- Otimização da rotina em blocos de tempo (*Time Blocking*).
- Análise de alinhamento com metas pessoais e plano anti-procrastinação.

### 8. Notificações Push & Lembretes Sonoros
- Lembretes no navegador com 15 minutos de antecedência para tarefas e eventos do dia.
- Sintetizador sonoro nativo via Web Audio API (sem dependência de arquivos externos).

### 9. Relatórios Semanais (PDF & CSV)
- Painel executivo com taxa de conclusão, horas dedicadas e distribuição por prioridade.
- Exportação para PDF com layout `@media print`.
- Exportação em planilha CSV formatada em UTF-8 com BOM (`\uFEFF`).

### 10. Otimização Mobile, Modo Escuro & PWA
- Barra de navegação inferior (*Mobile Bottom Nav*) com alvos de toque $\ge 44\text{px}$ para fácil uso com uma mão.
- Modo Escuro com `@custom-variant dark` e tokens contrastantes.
- PWA instalável com Service Worker offline e botão nativo na barra superior.

---

## 📏 Regras de Desenvolvimento & Qualidade de Código

1. **TDD (Test-Driven Development)**:
   - Suíte de testes automatizados com **Vitest**.
   - Testes unitários para cálculo de feriados móveis/fixos, gerador de recorrências e relatórios CSV.
2. **Arquivos Curtos (< 250 linhas)**:
   - 100% dos arquivos de código funcional do projeto respeitam o limite estrito de no máximo 250 linhas, divididos em módulos desacoplados e componentes especializados.
3. **DRY & KISS**:
   - Reutilização de hooks (`useAppState`, `usePWAInstall`) e funções utilitárias unificadas.
4. **Tipagem Estrita**:
   - TypeScript configurado com verificação estrita sem erros de compilação.

---

## 🚀 Guia de Instalação e Testes (TDD)

### Instalação
```bash
npm install
```

### Executar Testes Unitários (Vitest)
```bash
npm test
```

### Executar em Desenvolvimento
```bash
npm run dev
```
Acesse `http://localhost:3000`.

### Verificação de Tipos (Lint)
```bash
npm run lint
```

### Build de Produção
```bash
npm run build
```
