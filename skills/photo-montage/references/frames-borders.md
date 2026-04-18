# Frames & Molduras — Canvas 2D

8 tipos de moldura/frame para composição fotográfica. Cada um com código pronto.

## 1. Rounded Frame (Cantos Arredondados)

O mais comum. Simples, moderno, universal.

```javascript
function frameRounded(ctx, x, y, w, h, radius = 16, borderWidth = 0, borderColor = 'rgba(255,255,255,0.2)') {
  ctx.save();
  ctx.beginPath();
  ctx.roundRect(x, y, w, h, radius);
  ctx.clip();
  // ... draw photo inside ...
  ctx.restore();
  
  if (borderWidth > 0) {
    ctx.beginPath();
    ctx.roundRect(x, y, w, h, radius);
    ctx.strokeStyle = borderColor;
    ctx.lineWidth = borderWidth;
    ctx.stroke();
  }
}
```

**Quando usar:** Qualquer card moderno, posts de redes sociais, thumbnails.

## 2. Circular Frame (Avatar/Perfil)

```javascript
function frameCircular(ctx, img, cx, cy, radius, options = {}) {
  const {
    ringWidth = 3,
    ringColor = '#009C3B',
    ringGap = 2,
    shadowBlur = 12,
    shadowColor = 'rgba(0,0,0,0.3)',
  } = options;
  
  // Drop shadow
  if (shadowBlur > 0) {
    ctx.save();
    ctx.shadowBlur = shadowBlur;
    ctx.shadowColor = shadowColor;
    ctx.beginPath();
    ctx.arc(cx, cy, radius + ringWidth + ringGap, 0, Math.PI * 2);
    ctx.fillStyle = ringColor;
    ctx.fill();
    ctx.restore();
  }
  
  // Ring
  if (ringWidth > 0) {
    ctx.beginPath();
    ctx.arc(cx, cy, radius + ringWidth + ringGap, 0, Math.PI * 2);
    ctx.fillStyle = ringColor;
    ctx.fill();
    
    // Gap (optional transparent ring)
    if (ringGap > 0) {
      ctx.beginPath();
      ctx.arc(cx, cy, radius + ringGap, 0, Math.PI * 2);
      ctx.fillStyle = '#000000'; // Match background
      ctx.fill();
    }
  }
  
  // Photo clipped
  ctx.save();
  ctx.beginPath();
  ctx.arc(cx, cy, radius, 0, Math.PI * 2);
  ctx.clip();
  const size = radius * 2;
  const fit = coverFit(img, size, size);
  ctx.drawImage(img, fit.sx, fit.sy, fit.sw, fit.sh, cx - radius, cy - radius, size, size);
  ctx.restore();
}
```

**Quando usar:** Fotos de perfil, avatares, créditos de autor, testimonials.

## 3. Glass Frame (Authority/Institucional)

Frame com aparência de vidro: border sutil, inner glow, blur simulado.

```javascript
function frameGlass(ctx, x, y, w, h, radius = 12) {
  // Outer glow sutil
  ctx.save();
  ctx.shadowBlur = 20;
  ctx.shadowColor = 'rgba(0, 0, 0, 0.4)';
  ctx.beginPath();
  ctx.roundRect(x, y, w, h, radius);
  ctx.fillStyle = 'rgba(255, 255, 255, 0.03)';
  ctx.fill();
  ctx.restore();
  
  // Main border
  ctx.beginPath();
  ctx.roundRect(x, y, w, h, radius);
  ctx.strokeStyle = 'rgba(255, 255, 255, 0.12)';
  ctx.lineWidth = 1;
  ctx.stroke();
  
  // Inner highlight (topo)
  const innerGrad = ctx.createLinearGradient(x, y, x, y + h * 0.15);
  innerGrad.addColorStop(0, 'rgba(255, 255, 255, 0.06)');
  innerGrad.addColorStop(1, 'rgba(255, 255, 255, 0)');
  ctx.fillStyle = innerGrad;
  ctx.beginPath();
  ctx.roundRect(x + 1, y + 1, w - 2, h * 0.15, [radius, radius, 0, 0]);
  ctx.fill();
}
```

