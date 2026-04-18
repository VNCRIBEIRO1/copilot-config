# Tipografia para Canvas — Guia Completo

## Fontes System-Safe (sem carregamento)

Fontes disponíveis em todos os OS sem necessidade de download:

| Fonte | Estilo | Uso Ideal |
|-------|--------|-----------|
| `Arial, Helvetica` | Sans-serif clean | Universal, headlines curtas |
| `Verdana, Geneva` | Sans-serif wide | Corpo, legibilidade mobile |
| `Georgia, 'Times New Roman'` | Serif clássica | Editorial, elegante, luxo |
| `Impact, 'Arial Black'` | Bold/heavy | Headlines impactantes, promoção |
| `'Courier New', monospace` | Monospace | Código, tech, preço |
| `'Trebuchet MS'` | Sans-serif moderna | Web, tech, moderno |
| `system-ui` | Nativa do OS | Aparência nativa |
| `'Segoe UI'` | Windows nativa | Interface, clean |

### Stacks Recomendadas

```javascript
// Moderno/clean
ctx.font = '700 48px system-ui, -apple-system, "Segoe UI", sans-serif';

// Editorial/luxo
ctx.font = '400 36px Georgia, "Times New Roman", serif';

// Impacto/promo
ctx.font = '900 64px Impact, "Arial Black", sans-serif';

// Corpo
ctx.font = '400 16px Verdana, Geneva, sans-serif';
```

## Google Fonts no Canvas (FontFace API)

Para usar fontes customizadas no Canvas, carregar via FontFace API antes de desenhar:

```javascript
async function loadFont(name, url, weight = '400') {
  const font = new FontFace(name, `url(${url})`, { weight });
  await font.load();
  document.fonts.add(font);
}

// Uso
await loadFont('Inter', 'https://fonts.gstatic.com/s/inter/v13/UcCO3FwrK3iLTeHuS_fvQtMwCp50KnMw2boKoduKmMEVuLyfAZ9hiA.woff2', '400');
await loadFont('Inter', 'https://fonts.gstatic.com/s/inter/v13/UcCO3FwrK3iLTeHuS_fvQtMwCp50KnMw2boKoduKmMEVuFuYAZ9hiA.woff2', '700');
ctx.font = '700 48px "Inter"';
```

### Google Fonts Populares por Estilo

| Fonte | Estilo | Peso Recomendado | Uso |
|-------|--------|-----------------|-----|
| Inter | Sans-serif moderna | 400, 700, 900 | Universal, tech, SaaS |
| Poppins | Sans-serif rounded | 400, 600, 700 | Amigável, moderno |
| Montserrat | Sans-serif geométrica | 400, 700, 900 | Headlines, elegante |
| Roboto | Sans-serif neutra | 400, 500, 700 | Android, Google-style |
| Playfair Display | Serif display | 400, 700 | Luxo, editorial, sofisticado |
| Lora | Serif text | 400, 700 | Corpo, editorial |
| Oswald | Sans-serif condensed | 400, 700 | Headlines, esportes |
| Raleway | Sans-serif thin | 200, 400, 700 | Luxo, minimalista |
| Bebas Neue | Sans-serif caps | 400 | Headlines BOLD, impacto |
| Dancing Script | Handwriting | 400, 700 | Feminino, convites |

## Tamanhos Ideais por Dimensão

### Banners Grandes (1200×628, 1080×1080, 1920×600)

| Elemento | Tamanho (px) | Peso | Exemplo |
|----------|-------------|------|---------|
| Headline | 48–72 | 800–900 | `'900 64px Inter'` |
| Subtitle | 24–36 | 400 | `'400 28px Inter'` |
| CTA text | 20–28 | 700 | `'700 24px Inter'` |
| Body | 16–20 | 400 | `'400 18px Inter'` |
| Badge/label | 14–18 | 700 | `'700 16px Inter'` |

### Banners Médios (300×250, 336×280, 300×600)

