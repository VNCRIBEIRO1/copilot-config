# Canvas 2D API — Cheatsheet Completo

Referência rápida da API `CanvasRenderingContext2D`. Baseado na documentação MDN.

> **IMPORTANTE Safari**: `ctx.filter` NÃO é suportado no Safari/iOS. Sempre usar pixel manipulation manual.

## Setup

```javascript
const canvas = document.getElementById('c');
const ctx = canvas.getContext('2d');
// HiDPI support
const dpr = window.devicePixelRatio || 1;
canvas.width = desiredWidth * dpr;
canvas.height = desiredHeight * dpr;
canvas.style.width = desiredWidth + 'px';
canvas.style.height = desiredHeight + 'px';
ctx.scale(dpr, dpr);
```

## Retângulos

```javascript
ctx.fillRect(x, y, w, h)       // Preenche retângulo
ctx.strokeRect(x, y, w, h)     // Contorno
ctx.clearRect(x, y, w, h)      // Limpa área
```

## Rounded Rect (nativo)

```javascript
// Chrome 99+, Firefox 112+, Safari 16+
ctx.beginPath();
ctx.roundRect(x, y, w, h, [r]);          // raio único
ctx.roundRect(x, y, w, h, [r1,r2,r3,r4]); // por canto
ctx.fill();
```

### Fallback (browsers antigos)

```javascript
function drawRoundedRect(ctx, x, y, w, h, r) {
  ctx.beginPath();
  ctx.moveTo(x + r, y);
  ctx.arcTo(x + w, y, x + w, y + h, r);
  ctx.arcTo(x + w, y + h, x, y + h, r);
  ctx.arcTo(x, y + h, x, y, r);
  ctx.arcTo(x, y, x + w, y, r);
  ctx.closePath();
}
```

## Paths

```javascript
ctx.beginPath()
ctx.moveTo(x, y)
ctx.lineTo(x, y)
ctx.arc(x, y, radius, startAngle, endAngle, counterclockwise?)
ctx.arcTo(x1, y1, x2, y2, radius)
ctx.ellipse(x, y, rx, ry, rotation, startAngle, endAngle, ccw?)
ctx.quadraticCurveTo(cpx, cpy, x, y)
ctx.bezierCurveTo(cp1x, cp1y, cp2x, cp2y, x, y)
ctx.rect(x, y, w, h)
ctx.roundRect(x, y, w, h, radii)  // Safari 16+
ctx.closePath()
ctx.fill()
ctx.stroke()
ctx.clip()                          // Clipping mask
ctx.isPointInPath(x, y)
ctx.isPointInStroke(x, y)
```

## Texto

```javascript
ctx.font = '700 48px "Inter", system-ui'
ctx.textAlign = 'center'         // left | right | center | start | end
ctx.textBaseline = 'middle'      // top | hanging | middle | alphabetic | ideographic | bottom
ctx.direction = 'ltr'            // ltr | rtl
ctx.letterSpacing = '2px'        // Chrome 99+, NÃO Safari
ctx.wordSpacing = '4px'          // Chrome 99+, NÃO Safari
ctx.fillText(text, x, y, maxWidth?)
ctx.strokeText(text, x, y, maxWidth?)
ctx.measureText(text)            // .width, .actualBoundingBoxAscent, etc.
```

### Word Wrap Manual

```javascript
function wrapText(ctx, text, x, y, maxWidth, lineHeight) {
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
  for (let i = 0; i < lines.length; i++) {
    ctx.fillText(lines[i], x, y + i * lineHeight);
  }
  return lines.length;
}
```

## Estilos

```javascript
ctx.fillStyle = '#ff0000'           // Cor, gradient ou pattern
ctx.strokeStyle = 'rgba(0,0,0,0.5)'
ctx.lineWidth = 2
ctx.lineCap = 'round'              // butt | round | square
ctx.lineJoin = 'round'             // miter | round | bevel
ctx.miterLimit = 10
ctx.setLineDash([5, 10])           // Dashed line
ctx.lineDashOffset = 0
ctx.globalAlpha = 0.8              // Opacidade global
```

## Gradientes