**Quando usar:** Cards de campanha política, institucional, authority-grade.

## 4. Shadow Box Frame

Frame com drop shadow pronunciada. Efeito de card elevado.

```javascript
function frameShadowBox(ctx, x, y, w, h, radius = 8) {
  // Shadow layers (mais profundo → mais blur)
  const shadows = [
    { blur: 4, offset: 2, alpha: 0.12 },
    { blur: 12, offset: 4, alpha: 0.08 },
    { blur: 24, offset: 8, alpha: 0.05 },
  ];
  
  for (const s of shadows) {
    ctx.save();
    ctx.shadowBlur = s.blur;
    ctx.shadowOffsetY = s.offset;
    ctx.shadowColor = `rgba(0, 0, 0, ${s.alpha})`;
    ctx.beginPath();
    ctx.roundRect(x, y, w, h, radius);
    ctx.fillStyle = '#FFFFFF';
    ctx.fill();
    ctx.restore();
  }
  
  // Clean fill on top
  ctx.beginPath();
  ctx.roundRect(x, y, w, h, radius);
  ctx.fillStyle = '#FFFFFF';
  ctx.fill();
}
```

**Quando usar:** Cards em fundo claro, galeria de fotos, portfolio.

## 5. Double Border Frame

Duas bordas com gap entre elas. Estilo editorial/magazine.

```javascript
function frameDoubleBorder(ctx, x, y, w, h, options = {}) {
  const {
    outerColor = 'rgba(255, 255, 255, 0.4)',
    innerColor = 'rgba(255, 255, 255, 0.15)',
    outerWidth = 2,
    innerWidth = 1,
    gap = 4,
    radius = 0,
  } = options;
  
  // Outer border
  ctx.beginPath();
  ctx.roundRect(x, y, w, h, radius);
  ctx.strokeStyle = outerColor;
  ctx.lineWidth = outerWidth;
  ctx.stroke();
  
  // Inner border
  const offset = outerWidth + gap;
  ctx.beginPath();
  ctx.roundRect(x + offset, y + offset, w - offset * 2, h - offset * 2, radius);
  ctx.strokeStyle = innerColor;
  ctx.lineWidth = innerWidth;
  ctx.stroke();
}
```

**Quando usar:** Fotos editoriais, citações, destaque formal.

## 6. Polaroid Frame

Moldura branca com espaço extra embaixo para legenda. Estilo fotografia.

```javascript
function framePolaroid(ctx, img, x, y, photoW, options = {}) {
  const {
    padding = 12,
    bottomPadding = 48, // Espaço para legenda
    bgColor = '#FFFFFF',
    shadowBlur = 16,
    shadowAlpha = 0.2,
    rotation = 0, // Radians — leve rotação dá charme
    caption = '',
    captionFont = '400 14px "Dancing Script", Georgia',
    captionColor = '#333333',
  } = options;
  
  const aspectRatio = img.naturalHeight / img.naturalWidth;
  const photoH = photoW * aspectRatio;
  const totalW = photoW + padding * 2;
  const totalH = photoH + padding + bottomPadding;
  
  ctx.save();
  
  // Rotação
  if (rotation !== 0) {
    ctx.translate(x + totalW / 2, y + totalH / 2);
    ctx.rotate(rotation);
    ctx.translate(-(x + totalW / 2), -(y + totalH / 2));
  }
  
  // Shadow
  ctx.shadowBlur = shadowBlur;
  ctx.shadowColor = `rgba(0, 0, 0, ${shadowAlpha})`;
  ctx.shadowOffsetY = 4;
  
  // White frame
  ctx.fillStyle = bgColor;
  ctx.fillRect(x, y, totalW, totalH);
  
  // Reset shadow
  ctx.shadowBlur = 0;
  ctx.shadowColor = 'transparent';
  
  // Photo
  const fit = coverFit(img, photoW, photoH);
  ctx.drawImage(img, fit.sx, fit.sy, fit.sw, fit.sh, x + padding, y + padding, photoW, photoH);
  
  // Caption
  if (caption) {
    ctx.fillStyle = captionColor;
    ctx.font = captionFont;
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText(caption, x + totalW / 2, y + padding + photoH + bottomPadding / 2, photoW);
  }
  
  ctx.restore();
}
```

