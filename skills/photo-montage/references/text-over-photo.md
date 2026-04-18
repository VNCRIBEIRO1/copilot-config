# Texto Legível Sobre Foto — 6 Técnicas

Regra fundamental: **NUNCA** colocar texto branco diretamente sobre foto sem tratamento.
Mínimo: contraste WCAG AA (4.5:1 para texto normal, 3:1 para texto grande ≥24px bold).

## 1. Gradient Scrim (Mais Comum)

Gradient semi-transparente que escurece a zona do texto. A técnica mais versátil.

**Quando usar:** Headlines grandes sobre foto, cards de artigo, OG images.

```javascript
function drawGradientScrim(ctx, w, h, position = 'bottom', intensity = 0.75) {
  const configs = {
    bottom: { // Texto embaixo
      gradient: ctx.createLinearGradient(0, h * 0.35, 0, h),
      stops: [[0, 'rgba(0,0,0,0)'], [0.4, `rgba(0,0,0,${intensity * 0.3})`], [1, `rgba(0,0,0,${intensity})`]]
    },
    top: { // Texto em cima
      gradient: ctx.createLinearGradient(0, 0, 0, h * 0.5),
      stops: [[0, `rgba(0,0,0,${intensity})`], [0.6, `rgba(0,0,0,${intensity * 0.3})`], [1, 'rgba(0,0,0,0)']]
    },
    full: { // Texto no meio
      gradient: ctx.createLinearGradient(0, 0, 0, h),
      stops: [[0, `rgba(0,0,0,${intensity * 0.4})`], [0.5, `rgba(0,0,0,${intensity * 0.6})`], [1, `rgba(0,0,0,${intensity})`]]
    },
    left: { // Texto à esquerda
      gradient: ctx.createLinearGradient(0, 0, w * 0.6, 0),
      stops: [[0, `rgba(0,0,0,${intensity})`], [0.6, `rgba(0,0,0,${intensity * 0.3})`], [1, 'rgba(0,0,0,0)']]
    }
  };
  
  const cfg = configs[position];
  for (const [pos, color] of cfg.stops) {
    cfg.gradient.addColorStop(pos, color);
  }
  ctx.fillStyle = cfg.gradient;
  ctx.fillRect(0, 0, w, h);
}
```

## 2. Frosted Glass Panel

Simula backdrop-blur com panel semi-transparente. Elegante para cards formais.

**Quando usar:** Cards institucionais, informações estruturadas sobre foto, citações.

```javascript
function drawFrostedPanel(ctx, x, y, w, h, radius = 12) {
  ctx.save();
  
  // Panel semi-transparente
  ctx.beginPath();
  ctx.roundRect(x, y, w, h, radius);
  ctx.fillStyle = 'rgba(0, 0, 0, 0.55)';
  ctx.fill();
  
  // Borda sutil em cima
  ctx.strokeStyle = 'rgba(255, 255, 255, 0.12)';
  ctx.lineWidth = 1;
  ctx.stroke();
  
  ctx.restore();
}

// Para simular blur real (sem ctx.filter):
function drawFrostedBlur(ctx, srcCanvas, x, y, w, h, radius = 12, blurPasses = 3) {
  ctx.save();
  ctx.beginPath();
  ctx.roundRect(x, y, w, h, radius);
  ctx.clip();
  
  // Extrair região e aplicar box blur manual
  const region = ctx.getImageData(x, y, w, h);
  for (let pass = 0; pass < blurPasses; pass++) {
    boxBlur(region, w, h, 8);
  }
  ctx.putImageData(region, x, y);
  
  // Overlay tinted
  ctx.fillStyle = 'rgba(0, 0, 0, 0.4)';
  ctx.fillRect(x, y, w, h);
  
  // Border
  ctx.strokeStyle = 'rgba(255, 255, 255, 0.1)';
  ctx.lineWidth = 1;
  ctx.beginPath();
  ctx.roundRect(x, y, w, h, radius);
  ctx.stroke();
  
  ctx.restore();
}
```

## 3. Text Shadow Multi-Layer

Múltiplas camadas de shadowBlur para criar halo de contraste.

**Quando usar:** Headlines grandes, textos dramáticos, títulos de vídeo.

```javascript
function drawTextWithShadow(ctx, text, x, y, font = '700 48px Montserrat') {
  ctx.font = font;
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  
  // Layer 1: Shadow amplo (blur suave)
  ctx.shadowColor = 'rgba(0, 0, 0, 0.8)';
  ctx.shadowBlur = 30;
  ctx.shadowOffsetX = 0;
  ctx.shadowOffsetY = 2;
  ctx.fillStyle = 'rgba(0,0,0,0)'; // Invisível — só shadow
  ctx.fillText(text, x, y);
  
  // Layer 2: Shadow médio
  ctx.shadowBlur = 15;
  ctx.fillText(text, x, y);
  
  // Layer 3: Shadow tight
  ctx.shadowBlur = 5;
  ctx.fillText(text, x, y);
  
  // Layer 4: Texto real
  ctx.shadowColor = 'transparent';
  ctx.shadowBlur = 0;
  ctx.fillStyle = '#FFFFFF';
  ctx.fillText(text, x, y);
}
```

