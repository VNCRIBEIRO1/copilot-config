# Decision Engine — Regras SE/ENTÃO

Cada decisão visual é feita por **regras objetivas**, não por intuição.
Consulte este arquivo ANTES de compor qualquer peça.

## §Layout — Escolha de Layout

| Condição | Layout | Justificativa |
|----------|--------|---------------|
| Título ≤ 50 chars + foto de alta qualidade | **Standard** (foto full + gradient + texto bottom) | Foto carrega a peça, título é complemento |
| Título 51-80 chars | **Standard** (font menor) ou **Split** | Avaliar se cabe em 3 linhas |
| Título > 80 chars | **Split** (foto 45% + texto 55%) | Título precisa de espaço, foto não pode competir |
| Foto indisponível ou baixa qualidade | **Split** com fundo sólido no lado do texto | Esconde a foto fraca |
| Conteúdo formal (legislacao, economia) | **Magazine** (frosted glass panel sobre foto) | Panel comunica seriedade |
| outputType = story (1080×1920) | **Story** (foto full + texto bottom 30%) | Zona de toque bottom, perfil no top |
| outputType = pinterest (1000×1500) | **Tall** (foto top 65% + texto bottom 35%) | Leitura top-down natural |
| outputType = feed-square (1080×1080) | **Standard** ou **Centered** | Formato mais versátil |

### Fallbacks

1. Não consegue determinar qualidade da foto → **Standard** com overlay forte (0.7)
2. Título está vazio → **Minimal** (foto full, sem texto, apenas badge)
3. Todos os campos opcionais vazios → **Standard** com apenas título + badge

---

## §Overlay — Técnica de Readability

| Condição da Foto | Técnica | Intensidade |
|------------------|---------|-------------|
| Clara, variada, muita textura | Gradient scrim (bottom) | 0.65–0.75 |
| Escura, uniforme | Scrim leve + text-shadow multi-layer | 0.25–0.35 |
| Muito poluída / impossível de ler | Dark overlay uniforme | 0.75–0.85 |
| Conteúdo formal | Frosted glass panel | Panel opacity 0.55 |
| News rápido | Pill badge + backdrop strip | Backdrop 0.5 |
| Denúncia / urgente | Dark heavy overlay | 0.75+ |

### Regras Adicionais de Overlay

- Gradient SEMPRE começa transparente e termina opaco na zona do texto
- Layout **Split**: overlay apenas no lado do texto (half-scrim)
- Layout **Story**: gradient em 2 zonas (top 10% leve + bottom 40% forte)
- NUNCA overlay colorido (azul, verde) — apenas preto com opacity variável
- Se foto tem rosto, scrim NÃO deve cobrir o rosto com opacity > 0.4

---

## §Typography — Hierarquia Tipográfica

### Famílias Permitidas

| Papel | Fonte | Peso | Fallback |
|-------|-------|------|----------|
| Título | Montserrat | 700 (Bold) | system-ui |
| Subtítulo / Meta | Inter | 400 (Regular) | system-ui |

### Dimensionamento — Título

| Largura Canvas | ≤ 40 chars | 41–80 chars | > 80 chars |
|----------------|-----------|-------------|-----------|
| 1200px (OG) | 44–52px | 32–40px | 24–30px |
| 1080px (Feed) | 40–48px | 28–36px | 22–28px |
| 800px (Blog) | 32–40px | 24–30px | 18–24px |
| 1080×1920 (Story) | 48–56px | 36–44px | 28–34px |

### Regras de Texto

1. Título: **máximo 4 linhas**. Se não couber, reduzir fonte (autoFit)
2. Título ≤ 40 chars → pode ser UPPERCASE (aumenta autoridade)
3. Título > 40 chars → NUNCA uppercase (ilegível em blocos grandes)
4. **Exceção**: tema `denuncia` ou `seguranca` pode uppercase até 60 chars (impacto)
5. Subtítulo: 55–65% do tamanho do título
6. Metadados (data, autor): `rgba(255,255,255, 0.55–0.65)`, 12–16px
7. Line-height: título 1.15–1.25, subtítulo 1.3–1.4
8. Letter-spacing: normal 0, uppercase +0.04em

### Teste de Miniatura

> O título DEVE ser legível quando a imagem é exibida a **400px de largura**.
> Se falhar: aumentar tamanho, aumentar contraste, simplificar texto.

---

## §Frame — Escolha de Moldura

| Contexto | Frame | Por quê |
|----------|-------|---------|
| Artigo genérico | Nenhum ou shadow-box sutil | Moldura distrai do conteúdo |
| Institucional / campanha | Glass frame (border 0.12 opacity) | Comunica autoridade |
| Social media (post isolado) | Rounded corners 12–16px | Padrão visual esperado |
| Foto de perfil / avatar | Circular com ring colorido | Identifica pessoa |
| Destaque / feature | Double-border (editorial) | Sinaliza importância |
| Output para impressão | Sem frame (bleed edge) | Gráfica adiciona margem |