| Elemento | Tamanho (px) | Peso | Exemplo |
|----------|-------------|------|---------|
| Headline | 24–36 | 700–900 | `'800 28px Inter'` |
| Subtitle | 14–18 | 400 | `'400 16px Inter'` |
| CTA text | 14–18 | 700 | `'700 16px Inter'` |
| Body | 12–14 | 400 | `'400 13px Inter'` |

### Banners Pequenos (728×90, 468×60, 300×50)

| Elemento | Tamanho (px) | Peso | Exemplo |
|----------|-------------|------|---------|
| Headline | 18–28 | 700 | `'700 22px Inter'` |
| CTA text | 12–16 | 700 | `'700 14px Inter'` |
| Body | 11–14 | 400 | `'400 12px Inter'` |

### Stories/Vertical (1080×1920)

| Elemento | Tamanho (px) | Peso |
|----------|-------------|------|
| Headline | 56–80 | 900 |
| Subtitle | 28–40 | 400 |
| CTA text | 24–32 | 700 |

## Pesos Padrão

| Elemento | Peso | CSS |
|----------|------|-----|
| Headline | Extra Bold / Black | `800` ou `900` |
| Subtitle | Regular | `400` |
| CTA | Bold | `700` |
| Body | Regular | `400` |
| Caption | Light / Regular | `300` ou `400` |

## Line Height (espaçamento vertical)

| Elemento | Multiplicador | Exemplo |
|----------|-------------|---------|
| Headline | 1.1–1.2× | 64px font → 70–77px line |
| Subtitle | 1.3–1.4× | 28px font → 36–39px line |
| Body | 1.5–1.6× | 16px font → 24–26px line |

## measureText e Word Wrap

```javascript
// Medir largura exata
const metrics = ctx.measureText('Texto');
console.log(metrics.width);                    // Largura em pixels
console.log(metrics.actualBoundingBoxAscent);  // Altura acima da baseline
console.log(metrics.actualBoundingBoxDescent); // Altura abaixo da baseline

// Altura total do texto
const textHeight = metrics.actualBoundingBoxAscent + metrics.actualBoundingBoxDescent;
```

### Word Wrap para Canvas

```javascript
function wrapText(ctx, text, x, y, maxWidth, lineHeight) {
  const words = text.split(' ');
  let line = '';
  const lines = [];

  for (const word of words) {
    const testLine = line + word + ' ';
    const testWidth = ctx.measureText(testLine).width;

    if (testWidth > maxWidth && line !== '') {
      lines.push(line.trim());
      line = word + ' ';
    } else {
      line = testLine;
    }
  }
  lines.push(line.trim());

  for (let i = 0; i < lines.length; i++) {
    ctx.fillText(lines[i], x, y + i * lineHeight);
  }

  return lines.length; // Retorna número de linhas para calcular offset
}
```

### Centralização Vertical de Texto Multiline

```javascript
function drawCenteredText(ctx, text, cx, cy, maxWidth, lineHeight) {
  // Primeiro pass: contar linhas
  const words = text.split(' ');
  let line = '';
  const lines = [];
  for (const word of words) {
    const test = line + word + ' ';
    if (ctx.measureText(test).width > maxWidth && line !== '') {
      lines.push(line.trim());
      line = word + ' ';
    } else {
      line = test;
    }
  }
  lines.push(line.trim());

  // Calcular offset para centralizar
  const totalHeight = lines.length * lineHeight;
  const startY = cy - totalHeight / 2 + lineHeight / 2;

  ctx.textAlign = 'center';
  for (let i = 0; i < lines.length; i++) {
    ctx.fillText(lines[i], cx, startY + i * lineHeight);
  }
}
```

## Dicas de Legibilidade no Canvas

