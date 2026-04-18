---
name: editorial-composer
description: "Composição visual editorial para artigos: gera article cards, OG images, blog thumbnails e social cards a partir de foto + título + tema. Sistema de decisão com playbooks por tipo de conteúdo (jurídico, saúde, segurança, educação, infraestrutura, campanha), checklist de qualidade, contraste WCAG AA, safe zones, hierarquia tipográfica, molduras temáticas, Canvas 2D. Use when: creating article cards, OG images, blog thumbnails, social media cards, link preview images, editorial banners, news cards, campaign cards, card de artigo, imagem de capa, thumbnail de blog, banner editorial, social card."
argument-hint: "Tipo (card, OG, story) + tema + título + foto. Ex: 'OG image de artigo de saúde com título X e foto Y'"
---

# Editorial Composer

Gera peças visuais editoriais (article cards, OG images, social cards) a partir de um artigo.
Combina foto, tipografia, moldura e estilo temático em composições prontas para publicação.
**Foco em decisões reproduzíveis, não inspiração visual.**

> **Diferença das outras skills:**
>
> | Skill | Foco |
> |---|---|
> | `canvas-banners` | API Canvas 2D de baixo nível (filtros, kernels, pixel manipulation) |
> | `image-marketing` | Prompts de IA generativa, briefings de design, Photoshop JSX |
> | `editorial-composer` | **Sistema de decisão**: entrada (artigo) → decisões visuais → saída (peça pronta) |

## Contrato de Entrada / Saída

### Entradas Obrigatórias

| Campo | Tipo | Exemplo |
|-------|------|---------|
| `title` | string (≤120 chars) | "Novo projeto de lei beneficia comunidade" |
| `theme` | enum (14 valores) | `saude`, `legislacao`, `seguranca`, `educacao`, `infraestrutura`, `campanha`, `denuncia`, `evento`, `cultura`, `esporte`, `juventude`, `animal`, `meioambiente`, `economia` |
| `photoUrl` | URL (CORS-safe) | `https://images.unsplash.com/...` |
| `outputType` | enum | `og`, `card`, `story`, `feed-square`, `feed-vertical`, `thumbnail`, `pinterest` |

### Entradas Opcionais

| Campo | Tipo | Default |
|-------|------|---------|
| `subtitle` | string | `""` |
| `date` | string | `""` |
| `author` | string | `""` |
| `siteName` | string | `""` |
| `siteUrl` | string | `""` |
| `accent` | hex color | Definido pelo tema |
| `layout` | enum | Auto (decidido pelo playbook) |
| `frame` | enum | Auto (decidido pelo playbook) |

### Saídas

| Artefato | Formato | Descrição |
|----------|---------|-----------|
| Composição visual | Canvas 2D renderizado | 7 layers: bg → foto → overlay → badge → título → meta → branding |
| **Decisões (JSON)** | Objeto estruturado | Schema rígido documentado abaixo |
| Hierarquia tipográfica | Especificação | Fontes, tamanhos, pesos, cores para cada elemento |
| Validação de qualidade | Checklist pass/fail | 15 critérios de `checks/quality-checklist.md` |
| PNG exportável | Arquivo | HiDPI (2x), dimensão exata da plataforma-alvo |

### Schema de Saída — Contrato Rígido

Toda composição DEVE produzir este JSON de decisões. Campos sem valor usam `null`.

