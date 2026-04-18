# Core Recipes — Canvas 2D para Editorial Cards

Receitas essenciais para composição editorial. Para técnicas avançadas (duotone, double exposure, pixel manipulation), usar `canvas-banners`.

## 1. loadImage (CORS-safe)

```javascript
function loadImage(url) {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.crossOrigin = 'anonymous'; // ANTES de .src — obrigatório
    img.onload = () => resolve(img);
    img.onerror = () => reject(new Error(`Falha ao carregar: ${url}`));
    img.src = url;
  });
}
```

## 2. coverFit (object-fit: cover)

```javascript
function coverFit(img, canvasW, canvasH) {
  const imgRatio = img.naturalWidth / img.naturalHeight;
  const canvasRatio = canvasW / canvasH;
  let sx = 0, sy = 0, sw = img.naturalWidth, sh = img.naturalHeight;

  if (imgRatio > canvasRatio) {
    sw = img.naturalHeight * canvasRatio;
    sx = (img.naturalWidth - sw) / 2;
  } else {
    sh = img.naturalWidth / canvasRatio;
    sy = (img.naturalHeight - sh) / 2;
  }
  return { sx, sy, sw, sh };
}

// Uso:
const { sx, sy, sw, sh } = coverFit(img, canvas.width, canvas.height);
ctx.drawImage(img, sx, sy, sw, sh, 0, 0, canvas.width, canvas.height);
```

## 3. wrapText (word-wrap para Canvas)

```javascript
function wrapText(ctx, text, x, y, maxWidth, lineHeight) {
  const words = text.split(' ');
  let line = '';
  const lines = [];

  for (const word of words) {
    const testLine = line + (line ? ' ' : '') + word;
    if (ctx.measureText(testLine).width > maxWidth && line) {
      lines.push(line);
      line = word;
    } else {
      line = testLine;
    }
  }
  lines.push(line);

  for (let i = 0; i < lines.length; i++) {
    ctx.fillText(lines[i], x, y + i * lineHeight);
  }

  return { lines, totalHeight: lines.length * lineHeight };
}
```

## 4. autoFitFontSize (binary search)

Encontra o maior tamanho de fonte que faz o texto caber em maxWidth × maxLines.

```javascript
function autoFitFontSize(ctx, text, maxWidth, maxLines, family, minPx, maxPx) {
  let lo = minPx, hi = maxPx, best = minPx;

  while (lo <= hi) {
    const mid = Math.floor((lo + hi) / 2);
    ctx.font = `700 ${mid}px "${family}", system-ui`;

    // Contar linhas
    const words = text.split(' ');
    let line = '', lineCount = 1;
    for (const word of words) {
      const testLine = line + (line ? ' ' : '') + word;
      if (ctx.measureText(testLine).width > maxWidth && line) {
        lineCount++;
        line = word;
      } else {
        line = testLine;
      }
    }

    if (lineCount <= maxLines) {
      best = mid;
      lo = mid + 1;
    } else {
      hi = mid - 1;
    }
  }
  return best;
}

// Uso:
const fontSize = autoFitFontSize(ctx, title, w - 120, 4, 'Montserrat', 18, 56);
ctx.font = `700 ${fontSize}px "Montserrat", system-ui`;
```

## 5. drawPill (badge temático)

```javascript
function drawPill(ctx, text, x, y, bg, fg, fontSize = 13) {
  ctx.font = `700 ${fontSize}px "Montserrat", system-ui`;
  ctx.textBaseline = 'middle';
  const metrics = ctx.measureText(text);
  const padX = 12, padY = 6;
  const pillW = metrics.width + padX * 2;
  const pillH = fontSize + padY * 2;
  const radius = pillH / 2;

  // Background pill
  ctx.fillStyle = bg;
  ctx.beginPath();
  ctx.roundRect(x, y, pillW, pillH, radius);
  ctx.fill();

  // Text
  ctx.fillStyle = fg;
  ctx.textAlign = 'left';
  ctx.fillText(text, x + padX, y + pillH / 2);
  ctx.textBaseline = 'alphabetic'; // Reset

  return { width: pillW, height: pillH };
}
```

