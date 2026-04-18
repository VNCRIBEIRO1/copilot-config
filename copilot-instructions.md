# Agentes — Workspace Instructions

## Projeto
Workspace de projetos de campanhas políticas e ferramentas OSINT.

## Projetos
- `bozo.v2` — Site Wellington Bozo (estático)
- `bozo-next` — Site Wellington Bozo (Next.js)
- `spinelli` — Site Tenente Spinelli (Next.js 16 + React 19 + Tailwind v4)

## Agentes Disponíveis
- **OSINT Scraper v2** (`@osint-scraper`) — OSINT avançado: scraping, download de imagens, screenshots de evidência, reverse image search, wayback machine, análise de redes, detecção de conteúdo deletado, score de presença digital. Retorna JSON + imagens salvas em `osint-data/`.
- **Web Inspector** (`@web-inspector`) — Navega sites, tira screenshots (fullPage/mobile/desktop/tablet), audita visualmente e indexa capturas ao projeto. Output em `screenshots/{dominio}/` com `manifest.json`.
- **LLM Trainer** (`@llm-trainer`) — Orquestra pipeline de fine-tuning: coleta → dataset → validação → treino (Colab) → quantização GGUF → Ollama → FastAPI → WhatsApp Business API. Coordena subagentes `@dataset-generator` e `@dataset-validator`.
- **Dataset Generator** (`@dataset-generator`) — Gera pares Q&A jurídicos para fine-tuning. Subagente do LLM Trainer.
- **Dataset Validator** (`@dataset-validator`) — Audita datasets: formato JSONL, precisão legal, LGPD, distribuição. Subagente do LLM Trainer.
- **Pipeline QA** (`@pipeline-qa`) — Testa o sistema completo end-to-end: dataset, inferência Ollama, FastAPI, webhook WhatsApp, guardrails. Gera relatório de QA com métricas.

## MCP Servers
- **Playwright** — Automação de browser para scraping de SPAs, screenshots fullPage, navegação em redes sociais
- **Fetch** — HTTP fetch para APIs, download de imagens, páginas estáticas
- **Firecrawl** — Web scraping profundo com parsing inteligente (requer API key)
- **GitHub** — Acesso a repos, issues, PRs, perfis GitHub (requer PAT)

## Diretórios de Output OSINT
```
osint-data/{alvo}/
├── report.json          # Relatório completo
├── report.md            # Resumo legível
├── images/              # Fotos de perfil, posts, capas
│   └── manifest.json    # Índice com metadados
├── screenshots/         # Evidências com timestamp
│   └── manifest.json
└── docs/                # PDFs e documentos
```

## Convenções
- Node.js PATH: `$env:Path = "C:\Program Files\nodejs;C:\Users\Usuario\AppData\Roaming\npm;$env:Path"`
- Git user: VNCRIBEIRO1 / vncribeiro1@gmail.com
- Deploy: Vercel CLI (`vercel --yes --prod`)
- Sempre rodar comandos no terminal, instalar dependências automaticamente