1. **Contraste mínimo**: Texto branco em fundo escuro = 7:1+ (AAA). Texto escuro em fundo claro = 4.5:1+ (AA)
2. **Sombra de texto**: Para texto sobre imagem, adicionar shadow: `ctx.shadowColor = 'rgba(0,0,0,0.5); ctx.shadowBlur = 4;`
3. **Stroke + Fill**: Para texto sobre fundo variado: `ctx.strokeStyle = 'rgba(0,0,0,0.7); ctx.lineWidth = 3; ctx.strokeText(...); ctx.fillText(...);`
4. **Tamanho mínimo**: 12px para body, 14px para mobile, 11px mínimo absoluto
5. **Não usar mais de 2 fontes** por banner (headline + body é suficiente)
6. **Bold para headlines, regular para corpo** — criar hierarquia clara

---

## Técnicas Avançadas de Tipografia

### Texto em Arco (Curva Circular)

```javascript
function textOnArc(ctx, text, cx, cy, radius, startAngle, fontSize, options = {}) {
  const { fill = '#fff', letterSpacing = 0 } = options;
  ctx.save();
  ctx.font = `${fontSize}px system-ui, sans-serif`;
  ctx.fillStyle = fill;
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';

  // Calcular ângulo total
  let totalAngle = 0;
  for (const char of text) {
    totalAngle += (ctx.measureText(char).width + letterSpacing) / radius;
  }

  let angle = startAngle - totalAngle / 2;

  for (const char of text) {
    const charW = ctx.measureText(char).width;
    angle += (charW / 2 + letterSpacing / 2) / radius;
    ctx.save();
    ctx.translate(cx + radius * Math.cos(angle), cy + radius * Math.sin(angle));
    ctx.rotate(angle + Math.PI / 2);
    ctx.fillText(char, 0, 0);
    ctx.restore();
    angle += (charW / 2 + letterSpacing / 2) / radius;
  }
  ctx.restore();
}

// Uso: textOnArc(ctx, 'PROMOÇÃO ESPECIAL', 600, 314, 200, -Math.PI/2, 24);
```

### Texto em Path Bézier

```javascript
function textOnBezier(ctx, text, p0, p1, p2, p3, fontSize) {
  ctx.save();
  ctx.font = `${fontSize}px system-ui, sans-serif`;
  ctx.textBaseline = 'middle';

  const len = text.length;
  for (let i = 0; i < len; i++) {
    const t = i / (len - 1 || 1);
    const mt = 1 - t;
    // Ponto na curva cúbica de Bézier
    const x = mt*mt*mt*p0.x + 3*mt*mt*t*p1.x + 3*mt*t*t*p2.x + t*t*t*p3.x;
    const y = mt*mt*mt*p0.y + 3*mt*mt*t*p1.y + 3*mt*t*t*p2.y + t*t*t*p3.y;
    // Tangente para rotação
    const dx = 3*mt*mt*(p1.x-p0.x) + 6*mt*t*(p2.x-p1.x) + 3*t*t*(p3.x-p2.x);
    const dy = 3*mt*mt*(p1.y-p0.y) + 6*mt*t*(p2.y-p1.y) + 3*t*t*(p3.y-p2.y);
    ctx.save();
    ctx.translate(x, y);
    ctx.rotate(Math.atan2(dy, dx));
    ctx.fillText(text[i], 0, 0);
    ctx.restore();
  }
  ctx.restore();
}
```

### Letter Spacing Manual (Cross-browser, Safari Safe)

```javascript
function drawTextWithSpacing(ctx, text, x, y, spacing) {
  let currentX = x;
  const align = ctx.textAlign;
  
  // Ajustar posição inicial para alinhamento
  if (align === 'center' || align === 'right') {
    let totalWidth = 0;
    for (const char of text) totalWidth += ctx.measureText(char).width + spacing;
    totalWidth -= spacing; // Remove último spacing
    if (align === 'center') currentX -= totalWidth / 2;
    else currentX -= totalWidth;
  }
  
  const savedAlign = ctx.textAlign;
  ctx.textAlign = 'left';
  for (const char of text) {
    ctx.fillText(char, currentX, y);
    currentX += ctx.measureText(char).width + spacing;
  }
  ctx.textAlign = savedAlign;
}
```

