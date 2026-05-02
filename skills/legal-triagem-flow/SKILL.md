---
name: legal-triagem-flow
description: 'Construir fluxos de triagem jurídica conversacional ponta-a-ponta com LLM (Groq free tier). Mapeia áreas → tipos de serviço → documentos/informações exigidos, gera system prompts otimizados, implementa máquina de estados com persistência incremental por turno, e respeita limites de tokens (TPM/TPD) para não derrubar o bot. Use quando: criar/refatorar bot jurídico, mapear área de atuação, desenhar prompt de triagem, persistir dados de cliente turn-by-turn, otimizar consumo Groq, evitar 429 rate limit, refletir triagem no painel admin via Socket.IO.'
---

# Legal Triagem Flow — Bot Jurídico Conversacional com LLM

## Quando Usar

- Criar/refatorar fluxo de triagem para escritório de advocacia (WhatsApp / web chat)
- Adicionar nova área jurídica ou tipo de serviço ao bot
- Diagnosticar bot que repete perguntas, perde contexto ou não persiste dados
- Resolver `429 Rate limit / TPD` no Groq free tier
- Garantir que cada turno reflete imediatamente no banco e no painel admin

## Princípios Não-Negociáveis

1. **Estado persistido a cada turno** — `collected_data` salva no DB após cada extração. Nunca depender do histórico de mensagens para inferir "o que já foi coletado".
2. **System prompt cita JÁ COLETADO / FALTA / lastAskedField** — sem isso o LLM repete perguntas ou aceita resposta no campo errado.
3. **Knowledge Base truncado** — máx 1500 chars no chat/triagem, máx 2500 em análise de caso. KB completo (50KB+) ESTOURA o limite diário.
4. **Modelo certo por tarefa** — `llama-3.1-8b-instant` (500k TPD) para classificação; `llama-3.3-70b-versatile` (100k TPD) só para chat/triagem.
5. **Retry 429 com backoff** — parsear `try again in Xm Ys` da resposta da Groq; aguardar e re-tentar UMA vez. TPD não tem retry.
6. **Sempre uma área no prompt** — se o cliente menciona aposentadoria, a área `previdenciario` é fixada na primeira extração e permanece.

## Procedimento

### 1. Mapear Áreas → Serviços → Campos

Cada área jurídica tem N tipos de serviço; cada tipo tem documentos e informações específicos. Catálogo em `backend/src/config/caseRequirements.js`. Estrutura mínima:

```javascript
{
  [tipo_caso]: {
    label: 'Nome legível',
    documentos: ['RG', 'CPF', ...],
    informacoes: ['Data de nascimento', ...],
    // Opcional: campos extras obrigatórios além do core (cpf/rg/nome/...)
    camposExtras: ['data_nascimento', 'nit_pis'],
  }
}
```

Áreas atuais cobertas:
- **Previdenciário**: aposentadorias (idade, tempo, especial, rural, invalidez), auxílio-doença, BPC/LOAS, pensão por morte, revisão, planejamento
- **Direitos PCD**: BPC PCD, inclusão escolar, cotas, acessibilidade, isenção fiscal, capacitismo, autismo
- **Cível / Trabalhista / Família / ESG**: handoff direto ao humano (regra explícita no prompt)

### 2. System Prompt de Triagem — Anatomia Obrigatória

Toda mensagem do prompt de triagem deve ter estes blocos, NESTA ORDEM:

```
[persona curta]            → "Você é a assistente de [escritório]"
[tom de voz]               → frases curtas, sem juridiquês, 1 emoji por msg
[regras de extração]       → mapeamento "aposentei" → tipo_caso=aposentadoria_idade
[fase atual]               → 📋 Caso | 👤 Pessoais | ✅ Completa
[JÁ COLETADO]              → bullets dos campos preenchidos
[FALTA]                    → bullets dos campos pendentes
[⚠️ CONTEXTO CRUCIAL]      → "você acabou de pedir RG, próxima resposta É o RG"
[valores válidos]          → enum de tipos de caso permitidos
[KB truncado ≤1500 chars]  → seções pickKnowledgeSectionsFromText()
[formato de resposta JSON] → {message, extracted, phase}
```

Implementação de referência: [buildTriageSystemPrompt em aiProvider.js](../../backend/src/services/aiProvider.js)

### 3. Máquina de Estados — Roteamento Único

Toda entrada (WhatsApp, web, futuro Cloud API) DEVE passar por uma única função de roteamento que:

1. Carrega `current_step` + `collected_data` do DB
2. Valida step contra whitelist (`WELCOME, AI_CHAT, AI_TRIAGE, DONE`); legados → `AI_CHAT`
3. Valida `collected_data` é objeto puro (parse robusto contra strings duplamente codificadas)
4. Despacha para `_processStep` (switch case por step)
5. Cada case salva o state DEPOIS da extração via `ChatStateModel.upsert`

