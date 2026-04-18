# Exemplos — Input → Decisões → Output

5 exemplos completos mostrando como o decision engine transforma input em composição.

---

## Exemplo 1: Artigo de Saúde → OG Image

### Input

```json
{
  "title": "Prefeitura inaugura nova UBS no bairro São José",
  "theme": "saude",
  "photoUrl": "foto-ubs-inauguracao.jpg",
  "outputType": "og",
  "date": "15 Abr 2026",
  "author": "Equipe de Comunicação",
  "siteUrl": "spinelli.vercel.app"
}
```

### Decisões

| Decisão | Resultado | Regra Aplicada |
|---------|-----------|----------------|
| Dimensão | 1200 × 630 | outputType=og → sizes.md |
| Layout | **Standard** | 49 chars (≤50) + foto disponível |
| Overlay | **Gradient scrim 0.60** | tema=saude → estilo Padrão → overlay 0.55-0.65 |
| Título | Montserrat 700, 44px, Sentence case | 49 chars → coluna "≤50", 1200px → 44-52px |
| Badge | Pill `#16A34A` + "SAÚDE" branco | theme-system → saude |
| Frame | Nenhum | artigo genérico → sem frame |
| Branding | URL bottom-right 0.35 opacity | regra padrão de branding |

### Composição (7 Layers)

```
L0: #0D0D0D (fundo sólido)
L1: foto-ubs-inauguracao.jpg (coverFit 1200×630)
L2: gradient scrim bottom (rgba(0,0,0, 0→0.24→0.60))
L3: Pill "SAÚDE" #16A34A em (60, 60)
L4: "Prefeitura inaugura nova UBS no bairro São José" — branco 44px em (60, 480)
L5: "15 Abr 2026 • Equipe de Comunicação" — rgba(255,255,255,0.55) 14px em (60, 570)
    Accent line 48×3px #16A34A em (60, 530)
L6: "spinelli.vercel.app" — rgba(255,255,255,0.35) 12px em (1140, 570)
```

### Checklist

- ✅ Contraste: branco sobre gradient 0.60 = ~8:1
- ✅ Título legível a 400px: 44px ÷ 3 ≈ 15px visível
- ✅ 1 linha de título: OK
- ✅ Safe zone: 60px cada lado (5%)
- ✅ HiDPI: 2400×1260 real
- ✅ Dimensão: 1200×630 ✓

---

## Exemplo 2: Denúncia → Instagram Feed Vertical

### Input

```json
{
  "title": "Vereador é flagrado desviando verba da merenda escolar",
  "theme": "denuncia",
  "photoUrl": "foto-camara-municipal.jpg",
  "outputType": "feed-vertical",
  "date": "12 Abr 2026",
  "siteUrl": "spinelli.vercel.app"
}
```

### Decisões

| Decisão | Resultado | Regra |
|---------|-----------|-------|
| Dimensão | 1080 × 1350 | outputType=feed-vertical |
| Layout | **Standard** | 55 chars + foto disponível |
| Overlay | **Dark heavy 0.75** | tema=denuncia → estilo Impactante → 0.70-0.80 |
| Título | Montserrat 800, 34px, **UPPERCASE** | tema impactante + 55 chars (< 60) → uppercase |
| Badge | Pill `#991B1B` + "DENÚNCIA" branco | denuncia → theme-system |
| Frame | Nenhum | tema impactante → foco total no conteúdo |

### Composição

```
L0: #0D0D0D
L1: foto-camara-municipal.jpg (coverFit 1080×1350)
L2: dark overlay rgba(0,0,0, 0.75) uniforme
L3: Pill "DENÚNCIA" #991B1B em (32, 32)
L4: "VEREADOR É FLAGRADO DESVIANDO VERBA DA MERENDA ESCOLAR" — branco 800 34px em (32, 1050)
L5: "12 Abr 2026" — rgba(255,255,255,0.6) 14px em (32, 1290)
    Accent line 48×3px #991B1B em (32, 1250)
L6: "spinelli.vercel.app" 0.35 em (1048, 1290)
```

