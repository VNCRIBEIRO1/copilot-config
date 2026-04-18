---
name: photo-montage
description: "DEPRECATED — Substituída por editorial-composer. Mantida como arquivo. Especialista em manipulação de fotos e montagem com texto, molduras e frameworks para criação de banners e cards de artigos temáticos via Canvas 2D. Inclui composição multi-layer, text-over-photo com readability, frames decorativos, máscaras (circular, hexagonal, custom), article cards temáticos (notícia, legislação, campanha, evento), OG images, link preview cards, duotone, color grading, gradient overlays, glass panels. Use when: creating article cards, photo montage, text over photo, image frames, molduras, OG images, link preview cards, blog thumbnails, news cards, social media cards, photo composition, photo masking, duotone effect, gradient overlay text."
argument-hint: "DEPRECATED — usar editorial-composer"
---

> **DEPRECATED**: Esta skill foi substituída por `editorial-composer`, que tem sistema de decisão
> estruturado, playbooks por tema, contrato JSON rígido, fallbacks e stress tests.
> Mantida como arquivo para referência histórica. **Não usar para novas composições.**

# Photo Montage Skill (Archived)

Skill especialista em **composição fotográfica e montagem** para criação de banners e cards temáticos. Foco em workflows de alto nível que combinam fotos, texto, molduras e efeitos em peças prontas para publicação.

> **Diferença das outras skills:**
> - `canvas-banners` → API Canvas 2D de baixo nível (filtros, kernels, métodos)
> - `image-marketing` → Prompts de IA de imagem, briefings de marketing
> - `photo-montage` → **Composição de alto nível**: foto + texto + moldura + tema = peça final

## Regra de Autoridade (Campanhas Políticas)

Para cards de campanha: consultar `canvas-banners` → `color-psychology.md` para paleta do arquétipo.
Aplicar overlay escuro (rgba(0,0,0,0.55–0.7)), texto Montserrat Bold uppercase, máximo 3 cores.

## Quando Usar

- Criar **article cards** com thumbnail + título + categoria + data
- Gerar **OG images** (Open Graph) para link previews em redes sociais
- Montar **foto + texto** com readability garantida (overlay, glass panel, text shadow)
- Aplicar **molduras decorativas** (frames, borders, glass, ornamental)
- Criar **máscaras de recorte** (circular, hexagonal, rounded rect, custom SVG path)
- Compor **montagens multi-layer** (background + foto + overlay + texto + badge)
- Gerar **cards temáticos** variando visual pelo tema do artigo
- **Duotone**, color grading e tratamento de foto antes da composição
- **Social media cards** em tamanhos corretos por plataforma

## Capacidades

| Técnica | Descrição |
|---------|-----------|
| Multi-Layer Composition | Pipeline: bg → foto → overlay → text → badge → frame → export |
| Text-Over-Photo | 6 técnicas de readability (gradient overlay, frosted glass, text shadow, backdrop, pill, scrim) |
| Frames & Molduras | 8 tipos: rounded, circle, ornamental, glass, shadow-box, double-border, torn-edge, polaroid |
| Photo Masking | clip() com shapes: circle, hexagon, rounded-rect, star, custom Path2D |
| Article Cards | Layouts por tipo de conteúdo com badges temáticos |
| OG Image Generator | 1200×630 template com safe zones, fonte auto-fit, branding |
| Duotone & Color Grading | Mapear shadows/highlights para 2 cores, LUT-style grading |
| Responsive Multi-Size | Gerar mesma composição em 3+ tamanhos (feed, story, OG) |

## Estrutura

### Referências (`references/`)

| Arquivo | Conteúdo |
|---------|----------|
| [compositing-recipes.md](./references/compositing-recipes.md) | 12 receitas de composição: montage, masking, blending, duotone, vignette, double exposure |
| [text-over-photo.md](./references/text-over-photo.md) | 6 técnicas de texto legível sobre foto + código Canvas para cada |
| [frames-borders.md](./references/frames-borders.md) | 8 tipos de moldura + código Canvas + quando usar cada |
| [article-cards.md](./references/article-cards.md) | Layouts de cards por tipo de artigo + sistema de badges + paleta temática |
| [social-media-sizes.md](./references/social-media-sizes.md) | Tamanhos 2026 para 9 plataformas: OG, feed, story, thumbnail, cover |

### Templates (`templates/`)

| Arquivo | Tipo | Descrição |
|---------|------|-----------|
| [card-article.html](./templates/card-article.html) | Article Card | Foto + gradient overlay + badge + título + data + autor |
| [card-og-image.html](./templates/card-og-image.html) | OG Image | 1200×630 com safe zones, logo, título auto-fit, gradient scrim |