States:
- `WELCOME` → envia boas-vindas, transiciona para `AI_CHAT`
- `AI_CHAT` → classifica intent (saudação/dúvida/triagem/atendente/agendamento)
- `AI_TRIAGE` → loop de perguntas dirigido pela LLM até `_isTriageDataComplete`
- `DONE` → cria `triagem` no DB, emite `new-triagem` via Socket.IO, notifica secretária

### 4. Otimização de Tokens (Groq Free Tier)

Limites por modelo:
| Modelo | TPM | TPD | Uso |
|--------|-----|-----|-----|
| llama-3.3-70b-versatile | 6k | 100k | chat, triagem (qualidade) |
| llama-3.1-8b-instant | 20k | 500k | classifyIntent (volume) |

Configurações por chamada:
- **chat**: `history.slice(-6)`, `maxTokens: 512`, KB ≤ 1500 chars
- **triageChat**: `history.slice(-4)`, `maxTokens: 256`, `responseFormat: json_object`, KB ≤ 1500 chars
- **classifyIntent**: `model: 'llama-3.1-8b-instant'`, `maxTokens: 10`, SEM KB
- **analyzeCaseData**: `maxTokens: 800`, KB ≤ 2500 chars

Retry 429:
```javascript
const waitMatch = errMsg.match(/try again in (?:(\d+)m)?(\d+(?:\.\d+)?)s/);
// se totalWaitMs <= 62000ms: aguarda + retry uma vez
// se "tokens per day" no errMsg: aborta com mensagem clara
```

### 5. Persistência Incremental + Realtime

A cada turno:
1. `_mergeTriageData(data, extracted)` — merge cego pode duplicar; trate `detalhes` como objeto, `documentos` como array sem duplicatas, `cpf` com validação
2. `ChatStateModel.upsert(chatId, sessionName, step, data, area)` — JSON.stringify do data
3. `io.emit('new-message', ...)` — pinta a mensagem no painel imediatamente
4. Quando completa: `TriagemModel.create(...)` + `io.emit('new-triagem', ...)`

Eventos Socket.IO obrigatórios:
- `new-message` (toda msg, bot ou cliente)
- `new-triagem` (triagem criada)
- `triagem-completed` (resumo curto para notificações)
- `human-requested` (handoff)

### 6. Validação de Conclusão

`_isTriageDataComplete` deve checar campos *core* + *campos extras do tipo_caso*:

```javascript
const CORE = ['area', 'tipo_caso', 'client_name', 'cpf', 'rg', 'telefone_contato', 'rua', 'numero'];
const extras = CASE_REQUIREMENTS[data.tipo_caso]?.camposExtras || [];
return [...CORE, ...extras].every(f => data[f] && String(data[f]).trim());
```

Se faltar campo extra (ex: `nit_pis` para aposentadoria), prompt deve listar em FALTA até preencher.

## Checklist de Auditoria do Fluxo

- [ ] Toda entrada passa pelo mesmo `_routeToStateMachine`?
- [ ] `collected_data` parse robusto contra strings duplamente codificadas?
- [ ] System prompt cita JÁ COLETADO / FALTA / lastAskedField?
- [ ] KB truncado em todas as chamadas LLM?
- [ ] classifyIntent usa modelo 8b-instant?
- [ ] `_call` tem retry 429 com backoff parseando `try again in`?
- [ ] Mensagens de erro Groq são repassadas como msg ao usuário (não silêncio)?
- [ ] `ChatStateModel.upsert` chamado a CADA turno após merge?
- [ ] `new-message` emitido para TODA mensagem (entrada e saída)?
- [ ] `new-triagem` emitido na finalização?
- [ ] Frontend escuta os 4 eventos e atualiza listas sem F5?
- [ ] `tipo_caso` validado contra enum em `caseRequirements.js`?
- [ ] Áreas Cível/Trabalhista/Família/ESG → handoff humano automático?

## Anti-Padrões Conhecidos

- **`_handleLLM` direto** sem state machine → bot esquece o que perguntou
- **KB completo no prompt** → 6k tokens/chamada → estoura 100k TPD em ~16 conversas
- **`history.slice(-20)` no chat** → janela enorme + KB → 413 (payload too large)
- **`fast: true` no classifyIntent** sem trocar de modelo → ainda usa 70B
- **Catch silencioso de erro Groq** → cliente fica sem resposta, parece "bot parou"
- **`OUTSIDE_HOURS` ou steps legados não tratados** → cai no `default: break;` do switch e bot fica mudo
- **`JSON.parse(collected_data)` sem validar tipo** → strings duplamente codificadas viram `string` em vez de `object`, qualquer atribuição explode
- **Persistir state APENAS no fim da triagem** → se cliente fecha o chat, perde tudo

## Referências do Codebase

- Catálogo de serviços: `backend/src/config/caseRequirements.js`
- KB jurídico: `backend/src/config/KNOWLEDGE_BASE.md` (truncar ao usar!)
- Provider LLM: `backend/src/services/aiProvider.js`
- Máquina de estados: `backend/src/bot/flow.js`
- Persistência de estado: `backend/src/models/chatState.js`
- Persistência de triagem: `backend/src/models/triagem.js`
- Painel admin (lista chats/triagens): `frontend/src/components/`