## 6. drawGradientScrim (overlay de leitura)

```javascript
// position: 'bottom' | 'top' | 'full'
function drawGradientScrim(ctx, w, h, position = 'bottom', intensity = 0.65) {
  let grad;

  switch (position) {
    case 'bottom':
      grad = ctx.createLinearGradient(0, h * 0.35, 0, h);
      grad.addColorStop(0, 'rgba(0,0,0,0)');
      grad.addColorStop(0.4, `rgba(0,0,0,${intensity * 0.4})`);
      grad.addColorStop(1, `rgba(0,0,0,${intensity})`);
      break;
    case 'top':
      grad = ctx.createLinearGradient(0, 0, 0, h * 0.5);
      grad.addColorStop(0, `rgba(0,0,0,${intensity})`);
      grad.addColorStop(0.6, `rgba(0,0,0,${intensity * 0.4})`);
      grad.addColorStop(1, 'rgba(0,0,0,0)');
      break;
    case 'full':
      ctx.fillStyle = `rgba(0,0,0,${intensity})`;
      ctx.fillRect(0, 0, w, h);
      return;
  }

  ctx.fillStyle = grad;
  ctx.fillRect(0, 0, w, h);
}
```

## 7. drawFrostedPanel (glass panel para layout Magazine)

Simula frosted glass sem `ctx.filter` (Safari-safe).

```javascript
function drawFrostedPanel(ctx, x, y, w, h, radius = 16, opacity = 0.55) {
  ctx.save();

  // Semi-transparent background
  ctx.fillStyle = `rgba(0, 0, 0, ${opacity})`;
  ctx.beginPath();
  ctx.roundRect(x, y, w, h, radius);
  ctx.fill();

  // Subtle border (glass edge)
  ctx.strokeStyle = `rgba(255, 255, 255, 0.12)`;
  ctx.lineWidth = 1;
  ctx.stroke();

  ctx.restore();
}
```

## 8. drawArticleCard (composição completa — 7 layers)

Orquestra todos os recipes acima em uma composição editorial completa.