### Checklist

- ✅ Contraste: branco sobre 0.75 overlay = ~12:1
- ✅ UPPERCASE OK: 55 chars < 60 limite para impactante
- ✅ Safe zone: 32px (3% — OK para social, zona é UI da plataforma)
- ✅ Dimensão: 1080×1350 ✓

---

## Exemplo 3: Legislação → OG Image (Formal)

### Input

```json
{
  "title": "Lei Municipal 12.345 estabelece novas diretrizes para acessibilidade urbana",
  "theme": "legislacao",
  "photoUrl": "foto-plenario.jpg",
  "outputType": "og",
  "subtitle": "Projeto aprovado em sessão extraordinária",
  "date": "10 Abr 2026",
  "siteName": "Tenente Spinelli"
}
```

### Decisões

| Decisão | Resultado | Regra |
|---------|-----------|-------|
| Dimensão | 1200 × 630 | outputType=og |
| Layout | **Magazine** (frosted glass panel) | tema=legislacao → estilo Formal → magazine |
| Overlay | **Frosted glass panel** opacity 0.55 | tema formal → glass panel sobre foto |
| Título | Montserrat 700, 36px, Title Case, tracking +0.02em | 76 chars → "41-80", 1200px → 32-40px, formal |
| Badge | Pill `#D4AF37` + "LEGISLAÇÃO" preto | theme-system → legislacao |
| Frame | Glass frame sutil (border 0.12) | formal → glass frame |

### Composição

```
L0: #0D0D0D
L1: foto-plenario.jpg (coverFit 1200×630)
L2: gradient scrim leve 0.35 (fundo para glass)
L3: Frosted glass panel (60, 200, 540, 300) — rgba(0,0,0,0.55) + border 0.12
L4: Pill "LEGISLAÇÃO" #D4AF37 em (80, 220) — DENTRO do panel
L5: Título no panel: "Lei Municipal 12.345 Estabelece Novas Diretrizes Para Acessibilidade Urbana"
    Montserrat 700 36px Title Case em (80, 290)
L6: Subtítulo: "Projeto aprovado em sessão extraordinária" Inter 400 18px 0.6 em (80, 420)
    "10 Abr 2026" 14px 0.5 em (80, 460)
    Glass frame border em todo o card
```

### Diferença Visual

Este exemplo mostra layout **Magazine** — o texto fica dentro de um panel semi-transparente
em vez de sobre gradient. O resultado é mais sóbrio e institucional.

---

## Exemplo 4: Campanha → Instagram Story

### Input

```json
{
  "title": "Vote 10.123 — Tenente Spinelli",
  "theme": "campanha",
  "photoUrl": "foto-spinelli-comicio.jpg",
  "outputType": "story",
  "siteUrl": "spinelli.vercel.app"
}
```

### Decisões

| Decisão | Resultado | Regra |
|---------|-----------|-------|
| Dimensão | 1080 × 1920 | outputType=story |
| Layout | **Story** (foto full + texto bottom 30%) | outputType=story → layout story |
| Overlay | **Gradient dual-zone** (top leve + bottom forte 0.60) | story → 2 zonas |
| Título | Montserrat 700, 52px, **UPPERCASE** | 32 chars (≤40) + campanha → uppercase |
| Badge | Pill `#009C3B` + "CAMPANHA" branco | campanha → theme-system |
| Frame | Nenhum | story = full bleed |

### Composição

```
L0: #0D0D0D
L1: foto-spinelli-comicio.jpg (coverFit 1080×1920)
L2: gradient top: rgba(0,0,0, 0.25→0) nos primeiros 10%
    gradient bottom: rgba(0,0,0, 0→0.60) nos últimos 40%
L3: Pill "CAMPANHA" #009C3B em (32, 180) — abaixo da zona de perfil
L4: "VOTE 10.123 — TENENTE SPINELLI" — branco 52px UPPERCASE em (32, 1550)
    Accent line 48×3px #FFCC00 (gold) em (32, 1620)
L5: (sem metadados — story é limpo)
L6: "spinelli.vercel.app" 0.3 em (1048, 1860)
```