## Workflow Principal

### 1. Análise do Pedido

```
Identificar: tipo (card, banner, OG), tema, foto base, textos, plataforma-alvo
```

### 2. Escolher Dimensão

Consultar `social-media-sizes.md` para dimensão correta por plataforma.

| Output Comum | Dimensão | Uso |
|-------------|----------|-----|
| OG Image | 1200 × 630 | Link preview (Facebook, LinkedIn, Twitter, WhatsApp) |
| Instagram Feed | 1080 × 1080 ou 1080 × 1350 | Post quadrado ou vertical |
| Instagram Story | 1080 × 1920 | Story/Reels |
| YouTube Thumbnail | 1280 × 720 | Vídeo thumbnail |
| Blog Card | 800 × 420 | Thumbnail interno do site |
| Pinterest | 1000 × 1500 | Pin vertical |

### 3. Pipeline de Composição (Multi-Layer)

```
Layer 0: Background (cor sólida ou gradient)
Layer 1: Foto base (drawImage com crop/scale/mask)
Layer 2: Overlay de readability (gradient, scrim, frosted)
Layer 3: Texto principal (título, subtítulo)
Layer 4: Badges e metadados (categoria, data, autor)
Layer 5: Frame/moldura (se aplicável)
Layer 6: Branding (logo, URL)
Export: PNG HiDPI com botão download
```

### 4. Técnica de Text-Over-Photo

Consultar `text-over-photo.md`. Regra principal:

| Situação | Técnica Recomendada |
|----------|-------------------|
| Foto clara/variada | Gradient scrim (preto → transparent) na base |
| Foto escura uniforme | Texto branco direto + text-shadow sutil |
| Card formal/institucional | Frosted glass panel (backdrop-blur simulado) |
| Card rápido/news | Pill/badge colorido atrás do texto |
| Headline grande | Multi-layer shadow (3+ camadas de shadowBlur) |
| Subtítulo sobre foto | Semi-transparent backdrop strip |

### 5. Escolher Frame (se solicitado)

Consultar `frames-borders.md`. Regra:

| Contexto | Frame Recomendado |
|----------|------------------|
| Campanha política | Glass frame (border rgba(255,255,255,0.1) + shadow) |
| Artigo de notícia | Nenhum ou shadow-box sutil |
| Galeria/portfolio | Polaroid ou double-border |
| Perfil/avatar | Circular com ring colorido |
| Redes sociais | Rounded corners (12–16px radius) |

### 6. Aplicar Card Temático

Consultar `article-cards.md` para visual por tipo de artigo:

| Tema do Artigo | Cor do Badge | Ícone | Overlay Style |
|---------------|-------------|-------|---------------|
| Legislação/Lei | Dourado `#D4AF37` | ⚖️ | Gradient escuro formal |
| Saúde | Verde `#16A34A` | 🏥 | Gradient suave |
| Segurança | Vermelho `#DC2626` | 🛡️ | Gradient pesado |
| Educação | Azul `#2563EB` | 📚 | Gradient médio |
| Infraestrutura | Laranja `#EA580C` | 🏗️ | Gradient médio |
| Campanha/Evento | Acento do candidato | 📢 | Glass panel |
| Denúncia | Vermelho escuro `#991B1B` | ⚠️ | Heavy dark overlay |

### 7. Exportar

```javascript
// HiDPI export
const dpr = window.devicePixelRatio || 2;
canvas.width = targetWidth * dpr;
canvas.height = targetHeight * dpr;
ctx.scale(dpr, dpr);
// ... draw all layers ...
// Download
const link = document.createElement('a');
link.download = 'card-artigo.png';
link.href = canvas.toDataURL('image/png');
link.click();
```

## Regras Críticas

- **CORS**: Sempre `img.crossOrigin = "anonymous"` para fotos externas
- **Readability**: NUNCA colocar texto sobre foto sem overlay/shadow — mínimo WCAG AA (4.5:1)
- **Font Loading**: Carregar fontes via `FontFace` API ANTES de `drawImage` do texto
- **Safe Zones**: OG images devem manter texto dentro de 80% central (plataformas cortam bordas)
- **HiDPI**: Sempre escalar canvas por `devicePixelRatio` (mínimo 2x)
- **Safari**: NÃO usar `ctx.filter` — usar manipulação de pixel manual
- **Aspect Ratio**: Manter proporção original da foto ao redimensionar (`objectFit: cover` via math)