```javascript
async function drawArticleCard(canvas, config) {
  const {
    width, height, title, theme, photoUrl,
    subtitle = '', date = '', author = '', siteUrl = '',
    overlay = 'scrim', overlayIntensity = 0.6
  } = config;

  const dpr = window.devicePixelRatio || 2;
  canvas.width = width * dpr;
  canvas.height = height * dpr;
  canvas.style.width = width + 'px';
  canvas.style.height = height + 'px';
  const ctx = canvas.getContext('2d');
  ctx.scale(dpr, dpr);

  const THEMES = {
    saude:          { bg: '#16A34A', fg: '#FFF', label: 'SAÚDE' },
    legislacao:     { bg: '#D4AF37', fg: '#000', label: 'LEGISLAÇÃO' },
    seguranca:      { bg: '#DC2626', fg: '#FFF', label: 'SEGURANÇA' },
    educacao:       { bg: '#2563EB', fg: '#FFF', label: 'EDUCAÇÃO' },
    infraestrutura: { bg: '#EA580C', fg: '#FFF', label: 'INFRAESTRUTURA' },
    meioambiente:   { bg: '#059669', fg: '#FFF', label: 'MEIO AMBIENTE' },
    economia:       { bg: '#7C3AED', fg: '#FFF', label: 'ECONOMIA' },
    campanha:       { bg: '#009C3B', fg: '#FFF', label: 'CAMPANHA' },
    denuncia:       { bg: '#991B1B', fg: '#FFF', label: 'DENÚNCIA' },
    evento:         { bg: '#0891B2', fg: '#FFF', label: 'EVENTO' },
    cultura:        { bg: '#A855F7', fg: '#FFF', label: 'CULTURA' },
    esporte:        { bg: '#F59E0B', fg: '#000', label: 'ESPORTE' },
    juventude:      { bg: '#FFCC00', fg: '#000', label: 'JUVENTUDE' },
    animal:         { bg: '#22C55E', fg: '#000', label: 'ANIMAL' },
  };

  const pad = Math.round(width * 0.05); // 5% padding
  const themeData = THEMES[theme] || THEMES.campanha;

  // L0: Fundo sólido
  ctx.fillStyle = '#0D0D0D';
  ctx.fillRect(0, 0, width, height);

  // L1: Foto (cover fit)
  try {
    const img = await loadImage(photoUrl);
    const { sx, sy, sw, sh } = coverFit(img, width, height);
    ctx.drawImage(img, sx, sy, sw, sh, 0, 0, width, height);
  } catch {
    // Foto falhou → manter fundo sólido
  }

  // L2: Overlay
  if (overlay === 'panel') {
    drawGradientScrim(ctx, width, height, 'bottom', 0.35);
    drawFrostedPanel(ctx, pad, height * 0.35, width - pad * 2, height * 0.55, 16, overlayIntensity);
  } else {
    drawGradientScrim(ctx, width, height, 'bottom', overlayIntensity);
  }

  // L3: Badge
  drawPill(ctx, themeData.label, pad, pad, themeData.bg, themeData.fg);

  // L4: Título
  const titleMaxW = width - pad * 2;
  const titleFontSize = autoFitFontSize(ctx, title, titleMaxW, 4, 'Montserrat', 18, 56);
  ctx.fillStyle = '#FFFFFF';
  ctx.font = `700 ${titleFontSize}px "Montserrat", system-ui`;
  ctx.textAlign = 'left';
  ctx.textBaseline = 'alphabetic';
  const titleY = height - pad - (subtitle ? 60 : 40);
  const { totalHeight } = wrapText(ctx, title, pad, titleY, titleMaxW, titleFontSize * 1.2);

  // L5: Accent line + Metadados
  const accentY = titleY + totalHeight + 8;
  ctx.fillStyle = themeData.bg;
  ctx.fillRect(pad, accentY, 48, 3);

  if (date || author) {
    const meta = [date, author].filter(Boolean).join(' • ');
    ctx.fillStyle = 'rgba(255,255,255,0.55)';
    ctx.font = '400 14px "Inter", system-ui';
    ctx.fillText(meta, pad, accentY + 22, titleMaxW);
  }

  // L6: Branding
  if (siteUrl) {
    ctx.fillStyle = 'rgba(255,255,255,0.35)';
    ctx.font = '400 12px "Inter", system-ui';
    ctx.textAlign = 'right';
    ctx.fillText(siteUrl, width - pad, height - pad / 2);
    ctx.textAlign = 'left';
  }
}
```

## 9. HiDPI Setup (padrão para qualquer canvas)

```javascript
function setupHiDPI(canvas, w, h) {
  const dpr = window.devicePixelRatio || 2;
  canvas.width = w * dpr;
  canvas.height = h * dpr;
  canvas.style.width = w + 'px';
  canvas.style.height = h + 'px';
  const ctx = canvas.getContext('2d');
  ctx.scale(dpr, dpr);
  return ctx;
}
```

## 10. Font Loading (obrigatório antes de render)

```javascript
async function loadFonts() {
  const montserrat = new FontFace(
    'Montserrat',
    'url(https://fonts.gstatic.com/s/montserrat/v29/JTUHjIg1_i6t8kCHKm4532VJOt5-QNFgpCuM70w-Y3tcoqK5.woff2)',
    { weight: '700' }
  );
  const inter = new FontFace(
    'Inter',
    'url(https://fonts.gstatic.com/s/inter/v18/UcCO3FwrK3iLTeHuS_nVMrMxCp50SjIw2boKoduKmMEVuLyfAZ9hiJ-Ek-_EeA.woff2)',
    { weight: '400' }
  );

  document.fonts.add(montserrat);
  document.fonts.add(inter);
  await Promise.all([montserrat.load(), inter.load()]);
}
```
