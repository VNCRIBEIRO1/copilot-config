---
name: canvas-banners
description: "Referências técnicas e templates para criação de banners via HTML5 Canvas 2D API. Inclui cheatsheet completo da API Canvas, psicologia das cores baseada em pesquisa, tamanhos oficiais de banners, tipografia e templates prontos. Especializado em banners de autoridade para campanhas políticas e sites institucionais. Use when: creating Canvas banners, image manipulation, pixel filters, animated banners, PNG export, promotional graphics, political campaign banners, authority-grade visual materials, santinhos, social media posts."
argument-hint: "Descreva o banner que precisa criar (tipo, segmento, plataforma, candidato/arquétipo)"
---

# Canvas Banners Skill

Skill técnica de nível avançado para criação de banners e peças gráficas via HTML5 Canvas 2D API. Contém referências baseadas em pesquisa real (MDN, HubSpot, Google Ads, Designmodo) e técnicas de nível profissional. Especializada em **design de autoridade** para campanhas políticas, sites institucionais e material eleitoral.

## ⚠️ Regra de Autoridade (OBRIGATÓRIA para Campanhas)

Antes de criar QUALQUER banner para campanha política:

1. **Identificar o arquétipo do candidato** (Militar, Conservador, Progressista, Evangélico, Agro, etc.)
2. **Consultar `color-psychology.md` → seção "Paletas para Campanhas Políticas"** — usar a paleta correspondente
3. **Aplicar fórmula 60-30-5-3-2** — NUNCA usar cores primárias saturadas como background
4. **Verificar WCAG** — todos os textos com contraste ≥ 4.5:1

| ❌ PROIBIDO em Banners Políticos | ✅ OBRIGATÓRIO |
|----------------------------------|----------------|
| Fundos coloridos planos (vermelho, azul, verde saturado) | Base escura + acento restrito |
| Múltiplas cores vibrantes competindo | UMA cor de acento + ouro/prata |
| Texto sobre foto sem overlay escuro | Overlay gradiente escuro antes do texto |
| Fontes cursivas ou playful | Montserrat/Inter Bold uppercase |
| Animações bouncy/spring | Transições precisas 300ms ease-out |

## Quando Usar

- Criar banners promocionais via Canvas 2D
- Aplicar filtros de imagem (sepia, grayscale, duotone, blur, sharpen, emboss, edge detect)
- Color grading avançado (color matrix, HSL, vintage, warm, cool)
- Escolher paleta de cores baseada em psicologia e segmento
- Definir tamanho correto para plataforma (Google Ads, Meta, LinkedIn, etc.)
- Criar banners animados com requestAnimationFrame
- Efeitos de texto (glow/neon, gradient, text on path, 3D, auto-fit)
- Texturas procedurais (noise, grain, patterns)
- Compositing avançado e image masking
- Acessibilidade visual (WCAG contrast checking)
- Exportar Canvas como PNG/JPEG com suporte HiDPI

## Capacidades Avançadas

| Técnica | Descrição |
|---------|-----------|
| Convolution Kernels | Blur, sharpen, emboss, edge detect via engine genérica |
| Color Matrix Transform | Filtros 5×4 universais (vintage, warm, cool, saturate) |
| HSL Manipulation | Hue shift, saturação, conversões RGB↔HSL |
| Noise / FBM | Texturas procedurais grain/noise com overlay compositing |
| WCAG Contrast | Cálculo automático de luminância, ratio, bestTextColor |
| Path2D | Formas reutilizáveis (star, hexagon, SVG paths) |
| OffscreenCanvas | Cache de elementos estáticos, Web Workers |
| Glow / Neon Text | Multi-layer shadow blur |
| Gradient Text | Linear gradients em fillStyle com measureText |
| Auto-Fit Font | Binary search para fontSize ideal |
| HiDPI / Retina | devicePixelRatio para exports nítidos |

## Estrutura

### Referências (`references/`)