```json
{
  "layout_family": "standard | split | magazine | story | tall | centered | minimal",
  "dimensions": { "w": 1200, "h": 630, "dpr": 2 },
  "crop_strategy": {
    "method": "coverFit | contain | solidBg",
    "focus": "center | face | top-third",
    "reason": "string — regra que justifica"
  },
  "overlay": {
    "type": "gradient-scrim | dark-uniform | frosted-panel | half-scrim | none",
    "opacity": 0.65,
    "direction": "bottom | top | left | right | uniform"
  },
  "typography": {
    "title_font": "Montserrat",
    "title_weight": 700,
    "title_size_px": 44,
    "title_case": "sentence | title | upper",
    "title_lines": 2,
    "subtitle_size_px": 18,
    "meta_size_px": 14,
    "meta_opacity": 0.55
  },
  "frame_style": "none | shadow-box | glass | rounded-12 | rounded-16 | double-border | circular-ring",
  "theme_tokens": {
    "theme": "saude",
    "badge_bg": "#16A34A",
    "badge_text": "#FFF",
    "badge_label": "SAUDE",
    "style_group": "padrao",
    "accent_color": "#16A34A",
    "overlay_default": 0.60
  },
  "warnings": [
    "title_long: 87 chars, switched to split layout",
    "photo_busy: increased overlay to 0.75"
  ],
  "export_sizes": [
    { "label": "og", "w": 1200, "h": 630 },
    { "label": "og@2x", "w": 2400, "h": 1260 }
  ]
}
```

> O campo `warnings` documenta decisões de fallback — quando o engine ajustou
> algo automaticamente por causa de input degradado. Array vazio se tudo normal.

## Escopo

### Quando Usar

- Article cards com thumbnail + título + badge temático + metadados
- OG images (Open Graph) para link preview em redes sociais e WhatsApp
- Social media cards (Instagram feed/story, Twitter/X, LinkedIn, Pinterest)
- Blog thumbnails e imagens de destaque
- Cards temáticos por categoria de artigo (14 temas)
- Banners editoriais para conteúdo de campanha política

### Quando NÃO Usar

- Identidade visual / branding (logos, paletas, brand guidelines)
- Anúncios de performance (Google Ads, Meta Ads — usar `image-marketing`)
- Peças institucionais complexas (relatórios, apresentações, decks)
- Collages artísticas multi-foto, moodboards, scrapbooks
- Edição fotográfica pesada (retoque, remoção de fundo, restauração)
- Manipulação de pixel de baixo nível (filtros, kernels — usar `canvas-banners`)
- Montagens de vídeo ou animações

## Estrutura

| Camada | Arquivo | O que contém |
|--------|---------|-------------|
| **Pesquisa** | [research/benchmarks.md](./research/benchmarks.md) | Padrões observados em referências reais, fontes citadas, lições |
| **Playbook** | [playbooks/decision-engine.md](./playbooks/decision-engine.md) | Regras SE/ENTÃO para layout, overlay, frame, tipografia, badge, **fallbacks** |
| **Playbook** | [playbooks/theme-system.md](./playbooks/theme-system.md) | Paleta, overlay, tipografia e frame por tema — consistência |
| **Referência** | [references/core-recipes.md](./references/core-recipes.md) | Funções Canvas 2D essenciais: loadImage, coverFit, wrapText, scrim, drawArticleCard |
| **Referência** | [references/sizes.md](./references/sizes.md) | Dimensões 2026 para 9 plataformas + safe zones |
| **Referência** | [references/brand-tokens.md](./references/brand-tokens.md) | Tokens de marca: fontes, type scale, grid, border-radius, sombras, cores |
| **Validação** | [checks/quality-checklist.md](./checks/quality-checklist.md) | Definition of Done: 15 critérios objetivos pass/fail |
| **Validação** | [checks/stress-tests.md](./checks/stress-tests.md) | Edge cases: inputs degradados, limites tipográficos, colisões visuais |
| **Exemplo** | [examples/input-output.md](./examples/input-output.md) | 5 exemplos completos: input → decisões → composição → checklist |
| **Template** | [templates/card-article.html](./templates/card-article.html) | Article card interativo com controles + download |
| **Template** | [templates/card-og-image.html](./templates/card-og-image.html) | OG image 1200×630 com 3 estilos visuais |

> Para técnicas avançadas (duotone, double exposure, convolution, pixel manipulation),
> consultar a skill `canvas-banners`.

## Workflow de Decisão