```javascript
// Linear
const lg = ctx.createLinearGradient(x0, y0, x1, y1);
lg.addColorStop(0, '#000');
lg.addColorStop(1, '#fff');
ctx.fillStyle = lg;

// Radial
const rg = ctx.createRadialGradient(x0, y0, r0, x1, y1, r1);

// Conic (Chrome 99+, Safari 16.1+)
const cg = ctx.createConicGradient(startAngle, cx, cy);
cg.addColorStop(0, 'red');
cg.addColorStop(0.33, 'green');
cg.addColorStop(0.66, 'blue');
cg.addColorStop(1, 'red');
```

## Sombras

```javascript
ctx.shadowColor = 'rgba(0, 0, 0, 0.3)'
ctx.shadowBlur = 10
ctx.shadowOffsetX = 4
ctx.shadowOffsetY = 4
// Para remover sombra após uso:
ctx.shadowColor = 'transparent'
```

## Transformações

```javascript
ctx.save()                          // Salvar estado
ctx.restore()                       // Restaurar estado
ctx.translate(x, y)
ctx.rotate(angle)                   // Radianos!
ctx.scale(sx, sy)
ctx.transform(a, b, c, d, e, f)    // Matriz
ctx.setTransform(a, b, c, d, e, f) // Reset + apply
ctx.resetTransform()                // Reset para identidade
```

## Imagens

```javascript
ctx.drawImage(img, dx, dy)
ctx.drawImage(img, dx, dy, dw, dh)                      // Scale
ctx.drawImage(img, sx, sy, sw, sh, dx, dy, dw, dh)      // Crop + scale
ctx.imageSmoothingEnabled = true
ctx.imageSmoothingQuality = 'high'  // low | medium | high
```

### Carregar Imagem (async + CORS)

```javascript
function loadImage(src) {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.crossOrigin = 'anonymous';
    img.onload = () => resolve(img);
    img.onerror = reject;
    img.src = src;
  });
}
```

## Compositing (globalCompositeOperation)

```javascript
ctx.globalCompositeOperation = 'source-over'  // padrão
```

| Operação | Efeito |
|----------|--------|
| `source-over` | Fonte sobre destino (padrão) |
| `source-atop` | Fonte apenas onde sobrepõe destino |
| `source-in` | Fonte apenas na interseção |
| `source-out` | Fonte apenas fora do destino |
| `destination-over` | Destino sobre fonte |
| `destination-atop` | Destino apenas onde sobrepõe fonte |
| `destination-in` | Destino apenas na interseção |
| `destination-out` | Destino apenas fora da fonte |
| `lighter` | Aditivo (soma cores) |
| `multiply` | Multiplica cores (escurece) |
| `screen` | Inverso de multiply (clareia) |
| `overlay` | Multiply ou screen dependendo da cor base |

## Clipping

```javascript
ctx.save();
ctx.beginPath();
ctx.arc(150, 150, 100, 0, Math.PI * 2);
ctx.clip();
ctx.drawImage(img, 0, 0, 300, 300);  // Imagem cortada em círculo
ctx.restore();
```

## Pixel Manipulation

```javascript
const imageData = ctx.getImageData(x, y, w, h);
const data = imageData.data;  // Uint8ClampedArray — RGBA, 4 bytes por pixel

for (let i = 0; i < data.length; i += 4) {
  const r = data[i], g = data[i+1], b = data[i+2], a = data[i+3];
  // Manipular r, g, b, a
  data[i] = newR;
  data[i+1] = newG;
  data[i+2] = newB;
  // data[i+3] = a; // alpha geralmente mantém
}
ctx.putImageData(imageData, x, y);
```

### Filtros Manuais (Safari Safe)

#### Grayscale (ponderado — percepção humana)
```javascript
const gray = 0.299 * r + 0.587 * g + 0.114 * b;
data[i] = data[i+1] = data[i+2] = gray;
```

#### Sepia
```javascript
data[i]   = Math.min(0.393*r + 0.769*g + 0.189*b, 255);
data[i+1] = Math.min(0.349*r + 0.686*g + 0.168*b, 255);
data[i+2] = Math.min(0.272*r + 0.534*g + 0.131*b, 255);
```

#### Invert
```javascript
data[i] = 255 - r;
data[i+1] = 255 - g;
data[i+2] = 255 - b;
```

#### Brightness (factor: 0.5 = escuro, 1.5 = claro)
```javascript
data[i]   = Math.min(r * factor, 255);
data[i+1] = Math.min(g * factor, 255);
data[i+2] = Math.min(b * factor, 255);
```