### Notas

- Story usa gold `#FFCC00` no accent (campanha = verde + gold patriótico)
- Badge posicionado em y=180px para não ser coberto pela barra de perfil do Instagram
- Bottom safe zone: 10% (botão "Ver mais" do Instagram)

---

## Exemplo 5: Infraestrutura → Blog Thumbnail

### Input

```json
{
  "title": "Obras na rodovia SP-280 avançam e beneficiam zona rural do município",
  "theme": "infraestrutura",
  "photoUrl": "foto-obras-rodovia.jpg",
  "outputType": "thumbnail",
  "date": "8 Abr 2026",
  "author": "Assessoria de Imprensa"
}
```

### Decisões

| Decisão | Resultado | Regra |
|---------|-----------|-------|
| Dimensão | 800 × 420 | outputType=thumbnail |
| Layout | **Standard** | 67 chars (41-80) + foto disponível |
| Overlay | **Gradient scrim 0.60** | tema=infraestrutura → estilo Padrão → 0.55-0.65 |
| Título | Montserrat 700, 26px, Sentence case | 67 chars → "41-80", 800px → 24-30px |
| Badge | Pill `#EA580C` + "INFRAESTRUTURA" branco | theme-system → infraestrutura |
| Frame | Nenhum | blog thumbnail → sem frame |

### Composição

```
L0: #0D0D0D
L1: foto-obras-rodovia.jpg (coverFit 800×420)
L2: gradient scrim bottom 0.60
L3: Pill "INFRAESTRUTURA" #EA580C em (24, 24)
L4: "Obras na rodovia SP-280 avançam e beneficiam zona rural do município"
    Montserrat 700 26px em (24, 300) — ~3 linhas
L5: "8 Abr 2026 • Assessoria de Imprensa" 12px 0.55 em (24, 396)
    Accent line 36×2px #EA580C em (24, 370)
L6: (sem URL — blog card é interno, link já vai para o artigo)
```

### Nota sobre Thumbnail

Blog thumbnails são menores → elementos proporcionalmente menores:
- Pill badge: 11px font
- Accent line: 36×2px (menor que OG)
- Sem URL (o card já é clicável)
- Padding: 24px (3%)

---

## Exemplos com JSON de Saída (Schema Rígido)

Os exemplos acima mostram o raciocínio narrativo. Os 3 abaixo mostram a **saída contratual exata**
no formato do schema definido em `SKILL.md`.

---

### JSON 1: Saúde OG (Caso Normal)

**Input**: Exemplo 1 acima (inauguração UBS, saude, og)

```json
{
  "layout_family": "standard",
  "dimensions": { "w": 1200, "h": 630, "dpr": 2 },
  "crop_strategy": {
    "method": "coverFit",
    "focus": "center",
    "reason": "§Layout: título ≤50 chars + foto disponível → standard"
  },
  "overlay": {
    "type": "gradient-scrim",
    "opacity": 0.60,
    "direction": "bottom"
  },
  "typography": {
    "title_font": "Montserrat",
    "title_weight": 700,
    "title_size_px": 44,
    "title_case": "sentence",
    "title_lines": 1,
    "subtitle_size_px": null,
    "meta_size_px": 14,
    "meta_opacity": 0.55
  },
  "frame_style": "none",
  "theme_tokens": {
    "theme": "saude",
    "badge_bg": "#16A34A",
    "badge_text": "#FFF",
    "badge_label": "SAÚDE",
    "style_group": "padrao",
    "accent_color": "#16A34A",
    "overlay_default": 0.60
  },
  "warnings": [],
  "export_sizes": [
    { "label": "og", "w": 1200, "h": 630 },
    { "label": "og@2x", "w": 2400, "h": 1260 }
  ]
}
```