```
ENTRADA: título + tema + foto + outputType
  │
  ├─→ [1] DIMENSÃO ← sizes.md
  │     outputType → (largura, altura, safeZone)
  │
  ├─→ [2] LAYOUT ← decision-engine.md §Layout
  │     IF título > 80 chars → split (texto separado da foto)
  │     IF foto indisponível → split com fundo sólido
  │     IF headline curto + foto forte → standard (foto full + overlay)
  │     IF formal/institucional → magazine (frosted glass panel)
  │
  ├─→ [3] OVERLAY ← decision-engine.md §Overlay
  │     IF foto clara/variada → gradient scrim 0.65-0.75
  │     IF foto escura uniforme → scrim leve 0.3 + text-shadow
  │     IF tema denúncia → dark heavy 0.75
  │     IF formal → frosted glass panel
  │
  ├─→ [4] TIPOGRAFIA ← decision-engine.md §Typography
  │     Tamanho = f(largura, comprimento do título)
  │     Max 2 famílias: Montserrat 700 (título) + Inter 400 (corpo)
  │     IF título ≤ 40 chars + tema impactante → UPPERCASE
  │
  ├─→ [5] BADGE ← theme-system.md
  │     tema → { cor, label, overlayIntensity }
  │
  ├─→ [6] FRAME ← decision-engine.md §Frame
  │     IF card formal → glass frame
  │     IF social media → rounded 12-16px
  │     IF artigo genérico → nenhum ou shadow-box sutil
  │     REGRA: moldura NUNCA compete com título
  │
  ├─→ [7] COMPOSIÇÃO ← core-recipes.md
  │     L0: fundo sólido (#0D0D0D)
  │     L1: foto (coverFit)
  │     L2: overlay (técnica do passo 3)
  │     L3: badge temático (pill, canto sup-esq)
  │     L4: título (hierarquia do passo 4)
  │     L5: metadados (data • autor, opacity 0.6)
  │     L6: branding (URL, accent line)
  │
  └─→ [8] VALIDAÇÃO ← quality-checklist.md
        ☐ Contraste WCAG AA (≥ 4.5:1)
        ☐ Título legível a 400px de largura
        ☐ Texto dentro da safe zone
        ☐ Sem rostos cortados
        ☐ Max 2 famílias tipográficas
        ☐ Dimensão exata da plataforma
        → SAÍDA: PNG HiDPI (2x) + decisões documentadas
```

## Regras Universais

Aplicam-se a TODA composição, sem exceção:

| # | Regra | Detalhe |
|---|-------|---------|
| 1 | **Contraste WCAG AA** | ≥ 4.5:1 para texto ≤24px, ≥ 3:1 para texto >24px bold |
| 2 | **CORS antes de src** | `img.crossOrigin = 'anonymous'` ANTES de `img.src = url` |
| 3 | **HiDPI obrigatório** | Canvas = dimensão × `devicePixelRatio` (mín. 2x) |
| 4 | **Fontes carregadas** | `FontFace` API + `document.fonts.ready` ANTES de desenhar texto |
| 5 | **Safe zone** | Texto nunca encosta na borda — mín. 5% padding cada lado |
| 6 | **Faces preservadas** | Rostos na foto não podem ser cortados por badge, texto ou crop |
| 7 | **Max 2 fontes** | Título (Montserrat) + corpo (Inter). Nunca 3+ |
| 8 | **Moldura ≤ título** | Frame nunca compete com título — se título é grande, frame é sutil/ausente |
| 9 | **Aspect ratio** | Foto SEMPRE via coverFit — nunca distorcer |
| 10 | **Sem ctx.filter** | Safari não suporta — usar pixel manipulation manual (canvas-banners) |
| 11 | **Dimensão exata** | Saída no tamanho exato da plataforma-alvo (sizes.md) |
| 12 | **Overlay sempre preto** | Cor do tema aparece no badge/accent, NUNCA no overlay |