## 4. Backdrop Strip (Faixa Semi-Transparente)

Faixa horizontal atrás do texto. Simples e eficaz para subtítulos.

**Quando usar:** Subtítulos, datas, metadados, créditos de foto.

```javascript
function drawBackdropStrip(ctx, text, y, w, options = {}) {
  const {
    font = '400 16px Inter',
    textColor = '#FFFFFF',
    bgColor = 'rgba(0, 0, 0, 0.6)',
    padding = { x: 20, y: 10 },
    align = 'left', // 'left', 'center', 'right'
  } = options;
  
  ctx.font = font;
  const metrics = ctx.measureText(text);
  const textW = metrics.width;
  const stripH = padding.y * 2 + parseInt(font);
  
  // Background strip (full width ou ajustado)
  ctx.fillStyle = bgColor;
  ctx.fillRect(0, y - padding.y, w, stripH);
  
  // Texto
  ctx.fillStyle = textColor;
  ctx.textBaseline = 'top';
  if (align === 'left') {
    ctx.textAlign = 'left';
    ctx.fillText(text, padding.x, y);
  } else if (align === 'center') {
    ctx.textAlign = 'center';
    ctx.fillText(text, w / 2, y);
  }
}
```

## 5. Pill Badge (Cápsula Colorida)

Badge em formato pill/cápsula para categorias e labels.

**Quando usar:** Categoria de artigo, tags, labels de status (NOVO, URGENTE, AO VIVO).

```javascript
function drawPillBadge(ctx, text, x, y, options = {}) {
  const {
    font = '700 13px Inter',
    textColor = '#FFFFFF',
    bgColor = '#009C3B',
    paddingX = 14,
    paddingY = 6,
    radius = 100, // Full round
    uppercase = true,
  } = options;
  
  const displayText = uppercase ? text.toUpperCase() : text;
  ctx.font = font;
  const metrics = ctx.measureText(displayText);
  const pillW = metrics.width + paddingX * 2;
  const pillH = parseInt(font) + paddingY * 2;
  
  // Background pill
  ctx.beginPath();
  ctx.roundRect(x, y, pillW, pillH, radius);
  ctx.fillStyle = bgColor;
  ctx.fill();
  
  // Texto
  ctx.fillStyle = textColor;
  ctx.textAlign = 'left';
  ctx.textBaseline = 'top';
  ctx.fillText(displayText, x + paddingX, y + paddingY);
  
  return { width: pillW, height: pillH }; // Para posicionar next element
}
```

## 6. Knockout / Outlined Text

Texto com outline sem preenchimento, ou preenchimento transparente. Para headlines gigantes.

**Quando usar:** Títulos decorativos grandes, overlays artísticos, watermarks.

```javascript
function drawOutlinedText(ctx, text, x, y, options = {}) {
  const {
    font = '900 72px Montserrat',
    strokeColor = 'rgba(255, 255, 255, 0.8)',
    fillColor = null, // null = knockout (sem fill)
    lineWidth = 2,
  } = options;
  
  ctx.font = font;
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.lineWidth = lineWidth;
  ctx.strokeStyle = strokeColor;
  ctx.strokeText(text, x, y);
  
  if (fillColor) {
    ctx.fillStyle = fillColor;
    ctx.fillText(text, x, y);
  }
}
```

## Utility: Wrapped Text (Multi-Line)

Fundamental para textos longos em cards. Canvas não tem word-wrap nativo.

```javascript
function wrapText(ctx, text, x, y, maxWidth, lineHeight) {
  const words = text.split(' ');
  let line = '';
  let currentY = y;
  const lines = [];
  
  for (const word of words) {
    const testLine = line + (line ? ' ' : '') + word;
    const metrics = ctx.measureText(testLine);
    
    if (metrics.width > maxWidth && line) {
      lines.push({ text: line, x, y: currentY });
      line = word;
      currentY += lineHeight;
    } else {
      line = testLine;
    }
  }
  lines.push({ text: line, x, y: currentY });
  
  for (const l of lines) {
    ctx.fillText(l.text, l.x, l.y);
  }
  
  return { totalHeight: currentY - y + lineHeight, lineCount: lines.length };
}
```

## Utility: Auto-Fit Font Size

Encontra o maior tamanho de fonte que cabe na largura disponível.

```javascript
function autoFitFontSize(ctx, text, maxWidth, fontFamily, minSize = 12, maxSize = 72, weight = '700') {
  let lo = minSize, hi = maxSize;
  
  while (lo < hi - 1) {
    const mid = Math.floor((lo + hi) / 2);
    ctx.font = `${weight} ${mid}px ${fontFamily}`;
    const w = ctx.measureText(text).width;
    if (w <= maxWidth) lo = mid;
    else hi = mid;
  }
  
  ctx.font = `${weight} ${lo}px ${fontFamily}`;
  return lo;
}
```
