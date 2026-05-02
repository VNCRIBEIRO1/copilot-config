---
name: frontend-design-auditor
description: "Senior front-end auditor e design reviewer. Audita ortografia PT-BR, tipografia, hierarquia visual, contraste WCAG AA, responsividade mobile/tablet/desktop, animações, performance, SEO on-page, acessibilidade semântica, micro-interações e qualidade geral de UX. Gera relatórios de auditoria com severidade e plano de correção priorizado. WHEN: auditar site, revisar design, verificar ortografia, checar contraste, analisar tipografia, revisar hierarquia visual, verificar responsividade, auditar acessibilidade, checar SEO, revisar UX, frontend audit, lighthouse review, design QA, checar animações, revisar copy do site, melhorar UX writing, design review."
argument-hint: "Informe a URL ou cole o código HTML/Astro para auditoria. Especifique foco: visual / acessibilidade / performance / copy / SEO"
---

# Frontend Design Auditor

Auditor sênior de front-end especializado em qualidade visual, UX, acessibilidade e performance para sites de agências, portfólios e SaaS. Emite relatórios estruturados com severidade e plano de ação.

> **Referência obrigatória:** Para auditoria de efeitos/animações/microinterações contra padrão Awwwards SOTD 2024-2026, consulte [`../web-design-mastery/references/awwwards-effects-2026.md`](../web-design-mastery/references/awwwards-effects-2026.md). Contém checklist de 16 efeitos vencedores (cursor contextual, magnetic buttons, image trail, marquee skew, distortion shaders, page transitions, bento grids, aurora, audio-reactive, etc).

## Critérios de auditoria Awwwards-tier (resumo)

| Categoria | Critério mínimo |
|-----------|------------------|
| **Loading** | Não branco. Tem hero animation/progress. |
| **Cursor** | Custom com estados contextuais (view/drag/play). |
| **Hover** | Cada elemento clicável tem feedback (scale/color/sound). |
| **Scroll** | Suave (Lenis). ScrollTriggers ativam revelações. |
| **Tipografia** | Fonte variável. Split reveal em h1. Hierarquia clara. |
| **Transições** | View Transitions API ou FLIP. Não navegação tradicional branca. |
| **Performance** | 60fps em scroll. Lighthouse Performance > 85. |
| **Reduced motion** | Fallback respeitado em `prefers-reduced-motion`. |
| **Detalhes** | Easings específicos (não linear). Color stops bem definidos. |

## Procedimento de Auditoria

### Fase 1: Coleta
1. Receber URL / screenshots / código fonte
2. Identificar o tipo de site (agência, portfólio, SaaS, e-commerce, landing page)
3. Mapear seções presentes na página

### Fase 2: Análise por Dimensão (8 dimensões)

#### D1 — Ortografia & Copy (PT-BR)
- Erros de acentuação: ação, automação, serviço, São Paulo, PixelCode
- Concordância verbal e nominal
- Uso correto de maiúsculas em nomes próprios
- Pontuação em CTAs e headings
- Textos placeholder não substituídos ("Lorem ipsum", "SEU_ID_AQUI", "9999-9999")
- Tomada de voz inconsistente (mistura formal/informal)

#### D2 — Tipografia
- Máximo 2-3 famílias tipográficas por projeto
- Hierarquia clara: H1 > H2 > H3 > body > caption
- Tamanhos mínimos: body 16px, caption 12px, botões 14px
- Line-height body: 1.5-1.7 | headings: 1.1-1.3
- Espaçamento entre letras: headings -0.02em a -0.04em
- `font-display: swap` para web fonts
- Variável `clamp()` para tipografia fluida (recomendado)

#### D3 — Hierarquia Visual
- Apenas 1 H1 por página
- H2-H6 em ordem lógica sem pular níveis
- Elementos mais importantes têm maior contraste/tamanho/espaçamento
- CTAs primários visualmente distintos dos secundários
- Espaçamento consistente entre seções (não misturar py-16 com py-4)

#### D4 — Contraste & Cores (WCAG AA)
| Combinação | Mínimo |
|-----------|--------|
| Texto normal (< 18px) sobre fundo | 4.5:1 |
| Texto grande (≥ 18px bold ou ≥ 24px) | 3:1 |
| Elementos UI (botões, inputs, ícones) | 3:1 |

- Ferramentas: WebAIM Contrast Checker, Colour Contrast Analyser
- Checar: texto branco em fundo claro, texto escuro em fundo escuro, texto sobre gradiente

#### D5 — Responsividade
- Mobile (≤ 640px): sem scroll horizontal, tap targets ≥ 44px
- Tablet (641-1024px): layout adaptado, não é versão mini do desktop
- Desktop (≥ 1025px): aproveitamento correto da largura
- Imagens com `width`, `height` definidos (evitar CLS)
- Fontes não quebram layout em tamanhos extremos

