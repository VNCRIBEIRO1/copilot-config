# Article Cards — Layouts Temáticos

Layouts de cards para artigos/notícias. Cada tipo de conteúdo tem visual próprio baseado no tema.

## Layout Padrão (Article Card)

```
┌─────────────────────────────────┐
│  [FOTO — cover fit]             │  ← 60% da altura
│                                 │
│  ┌─[BADGE]─┐                   │  ← Pill badge no canto
│  └─────────┘                   │
│▓▓▓▓▓▓▓▓▓▓▓▓▓▓ gradient scrim ▓│
│  TÍTULO DO ARTIGO               │  ← Texto sobre gradient
│  12 Jun 2026 • Autor            │  ← Metadados
└─────────────────────────────────┘
```

### Variações de Layout

| Layout | Estrutura | Uso |
|--------|-----------|-----|
| **Standard** | Foto full + gradient + texto embaixo | Blog, notícias gerais |
| **Split** | Foto metade esquerda + texto metade direita | Artigo destaque, feature |
| **Minimal** | Foto full + apenas título centrado | Hero, impacto visual |
| **Card** | Foto topo + fundo branco com texto | Fundo claro, cards em grid |
| **Magazine** | Foto full + frosted glass panel | Editorial, destaque premium |
| **Story** | Vertical 9:16 + foto full + texto + CTA | Instagram Story, mobile |

## Sistema de Badges por Tema

Cada tema de artigo recebe badge com cor e ícone próprios.

```javascript
const THEME_BADGES = {
  legislacao: {
    label: 'LEGISLAÇÃO',
    bgColor: '#D4AF37',
    textColor: '#000000',
    icon: '⚖️',
    overlayIntensity: 0.7,
  },
  saude: {
    label: 'SAÚDE',
    bgColor: '#16A34A',
    textColor: '#FFFFFF',
    icon: '🏥',
    overlayIntensity: 0.6,
  },
  seguranca: {
    label: 'SEGURANÇA',
    bgColor: '#DC2626',
    textColor: '#FFFFFF',
    icon: '🛡️',
    overlayIntensity: 0.7,
  },
  educacao: {
    label: 'EDUCAÇÃO',
    bgColor: '#2563EB',
    textColor: '#FFFFFF',
    icon: '📚',
    overlayIntensity: 0.6,
  },
  infraestrutura: {
    label: 'INFRAESTRUTURA',
    bgColor: '#EA580C',
    textColor: '#FFFFFF',
    icon: '🏗️',
    overlayIntensity: 0.6,
  },
  meioambiente: {
    label: 'MEIO AMBIENTE',
    bgColor: '#059669',
    textColor: '#FFFFFF',
    icon: '🌿',
    overlayIntensity: 0.55,
  },
  economia: {
    label: 'ECONOMIA',
    bgColor: '#7C3AED',
    textColor: '#FFFFFF',
    icon: '📊',
    overlayIntensity: 0.6,
  },
  campanha: {
    label: 'CAMPANHA',
    bgColor: '#009C3B', // Acento da campanha Spinelli
    textColor: '#FFFFFF',
    icon: '📢',
    overlayIntensity: 0.6,
  },
  denuncia: {
    label: 'DENÚNCIA',
    bgColor: '#991B1B',
    textColor: '#FFFFFF',
    icon: '⚠️',
    overlayIntensity: 0.75,
  },
  evento: {
    label: 'EVENTO',
    bgColor: '#0891B2',
    textColor: '#FFFFFF',
    icon: '📅',
    overlayIntensity: 0.55,
  },
  cultura: {
    label: 'CULTURA',
    bgColor: '#A855F7',
    textColor: '#FFFFFF',
    icon: '🎭',
    overlayIntensity: 0.55,
  },
  esporte: {
    label: 'ESPORTE',
    bgColor: '#F59E0B',
    textColor: '#000000',
    icon: '⚽',
    overlayIntensity: 0.55,
  },
  juventude: {
    label: 'JUVENTUDE',
    bgColor: '#FFCC00', // Ouro campanha
    textColor: '#000000',
    icon: '🎓',
    overlayIntensity: 0.55,
  },
  animal: {
    label: 'CAUSA ANIMAL',
    bgColor: '#22C55E',
    textColor: '#000000',
    icon: '🐾',
    overlayIntensity: 0.6,
  },
};
```

## Composição Completa: drawArticleCard()

