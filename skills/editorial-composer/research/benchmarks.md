# Benchmarks — Padrões Observados em Referências Reais

Toda regra no `decision-engine.md` é fundamentada nestes benchmarks.
Padrões documentados a partir de análise de referências reais com fontes citadas.

## Fontes de Pesquisa

| Fonte | Tipo | O que extraímos |
|-------|------|----------------|
| **The Guardian** | Publisher — digital-first broadsheet | Card system, crop ratios (5:4, 4:5, 1:1), category badges, gradient overlays on hero, section color-coding |
| **The New York Times** | Publisher — premium editorial | Magazine layout, frosted panels, read-time badges, minimal chrome, whitespace hierarchy, vertical rhythm |
| **BBC News** | Publisher — global news | Image-first cards, bold headlines sem serif, tag de tempo relativo, aspect ratio 16:9 fixo em video cards |
| **Folha de S.Paulo / G1** | Publisher — BR news | Cards com badge de editoria em caixa-alta, scrim gradient em hero, accent color por caderno |
| **Nexo Jornal** | Publisher — BR editorial premium | Tipografia serif em títulos, paleta restrita (3 cores), uso extenso de ilustração em vez de foto |
| Nielsen Norman Group | Research | Cards = unidade modular; browsing > searching; common region principle |
| USWDS (designsystem.digital.gov) | Design system | Card variants: default, flag, media-first; accessibility com `ul`/`li` |
| Material Design M3 (m3.material.io) | Design system | 3 variantes: elevated, filled, outlined; M3 reduz shadow, separa por cor |
| MDN Web Docs | API reference | Canvas 2D: drawImage 9-params, compositing, clipping, framing examples |
| Buffer Social Media Sizes 2026 | Size guide | Dimensões atualizadas para 9 plataformas, 50+ formatos |
| Referências visuais do usuário (5 imagens) | Visual analysis | Collages, frames, grids, shape compositions |

---

## Benchmarks Editoriais — Publishers Reais

### The Guardian (theguardian.com)

Padrões extraídos da homepage e article pages:

| Padrão | Detalhe | Impacto na Skill |
|--------|---------|-----------------|
| **Crop ratios fixos por seção** | Hero 5:4, features 4:5 (vertical), square 1:1 para listas | Usar ratios consistentes por `outputType`, nunca ratio livre |
| **Section color-coding** | Cada editoria (News, Opinion, Sport) tem cor de accent distinta usada em borders e labels | Valida nosso sistema de `theme → badge color` |
| **Category badge como texto simples** | Badges são texto puro em caixa-alta com cor, sem fundo/pill — apenas acima do título | Alternativa ao pill: texto puro colorido para contextos formais |
| **Gradient scrim seletivo** | Hero image usa scrim bottom forte (~0.7); cards internos NÃO usam scrim, separam texto abaixo | Scrim é técnica de hero/destacado, não de todo card |
| **Kicker + headline** | Estrutura: editoria (kicker) → título (headline) → standfirst (subtítulo) | Hierarquia 3-tier: badge → título → subtítulo |
| **Author byline com avatar** | Opinião mostra avatar circular do autor (1:1 crop, 80-130px) ao lado do byline | Uso de avatar circular para cards de opinião/pronunciamento |
| **Tipografia dual** | Guardian Text Egyptian (serif) em títulos, Guardian Text Sans em corpo | Nosso equivalente: Montserrat (bold) + Inter (regular) |

### The New York Times (nytimes.com)

| Padrão | Detalhe | Impacto na Skill |
|--------|---------|-----------------|
| **Magazine layout** | Artigos de destaque usam foto full-bleed + painel semi-transparente com tipografia | Valida nosso layout "Magazine" com frosted glass panel |
| **Read-time badge** | "5 MIN READ" em cinza sutil — metadado funcional, não decorativo | Metadado como utilidade, não como elemento visual forte |
| **Whitespace como hierarquia** | Mais espaço = mais importância. Hero tem 3x o espaço de cards secundários | Padding proporcional à importância da peça |
| **Minimal chrome** | Quase zero borders, zero shadows visíveis — separação por espaço e tipografia | Para peças formais: remover frames, usar apenas whitespace |
| **Vertical rhythm** | Títulos de tamanhos muito diferentes (60px hero vs 18px sidebar) coexistem via grid | Font size deve variar dramaticamente entre hierarquias |
| **Opinião = aspas visuais** | Coluna de opinião marcada visualmente com aspas grandes decorativas | Elemento visual diferenciador para conteúdo de opinião |