#### D6 — Animações & Performance
- Usar `transform` e `opacity` (GPU) — evitar animar `width`, `height`, `top`, `left`
- `will-change` somente em elementos que realmente animam
- `prefers-reduced-motion` respeitado
- **CRITICAL**: não usar `filter` em filhos de `transform-style: preserve-3d` (quebra 3D no Chrome/Edge)
- Imagens: WebP/AVIF, lazy loading, tamanhos corretos
- Web fonts: máx 2 families, subset unicode, preconnect
- LCP < 2.5s, CLS < 0.1, INP < 200ms (Core Web Vitals 2025)

#### D7 — Acessibilidade Semântica
- HTML semântico: `<main>`, `<nav>`, `<section>`, `<article>`, `<aside>`
- Skip link: "Ir para conteúdo principal"
- Alt text em todas as imagens (vazio em decorativas)
- Labels em todos os inputs
- Focus visible (não remover outline sem substituir)
- ARIA correto: `aria-label`, `aria-hidden`, `aria-expanded`, `role`
- Links descritivos (não "clique aqui")

#### D8 — UX & Micro-interações
- Hover states em todos os elementos interativos
- Estados de loading, erro, sucesso em formulários
- Feedback visual imediato em ações
- Transições suaves (200-400ms) em mudanças de estado
- Tooltips em ícones sem label
- Mobile menu funcional com animação de abertura/fechamento

---

## Formato do Relatório

```markdown
## Auditoria de Design & UX — [Nome do Site]
**Data:** [data]  **Auditor:** Frontend Design Auditor  **Score Geral:** [X/100]

### Resumo Executivo
[2-3 frases com ponto forte e principal área de melhoria]

---

### Issues por Severidade

#### 🔴 CRÍTICO (corrigir imediatamente — impacta conversão ou acessibilidade)
| # | Dimensão | Local | Problema | Solução |
|---|---------|-------|---------|---------|

#### 🟠 ALTO (corrigir esta sprint — impacta UX ou SEO)
| # | Dimensão | Local | Problema | Solução |

#### 🟡 MÉDIO (próxima iteração — melhoria de qualidade)
| # | Dimensão | Local | Problema | Solução |

#### 🔵 BAIXO (backlog — polish e refinamento)
| # | Dimensão | Local | Problema | Solução |

---

### Score por Dimensão
| Dimensão | Score | Status |
|----------|-------|--------|
| D1 Ortografia & Copy | X/10 | ✅/⚠️/❌ |
| D2 Tipografia | X/10 | |
| D3 Hierarquia Visual | X/10 | |
| D4 Contraste & Cores | X/10 | |
| D5 Responsividade | X/10 | |
| D6 Animações & Performance | X/10 | |
| D7 Acessibilidade | X/10 | |
| D8 UX & Micro-interações | X/10 | |

---

### Plano de Ação Priorizado
1. [ ] **[Semana 1]** — [críticos + altos]
2. [ ] **[Semana 2]** — [médios]
3. [ ] **[Backlog]** — [baixos]
```

---

## Checklist Rápido (Quick Audit)

### Copy & Texto
- [ ] Sem lorem ipsum ou textos placeholder
- [ ] Ortografia e acentuação PT-BR corretas
- [ ] Tom consistente em toda a página
- [ ] CTAs com verbos de ação claros

### Visual
- [ ] H1 único por página
- [ ] Contraste mínimo 4.5:1 para texto normal
- [ ] Espaçamento consistente entre seções
- [ ] Máx 3 cores primárias + neutros

### Técnico
- [ ] `alt` em todas as imagens
- [ ] Formulários com labels
- [ ] Links com texto descritivo
- [ ] Mobile sem scroll horizontal
- [ ] Tap targets ≥ 44px no mobile
- [ ] `prefers-reduced-motion` implementado
- [ ] Sem `filter` em filhos de `preserve-3d`

### Performance
- [ ] Imagens em WebP/AVIF
- [ ] Lazy loading ativo
- [ ] Fontes com `font-display: swap`
- [ ] CSS crítico inline (above-the-fold)

---

## Padrões de Issues Comuns em Agências Digitais

### Issue: Texto branco sobre fundo branco (invisível)
```
Causa: Classe de cor de texto mantida de estado anterior do design
Fix: Checar todo .text-white em contextos com bg-white ou bg-light
```

### Issue: `filter` quebrando carrossel 3D em Chrome
```
Causa: filter em filho de preserve-3d força compositor a achatar o contexto 3D
Fix: Substituir filter:blur() por opacity no mesmo elemento
```

### Issue: Mobile menu sem animação de fechamento
```
Causa: Classe "hidden" aplicada imediatamente, sem transição de saída
Fix: Remover classe de animação primeiro, aguardar transição (setTimeout 360ms), então hidden
```

### Issue: `is-scrolled` header sem CSS respondendo
```
Causa: JS adiciona classe mas CSS não tem regra correspondente
Fix: Adicionar #site-header.is-scrolled { } com background e box-shadow
```

### Issue: Accordion snap-fechamento (sem animação de saída)
```
Causa: details.open removido antes de transição
Fix: GSAP/CSS para height:0 + opacity:0, depois removeAttribute('open')
```