```javascript
async function drawArticleCard(ctx, w, h, config) {
  const {
    photoUrl,
    title,
    theme = 'campanha',
    date = '',
    author = '',
    siteLogo = null,
    siteUrl = '',
  } = config;
  
  const badge = THEME_BADGES[theme] || THEME_BADGES.campanha;
  const padding = 32;
  
  // === Layer 0: Background ===
  ctx.fillStyle = '#0D0D0D';
  ctx.fillRect(0, 0, w, h);
  
  // === Layer 1: Foto (cover fit) ===
  const img = await loadImage(photoUrl);
  const fit = coverFit(img, w, h);
  ctx.drawImage(img, fit.sx, fit.sy, fit.sw, fit.sh, 0, 0, w, h);
  
  // === Layer 2: Gradient scrim ===
  const grad = ctx.createLinearGradient(0, h * 0.3, 0, h);
  grad.addColorStop(0, 'rgba(0,0,0,0)');
  grad.addColorStop(0.4, `rgba(0,0,0,${badge.overlayIntensity * 0.4})`);
  grad.addColorStop(1, `rgba(0,0,0,${badge.overlayIntensity})`);
  ctx.fillStyle = grad;
  ctx.fillRect(0, 0, w, h);
  
  // === Layer 3: Badge temático ===
  drawPillBadge(ctx, badge.label, padding, padding, {
    bgColor: badge.bgColor,
    textColor: badge.textColor,
    font: '700 12px "Montserrat", system-ui',
  });
  
  // === Layer 4: Título ===
  ctx.fillStyle = '#FFFFFF';
  ctx.font = '700 28px "Montserrat", system-ui';
  ctx.textAlign = 'left';
  ctx.textBaseline = 'bottom';
  
  const maxTitleW = w - padding * 2;
  const titleY = h - 60;
  wrapText(ctx, title, padding, titleY - 30, maxTitleW, 34);
  
  // === Layer 5: Metadados ===
  ctx.fillStyle = 'rgba(255, 255, 255, 0.6)';
  ctx.font = '400 14px "Inter", system-ui';
  ctx.textBaseline = 'bottom';
  
  let metaText = '';
  if (date) metaText += date;
  if (author) metaText += (metaText ? ' • ' : '') + author;
  if (metaText) {
    ctx.fillText(metaText, padding, h - padding);
  }
  
  // === Layer 6: Accent line ===
  ctx.fillStyle = badge.bgColor;
  ctx.fillRect(padding, h - padding - 22, 40, 3);
  
  // === Layer 7: Site branding (optional) ===
  if (siteUrl) {
    ctx.fillStyle = 'rgba(255, 255, 255, 0.4)';
    ctx.font = '400 11px "Inter", system-ui';
    ctx.textAlign = 'right';
    ctx.fillText(siteUrl, w - padding, h - padding);
  }
}
```

## Composição: drawOGImage()

OG Image otimizada para link preview. 1200×630 com safe zones.

```javascript
async function drawOGImage(ctx, config) {
  const W = 1200, H = 630;
  const {
    photoUrl,
    title,
    theme = 'campanha',
    siteName = '',
    siteLogoUrl = null,
  } = config;
  
  const badge = THEME_BADGES[theme] || THEME_BADGES.campanha;
  const pad = 48;
  
  // Background
  ctx.fillStyle = '#0D0D0D';
  ctx.fillRect(0, 0, W, H);
  
  // Foto
  if (photoUrl) {
    const img = await loadImage(photoUrl);
    const fit = coverFit(img, W, H);
    ctx.drawImage(img, fit.sx, fit.sy, fit.sw, fit.sh, 0, 0, W, H);
  }
  
  // Gradient overlay
  const grad = ctx.createLinearGradient(0, 0, W * 0.6, 0);
  grad.addColorStop(0, `rgba(0,0,0,0.85)`);
  grad.addColorStop(0.6, `rgba(0,0,0,0.6)`);
  grad.addColorStop(1, 'rgba(0,0,0,0.3)');
  ctx.fillStyle = grad;
  ctx.fillRect(0, 0, W, H);
  
  // Bottom gradient extra
  const grad2 = ctx.createLinearGradient(0, H * 0.6, 0, H);
  grad2.addColorStop(0, 'rgba(0,0,0,0)');
  grad2.addColorStop(1, 'rgba(0,0,0,0.4)');
  ctx.fillStyle = grad2;
  ctx.fillRect(0, 0, W, H);
  
  // Badge
  drawPillBadge(ctx, badge.label, pad, pad, {
    bgColor: badge.bgColor,
    textColor: badge.textColor,
    font: '700 14px "Montserrat", system-ui',
  });
  
  // Título (auto-fit)
  ctx.fillStyle = '#FFFFFF';
  const maxTitleW = W * 0.6; // Safe zone: 60% da largura
  const fontSize = autoFitFontSize(ctx, title, maxTitleW, '"Montserrat", system-ui', 24, 48, '700');
  ctx.font = `700 ${fontSize}px "Montserrat", system-ui`;
  ctx.textAlign = 'left';
  ctx.textBaseline = 'top';
  wrapText(ctx, title, pad, H * 0.35, maxTitleW, fontSize * 1.3);
  
  // Accent line
  ctx.fillStyle = badge.bgColor;
  ctx.fillRect(pad, H - pad - 40, 56, 4);
  
  // Site name
  if (siteName) {
    ctx.fillStyle = 'rgba(255, 255, 255, 0.7)';
    ctx.font = '600 16px "Montserrat", system-ui';
    ctx.textAlign = 'left';
    ctx.textBaseline = 'bottom';
    ctx.fillText(siteName.toUpperCase(), pad, H - pad);
  }
}
```

## Dimensões por Tipo de Card

| Tipo | Largura | Altura | Aspect Ratio | Uso |
|------|---------|--------|-------------|-----|
| OG Image | 1200 | 630 | 1.91:1 | Facebook, LinkedIn, Twitter, WhatsApp |
| Blog Card Large | 800 | 420 | 1.91:1 | Interno do site, thumbnail destaque |
| Blog Card Medium | 600 | 315 | 1.91:1 | Card em grid 2-col |
| Blog Card Small | 400 | 210 | 1.91:1 | Card em grid 3-col |
| Instagram Square | 1080 | 1080 | 1:1 | Feed quadrado |
| Instagram Vertical | 1080 | 1350 | 4:5 | Feed vertical |
| Instagram Story | 1080 | 1920 | 9:16 | Story/Reels |
| YouTube Thumbnail | 1280 | 720 | 16:9 | Thumbnail de vídeo |
| Pinterest Pin | 1000 | 1500 | 2:3 | Pin vertical |
| Twitter Card | 1200 | 630 | 1.91:1 | Card com link |
| WhatsApp Link | 1200 | 630 | 1.91:1 | Preview de link |