### Regra de Ouro

> **Moldura é complemento, nunca protagonista.**
> Se o título é grande ou a composição está carregada, a moldura deve ser
> INVISÍVEL ou ausente. Moldura só se destaca em composições simples.

### Regra de Exclusão Mútua

- Badge bold + Frame bold → **PROIBIDO** (dois destaques competem)
- Se badge é colorido e grande → frame deve ser sutil ou ausente
- Se frame é decorativo → badge deve ser discreto (apenas texto, sem emoji)

---

## §Badge — Posição e Estilo

| outputType | Posição | Tamanho Fonte |
|------------|---------|---------------|
| og (1200×630) | Top-left (60px, 60px) — safe zone | 13–14px |
| feed (1080×1080) | Top-left (32px, 32px) | 12–13px |
| feed-vertical (1080×1350) | Top-left (32px, 32px) | 12–13px |
| story (1080×1920) | Top-left (32px, 180px) — abaixo zona perfil | 11–12px |
| thumbnail (800×420) | Top-left (24px, 24px) | 11–12px |
| pinterest (1000×1500) | Top-left (32px, 32px) | 12px |

### Formato do Badge

- Sempre **pill** (roundRect com radius 100)
- Padding: 10–14px horizontal, 5–7px vertical
- Texto: uppercase, bold
- Cor: definida por `theme-system.md`
- Emojis: apenas em contexto informal (redes sociais). OMITIR em OG/institucional

---

## §Branding — Logo e URL

| Elemento | Posição | Estilo |
|----------|---------|--------|
| URL do site | Bottom-right, safe zone | opacity 0.3–0.4, 11–13px |
| Accent line | Abaixo do título, 48×3px | Cor gold ou accent do tema |
| Logo (se houver) | Top-right ou bottom-left | opacity 0.5–0.7, max 60px height |

### Regras

- Branding é o elemento **mais sutil** da composição
- NUNCA > 0.4 opacity (exceto accent line)
- Se composição está carregada, **OMITIR logo** e manter apenas URL
- Accent line é o único elemento de branding que pode ter cor forte

---

## §Fallbacks — Degradação Controlada

Quando inputs são ruins ou incompletos, o engine ajusta automaticamente.
Cada fallback registra uma `warning` no JSON de saída.

### Cenários

| Condição Degradada | Ação Automática | Warning Key |
|--------------------|-----------------|-------------|
| **Foto baixa resolução** (< 800px lado maior) | Trocar para layout **Split** com fundo sólido `#0D0D0D` no lado do texto; foto reduzida ocupa ≤40% | `photo_lowres` |
| **Foto indisponível** (URL 404, CORS fail, campo vazio) | Layout **Split** com fundo sólido na cor do `style_group` (ex: `#1A1A2E` para formal, `#0D0D0D` para padrão); badge + título normalmente | `photo_missing` |
| **Background muito poluído** (muitas cores, texturas, padrões) | Aumentar overlay para `0.75–0.85` uniforme; se ainda ilegível, trocar para **Split** | `photo_busy` |
| **Título longo** (> 80 chars) | Forçar layout **Split**; reduzir fonte pro menor da faixa; max 4 linhas; se > 120 chars, truncar com `…` e registrar warning | `title_long` |
| **Título vazio** | Layout **Minimal**: foto full, badge apenas, sem texto; overlay reduzido para 0.3 | `title_empty` |
| **Múltiplos rostos** na foto | Crop com `focus: center`; NÃO tentar face-detection; manter overlay uniforme (evitar rosto parcialmente coberto) | `photo_multi_face` |
| **Rosto cortado** pelo crop | Shift crop 15% na direção oposta ao corte; se impossível, trocar para **Split** | `photo_face_crop` |
| **Tema não reconhecido** | Default para tema `campanha` (accent `#009C3B`, style `padrao`) | `theme_unknown` |
| **outputType não reconhecido** | Default para `og` (1200×630) | `output_unknown` |
| **Foto muito escura** (avg luminancia < 0.15) | Overlay scrim **leve** (0.20–0.30) + text-shadow multi-layer em vez de scrim pesado | `photo_dark` |
| **Foto muito clara** (avg luminancia > 0.85) | Overlay dark uniforme (0.70+) ou trocar para **Split** com fundo escuro | `photo_light` |
| **Subtitle > 80 chars** | Truncar a 80 chars com `…` | `subtitle_long` |

### Regras de Cascata

1. **Máximo 3 fallbacks simultâneos**. Se mais de 3 condições degradadas ativas → forçar layout **Split + fundo sólido** (o mais seguro)
2. Fallbacks são **cumulativos**: `photo_busy` + `title_long` → Split + overlay 0.80
3. **Warnings obrigatórios**: toda ação de fallback DEVE gerar entrada no array `warnings` do JSON de saída
4. **Precedência**: problemas de foto (lowres/missing) > problemas de título (long/empty) > problemas de tema (unknown)
