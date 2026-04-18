# Social Media Sizes — 2026

Dimensões oficiais e recomendadas. Fonte: documentação oficial + Buffer Research (Mar 2026).

## Tamanhos para Editorial Cards

Estes são os formatos relevantes para peças editoriais (article cards, OG images, social cards):

| outputType | Largura | Altura | Aspect | Plataformas |
|-----------|---------|--------|--------|-------------|
| `og` | 1200 | 630 | 1.91:1 | Facebook, LinkedIn, Twitter, WhatsApp, Bluesky |
| `feed-square` | 1080 | 1080 | 1:1 | Instagram, Facebook, Twitter, LinkedIn |
| `feed-vertical` | 1080 | 1350 | 4:5 | Instagram, Facebook, Twitter, LinkedIn |
| `story` | 1080 | 1920 | 9:16 | Instagram, Facebook, TikTok |
| `thumbnail` | 800 | 420 | 1.91:1 | Blog, Next.js, CMS |
| `pinterest` | 1000 | 1500 | 2:3 | Pinterest |
| `youtube-thumb` | 1280 | 720 | 16:9 | YouTube |
| `card` | 600 | 400 | 3:2 | Cards de preview (blog grids) |

## Safe Zones

Áreas que plataformas sobrepõem com UI (botões, nome, avatar):

| Formato | Safe Zone (evitar) | Zona útil |
|---------|-------------------|-----------|
| Instagram Story | 310px topo + 310px base | 1080 × 1300 central |
| Instagram Reels | 480px topo + 480px base | 1080 × 960 central |
| YouTube Banner | Fora de 1546×423 central | 1546 × 423 |
| Facebook Cover | Canto inferior esquerdo (profile overlap) | 80% centro-direita |
| OG Image | ~10% bordas (plataformas cortam) | 80% central (960×504) |

## Tabela Completa (Todas as Plataformas)

| Plataforma | Tipo | Largura | Altura | Ratio |
|-----------|------|---------|--------|-------|
| **Facebook** | Post Square | 1080 | 1080 | 1:1 |
| | Post Vertical | 1080 | 1350 | 4:5 |
| | Story | 1080 | 1920 | 9:16 |
| | Link Preview (OG) | 1200 | 630 | 1.91:1 |
| | Cover | 851 | 315 | 2.7:1 |
| | Profile | 320 | 320 | 1:1 |
| **Instagram** | Feed Square | 1080 | 1080 | 1:1 |
| | Feed Vertical | 1080 | 1350 | 4:5 |
| | Feed Horizontal | 1080 | 566 | 1.91:1 |
| | Story/Reels | 1080 | 1920 | 9:16 |
| | Profile | 320 | 320 | 1:1 |
| **X/Twitter** | Post Horizontal | 1600 | 900 | 16:9 |
| | Post Square | 1080 | 1080 | 1:1 |
| | Link Card | 1200 | 630 | 1.91:1 |
| | Cover | 1500 | 500 | 3:1 |
| | Profile | 400 | 400 | 1:1 |
| **LinkedIn** | Post Vertical | 1080 | 1350 | 4:5 |
| | Link Preview | 1200 | 627 | 1.91:1 |
| | Cover (Personal) | 1584 | 396 | 4:1 |
| | Profile | 400 | 400 | 1:1 |
| **Pinterest** | Pin | 1000 | 1500 | 2:3 |
| | Cover | 800 | 450 | 16:9 |
| **YouTube** | Thumbnail | 1280 | 720 | 16:9 |
| | Banner | 2560 | 1440 | 16:9 |
| **TikTok** | Post/Story | 1080 | 1920 | 9:16 |
| **Bluesky** | Link Preview | 1200 | 627 | 1.91:1 |
| | Cover | 1500 | 500 | 3:1 |

## Canvas Export

```javascript
// PNG (qualidade, maior arquivo)
canvas.toDataURL('image/png');

// JPEG (fotos, menor arquivo)
canvas.toDataURL('image/jpeg', 0.92);

// WebP (web otimizado)
canvas.toDataURL('image/webp', 0.90);

// Blob (upload direto)
canvas.toBlob(blob => {
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `card-${Date.now()}.png`;
  a.click();
  URL.revokeObjectURL(url);
}, 'image/png');
```