### Texto com Gradient

```javascript
function drawGradientText(ctx, text, x, y, colors, direction = 'horizontal') {
  const metrics = ctx.measureText(text);
  const w = metrics.width;
  const h = metrics.actualBoundingBoxAscent + metrics.actualBoundingBoxDescent;
  
  let grad;
  if (direction === 'horizontal') {
    grad = ctx.createLinearGradient(x - w/2, y, x + w/2, y);
  } else {
    grad = ctx.createLinearGradient(x, y - h, x, y);
  }
  
  colors.forEach((c, i) => grad.addColorStop(i / (colors.length - 1), c));
  ctx.fillStyle = grad;
  ctx.fillText(text, x, y);
}

// Uso:
// ctx.textAlign = 'center';
// drawGradientText(ctx, 'MEGA SALE', 600, 200, ['#ff6b6b', '#feca57', '#48dbfb']);
```

### Glow / Neon Text Effect

```javascript
function drawGlowText(ctx, text, x, y, color, glowColor, blur = 20) {
  ctx.save();
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  
  // Múltiplas camadas de shadow para glow profundo
  const layers = [blur * 2, blur * 1.5, blur, blur * 0.5];
  for (const b of layers) {
    ctx.shadowColor = glowColor;
    ctx.shadowBlur = b;
    ctx.shadowOffsetX = 0;
    ctx.shadowOffsetY = 0;
    ctx.fillStyle = color;
    ctx.fillText(text, x, y);
  }
  
  // Camada final brilhante sem shadow
  ctx.shadowColor = 'transparent';
  ctx.fillStyle = '#fff';
  ctx.fillText(text, x, y);
  ctx.restore();
}

// Uso: drawGlowText(ctx, 'NEON', 600, 300, '#ff00ff', '#ff00ff80', 30);
```

### Texto 3D / Extruded

```javascript
function draw3DText(ctx, text, x, y, mainColor, shadowColor, depth = 4) {
  ctx.save();
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  
  // Camadas de profundidade (de trás para frente)
  ctx.fillStyle = shadowColor;
  for (let i = depth; i > 0; i--) {
    ctx.fillText(text, x + i, y + i);
  }
  
  // Camada principal
  ctx.fillStyle = mainColor;
  ctx.fillText(text, x, y);
  ctx.restore();
}

// Uso: draw3DText(ctx, 'BLACK FRIDAY', 600, 200, '#D4AF37', '#1A202C', 5);
```

### Stroke + Fill (Outlined Text)

```javascript
function drawOutlinedText(ctx, text, x, y, fillColor, strokeColor, strokeWidth = 3) {
  ctx.save();
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  
  // Stroke primeiro (fica por baixo)
  ctx.lineWidth = strokeWidth;
  ctx.lineJoin = 'round'; // Suaviza cantos
  ctx.strokeStyle = strokeColor;
  ctx.strokeText(text, x, y);
  
  // Fill por cima
  ctx.fillStyle = fillColor;
  ctx.fillText(text, x, y);
  ctx.restore();
}
```

### Animação de Texto Caractere-por-Caractere (Typewriter)

```javascript
function animateTypewriter(ctx, text, x, y, speed = 50) {
  let index = 0;
  
  function draw() {
    // Limpar área (ou redesenhar fundo)
    ctx.clearRect(x - 400, y - 40, 800, 80);
    
    const partial = text.slice(0, index + 1);
    ctx.fillText(partial, x, y);
    
    // Cursor piscando
    const cursorX = x + ctx.measureText(partial).width + 2;
    if (Math.floor(Date.now() / 500) % 2 === 0) {
      ctx.fillRect(cursorX, y - 20, 2, 40);
    }
    
    index++;
    if (index < text.length) {
      setTimeout(() => requestAnimationFrame(draw), speed);
    }
  }
  
  requestAnimationFrame(draw);
}
```