#### Contrast (factor: 0.5 = baixo, 2.0 = alto)
```javascript
data[i]   = Math.min(((r/255 - 0.5) * factor + 0.5) * 255, 255);
data[i+1] = Math.min(((g/255 - 0.5) * factor + 0.5) * 255, 255);
data[i+2] = Math.min(((b/255 - 0.5) * factor + 0.5) * 255, 255);
```

#### Duotone (mapeia grayscale para 2 cores)
```javascript
const gray = 0.299*r + 0.587*g + 0.114*b;
const t = gray / 255;
data[i]   = darkR + (lightR - darkR) * t;
data[i+1] = darkG + (lightG - darkG) * t;
data[i+2] = darkB + (lightB - darkB) * t;
```

## Export PNG

```javascript
// Via data URL + download link
function exportPNG(canvas, filename = 'banner.png') {
  const link = document.createElement('a');
  link.download = filename;
  link.href = canvas.toDataURL('image/png');
  link.click();
}

// Via Blob (alternativa — melhor para arquivos grandes)
canvas.toBlob(blob => {
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.download = 'banner.png';
  link.href = url;
  link.click();
  URL.revokeObjectURL(url);
}, 'image/png');
```

## Patterns

```javascript
const pattern = ctx.createPattern(img, 'repeat'); // repeat | repeat-x | repeat-y | no-repeat
ctx.fillStyle = pattern;
ctx.fillRect(0, 0, canvas.width, canvas.height);
```

## Path2D — Objetos de Path Reutilizáveis

```javascript
// Criar path reutilizável (evita rebuild a cada frame)
const star = new Path2D();
for (let i = 0; i < 5; i++) {
  const angle = (i * 4 * Math.PI) / 5 - Math.PI / 2;
  const method = i === 0 ? 'moveTo' : 'lineTo';
  star[method](cx + r * Math.cos(angle), cy + r * Math.sin(angle));
}
star.closePath();

// Usar em fill/stroke/clip/isPointInPath
ctx.fill(star);
ctx.stroke(star);
ctx.clip(star);
ctx.isPointInPath(star, x, y);

// Combinar paths
const combined = new Path2D();
combined.addPath(path1);
combined.addPath(path2, new DOMMatrix().translate(100, 0));

// SVG path string (powerful!)
const heart = new Path2D('M 10,30 A 20,20 0,0,1 50,30 A 20,20 0,0,1 90,30 Q 90,60 50,90 Q 10,60 10,30 z');
ctx.fill(heart);
```

## OffscreenCanvas — Renderização Off-Thread

```javascript
// Método 1: Canvas auxiliar para cache (síncrono)
const offscreen = new OffscreenCanvas(400, 400);
const offCtx = offscreen.getContext('2d');
// Desenhar elementos complexos uma vez
offCtx.arc(200, 200, 100, 0, Math.PI * 2);
offCtx.fill();
// Reusar via drawImage (muito mais rápido que redesenhar)
ctx.drawImage(offscreen, x, y);

// Método 2: Web Worker (assíncrono — heavy processing)
// main.js:
const htmlCanvas = document.getElementById('canvas');
const offscreen2 = htmlCanvas.transferControlToOffscreen();
const worker = new Worker('canvas-worker.js');
worker.postMessage({ canvas: offscreen2 }, [offscreen2]);

// canvas-worker.js:
onmessage = (e) => {
  const canvas = e.data.canvas;
  const ctx = canvas.getContext('2d');
  function render() {
    // Heavy drawing here — off main thread!
    requestAnimationFrame(render);
  }
  render();
};
```

### createImageBitmap — Decode Assíncrono

```javascript
// Decodificar imagem fora do main thread (não bloqueia UI)
const response = await fetch(url);
const blob = await response.blob();
const bitmap = await createImageBitmap(blob);
ctx.drawImage(bitmap, 0, 0);

// Com resize (hardware-accelerated)
const resized = await createImageBitmap(blob, {
  resizeWidth: 600,
  resizeHeight: 400,
  resizeQuality: 'high' // pixelated | low | medium | high
});

// Crop + resize
const cropped = await createImageBitmap(img, sx, sy, sw, sh, {
  resizeWidth: 300, resizeHeight: 200
});
```

## Convolution Kernels — Filtros Avançados (Safari Safe)

