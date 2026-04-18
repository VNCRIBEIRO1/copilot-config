---
name: image-marketing
description: "Templates e referências para criação de prompts de IA de imagem, banners HTML/CSS, scripts Photoshop JSX, e briefings de design para campanhas de marketing. Use when: generating image prompts, creating banners, writing Photoshop scripts, making marketing visuals, designing campaign materials."
argument-hint: "Descreva o que você precisa criar (banner, prompt, campanha, etc.)"
---

# Image & Marketing Skill

Skill de apoio para geração de materiais visuais e de marketing. Contém templates, referências de dimensões e exemplos prontos para uso.

## Quando Usar

- Precisa de um prompt otimizado para DALL-E, Midjourney ou Stable Diffusion
- Precisa de um banner HTML/CSS responsivo
- Precisa de um script JSX para Photoshop
- Precisa de um briefing completo para designer
- Precisa de copy + visual para campanha de marketing

## Workflow

1. Identifique o objetivo e plataforma-alvo
2. Consulte as referências de dimensões em [dimensions.md](./references/dimensions.md)
3. Use o template apropriado em [templates/](./templates/)
4. Adapte ao briefing do usuário
5. Entregue artefato pronto para uso

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
