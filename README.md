# Copilot Config

Repositório central com **agentes, skills, prompts e instructions** customizados para GitHub Copilot. Consolida assets de múltiplos workspaces em um único catálogo unificado e auditado.

## Estrutura

```
├── agents/          # Agentes customizados (.agent.md)
├── skills/          # Skills (SKILL.md + references/templates)
├── prompts/         # Prompts e instructions (user-level)
├── hooks/           # Copilot hooks (validação, otimização)
├── instructions/    # Instructions por domínio (workspace-level)
└── copilot-instructions.md
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

## Skills (29)

### Design Visual & Web (efeitos premium auditados)

| Skill | Domínio | Destaque |
|-------|---------|----------|
| `web-design-mastery` | **Efeitos visuais premium** (CSS, GSAP, 3D) | Inclui [`EFFECTS-MECHANICS.md`](./skills/web-design-mastery/EFFECTS-MECHANICS.md) — manual técnico 2026 com **como cada efeito funciona + variações + Awwwards refs** |
| `visual-design-expert` | Direção visual SaaS / landing pages | Sland/Bingle aesthetic, procedural SVG vs raster |
| `frontend-design-auditor` | Auditoria PT-BR (ortografia, tipografia, contraste WCAG, a11y) | 35+ regras de QA |
| `nextjs-expert` | Next.js cinematic web design | Glassmorphism, gradient mesh |
| `canvas-banners` | Banners HTML5 Canvas | Convolution, duotone, double exposure |
| `editorial-composer` | Composição editorial / mockups | Substitui `photo-montage` |
| `image-marketing` | Prompts IA + design marketing | Midjourney, DALL-E, brand kits |

### Copy & SEO

| Skill | Domínio |
|-------|---------|
| `copywriting-persuasion` | Copy persuasivo PT-BR (PAS, AIDA, headlines) |
| `seo-conversion-master` | SEO técnico + CRO + schema.org |
| `business-proposal` | Propostas comerciais PDF/HTML |

### Jurídico (PT-BR)

| Skill | Domínio |
|-------|---------|
| `direito-brasileiro` | Base geral do direito brasileiro |
| `direito-previdenciario` | Direito previdenciário INSS |
| `legal-triagem-flow` | Triagem legal via WhatsApp |
| `therapeutic-evolution-flow` | Evolução terapêutica SaaS |

### Stripe & Pagamentos

| Skill | Domínio |
|-------|---------|
| `stripe-best-practices` | Boas práticas Stripe |
| `stripe-projects` | Projetos Stripe end-to-end |
| `upgrade-stripe` | Migrações de versão Stripe |

### IA / Agents / Pipelines

| Skill | Domínio |
|-------|---------|
| `dependency-docs-mapper` | Mapeia docs de dependências |
| `jurema-7b-trainer` | Fine-tuning Jurema 7B |
| `mapeador-executor` | Padrão Mapeador-Executor para agentes |
| `lucas-mangolin-content` | Geração de conteúdo persona |
| `lucas-mangolin-seo` | SEO persona-driven |

### Microsoft / Azure / Entra

| Skill | Domínio |
|-------|---------|
| `microsoft-foundry` | Microsoft Foundry agents |
| `entra-agent-id` | Entra Agent ID |
| `entra-app-registration` | Registro de apps no Entra |

### Utilitários

| Skill | Domínio |
|-------|---------|
| `web-inspector` | Inspeção de sites (Playwright) |
| `comercio-simulator` | Simulação de cenários de varejo |
| `political-marketing` | Marketing político brasileiro |
| `photo-montage` | (deprecated → `editorial-composer`) |

> **Skills oficiais Microsoft Azure:** A Microsoft mantém ~25 skills oficiais (azure-deploy, azure-prepare, azure-cost, azure-kubernetes, azure-rbac etc.) instaladas em `~/.agents/skills/`. Como são atualizadas externamente pela MS, **não foram duplicadas neste repositório** — apenas referenciadas. Para usá-las, mantenha o pacote oficial instalado.

## Auditoria das Skills de Design Visual

As skills de design (`web-design-mastery`, `visual-design-expert`, `frontend-design-auditor`, `canvas-banners`, `nextjs-expert`) foram auditadas com pesquisa em **Awwwards SOTD 2026**, **Codrops case studies** e **Motion Highlights** para garantir cobertura de:

- **Cards** — spotlight, tilt 3D, beam, gradient border (mecânica + 4 variações cada)
- **Carrosséis** — drag-snap, 3D coverflow/ring, marquee infinito, stack swipe
- **Tipografia** — variable fonts kinetic, split reveal, gradient animado, kinetic typography
- **Transições** — View Transitions API, FLIP, magnetic hover, scroll-driven CSS nativas
- **Scroll** — Lenis, scroll-pin storytelling, distortion/blur por velocidade
- **3D / WebGL** — quando usar Three.js vs CSS 3D, scroll-driven 3D, WebGPU 2026

Documento completo: [`skills/web-design-mastery/EFFECTS-MECHANICS.md`](./skills/web-design-mastery/EFFECTS-MECHANICS.md).

## Como usar

1. Clone este repositório.
2. Para usar como **user-level Copilot config**, copie `agents/`, `skills/`, `prompts/`, `instructions/` para `~/.agents/` e `~/.copilot/`.
3. Para usar **por workspace**, copie `skills/<nome>/` para `<workspace>/.copilot/skills/<nome>/`.
4. Reinicie o VS Code para que o Copilot detecte os assets.

## Autor

[VNCRIBEIRO1](https://github.com/VNCRIBEIRO1)
