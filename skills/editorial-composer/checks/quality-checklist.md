# Quality Checklist — Definition of Done

Toda peça editorial DEVE passar nestes 15 critérios antes de ser considerada pronta.
Se qualquer critério obrigatório falhar, a peça precisa de ajuste.

## Critérios Obrigatórios (bloqueantes)

### Legibilidade

| # | Critério | Como verificar |
|---|----------|----------------|
| 1 | **Contraste ≥ 4.5:1** (texto ≤24px) ou ≥ 3:1 (texto >24px bold) | Calcular luminância relativa do texto vs fundo |
| 2 | **Título legível a 400px** de largura | Reduzir preview para 400px — título ainda é lido? |
| 3 | **Máximo 4 linhas** de título | Contar linhas after wrapText. Se >4, reduzir fonte |
| 4 | **Nenhum texto sobre área clara** sem tratamento | Todo texto branco TEM overlay/scrim/shadow por baixo |

### Composição

| # | Critério | Como verificar |
|---|----------|----------------|
| 5 | **Safe zone respeitada** | Nenhum texto/badge encosta em borda. Mín 5% padding |
| 6 | **Rostos não cortados** | Se há rosto na foto: visível, não coberto por badge/texto/crop |
| 7 | **Moldura não compete com título** | Frame é sutil ou ausente quando título é grande |
| 8 | **Hierarquia visual clara** | Olho identifica: 1° título → 2° badge → 3° subtítulo → 4° meta |

### Tipografia

| # | Critério | Como verificar |
|---|----------|----------------|
| 9 | **Máximo 2 famílias** tipográficas | Contar fontes usadas na composição |
| 10 | **Fontes carregadas** antes de render | `document.fonts.ready` ou `FontFace.load()` chamado |
| 11 | **Tamanho adequado** para largura | Consultar tabela §Typography de `decision-engine.md` |

### Técnico

| # | Critério | Como verificar |
|---|----------|----------------|
| 12 | **Dimensão exata** da plataforma | Largura × Altura conforme `sizes.md` |
| 13 | **HiDPI** (2x mínimo) | `canvas.width = W * dpr; canvas.height = H * dpr; ctx.scale(dpr, dpr)` |
| 14 | **CORS configurado** | `img.crossOrigin = 'anonymous'` ANTES de `img.src` |
| 15 | **Aspect ratio preservado** | Foto usa coverFit, sem distorção |

## Critérios Recomendados (não bloqueantes)

| # | Critério |
|---|----------|
| R1 | Badge usa cor exata do tema (`theme-system.md`) |
| R2 | Accent line presente abaixo do título |
| R3 | URL do site no bottom-right com opacity ≤ 0.4 |
| R4 | Exportado como PNG (qualidade) ou JPEG 0.92 (peso) |
| R5 | Testado em dark mode e light mode do SO |
| R6 | Decisões do decision-engine documentadas junto à peça |

## Anti-Patterns (proibidos em qualquer contexto)

| Anti-Pattern | Por quê |
|-------------|---------|
| Texto branco sobre foto sem overlay | Ilegível em fotos claras |
| 3+ fontes diferentes | Poluição visual, amador |
| Badge fonte > 15px | Distrai do título |
| Overlay colorido (azul, verde, etc.) | Inconsistência, parece filtro amador |
| Logo > 60px de altura | Compete com conteúdo editorial |
| UPPERCASE em título > 60 chars | Ilegível, grita demais |
| Moldura ornamental em card de notícia | Fora de tom editorial |
| Foto distorcida (aspect ratio errado) | Amador, quebra credibilidade |
| Texto fora da safe zone | Cortado em plataformas |
| Mais de 1 ponto focal por card | Confuso, sem hierarquia |
