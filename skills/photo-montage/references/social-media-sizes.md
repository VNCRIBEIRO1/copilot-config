# Social Media Image Sizes — 2026

Tamanhos oficiais e recomendados para 9 plataformas. Baseado em documentação oficial e Buffer Research (Mar 2026).

## Tabela Rápida (Todos os Tamanhos)

| Plataforma | Tipo | Largura | Altura | Aspect Ratio |
|-----------|------|---------|--------|-------------|
| **Facebook** | Profile | 320 | 320 | 1:1 |
| | Cover (Profile/Page) | 851 | 315 | 2.7:1 |
| | Cover (Group) | 1640 | 856 | 1.92:1 |
| | Cover (Event) | 1920 | 1005 | 1.91:1 |
| | Post Square | 1080 | 1080 | 1:1 |
| | Post Vertical | 1080 | 1350 | 4:5 |
| | Story | 1080 | 1920 | 9:16 |
| | Link Preview (OG) | 1200 | 630 | 1.91:1 |
| **Instagram** | Profile | 320 | 320 | 1:1 |
| | Feed Square | 1080 | 1080 | 1:1 |
| | Feed Vertical | 1080 | 1350 | 4:5 |
| | Feed Vertical (3:4) | 1080 | 1440 | 3:4 |
| | Feed Horizontal | 1080 | 566 | 1.91:1 |
| | Story/Reels | 1080 | 1920 | 9:16 |
| | Reels Thumbnail | 1080 | 1920 | 9:16 |
| **X/Twitter** | Profile | 400 | 400 | 1:1 |
| | Cover | 1500 | 500 | 3:1 |
| | Post Square | 1080 | 1080 | 1:1 |
| | Post Vertical | 1080 | 1350 | 4:5 |
| | Post Horizontal | 1600 | 900 | 16:9 |
| | Link Card | 1200 | 630 | 1.91:1 |
| **LinkedIn** | Profile | 400 | 400 | 1:1 |
| | Cover (Personal) | 1584 | 396 | 4:1 |
| | Cover (Company) | 1128 | 191 | ~6:1 |
| | Post Vertical | 1080 | 1350 | 4:5 |
| | Post Horizontal | 1080 | 360 | 3:1 |
| | Link Preview | 1200 | 627 | 1.91:1 |
| **Threads** | Profile | 320 | 320 | 1:1 |
| | Post | *any* | *any* | *any* |
| | Link Preview | 1200 | 600 | 2:1 |
| **Pinterest** | Profile | 165 | 165 | 1:1 |
| | Cover | 800 | 450 | 16:9 |
| | Pin | 1000 | 1500 | 2:3 |
| **YouTube** | Profile | 800 | 800 | 1:1 |
| | Banner | 2560 | 1440 | 16:9 |
| | Banner Safe Area | 1546 | 423 | — |
| | Thumbnail | 1280 | 720 | 16:9 |
| **TikTok** | Profile | 200 | 200 | 1:1 |
| | Post Vertical | 1080 | 1920 | 9:16 |
| | Story | 1080 | 1920 | 9:16 |
| **Bluesky** | Profile | 400 | 400 | 1:1 |
| | Cover | 1500 | 500 | 3:1 |
| | Post | *any* | *any* | *any* |
| | Link Preview | 1200 | 627 | 1.91:1 |

## Tamanhos Universais (Multi-Platform)

Para gerar UMA imagem que funcione em múltiplas plataformas:

| Cenário | Tamanho Recomendado | Funciona em |
|---------|-------------------|------------|
| Link Preview / OG Image | **1200 × 630** | Facebook, LinkedIn, Twitter, WhatsApp, Bluesky |
| Post Feed Universal | **1080 × 1080** | Instagram, Facebook, Twitter, LinkedIn |
| Post Vertical Universal | **1080 × 1350** | Instagram, Facebook, Twitter, LinkedIn |
| Story Universal | **1080 × 1920** | Instagram, Facebook, TikTok |
| Thumbnail Universal | **1280 × 720** | YouTube, Blog, Twitter |

## Safe Zones

Áreas que plataformas sobrepõem com UI (botões, nome, avatar):

| Plataforma | Formato | Safe Zone |
|-----------|---------|-----------|
| Instagram Story | 1080×1920 | Evitar 310px topo + 310px base |
| Instagram Reels | 1080×1920 | Evitar 480px topo + 480px base (grid 3:4) |
| YouTube Banner | 2560×1440 | Texto dentro de 1546×423 central |
| Facebook Cover | 851×315 | Evitar canto inferior esquerdo (profile photo overlap) |
| OG Image | 1200×630 | Texto dentro de 80% central (plataformas cortam ~10% bordas) |

## Formatos de Arquivo

| Formato | Quando Usar | Max File Size |
|---------|------------|---------------|
| PNG | Texto nítido, logos, screenshots, transparência | 8MB (Facebook) |
| JPEG | Fotos, gradients suaves, tamanho menor | 15MB (YouTube) |
| WebP | Web otimizado (blog, Next.js) | Varia |
| GIF | Animação simples, memes | 15MB |

## Canvas Export Otimizado

```javascript
// PNG (melhor qualidade, maior arquivo)
canvas.toDataURL('image/png');

// JPEG com qualidade ajustável
canvas.toDataURL('image/jpeg', 0.92); // 92% quality — bom trade-off

// WebP (menor arquivo, boa qualidade)
canvas.toDataURL('image/webp', 0.90);

// Blob para upload direto
canvas.toBlob(blob => {
  const url = URL.createObjectURL(blob);
  // upload ou download
}, 'image/png');
```
