# GEO — Generative Engine Optimization & AI Search Visibility

## O Que É GEO

Generative Engine Optimization (GEO) é a prática de otimizar presença e conteúdo para aparecer em respostas geradas por sistemas de IA: Google AI Overviews, ChatGPT, Gemini, Perplexity, Claude e outros.

**Diferença fundamental:** Em SEO tradicional você compete por posição no ranking. Em GEO, você compete para **ser parte da resposta**.

## SEO vs GEO — Comparação

| Aspecto | SEO Tradicional | GEO |
|---------|----------------|-----|
| **Objetivo** | Ranking nas SERPs | Ser citado/mencionado em respostas de IA |
| **Táticas principais** | Crawlabilidade, keywords, intent, backlinks | Clareza, extractabilidade, menções em fontes crédulas, conteúdo fresco |
| **Métricas** | Rankings, tráfego orgânico, CTR | AI visibility, AI mentions, AI citations, AI share of voice |
| **Links** | Backlinks com âncora são essenciais | Menções sem link (unlinked mentions) têm grande peso |
| **Conteúdo** | Otimizado para snippets e SERP features | Otimizado para extração e síntese por LLMs |

## Por Que GEO É Crítico para YMYL (Saúde/Direito/Psicologia)

1. **AI Overviews dominam queries informacionais** — "o que é ansiedade generalizada", "quanto custa um divórcio"
2. **Pacientes/clientes usam ChatGPT para pesquisar** — "melhor dermatologista em Campinas" pode ser perguntado ao ChatGPT
3. **Google AI Mode está crescendo** — testes mostram integração total com resultados locais
4. **Reviews influenciam o que LLMs dizem** — estudo Moz 2025: avaliações agora moldam as recomendações de IA

## Fatores de Visibilidade em AI Search (Whitespark 2026)

Ranking baseado no survey de 47 especialistas (nov/2025):

| # | Fator de AI Search Visibility | Score |
|---|-------------------------------|-------|
| 1 | Presença em listas curadas "best of" por especialistas | 179 |
| 2 | Página dedicada para cada serviço | 170 |
| 3 | Proeminência em domínios relevantes do setor | 167 |
| 4 | Qualidade/autoridade de citações não-estruturadas (artigos, blogs, gov, associações) | 160 |
| 5 | Autoridade de sites terceiros onde há reviews | 156 |
| 6 | Relevância de keywords geográficas no conteúdo | 153 |
| 7 | Quantidade de citações não-estruturadas (artigos, blogs) | 147 |
| 8 | Rating alto no Google (4-5 estrelas) | 146 |
| 9 | Foco do site em nicho específico | 138 |

### Insight Crucial: "Citations are the new links" para AI

> Em AI SEO, menções (citations) são o novo link. 3 dos top 5 fatores de AI Search Visibility são fatores de citação.
> — Darren Shaw, Whitespark LSRF 2026

## Estratégias de Otimização para AI Search

### 1. Aparecer em Listas Curadas "Best Of"

**Por quê:** Fator #1 de AI visibility. LLMs citam listas autoritativas.

**Como fazer:**
- Contactar sites de associações profissionais (OAB, CRM, CFP locais)
- Solicitar inclusão em listas de "melhores profissionais" de portais como Doctoralia, JusBrasil
- Criar ou aparecer em artigos "Top 10 [profissionais] em [cidade]" em blogs locais
- Patrocinar conteúdo editorial em jornais/revistas regionais
- Participar de rankings profissionais (Análise Advocacia, etc.)

### 2. Menções (Unlinked Brand Mentions)

**Por quê:** AI crawalers valorizam menções mesmo sem link. "Unlinked mentions carry more weight in AI."

**Como fazer:**
- Publicar artigos como especialista convidado em portais do setor
- Ser citado em matérias de imprensa local/regional
- Participar como fonte em artigos jornalísticos
- Contribuir em fóruns profissionais (JusBrasil para advogados, Doctoralia para médicos)
- Manter presença ativa no LinkedIn com posts de especialista

### 3. Conteúdo com Citações, Dados e Estatísticas

**Por quê:** Estudo com 10.000 queries: páginas com citações e estatísticas têm 30-40% mais visibilidade em respostas de IA.

**Template de conteúdo otimizado para AI:**
```markdown
## [Pergunta que o usuário faria a um LLM]

[Resposta direta em 1-2 frases — a "extractable answer"]

Segundo [fonte autoritativa], [dado ou estatística verificável].

"[Citação direta de especialista]" — [Nome], [credencial]

### O que a pesquisa mostra

- [Dado 1 com fonte]
- [Dado 2 com fonte]
- [Recomendação prática]
```

### 4. Structured Data em HTML Estático (Server-Side)

**ALERTA CRÍTICO:** AI crawlers (GPTBot, ClaudeBot, PerplexityBot) **NÃO executam JavaScript**.

| Método | Googlebot | AI Crawlers |
|--------|-----------|-------------|
| JSON-LD no HTML estático | ✅ Lê | ✅ Lê |
| JSON-LD via GTM/JS client-side | ✅ Lê | ❌ Invisível |
| Meta tags no `<head>` | ✅ Lê | ✅ Lê |
| Conteúdo renderizado por JS | ✅ Renderiza | ❌ Não renderiza |

**Ações obrigatórias:**
- Schema JSON-LD **sempre** no HTML servidor (SSR ou estático)
- Nunca depender de Google Tag Manager para structured data
- Se usar Next.js/Nuxt: usar SSR, nunca CSR puro para conteúdo crítico
- Pré-renderizar páginas para crawlers quando necessário