> `warnings` vazio: nenhum fallback ativado. Todos os inputs dentro dos limites.

---

### JSON 2: Denúncia Feed-Vertical (Tema Impactante + UPPERCASE)

**Input**: Exemplo 2 acima (vereador flagrado, denuncia, feed-vertical)

```json
{
  "layout_family": "standard",
  "dimensions": { "w": 1080, "h": 1350, "dpr": 2 },
  "crop_strategy": {
    "method": "coverFit",
    "focus": "center",
    "reason": "§Layout: título 55 chars + foto disponível → standard"
  },
  "overlay": {
    "type": "dark-uniform",
    "opacity": 0.75,
    "direction": "uniform"
  },
  "typography": {
    "title_font": "Montserrat",
    "title_weight": 800,
    "title_size_px": 34,
    "title_case": "upper",
    "title_lines": 2,
    "subtitle_size_px": null,
    "meta_size_px": 14,
    "meta_opacity": 0.60
  },
  "frame_style": "none",
  "theme_tokens": {
    "theme": "denuncia",
    "badge_bg": "#991B1B",
    "badge_text": "#FFF",
    "badge_label": "DENÚNCIA",
    "style_group": "impactante",
    "accent_color": "#991B1B",
    "overlay_default": 0.75
  },
  "warnings": [],
  "export_sizes": [
    { "label": "feed-vertical", "w": 1080, "h": 1350 },
    { "label": "feed-vertical@2x", "w": 2160, "h": 2700 }
  ]
}
```

> `title_weight: 800` (extrabold) e `title_case: "upper"` — regras do estilo Impactante
> para temas denuncia/seguranca com título ≤60 chars.

---

### JSON 3: Legislação OG com Fallback (Título Longo + Formal)

**Input modificado**: título deliberadamente longo para demonstrar fallback.

```json
{
  "title": "Lei Complementar Municipal 12.345/2026 estabelece novas diretrizes para acessibilidade urbana em áreas de risco e comunidades tradicionais",
  "theme": "legislacao",
  "photoUrl": "foto-plenario.jpg",
  "outputType": "og"
}
```

**JSON de saída com fallback ativado:**

```json
{
  "layout_family": "split",
  "dimensions": { "w": 1200, "h": 630, "dpr": 2 },
  "crop_strategy": {
    "method": "coverFit",
    "focus": "center",
    "reason": "§Fallback: título 134 chars > 80 → forçar split; foto ocupa 45% esquerdo"
  },
  "overlay": {
    "type": "half-scrim",
    "opacity": 0.55,
    "direction": "right"
  },
  "typography": {
    "title_font": "Montserrat",
    "title_weight": 700,
    "title_size_px": 26,
    "title_case": "title",
    "title_lines": 4,
    "subtitle_size_px": null,
    "meta_size_px": 14,
    "meta_opacity": 0.55
  },
  "frame_style": "glass",
  "theme_tokens": {
    "theme": "legislacao",
    "badge_bg": "#D4AF37",
    "badge_text": "#000",
    "badge_label": "LEGISLAÇÃO",
    "style_group": "formal",
    "accent_color": "#D4AF37",
    "overlay_default": 0.70
  },
  "warnings": [
    "title_long: 134 chars, switched to split layout",
    "title_long: reduced font to 26px, max 4 lines"
  ],
  "export_sizes": [
    { "label": "og", "w": 1200, "h": 630 },
    { "label": "og@2x", "w": 2400, "h": 1260 }
  ]
}
```

> Este exemplo demonstra o sistema de fallback em ação. O título excede 80 chars,
> ativando a regra `§Fallbacks > title_long` que força split e reduz a fonte.
> O campo `warnings` registra ambas as ações automáticas para rastreabilidade.