### Responsive Font Sizing (Auto-fit)

```javascript
// Calcular maior tamanho de fonte que cabe no espaço
function autoFitFontSize(ctx, text, maxWidth, maxHeight, fontFamily = 'system-ui', minSize = 12, maxSize = 200) {
  let low = minSize, high = maxSize;
  
  while (low < high - 1) {
    const mid = Math.floor((low + high) / 2);
    ctx.font = `900 ${mid}px ${fontFamily}`;
    const metrics = ctx.measureText(text);
    const textH = metrics.actualBoundingBoxAscent + metrics.actualBoundingBoxDescent;
    
    if (metrics.width <= maxWidth && textH <= maxHeight) {
      low = mid;
    } else {
      high = mid;
    }
  }
  
  return low;
}

// Uso:
// const size = autoFitFontSize(ctx, 'MEGA PROMOÇÃO', W * 0.8, H * 0.3);
// ctx.font = `900 ${size}px system-ui`;
```

### Kerning Manual (Safari Safe)

```javascript
// Tabela de ajustes de kerning para pares comuns
const KERN_PAIRS = {
  'AV': -2, 'VA': -2, 'AW': -1, 'WA': -1,
  'AT': -2, 'TA': -2, 'AY': -2, 'YA': -2,
  'LT': -2, 'LV': -1, 'LW': -1, 'LY': -1,
  'To': -1, 'Tr': -1, 'Te': -1, 'Ta': -1,
  'PA': -1, 'FA': -1, 'Wo': -1, 'We': -1,
};

function drawKernedText(ctx, text, x, y) {
  let currentX = x;
  ctx.textAlign = 'left';
  
  for (let i = 0; i < text.length; i++) {
    const char = text[i];
    ctx.fillText(char, currentX, y);
    currentX += ctx.measureText(char).width;
    
    // Aplicar kerning se par existe
    if (i < text.length - 1) {
      const pair = char + text[i + 1];
      currentX += (KERN_PAIRS[pair] || 0);
    }
  }
}
```

### Tabela: Combinações de Fontes Testadas

| Headline | Body | Estilo | Segmento |
|----------|------|--------|----------|
| **Montserrat 900** | Inter 400 | Moderno/Bold | Tech, SaaS, Startups |
| **Playfair Display 700** | Lora 400 | Elegant/Serif | Luxo, Editorial, Moda |
| **Bebas Neue** | Roboto 400 | Impact/Clean | Esportes, Promos, Sales |
| **Poppins 700** | Poppins 400 | Friendly/Rounded | Infantil, Educação, App |
| **Oswald 700** | Inter 400 | Condensed/Tight | Fitness, News, Urgência |
| **Raleway 200** | Raleway 400 | Thin/Elegante | Minimalismo, Luxo, Beauty |
| **Impact** | Arial 400 | System Bold | Fallback universal, promos |
| **Georgia 700** | Verdana 400 | Classic/System | Editorial sem web fonts |

### Tipografia Adaptativa por Plataforma

| Plataforma | Max Chars (headline) | Font Size Range | Nota |
|-----------|---------------------|----------------|------|
| Google Ads 300×250 | 15-20 chars | 24-36px | Espaço limitado, 1-2 linhas |
| Facebook 1200×628 | 30-50 chars | 48-72px | 2-3 linhas, legível no feed |
| Instagram 1080×1080 | 20-40 chars | 48-80px | Quadrado, centralizado |
| Story 1080×1920 | 10-25 chars | 56-96px | Vertical, impacto rápido |
| YouTube Thumbnail 1280×720 | 5-10 chars | 72-120px | Massivo, poucas palavras |
| Email 600×200 | 20-40 chars | 28-48px | Retina, fallback system |
| LinkedIn 1200×627 | 30-50 chars | 42-64px | Profissional, clean |