### 5. Conteúdo Fresco e Atualizado

**Por quê:** AI tools favorecem informação mais recente.

**Ações:**
- Atualizar artigos existentes a cada 6 meses (data visível de atualização)
- Adicionar seção "Atualizado em [mês/ano]" aos posts
- Publicar análises de mudanças regulatórias (novas resoluções CFM, OAB)
- Manter página de FAQ dinâmica com perguntas emergentes
- **NUNCA** mudar apenas a data sem atualizar conteúdo real (Google penaliza)

### 6. Presença em Plataformas UGC

**Por quê:** Reddit, YouTube, Facebook, fóruns profissionais têm alta exposição em generative engines.

**Para profissionais YMYL:**

| Plataforma | Ação |
|-----------|------|
| YouTube | Publicar vídeos curtos respondendo perguntas comuns |
| LinkedIn | Posts de expertise com dados e opiniões profissionais |
| Reddit (r/direito, r/desabafos, etc.) | Participar de forma útil e ética (sem propaganda) |
| Doctoralia / Psicologia Viva | Responder perguntas de usuários |
| JusBrasil | Publicar artigos e responder dúvidas jurídicas |

### 7. Presença na Wikipedia (quando aplicável)

**Por quê:** Wikipedia compõe porção significativa dos dados de treino de LLMs.

**Aplicação para profissionais:**
- Clínicas/escritórios grandes: considerar criar artigo se notabilidade comprovada
- Garantir que associações e instituições (OAB, CRM) tenham páginas Wiki atualizadas
- Contribuir com referências em artigos Wikipedia de sua área de atuação

## Otimização de Conteúdo para Extração por LLMs

### Estrutura Ideal de Página para AI

```html
<h1>Pergunta Principal / Tópico</h1>
<p><strong>Resposta direta</strong> em 1-2 frases (extractable answer).</p>

<h2>Detalhamento</h2>
<p>Explicação com dados verificáveis e fontes citadas.</p>
<blockquote>"Citação de especialista" — Nome, Credencial</blockquote>

<h2>Perguntas Frequentes</h2>
<h3>Pergunta específica?</h3>
<p>Resposta concisa e direta.</p>

<!-- Schema FAQ no HTML estático -->
```

### Princípios de Escrita para AI Visibility

1. **Conciso, direto, confiante** — LLMs preferem conteúdo factual sem floreios
2. **Estrutura semântica** — H1 > H2 > H3, bullets, sem "muros de texto"
3. **Respostas no início** — Primeiro parágrafo responde a pergunta
4. **Dados e fontes** — Citar fontes verificáveis aumenta confiabilidade
5. **Who-How-Why** (framework Google):
   - **Who**: Autoria clara com byline e credenciais
   - **How**: Método de criação (se IA foi usada, disclosure recomendado)
   - **Why**: Propósito primário = ajudar pessoas (não manipular ranking)
6. **E-E-A-T elevado** — Trust é o fator mais importante; YMYL exige E-E-A-T máximo

## AI Overviews (AIO) — O Que Saber

### Como Google AI Overviews Funcionam para Local

- Puxam informações do GBP (descrição, serviços, reviews)
- Podem citar diretórios como Doctoralia, JusBrasil
- Favorecem conteúdo bem estruturado e factual
- Crescendo especialmente para queries "best [service] near me"

### Como Ser Citado em AI Overviews

1. Ter GBP completo e otimizado (descrição, serviços, reviews)
2. Structured data no HTML estático
3. Conteúdo que responda perguntas de forma direta
4. Presença em diretórios autoritativos do setor
5. Rating alto com reviews recentes

## Métricas de GEO

### O Que Monitorar

| Métrica | Como Medir |
|---------|-----------|
| AI Mentions | Buscar sua marca/nome em ChatGPT, Gemini, Perplexity |
| AI Citations | Verificar se seu site é citado como fonte |
| AI Share of Voice | Comparar menções vs concorrentes |
| AI Sentiment | Verificar se a IA fala positivamente da marca |
| AI Referral Traffic | Filtro de tráfego de origens AI no Analytics |

### Checklist GEO Mensal

- [ ] Verificar menções da marca em ChatGPT, Gemini e Perplexity
- [ ] Atualizar ao menos 2 artigos com dados frescos
- [ ] Publicar 1 conteúdo com citações/estatísticas verificáveis
- [ ] Garantir schema JSON-LD no HTML servidor (não via JS)
- [ ] Revisar presença em diretórios de setor
- [ ] Verificar se reviews recentes estão chegando (pelo menos 2/mês)
- [ ] Publicar 1 post/artigo em plataforma terceira como especialista
- [ ] Avaliar sentimento em respostas de AI sobre a marca

## Integração GEO + SEO — Não São Estratégias Separadas

> "SEO e GEO funcionam juntos. Separá-los em duas estratégias distintas talvez não faça sentido."
> — Semrush, GEO Practical Guide 2026

**Princípio:** Todo trabalho de SEO tradicional bem feito já contribui para GEO. As adições são:

1. **Garantir renderização server-side** do schema e conteúdo principal
2. **Amplificar menções** em vez de focar apenas em backlinks
3. **Incluir dados verificáveis** em todo conteúdo
4. **Monitorar presença em AI** além de rankings tradicionais
5. **Manter conteúdo atualizado** com frequência regular
