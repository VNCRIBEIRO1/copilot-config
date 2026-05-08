---
name: image-marketing
description: "Templates e referências para criação de prompts de IA de imagem, banners HTML/CSS, scripts Photoshop JSX, e briefings de design para campanhas de marketing. Geração local via sd-webdesign (https://github.com/VNCRIBEIRO1/sd-webdesign). Use when: generating image prompts, SD local generation, creating banners, writing Photoshop scripts, making marketing visuals, designing web mockups, campaign materials."
argument-hint: "Descreva o que você precisa criar (banner, prompt, campanha, mockup de web, etc.)"
---

# Image & Marketing Skill

Skill de apoio para geração de materiais visuais e de marketing. Plataforma principal de geração: **[sd-webdesign](https://github.com/VNCRIBEIRO1/sd-webdesign)** (Stable Diffusion local). Contém templates, referências de dimensões e exemplos prontos para uso.

## Quando Usar

- Precisa de um prompt otimizado para SD local (sd-webdesign), Midjourney ou DALL-E
- Precisa de mockups de web design, hero shots, OG images gerados localmente
- Precisa de um banner HTML/CSS responsivo
- Precisa de um script JSX para Photoshop
- Precisa de um briefing completo para designer
- Precisa de copy + visual para campanha de marketing

## Workflow

1. Identifique o objetivo e plataforma-alvo
2. Consulte as referências de dimensões em [dimensions.md](./references/dimensions.md)
3. Escolha o canal de geração: **SD local** → `sd-webdesign`, Midjourney ou DALL-E
4. Use o template de prompt apropriado abaixo
5. Adapte ao briefing do usuário
6. Entregue artefato pronto para uso

---

## Geração Local — sd-webdesign

**Repo:** https://github.com/VNCRIBEIRO1/sd-webdesign  
Stable Diffusion local otimizado para assets de web design: mockups de dispositivos, hero images, blobs, cards, OG images, thumbnails.

### Modelos recomendados por tipo de asset

| Asset | Modelo | Motivo |
|-------|--------|--------|
| Phone / device mockups | `dreamshaper_8.safetensors` | Melhor equilíbrio fotorrealismo + UI rendering |
| Hero portraits fundadores | `realisticVisionV60B1_v60B1VAE.safetensors` | Pele realista, sem artefatos |
| Hero illustrations / SaaS | `protogenX34Photorealism_1.ckpt` | Stylized + clean |
| Background abstract / blobs | `deliberate_v6.safetensors` | Excelente para gradientes orgânicos |
| OG images / social banners | `dreamshaper_8.safetensors` | Versátil para composição mista |

### Configurações de geração por caso de uso

```yaml
# Phone mockup — UI screen visible
sampler: DPM++ 2M Karras
steps: 28
cfg_scale: 7
width: 512
height: 768          # 9:16 portrait para mobile
hires_fix: true
hires_upscaler: 4x-UltraSharp
hires_denoising: 0.4
seed: -1

# Hero shot fotorrealista
sampler: DPM++ 2M Karras
steps: 30
cfg_scale: 6.5
width: 768
height: 512          # 16:9 landscape
hires_fix: true
hires_upscaler: 4x-UltraSharp
hires_denoising: 0.35

# OG image / social card (1200x630 → gerar 1024x512, upscale depois)
sampler: DPM++ SDE Karras
steps: 25
cfg_scale: 7.5
width: 1024
height: 512

# Background / blob / abstrato
sampler: Euler a
steps: 20
cfg_scale: 5
width: 512
height: 512
```

### ControlNet para web mockups

| ControlNet | Pré-processor | Uso |
|-----------|--------------|-----|
| `canny` | Canny edge | Reproduzir estrutura de um wireframe/sketch |
| `depth` | MiDaS depth | Manter perspectiva de mockup de referência |
| `openpose` | OpenPose | Matching de pose em fotos de fundadores |
| `tile` | Tile resample | Upscale com detalhe (alternativa ao hires.fix) |
| `ip-adapter` | IP-Adapter FaceID | Consistência de rosto entre gerações |

### Workflow img2img para iterações

```
1. Gerar texto-para-imagem com prompt completo
2. Identificar área problemática (texto corrompido, prop distorcida)
3. Usar inpainting: maskar só a área com problema
4. Prompt de inpainting: descrever só o que deve aparecer ali
5. Denoising strength: 0.55–0.70 (alto = mais liberdade, baixo = fiel ao original)
6. Exportar → squoosh.app → WebP 80% + AVIF fallback
```

### Templates de prompt para sd-webdesign

**Hero SaaS — estética pink/violet (pixelcodestudio)**
```
photorealistic SaaS product hero image, soft pink to violet gradient background
(#ec268d to #7b3ff2), floating glassmorphic UI card, modern minimal design,
studio lighting, 8k, sharp focus, no text, no watermarks, Awwwards aesthetic,
ultra-clean composition
Negative: blurry, low quality, text, watermark, logo, cropped, deformed, ugly,
bad anatomy, extra limbs, duplicate, jpeg artifacts, oversaturated, stock photo look
```

**Phone mockup com UI**
```
photorealistic iPhone 16 Pro mockup floating at slight angle, on screen: clean mobile
app UI with gradient buttons, modern sans-serif typography, soft drop shadow,
studio key light from upper left, pastel gradient backdrop, 8k render, no text outside screen
Negative: blurry, deformed screen, text artifacts, bad reflections, low quality,
watermark, extra objects
```

**Fundador / pessoa profissional**
```
confident Brazilian professional in late 30s, warm approachable smile, modern
smart-casual style, soft studio lighting, neutral gradient backdrop, shallow depth
of field, LinkedIn quality portrait, photorealistic, no text, no logos
Negative: unrealistic skin, plastic look, text, watermark, deformed face, extra fingers,
bad hands, blur, overexposed
```

**Background blob abstrato**
```
abstract organic gradient blob shape, smooth color transition from deep magenta
to violet, soft glowing halo, glassmorphism feel, isolated on white background,
4k quality, no hard edges, no text
Negative: geometric shapes, text, low quality, artifacts, sharp edges
```

**OG Image / Social Card dark**
```
dark navy web design agency brand cover, deep background #0f1230, large
pink-to-violet gradient abstract shape center-left, floating geometric UI elements,
generous negative space, professional branding, horizontal composition 2:1
Negative: text artifacts, low quality, busy composition, neon overload, stock photo
```

### Checklist de entrega de asset SD

1. Gerar em 2× o tamanho de exibição (Retina)
2. Rodar no `squoosh.app` → WebP 80% + AVIF
3. Adicionar `loading="lazy"` + `width`/`height` explícitos (evita CLS)
4. Remover/sobrepor qualquer texto gerado pela SD (sempre corrompido) com HTML/CSS real
5. Verificar licença comercial (SD local = sem restrições de licença)
6. Confirmar paleta: usar Coolors ou DevTools eyedropper para alinhar com brand

## Referências Rápidas

### Dimensões por Plataforma (px)

| Plataforma | Formato | Largura | Altura |
|-----------|---------|---------|--------|
| Instagram | Feed quadrado | 1080 | 1080 |
| Instagram | Story/Reels | 1080 | 1920 |
| Instagram | Carrossel | 1080 | 1350 |
| Facebook | Post | 1200 | 630 |
| Facebook | Cover | 820 | 312 |
| Facebook | Ad | 1200 | 628 |
| YouTube | Thumbnail | 1280 | 720 |
| YouTube | Banner | 2560 | 1440 |
| LinkedIn | Post | 1200 | 627 |
| Twitter/X | Post | 1600 | 900 |
| WhatsApp | Status | 1080 | 1920 |
| Google Ads | Leaderboard | 728 | 90 |
| Google Ads | Medium Rectangle | 300 | 250 |
| Google Ads | Skyscraper | 160 | 600 |
| E-mail | Header | 600 | 200 |
| Pinterest | Pin | 1000 | 1500 |

### Estrutura de Prompt para IA de Imagem

```
[ESTILO] [SUJEITO] [AÇÃO/POSE] [CENÁRIO/FUNDO] [ILUMINAÇÃO] [CORES] [COMPOSIÇÃO] [DETALHES EXTRAS]
```

### Negative Prompts Padrão (Stable Diffusion)

```
blurry, low quality, deformed, ugly, bad anatomy, bad proportions, extra limbs, duplicate, watermark, text, logo, signature, cropped, out of frame, worst quality, low resolution, jpeg artifacts
```

### Parâmetros Midjourney Comuns

| Param | Uso | Exemplo |
|-------|-----|---------|
| `--ar` | Aspect ratio | `--ar 16:9` |
| `--v` | Versão | `--v 6.1` |
| `--style` | Estilo | `--style raw` |
| `--q` | Qualidade | `--q 2` |
| `--chaos` | Variação | `--chaos 30` |
| `--no` | Excluir | `--no text, watermark` |
| `--s` | Stylize | `--s 750` |
