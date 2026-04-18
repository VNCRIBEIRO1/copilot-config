# Receitas de Composição — Canvas 2D

12 receitas prontas para composição fotográfica. Cada receita é um pattern reutilizável.

## 1. Photo Montage Básica (Foto + Overlay + Texto)

```javascript
async function montageBasic(ctx, w, h, photoUrl, title, subtitle) {
  const img = await loadImage(photoUrl);
  
  // Layer 1: Foto (cover fit)
  const { sx, sy, sw, sh } = coverFit(img, w, h);
  ctx.drawImage(img, sx, sy, sw, sh, 0, 0, w, h);
  
  // Layer 2: Gradient scrim (bottom 50%)
  const grad = ctx.createLinearGradient(0, h * 0.4, 0, h);
  grad.addColorStop(0, 'rgba(0,0,0,0)');
  grad.addColorStop(0.5, 'rgba(0,0,0,0.5)');
  grad.addColorStop(1, 'rgba(0,0,0,0.85)');
  ctx.fillStyle = grad;
  ctx.fillRect(0, 0, w, h);
  
  // Layer 3: Texto
  ctx.fillStyle = '#FFFFFF';
  ctx.font = '700 28px "Montserrat", system-ui';
  ctx.textAlign = 'left';
  ctx.fillText(title, 40, h - 80, w - 80);
  
  ctx.fillStyle = 'rgba(255,255,255,0.7)';
  ctx.font = '400 16px "Inter", system-ui';
  ctx.fillText(subtitle, 40, h - 50, w - 80);
}
```

## 2. Cover Fit (Object-Fit: Cover para Canvas)

```javascript
function coverFit(img, canvasW, canvasH) {
  const imgRatio = img.naturalWidth / img.naturalHeight;
  const canvasRatio = canvasW / canvasH;
  let sx = 0, sy = 0, sw = img.naturalWidth, sh = img.naturalHeight;
  
  if (imgRatio > canvasRatio) {
    // Imagem mais larga — cortar lados
    sw = img.naturalHeight * canvasRatio;
    sx = (img.naturalWidth - sw) / 2;
  } else {
    // Imagem mais alta — cortar topo/base
    sh = img.naturalWidth / canvasRatio;
    sy = (img.naturalHeight - sh) / 2;
  }
  return { sx, sy, sw, sh };
}
```

## 3. Image Loading (com CORS)

```javascript
function loadImage(url) {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.crossOrigin = 'anonymous';
    img.onload = () => resolve(img);
    img.onerror = reject;
    img.src = url;
  });
}
```

## 4. Circular Mask (Avatar/Profile)

```javascript
function drawCircularPhoto(ctx, img, cx, cy, radius) {
  ctx.save();
  ctx.beginPath();
  ctx.arc(cx, cy, radius, 0, Math.PI * 2);
  ctx.clip();
  
  // Cover fit dentro do círculo
  const size = radius * 2;
  const { sx, sy, sw, sh } = coverFit(img, size, size);
  ctx.drawImage(img, sx, sy, sw, sh, cx - radius, cy - radius, size, size);
  ctx.restore();
}

// Com ring colorido
function drawCircularWithRing(ctx, img, cx, cy, radius, ringColor = '#009C3B', ringWidth = 4) {
  // Ring
  ctx.beginPath();
  ctx.arc(cx, cy, radius + ringWidth, 0, Math.PI * 2);
  ctx.fillStyle = ringColor;
  ctx.fill();
  
  // Foto circular
  drawCircularPhoto(ctx, img, cx, cy, radius);
}
```

## 5. Hexagonal Mask

```javascript
function drawHexagonalPhoto(ctx, img, cx, cy, radius) {
  ctx.save();
  ctx.beginPath();
  for (let i = 0; i < 6; i++) {
    const angle = (Math.PI / 3) * i - Math.PI / 6;
    const x = cx + radius * Math.cos(angle);
    const y = cy + radius * Math.sin(angle);
    if (i === 0) ctx.moveTo(x, y);
    else ctx.lineTo(x, y);
  }
  ctx.closePath();
  ctx.clip();
  
  const size = radius * 2;
  const { sx, sy, sw, sh } = coverFit(img, size, size);
  ctx.drawImage(img, sx, sy, sw, sh, cx - radius, cy - radius, size, size);
  ctx.restore();
}
```

## 6. Rounded Rect Mask

```javascript
function drawRoundedPhoto(ctx, img, x, y, w, h, radius = 16) {
  ctx.save();
  ctx.beginPath();
  ctx.roundRect(x, y, w, h, radius);
  ctx.clip();
  
  const { sx, sy, sw, sh } = coverFit(img, w, h);
  ctx.drawImage(img, sx, sy, sw, sh, x, y, w, h);
  ctx.restore();
}
```

## 7. Duotone Effect

Mapeia sombras e highlights para duas cores, criando efeito editorial premium.

```javascript
function applyDuotone(ctx, w, h, shadowColor, highlightColor) {
  const imageData = ctx.getImageData(0, 0, w, h);
  const data = imageData.data;
  
  // Parse hex colors
  const shadow = hexToRGB(shadowColor);   // ex: '#1a1a2e'
  const highlight = hexToRGB(highlightColor); // ex: '#009C3B'
  
  for (let i = 0; i < data.length; i += 4) {
    // Luminância CIE
    const lum = (0.2126 * data[i] + 0.7152 * data[i+1] + 0.0722 * data[i+2]) / 255;
    
    // Interpolar entre shadow e highlight
    data[i]   = shadow.r + (highlight.r - shadow.r) * lum;
    data[i+1] = shadow.g + (highlight.g - shadow.g) * lum;
    data[i+2] = shadow.b + (highlight.b - shadow.b) * lum;
  }
  
  ctx.putImageData(imageData, 0, 0);
}

function hexToRGB(hex) {
  const r = parseInt(hex.slice(1,3), 16);
  const g = parseInt(hex.slice(3,5), 16);
  const b = parseInt(hex.slice(5,7), 16);
  return { r, g, b };
}
```

