# Brand Tokens — Referência Centralizada

Tokens de marca para todas as composições editoriais.
Usado pelo decision-engine e templates como fonte única de verdade.

## Cores de Marca

| Token | Valor | Uso |
|-------|-------|-----|
| `brand.primary` | `#0D0D0D` | Fundo base, overlay, texto principal |
| `brand.accent` | `#009C3B` | Badge campanha, accent line, destaque |
| `brand.gold` | `#FFCC00` | Accent premium, badge juventude, destaques formais |
| `brand.white` | `#FFFFFF` | Texto sobre escuro, badge text claro |
| `brand.muted` | `rgba(255,255,255,0.55)` | Metadados (data, autor), branding URL |

## Tipografia

### Fontes

| Token | Valor | Role |
|-------|-------|------|
| `font.heading` | `Montserrat` | Títulos — todas as composições |
| `font.body` | `Inter` | Subtítulos, metadados, corpo auxiliar |
| `font.fallback` | `system-ui, sans-serif` | Fallback se webfont falhar |

### Type Scale (Modular — ratio 1.25)

Base: 16px. Escala para canvas de 1200px de largura.
Escalar proporcionalmente para outros tamanhos.

| Step | Token | Size | Uso típico |
|------|-------|------|------------|
| -2 | `type.xs` | 10px | — (reservado) |
| -1 | `type.sm` | 13px | URL branding, copyright |
| 0 | `type.base` | 16px | Metadados (data, autor) |
| 1 | `type.md` | 20px | Subtítulo pequeno |
| 2 | `type.lg` | 25px | Subtítulo padrão |
| 3 | `type.xl` | 31px | Título compacto (> 80 chars) |
| 4 | `type.2xl` | 39px | Título padrão (41-80 chars) |
| 5 | `type.3xl` | 49px | Título display (≤ 40 chars) |
| 6 | `type.4xl` | 61px | Título hero (≤ 25 chars, story) |

### Pesos

| Token | Valor | Uso |
|-------|-------|-----|
| `weight.regular` | 400 | Inter — corpo, meta |
| `weight.medium` | 500 | Inter — subtítulo com destaque |
| `weight.semibold` | 600 | Montserrat — título leve (style leve) |
| `weight.bold` | 700 | Montserrat — título padrão |
| `weight.extrabold` | 800 | Montserrat — título impactante (denuncia, seguranca) |

### Line Height

| Token | Valor | Uso |
|-------|-------|-----|
| `leading.tight` | 1.15 | Títulos curtos, UPPERCASE |
| `leading.normal` | 1.25 | Títulos normais |
| `leading.relaxed` | 1.40 | Subtítulos, corpo |

### Letter Spacing

| Token | Valor | Uso |
|-------|-------|-----|
| `tracking.tight` | -0.01em | Títulos display grandes |
| `tracking.normal` | 0 | Padrão |
| `tracking.formal` | +0.02em | Temas formais (legislacao, economia) |
| `tracking.caps` | +0.04em | Textos UPPERCASE |

## Grid e Spacing

### Safe Zones (padding interno)

| Token | Valor | Aplicação |
|-------|-------|-----------|
| `space.safe` | 5% cada lado | Zona segura mínima — texto nunca encosta na borda |
| `space.safe-story` | 7% lateral, 12% top, 8% bottom | Story: perfil no top, swipe-up no bottom |
| `space.badge-x` | 32–60px do canto | Posição X do badge |
| `space.badge-y` | 32–60px do canto | Posição Y do badge |
| `space.accent-gap` | 12px | Distância entre accent line e título |

### Módulo de Spacing

Base: 8px. Usar múltiplos: 8, 16, 24, 32, 48, 64.

| Token | Valor | Uso |
|-------|-------|-----|
| `space.xs` | 8px | Padding interno badge, gap mínimo |
| `space.sm` | 16px | Gap entre metadados |
| `space.md` | 24px | Gap título → subtítulo |
| `space.lg` | 32px | Margem interna card, padding geral |
| `space.xl` | 48px | Separação título → metadados |
| `space.2xl` | 64px | Margem interna OG image |

## Border Radius

| Token | Valor | Uso |
|-------|-------|-----|
| `radius.none` | 0 | OG images, prints (bleed) |
| `radius.sm` | 8px | Thumbnails, cards menores |
| `radius.md` | 12px | Feed cards, posts padrão |
| `radius.lg` | 16px | Social cards, destaque |
| `radius.pill` | 100px | Badge pill shape |

## Sombras

| Token | Valor | Uso |
|-------|-------|-----|
| `shadow.none` | — | Padrão — maioria das composições |
| `shadow.card` | `0 2px 8px rgba(0,0,0,0.25)` | Shadow-box sutil para cards |
| `shadow.text` | `0 2px 4px rgba(0,0,0,0.5)` | Text-shadow single para legibilidade |
| `shadow.text-heavy` | 3 layers: `0 1px 3px`, `0 2px 8px`, `0 4px 16px` | Text-shadow multi-layer para fotos difíceis |
| `shadow.glass` | `inset 0 1px 0 rgba(255,255,255,0.08)` | Edge highlight para frosted glass panels |

## Logo e Branding Visual

| Regra | Especificação |
|-------|---------------|
| Logo max height | 60px |
| Logo opacity | 0.5–0.7 (nunca protagonista) |
| URL opacity | 0.3–0.4 |
| URL font size | `type.sm` (13px) |
| Accent line | 48×3px, cor do tema ou `brand.gold` |
| Accent line posição | Abaixo do título, gap `space.accent-gap` |

## Código — Objeto de Tokens

```javascript
const BRAND_TOKENS = {
  color: {
    primary:  '#0D0D0D',
    accent:   '#009C3B',
    gold:     '#FFCC00',
    white:    '#FFFFFF',
    muted:    'rgba(255,255,255,0.55)',
  },
  font: {
    heading:  'Montserrat',
    body:     'Inter',
    fallback: 'system-ui, sans-serif',
  },
  weight: { regular: 400, medium: 500, semibold: 600, bold: 700, extrabold: 800 },
  leading: { tight: 1.15, normal: 1.25, relaxed: 1.40 },
  tracking: { tight: '-0.01em', normal: '0', formal: '0.02em', caps: '0.04em' },
  radius: { none: 0, sm: 8, md: 12, lg: 16, pill: 100 },
  space: { xs: 8, sm: 16, md: 24, lg: 32, xl: 48, '2xl': 64 },
};
```
