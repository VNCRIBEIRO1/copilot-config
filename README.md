# Copilot Config

Custom GitHub Copilot agents, skills, prompts e instructions.

## Estrutura

```
├── agents/          # Agentes customizados (.agent.md)
├── skills/          # Skills com SKILL.md + references/templates
├── prompts/         # Prompts e instructions (user-level)
├── hooks/           # Copilot hooks (validação, otimização)
├── instructions/    # Instructions por domínio (workspace-level)
└── copilot-instructions.md  # Instructions raiz do workspace
```

## Agentes

| Agente | Descrição |
|--------|-----------|
| `osint-scraper` | OSINT avançado: scraping, screenshots, reverse image search |
| `web-inspector` | Screenshots, auditoria visual, comparação A/B |
| `llm-trainer` | Pipeline fine-tuning: dataset → treino → deploy → WhatsApp |
| `dataset-generator` | Gera pares Q&A jurídicos para fine-tuning |
| `dataset-validator` | Audita datasets: formato, precisão legal, LGPD |
| `pipeline-qa` | Testes E2E do pipeline completo |

## Skills

| Skill | Domínio |
|-------|---------|
| `nextjs-expert` | Next.js + design de autoridade |
| `political-marketing` | Marketing político brasileiro |
| `canvas-banners` | Banners HTML5 Canvas |
| `editorial-composer` | Composição visual editorial |
| `business-proposal` | Propostas comerciais PDF/HTML |
| `direito-previdenciario` | Base jurídica previdenciária |
| `comercio-simulator` | Simulação de cenários de varejo |
| `image-marketing` | Prompts de IA e design de marketing |
| `web-inspector` | Navegação e captura de sites |
| `therapeutic-evolution-flow` | Sessões terapêuticas SaaS |
| `photo-montage` | (deprecated → editorial-composer) |

## Autor

VNCRIBEIRO1