```javascript
// Engine genérica de convolução 2D
function applyConvolution(imageData, kernel, divisor = 1, offset = 0) {
  const { width, height, data } = imageData;
  const output = new Uint8ClampedArray(data);
  const kSize = Math.sqrt(kernel.length);
  const half = Math.floor(kSize / 2);

  for (let y = half; y < height - half; y++) {
    for (let x = half; x < width - half; x++) {
      let r = 0, g = 0, b = 0;
      for (let ky = 0; ky < kSize; ky++) {
        for (let kx = 0; kx < kSize; kx++) {
          const px = ((y + ky - half) * width + (x + kx - half)) * 4;
          const weight = kernel[ky * kSize + kx];
          r += data[px] * weight;
          g += data[px + 1] * weight;
          b += data[px + 2] * weight;
        }
      }
      const idx = (y * width + x) * 4;
      output[idx]     = Math.min(Math.max(r / divisor + offset, 0), 255);
      output[idx + 1] = Math.min(Math.max(g / divisor + offset, 0), 255);
      output[idx + 2] = Math.min(Math.max(b / divisor + offset, 0), 255);
    }
  }
  imageData.data.set(output);
  return imageData;
}
```

### Kernels Prontos

```javascript
// Gaussian Blur 3x3
const BLUR_3x3 = [1,2,1, 2,4,2, 1,2,1]; // divisor = 16

// Gaussian Blur 5x5 (mais suave)
const BLUR_5x5 = [
  1, 4, 6, 4, 1,
  4,16,24,16, 4,
  6,24,36,24, 6,
  4,16,24,16, 4,
  1, 4, 6, 4, 1
]; // divisor = 256

// Sharpen
const SHARPEN = [0,-1,0, -1,5,-1, 0,-1,0]; // divisor = 1

// Edge Detection (Sobel-like)
const EDGE_DETECT = [-1,-1,-1, -1,8,-1, -1,-1,-1]; // divisor = 1

// Emboss
const EMBOSS = [-2,-1,0, -1,1,1, 0,1,2]; // divisor = 1, offset = 128

// Uso:
const imgData = ctx.getImageData(0, 0, W, H);
applyConvolution(imgData, BLUR_3x3, 16);
ctx.putImageData(imgData, 0, 0);
```

### Box Blur Multi-Pass (mais rápido que Gaussian para raios grandes)

```javascript
function boxBlur(imageData, radius) {
  const { width, height, data } = imageData;
  const temp = new Uint8ClampedArray(data);

  // Horizontal pass
  for (let y = 0; y < height; y++) {
    for (let x = 0; x < width; x++) {
      let r = 0, g = 0, b = 0, count = 0;
      for (let dx = -radius; dx <= radius; dx++) {
        const nx = Math.min(Math.max(x + dx, 0), width - 1);
        const idx = (y * width + nx) * 4;
        r += data[idx]; g += data[idx+1]; b += data[idx+2];
        count++;
      }
      const idx = (y * width + x) * 4;
      temp[idx] = r/count; temp[idx+1] = g/count; temp[idx+2] = b/count;
    }
  }
  // Vertical pass
  for (let y = 0; y < height; y++) {
    for (let x = 0; x < width; x++) {
      let r = 0, g = 0, b = 0, count = 0;
      for (let dy = -radius; dy <= radius; dy++) {
        const ny = Math.min(Math.max(y + dy, 0), height - 1);
        const idx = (ny * width + x) * 4;
        r += temp[idx]; g += temp[idx+1]; b += temp[idx+2];
        count++;
      }
      const idx = (y * width + x) * 4;
      data[idx] = r/count; data[idx+1] = g/count; data[idx+2] = b/count;
    }
  }
  return imageData;
}

// 3 passes de box blur ≈ Gaussian blur (teorema do limite central)
function fastGaussianBlur(imageData, radius) {
  boxBlur(imageData, radius);
  boxBlur(imageData, radius);
  boxBlur(imageData, radius);
  return imageData;
}
```

## Noise Generation (Perlin-like)