| Arquivo | Conteúdo |
|---------|---------|
| [canvas-cheatsheet.md](./references/canvas-cheatsheet.md) | API Canvas 2D — 60+ métodos, convolution, color matrix, HSL, noise, WCAG, Path2D, OffscreenCanvas, performance |
| [color-psychology.md](./references/color-psychology.md) | Psicologia das cores + paletas por segmento + geração algorítmica + WCAG + blending + 60-30-10 |
| [banner-sizes.md](./references/banner-sizes.md) | Tamanhos oficiais Google Ads, Meta, LinkedIn, Pinterest, YouTube, WhatsApp, Email |
| [typography.md](./references/typography.md) | Fontes, text on arc/Bézier, glow/neon/3D/gradient text, auto-fit, kerning, font combos |

### Templates (`templates/`)

| Arquivo | Tipo | Descrição |
|---------|------|-----------|
| [banner-base.html](./templates/banner-base.html) | Base | Biblioteca completa: 25+ utilitários (drawRoundedRect, wrapText, convolution, colorMatrix, HSL, noise, WCAG, glow/gradient text, circular clip, autoFit, Path2D helpers) |
| [banner-product.html](./templates/banner-product.html) | Produto | Layout produto + headline + CTA com gradient overlay + noise + HiDPI |
| [banner-sale.html](./templates/banner-sale.html) | Promoção | Badge desconto + preço cortado + pulse + sparks + noise grain + HiDPI |
| [banner-animated.html](./templates/banner-animated.html) | Animado | rAF + fade/scale/particles + connections + gradient text + HiDPI |
| [banner-story.html](./templates/banner-story.html) | Story/Reels | Vertical 1080×1920 + gradient mesh + glow text + CTA animado + HiDPI |
| [banner-image-manipulation.html](./templates/banner-image-manipulation.html) | Filtros | Pipeline: load → filter → adjust → HSL → overlay → text → export (13 filtros + vignette + noise) |

## Workflow

### Workflow Geral (Comercial/Promocional)

1. **Ler o pedido** — identificar objetivo, segmento, plataforma
2. **Consultar `banner-sizes.md`** — escolher dimensão adequada
3. **Consultar `color-psychology.md`** — escolher paleta por segmento
4. **Consultar `typography.md`** — escolher fonte e efeitos de texto
5. **Usar template mais próximo** de `templates/`
6. **Consultar `canvas-cheatsheet.md`** para técnicas específicas
7. **Adaptar e entregar** HTML completo com botão "Baixar PNG"

### Workflow Campanha Política (Authority-Grade)

1. **Identificar arquétipo** — Militar? Conservador? Progressista? Evangélico? Agro?
2. **Consultar `color-psychology.md` → "Paletas para Campanhas Políticas"** — selecionar paleta exata
3. **Consultar `banner-sizes.md`** — dimensão por plataforma
4. **Aplicar overlay escuro** — toda foto/imagem do candidato recebe gradient overlay (rgba(0,0,0,0.6) → transparent)
5. **Texto authority** — Montserrat/Inter Bold, uppercase, letter-spacing: 0.05em, tamanho restrito
6. **Cores restritas** — máximo 3 cores: base escura + acento institucional + ouro/branco
7. **Elementos de prestígio** — linha dourada separadora, border sutil, ícones outline (não filled)
8. **Verificar WCAG** — todo texto ≥ 4.5:1 contra background
9. **Exportar HiDPI** — devicePixelRatio para nitidez
10. **Gerar multi-size** — mesmo banner em 3+ tamanhos com button "Baixar Todos"

## Regras Críticas

- **NUNCA usar `ctx.filter`** — não suportado no Safari. Usar `getImageData`/`putImageData`.
- **CORS**: `img.crossOrigin = "anonymous"` para imagens externas.
- **Export**: `canvas.toDataURL('image/png')` + link de download sempre.
- **HiDPI**: Sempre escalar canvas por `devicePixelRatio` e usar CSS para tamanho visual.
- **WCAG**: Verificar contraste texto/fundo ≥ 4.5:1 (AA) antes de entregar.