**Quando usar:** Galeria, memories, mood board, estilo scrapbook, timeline.

## 7. Torn Edge Frame (Borda Rasgada)

Efeito de papel rasgado nas bordas. Estilo editorial/vintage.

```javascript
function frameTornEdge(ctx, x, y, w, h, tearSize = 8) {
  ctx.save();
  ctx.beginPath();
  
  // Top edge (irregular)
  ctx.moveTo(x, y);
  for (let px = x; px < x + w; px += tearSize) {
    const offsetY = Math.random() * tearSize - tearSize / 2;
    ctx.lineTo(px, y + offsetY);
  }
  
  // Right edge
  ctx.lineTo(x + w, y);
  for (let py = y; py < y + h; py += tearSize) {
    const offsetX = Math.random() * tearSize - tearSize / 2;
    ctx.lineTo(x + w + offsetX, py);
  }
  
  // Bottom edge (irregular)
  ctx.lineTo(x + w, y + h);
  for (let px = x + w; px > x; px -= tearSize) {
    const offsetY = Math.random() * tearSize - tearSize / 2;
    ctx.lineTo(px, y + h + offsetY);
  }
  
  // Left edge
  ctx.lineTo(x, y + h);
  for (let py = y + h; py > y; py -= tearSize) {
    const offsetX = Math.random() * tearSize - tearSize / 2;
    ctx.lineTo(x + offsetX, py);
  }
  
  ctx.closePath();
  ctx.clip();
  // ... draw photo inside ...
  ctx.restore();
}
```

**Quando usar:** Estilo vintage, cobertura jornalística, antes/depois.

## 8. Ornamental Frame (Decorativo)

Linhas e ornamentos nas esquinas. Estilo elegante/luxo.

```javascript
function frameOrnamental(ctx, x, y, w, h, options = {}) {
  const {
    color = '#D4AF37', // Gold
    thickness = 1.5,
    cornerSize = 24,
    inset = 8,
  } = options;
  
  ctx.strokeStyle = color;
  ctx.lineWidth = thickness;
  
  const ix = x + inset;
  const iy = y + inset;
  const iw = w - inset * 2;
  const ih = h - inset * 2;
  
  // Main rect (thin line)
  ctx.strokeRect(ix, iy, iw, ih);
  
  // Corner ornaments (L-shapes em cada canto)
  ctx.lineWidth = thickness * 2;
  
  // Top-left
  ctx.beginPath();
  ctx.moveTo(ix, iy + cornerSize);
  ctx.lineTo(ix, iy);
  ctx.lineTo(ix + cornerSize, iy);
  ctx.stroke();
  
  // Top-right
  ctx.beginPath();
  ctx.moveTo(ix + iw - cornerSize, iy);
  ctx.lineTo(ix + iw, iy);
  ctx.lineTo(ix + iw, iy + cornerSize);
  ctx.stroke();
  
  // Bottom-right
  ctx.beginPath();
  ctx.moveTo(ix + iw, iy + ih - cornerSize);
  ctx.lineTo(ix + iw, iy + ih);
  ctx.lineTo(ix + iw - cornerSize, iy + ih);
  ctx.stroke();
  
  // Bottom-left
  ctx.beginPath();
  ctx.moveTo(ix + cornerSize, iy + ih);
  ctx.lineTo(ix, iy + ih);
  ctx.lineTo(ix, iy + ih - cornerSize);
  ctx.stroke();
}
```

**Quando usar:** Convites formais, certificados, diploma, luxo, gold-accented designs.

---

## Tabela de Decisão

| Contexto | Frame Recomendado | Radius |
|----------|------------------|--------|
| Social media post | Rounded | 12-16 px |
| Avatar/perfil | Circular | N/A |
| Card político/institucional | Glass | 12 px |
| Blog card light theme | Shadow Box | 8 px |
| Foto destaque editorial | Double Border | 0 px |
| Galeria/memories | Polaroid | 0 px |
| Estilo vintage/jornalístico | Torn Edge | N/A |
| Certificado/convite | Ornamental | 0 px |
| OG image | Nenhum ou Rounded | 0 px |