```javascript
// Simplex-like noise para texturas procedurais
function simpleNoise(x, y, seed = 42) {
  const n = Math.sin(x * 127.1 + y * 311.7 + seed) * 43758.5453;
  return n - Math.floor(n); // 0..1
}

// Fractal Brownian Motion (fbm) — ruído orgânico
function fbmNoise(x, y, octaves = 4, lacunarity = 2, gain = 0.5) {
  let value = 0, amplitude = 1, frequency = 1, maxAmplitude = 0;
  for (let i = 0; i < octaves; i++) {
    value += simpleNoise(x * frequency, y * frequency) * amplitude;
    maxAmplitude += amplitude;
    amplitude *= gain;
    frequency *= lacunarity;
  }
  return value / maxAmplitude;
}

// Gerar textura de ruído no canvas
function generateNoiseTexture(w, h, scale = 0.02, opacity = 0.08) {
  const imgData = ctx.createImageData(w, h);
  const data = imgData.data;
  for (let y = 0; y < h; y++) {
    for (let x = 0; x < w; x++) {
      const n = fbmNoise(x * scale, y * scale) * 255;
      const idx = (y * w + x) * 4;
      data[idx] = data[idx+1] = data[idx+2] = n;
      data[idx+3] = opacity * 255;
    }
  }
  ctx.putImageData(imgData, 0, 0);
}
```

## Color Matrix Transform — Filtro Universal

```javascript
// Aplicar qualquer transformação de cor via matriz 5x4
function applyColorMatrix(imageData, matrix) {
  const d = imageData.data;
  for (let i = 0; i < d.length; i += 4) {
    const r = d[i], g = d[i+1], b = d[i+2], a = d[i+3];
    d[i]   = Math.min(Math.max(matrix[0]*r + matrix[1]*g + matrix[2]*b + matrix[3]*a + matrix[4], 0), 255);
    d[i+1] = Math.min(Math.max(matrix[5]*r + matrix[6]*g + matrix[7]*b + matrix[8]*a + matrix[9], 0), 255);
    d[i+2] = Math.min(Math.max(matrix[10]*r + matrix[11]*g + matrix[12]*b + matrix[13]*a + matrix[14], 0), 255);
    d[i+3] = Math.min(Math.max(matrix[15]*r + matrix[16]*g + matrix[17]*b + matrix[18]*a + matrix[19], 0), 255);
  }
  return imageData;
}

// Matrizes pré-definidas (5x4 = 20 valores: [rr,rg,rb,ra,rOffset, gr,gg,gb,ga,gOffset, ...])
const SATURATE_150 = [
  1.3, -0.15, -0.15, 0, 0,
  -0.15, 1.3, -0.15, 0, 0,
  -0.15, -0.15, 1.3, 0, 0,
  0, 0, 0, 1, 0
];

const WARM_TINT = [
  1.1, 0, 0, 0, 10,
  0, 1.0, 0, 0, 0,
  0, 0, 0.9, 0, -10,
  0, 0, 0, 1, 0
];

const COOL_TINT = [
  0.9, 0, 0, 0, -10,
  0, 1.0, 0, 0, 0,
  0, 0, 1.1, 0, 10,
  0, 0, 0, 1, 0
];

const VINTAGE = [
  0.6, 0.3, 0.1, 0, 20,
  0.2, 0.7, 0.1, 0, 10,
  0.1, 0.2, 0.5, 0, 30,
  0, 0, 0, 1, 0
];
```

## HSL Manipulation — Conversão de Espaço de Cor

```javascript
function rgbToHsl(r, g, b) {
  r /= 255; g /= 255; b /= 255;
  const max = Math.max(r, g, b), min = Math.min(r, g, b);
  let h, s, l = (max + min) / 2;
  if (max === min) { h = s = 0; }
  else {
    const d = max - min;
    s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
    switch (max) {
      case r: h = ((g - b) / d + (g < b ? 6 : 0)) / 6; break;
      case g: h = ((b - r) / d + 2) / 6; break;
      case b: h = ((r - g) / d + 4) / 6; break;
    }
  }
  return [h * 360, s, l];
}

function hslToRgb(h, s, l) {
  h /= 360;
  let r, g, b;
  if (s === 0) { r = g = b = l; }
  else {
    const hue2rgb = (p, q, t) => {
      if (t < 0) t += 1; if (t > 1) t -= 1;
      if (t < 1/6) return p + (q - p) * 6 * t;
      if (t < 1/2) return q;
      if (t < 2/3) return p + (q - p) * (2/3 - t) * 6;
      return p;
    };
    const q = l < 0.5 ? l * (1 + s) : l + s - l * s;
    const p = 2 * l - q;
    r = hue2rgb(p, q, h + 1/3);
    g = hue2rgb(p, q, h);
    b = hue2rgb(p, q, h - 1/3);
  }
  return [Math.round(r * 255), Math.round(g * 255), Math.round(b * 255)];
}

// Hue Shift em todo o canvas
function hueShift(imageData, degrees) {
  const d = imageData.data;
  for (let i = 0; i < d.length; i += 4) {
    const [h, s, l] = rgbToHsl(d[i], d[i+1], d[i+2]);
    const [r, g, b] = hslToRgb((h + degrees) % 360, s, l);
    d[i] = r; d[i+1] = g; d[i+2] = b;
  }
  return imageData;
}
```