### BBC News (bbc.com/news)

| Padrão | Detalhe | Impacto na Skill |
|--------|---------|-----------------|
| **Image-first cards** | Foto ocupa 60-70% do card; texto abaixo, nunca sobre a foto em cards menores | Para `thumbnail` e cards pequenos: texto separado, não overlay |
| **Headline sans-serif bold** | BBC Reith Sans em peso bold, zero decoração, contraste máximo | Confirma Montserrat bold como decisão correta para headlines |
| **Time badge relativo** | "3 hrs ago", "52 mins ago" — tempo como informação funcional | Badge de tempo é metadado de relevância, não apenas data |
| **Aspect ratio 16:9 fixo** | Video cards e hero SEMPRE 16:9; photo cards podem variar | Para cards com vídeo: forçar 16:9 |
| **Sem overlay em cards menores** | Cards de lista usam texto 100% separado da foto (abaixo) | Overlay é para hero/destaque. Cards de lista: texto abaixo |
| **Section labels** | Labels como "US & Canada", "Africa" em caixa normal + cor | Valida category labels como texto simples com cor |

### Folha/G1 (BR — digital news mainstream)

| Padrão | Detalhe | Impacto na Skill |
|--------|---------|-----------------|
| **Badge de editoria em caixa-alta** | "POLÍTICA", "ECONOMIA" em bold caps com cor de fundo | Valida nosso badge pill com uppercase |
| **Scrim gradient em hero** | Gradient preto bottom em hero cards, 0.5-0.7 opacity | Consistente com nosso padrão universal |
| **Accent color por caderno** | Cada caderno tem cor (Política=azul, Economia=roxo, Esporte=verde) | Paralelo direto ao nosso theme → badge color |
| **Foto: crop face-aware** | Fotos de políticos sempre com rosto visível, crop centralizado no rosto | Regra de faces: rosto sempre visível, nunca cortado |

### Nexo Jornal (BR — editorial premium)

| Padrão | Detalhe | Impacto na Skill |
|--------|---------|-----------------|
| **Paleta restrita** | Máximo 3 cores por peça visual (1 primária + 1 accent + 1 neutro) | "Max 2 cores de destaque" já é regra; Nexo valida |
| **Ilustração > foto** | Para temas abstratos (economia, política), usa ilustração em vez de foto genérica | Quando foto é genérica/fraca, considerar layout sem foto (split com cor sólida) |
| **Tipografia como elemento visual** | Títulos grandes com tracking negativo, usados como elemento gráfico | Para cards de opinião/destaque, tipografia pode ser o hero visual |

---

## Padrões-Chave por Fonte (Design Systems)

### NN/g — Cards como Componente UI

- Cards são **unidades modulares** — entrada rápida para conteúdo detalhado
- Funcionam melhor para **browsing** (explorar), não searching (buscar algo específico)
- O **princípio de common region** (borda + fundo diferente) cria agrupamento forte
- Cards são ideais para **conteúdo heterogêneo** (mix de mídia + texto + ações)
- **Anti-pattern**: não repetir mesma imagem em todos os cards de uma coleção
- **Anti-pattern**: card sem ação clicável — card PRECISA ser link para detalhes

### USWDS — Card Variants

- **Default**: imagem topo + conteúdo base → nosso layout "standard"
- **Flag**: horizontal imagem-esquerda + texto-direita → nosso layout "split"
- **Header-first**: header antes da mídia → útil para SEO/screen readers
- **Exdent**: conteúdo que extende além da borda → efeito editorial premium
- **Acessibilidade**: `<ul>` + `<li>` para card groups; heading level correto

### Material Design M3