## 8. Double Exposure

Combina duas fotos usando blending modes via `globalCompositeOperation`.

```javascript
async function doubleExposure(ctx, w, h, photoUrl1, photoUrl2, blendMode = 'screen') {
  const img1 = await loadImage(photoUrl1);
  const img2 = await loadImage(photoUrl2);
  
  // Base photo
  const fit1 = coverFit(img1, w, h);
  ctx.drawImage(img1, fit1.sx, fit1.sy, fit1.sw, fit1.sh, 0, 0, w, h);
  
  // Blend photo
  ctx.globalCompositeOperation = blendMode; // 'screen', 'multiply', 'overlay'
  const fit2 = coverFit(img2, w, h);
  ctx.drawImage(img2, fit2.sx, fit2.sy, fit2.sw, fit2.sh, 0, 0, w, h);
  
  ctx.globalCompositeOperation = 'source-over'; // Reset
}
```

## 9. Vignette Effect

```javascript
function applyVignette(ctx, w, h, intensity = 0.6) {
  const gradient = ctx.createRadialGradient(w/2, h/2, w * 0.3, w/2, h/2, w * 0.8);
  gradient.addColorStop(0, 'rgba(0,0,0,0)');
  gradient.addColorStop(1, `rgba(0,0,0,${intensity})`);
  ctx.fillStyle = gradient;
  ctx.fillRect(0, 0, w, h);
}
```

## 10. Color Grading (Warm/Cool/Vintage)

```javascript
function applyColorGrading(ctx, w, h, preset = 'warm') {
  const imageData = ctx.getImageData(0, 0, w, h);
  const data = imageData.data;
  
  const presets = {
    warm:    { r: 10, g: 0, b: -15, saturation: 1.1 },
    cool:    { r: -10, g: 0, b: 15, saturation: 0.9 },
    vintage: { r: 20, g: 10, b: -20, saturation: 0.7 },
    moody:   { r: -5, g: -5, b: 10, saturation: 0.8 },
    golden:  { r: 15, g: 8, b: -10, saturation: 1.15 },
  };
  
  const p = presets[preset];
  
  for (let i = 0; i < data.length; i += 4) {
    data[i]   = clamp(data[i]   + p.r);    // R
    data[i+1] = clamp(data[i+1] + p.g);    // G
    data[i+2] = clamp(data[i+2] + p.b);    // B
    
    // Adjust saturation
    if (p.saturation !== 1) {
      const gray = 0.2126 * data[i] + 0.7152 * data[i+1] + 0.0722 * data[i+2];
      data[i]   = clamp(gray + (data[i] - gray) * p.saturation);
      data[i+1] = clamp(gray + (data[i+1] - gray) * p.saturation);
      data[i+2] = clamp(gray + (data[i+2] - gray) * p.saturation);
    }
  }
  
  ctx.putImageData(imageData, 0, 0);
}

function clamp(v) { return Math.max(0, Math.min(255, v)); }
```

## 11. Photo Strip (Múltiplas Fotos em Grid)

```javascript
async function photoStrip(ctx, w, h, photoUrls, cols = 3, gap = 4) {
  const rows = Math.ceil(photoUrls.length / cols);
  const cellW = (w - gap * (cols + 1)) / cols;
  const cellH = (h - gap * (rows + 1)) / rows;
  
  for (let i = 0; i < photoUrls.length; i++) {
    const col = i % cols;
    const row = Math.floor(i / cols);
    const x = gap + col * (cellW + gap);
    const y = gap + row * (cellH + gap);
    
    const img = await loadImage(photoUrls[i]);
    drawRoundedPhoto(ctx, img, x, y, cellW, cellH, 8);
  }
}
```

## 12. Gradient Map (Custom LUT)

```javascript
function applyGradientMap(ctx, w, h, colorStops) {
  // colorStops: [{pos: 0, color: '#000'}, {pos: 0.5, color: '#009C3B'}, {pos: 1, color: '#FFF'}]
  // Build 256-entry LUT
  const lut = buildLUT(colorStops);
  
  const imageData = ctx.getImageData(0, 0, w, h);
  const data = imageData.data;
  
  for (let i = 0; i < data.length; i += 4) {
    const lum = Math.round(0.2126 * data[i] + 0.7152 * data[i+1] + 0.0722 * data[i+2]);
    const mapped = lut[lum];
    data[i]   = mapped.r;
    data[i+1] = mapped.g;
    data[i+2] = mapped.b;
  }
  
  ctx.putImageData(imageData, 0, 0);
}

function buildLUT(stops) {
  const lut = new Array(256);
  for (let i = 0; i < 256; i++) {
    const t = i / 255;
    // Find surrounding stops
    let lo = stops[0], hi = stops[stops.length - 1];
    for (let s = 0; s < stops.length - 1; s++) {
      if (t >= stops[s].pos && t <= stops[s+1].pos) {
        lo = stops[s]; hi = stops[s+1]; break;
      }
    }
    const range = hi.pos - lo.pos || 1;
    const localT = (t - lo.pos) / range;
    const loC = hexToRGB(lo.color);
    const hiC = hexToRGB(hi.color);
    lut[i] = {
      r: Math.round(loC.r + (hiC.r - loC.r) * localT),
      g: Math.round(loC.g + (hiC.g - loC.g) * localT),
      b: Math.round(loC.b + (hiC.b - loC.b) * localT),
    };
  }
  return lut;
}
```