## WCAG Contrast Ratio — Cálculo de Acessibilidade

```javascript
// Luminância relativa (WCAG 2.1)
function relativeLuminance(r, g, b) {
  const [rs, gs, bs] = [r, g, b].map(c => {
    c /= 255;
    return c <= 0.04045 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4);
  });
  return 0.2126 * rs + 0.7152 * gs + 0.0722 * bs;
}

// Ratio de contraste (retorna 1:1 a 21:1)
function contrastRatio(r1, g1, b1, r2, g2, b2) {
  const l1 = relativeLuminance(r1, g1, b1);
  const l2 = relativeLuminance(r2, g2, b2);
  const lighter = Math.max(l1, l2);
  const darker = Math.min(l1, l2);
  return (lighter + 0.05) / (darker + 0.05);
}

// Validar compliance WCAG
function wcagLevel(ratio) {
  if (ratio >= 7) return 'AAA';        // Texto normal AAA
  if (ratio >= 4.5) return 'AA';       // Texto normal AA
  if (ratio >= 3) return 'AA-large';   // Texto grande AA (≥18pt ou ≥14pt bold)
  return 'FAIL';
}

// Exemplo: verificar antes de renderizar texto
const ratio = contrastRatio(255,255,255, 26,32,44); // branco sobre dark bg
console.log(`Contrast: ${ratio.toFixed(1)}:1 — ${wcagLevel(ratio)}`);
```

## Texto em Path (Curva)

```javascript
// Desenhar texto seguindo um arco
function textOnArc(text, cx, cy, radius, startAngle, fontSize) {
  ctx.save();
  ctx.font = `${fontSize}px system-ui, sans-serif`;
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';

  const totalWidth = ctx.measureText(text).width;
  const anglePerChar = totalWidth / radius / text.length;
  let angle = startAngle - (text.length * anglePerChar) / 2;

  for (const char of text) {
    const charW = ctx.measureText(char).width;
    angle += charW / 2 / radius;
    ctx.save();
    ctx.translate(cx + radius * Math.cos(angle), cy + radius * Math.sin(angle));
    ctx.rotate(angle + Math.PI / 2);
    ctx.fillText(char, 0, 0);
    ctx.restore();
    angle += charW / 2 / radius;
  }
  ctx.restore();
}

// Desenhar texto seguindo path Bézier
function textOnBezier(text, p0, p1, p2, p3, fontSize) {
  ctx.save();
  ctx.font = `${fontSize}px system-ui, sans-serif`;
  ctx.textBaseline = 'middle';

  const len = text.length;
  for (let i = 0; i < len; i++) {
    const t = i / (len - 1 || 1);
    // Cúbica de Bézier
    const mt = 1 - t;
    const x = mt*mt*mt*p0.x + 3*mt*mt*t*p1.x + 3*mt*t*t*p2.x + t*t*t*p3.x;
    const y = mt*mt*mt*p0.y + 3*mt*mt*t*p1.y + 3*mt*t*t*p2.y + t*t*t*p3.y;
    // Tangente para rotação
    const dx = 3*mt*mt*(p1.x-p0.x) + 6*mt*t*(p2.x-p1.x) + 3*t*t*(p3.x-p2.x);
    const dy = 3*mt*mt*(p1.y-p0.y) + 6*mt*t*(p2.y-p1.y) + 3*t*t*(p3.y-p2.y);
    const angle = Math.atan2(dy, dx);
    ctx.save();
    ctx.translate(x, y);
    ctx.rotate(angle);
    ctx.fillText(text[i], 0, 0);
    ctx.restore();
  }
  ctx.restore();
}
```

## Efeitos Gráficos Avançados

### Glow / Neon Effect