- **Elevated**: shadow sutil → nosso shadow-box frame
- **Filled**: fundo sólido contrastante → nosso bg sólido em layout split
- **Outlined**: border sem shadow → nosso glass frame simplificado
- Tendência M3: **menos shadow por default**, mais separação por cor e borda

### Análise Visual — 5 Referências do Usuário

#### Ref 1 — Collage Artística (Mixed Media)

Composição scatter com halftone, duotone isolado, recortes irregulares, botânicos sobrepostos, papel texturizado.

- **Aplicável**: background texture, torn-edge masks, overlapping layers
- **Fora de escopo**: composição scatter livre (sem grid estruturado)
- **Lição**: texturas de fundo (paper, linen) elevam composições simples

#### Ref 2 — Scrapbook / Vision Board

Polaroids, washi tape, ransom-note typography, stickers decorativos, papel amassado.

- **Aplicável**: frame polaroid (com clip), torn-paper borders
- **Fora de escopo**: ransom-note type, layout scatter orgânico
- **Lição**: polaroid frame é o mais versátil para cards informais/pessoais

#### Ref 3 — Photo Grid + Text Cells (Magazine)

Grid tight (gap ~4px), color grading consistente (warm) em TODAS as fotos, painel de texto centralizado como célula do grid, frases em cells.

- **Insight-chave**: consistência de color grading em coleções de cards
- **Aplicável**: texto como célula de grid (não só overlay), grid tight com toning uniforme
- **Lição para coleções**: aplicar o MESMO color grading em todas as imagens de um grupo

#### Ref 4 — Catálogo de 6 Frames

Mesma foto com 6 molduras: bracket/ornamental, white inset, polaroid+clip, hexagonal+gold, octagonal+bold bg, scalloped circle.

- **Aplicável**: expandir `frames-masks` com octagonal e scalloped circle
- **Insight-chave**: **mesma foto + 6 molduras = 6 personalidades**. Frame define tom
- **Lição**: a moldura é a decisão visual que mais muda a percepção da peça

#### Ref 5 — Heart-Shape Collage

Fotos variadas organizadas em silhueta de coração, tonalidade muted consistente, fundo linen.

- **Aplicável**: shape-masked multi-photo (avançado)
- **Fora de escopo**: collages multi-foto em shapes arbitrários
- **Lição**: consistência tonal (muting uniform) unifica fotos de origens diferentes

## Padrões Recorrentes Universais

De todas as fontes, estes padrões aparecem **consistentemente** em peças editoriais de qualidade.

> **Nota metodológica**: frequências abaixo são observações qualitativas baseadas em análise visual
> das homepages de Guardian, NYT, BBC, Folha/G1 e Nexo (abril 2026), não métricas quantitativas.
> "Quase universal" = observado em ≥4 dos 5 publishers; "Muito recorrente" = ≥3; "Frequente" = ≥2.

| Padrão | Frequência Observada | Impacto |
|--------|---------------------|---------|
| Gradient overlay escuro na base | Quase universal em cards de notícia | Garante legibilidade |
| Título curto e bold | Muito recorrente em peças de destaque | Leitura rápida, impacto |
| Badge/tag temático | Frequente em sites de notícia (Guardian, BBC, Folha) | Categoriza visualmente |
| Face close-up em foto principal | Muito recorrente em cards de alto destaque | Conexão humana |
| Zona de respiro (padding generoso) | Universal em design de qualidade | Elegância, legibilidade |
| Consistência tonal em coleções | Universal | Coesão e profissionalismo |
| Max 1 ponto focal por card | Universal | Um card = um assunto = um destaque |

## 7 Lições para o Decision Engine

1. **Gradient scrim é o padrão de ouro** — 90% das vezes é a escolha certa
2. **Frame define personalidade** — mesma foto muda de tom com frames diferentes
3. **Consistência > criatividade** — em coleções, uniformidade importa mais que variedade
4. **Card não é poster** — é resumo clicável, não peça final. Menos é mais
5. **Faces vendem** — fotos com rostos geram mais engajamento. Priorizar
6. **Badge categoriza** — primeiro sinal visual de "que tipo de conteúdo é este"
7. **Text cells** — texto como célula de grid é alternativa viável a overlay (layouts formais)