```javascript
function drawGlowText(text, x, y, color, glowColor, blur = 20) {
  ctx.save();
  // Múltiplas camadas de shadow para glow intenso
  for (let i = 0; i < 3; i++) {
    ctx.shadowColor = glowColor;
    ctx.shadowBlur = blur * (i + 1);
    ctx.shadowOffsetX = 0;
    ctx.shadowOffsetY = 0;
    ctx.fillStyle = color;
    ctx.fillText(text, x, y);
  }
  // Camada final sem glow
  ctx.shadowColor = 'transparent';
  ctx.fillStyle = '#fff';
  ctx.fillText(text, x, y);
  ctx.restore();
}
```

### Gradient Text

```javascript
function drawGradientText(text, x, y, colors) {
  const metrics = ctx.measureText(text);
  const grad = ctx.createLinearGradient(
    x - metrics.width / 2, y,
    x + metrics.width / 2, y
  );
  colors.forEach((c, i) => grad.addColorStop(i / (colors.length - 1), c));
  ctx.fillStyle = grad;
  ctx.fillText(text, x, y);
}
```

### Image Mask (clip com imagem)

```javascript
// Recortar imagem com forma circular + feather
function drawCircularImage(img, cx, cy, radius) {
  ctx.save();
  ctx.beginPath();
  ctx.arc(cx, cy, radius, 0, Math.PI * 2);
  ctx.clip();
  const size = radius * 2;
  ctx.drawImage(img, cx - radius, cy - radius, size, size);
  ctx.restore();
}

// Recortar com qualquer Path2D
function drawMaskedImage(img, path, dx, dy, dw, dh) {
  ctx.save();
  ctx.clip(path);
  ctx.drawImage(img, dx, dy, dw, dh);
  ctx.restore();
}
```

### Parallax Layers (animação sutil)

```javascript
function drawParallaxBg(layers, scrollX) {
  // layers = [{ img, speed, y }]
  for (const layer of layers) {
    const offset = (scrollX * layer.speed) % layer.img.width;
    ctx.drawImage(layer.img, -offset, layer.y);
    ctx.drawImage(layer.img, layer.img.width - offset, layer.y);
  }
}
```

## Performance — Regras de Ouro

1. **`{ alpha: false }`** — se não precisa transparência do canvas:
   ```javascript
   const ctx = canvas.getContext('2d', { alpha: false });
   ```
2. **Coordenadas inteiras** — `Math.round()` evita sub-pixel rendering
3. **Batch draws** — polyline em vez de múltiplos `lineTo` separados
4. **Cache com OffscreenCanvas** — elementos estáticos desenhados uma vez
5. **Layered canvases** — canvas separados para UI, conteúdo, background
6. **Evitar `shadowBlur` em loops** — é extremamente caro
7. **Minimizar `getImageData`/`putImageData`** — operação lenta, fazer uma vez
8. **CSS transform para scale** — usa GPU em vez de redesenhar
9. **`requestAnimationFrame`** — nunca `setInterval` para animação
10. **Evitar `save()/restore()` excessivo** — setar propriedades diretamente quando possível

### Benchmark: medir FPS

```javascript
let frameCount = 0, lastTime = performance.now();
function measureFPS() {
  frameCount++;
  const now = performance.now();
  if (now - lastTime >= 1000) {
    console.log(`FPS: ${frameCount}`);
    frameCount = 0;
    lastTime = now;
  }
  requestAnimationFrame(measureFPS);
}
```

## Compatibilidade Safari — Resumo

| Feature | Chrome | Firefox | Safari | Nota |
|---------|--------|---------|--------|------|
| `ctx.filter` | 52+ | 49+ | **NÃO** | Usar pixel manipulation |
| `roundRect()` | 99+ | 112+ | 16+ | OK |
| `createConicGradient()` | 99+ | 112+ | 16.1+ | OK |
| `letterSpacing` | 99+ | 115+ | 18.4+ | OK recente |
| `wordSpacing` | 99+ | 115+ | 18.4+ | OK recente |
| `textRendering` | 99+ | 116+ | **NÃO** | — |
| `fontKerning` | 99+ | 104+ | **NÃO** | — |
| `OffscreenCanvas` | 69+ | 105+ | 16.4+ | OK |
| `createImageBitmap` | 50+ | 42+ | 15+ | OK |
| `Path2D` | 36+ | 31+ | 7+ | OK |
| `isContextLost` | 99+ | 125+ | **NÃO** | — |
| `reset()` | 99+ | 113+ | 17.2+ | OK |
