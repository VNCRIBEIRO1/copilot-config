# Stress Tests — Edge Cases

Cenários de input degradado que toda composição deve resolver corretamente.
Usar para validar que o decision-engine e os fallbacks funcionam.

## Cenários

### ST-01: Título Ultra-Longo (120+ chars)

```
Input:
  title: "Projeto de lei complementar número 4.327 do deputado federal estabelece novas diretrizes para a política nacional de proteção aos animais domésticos e silvestres"
  theme: legislacao
  outputType: og

Esperado:
  layout_family: split
  typography.title_size_px: 24-30 (menor da faixa)
  typography.title_lines: 4 (max)
  warnings: ["title_long: 156 chars, switched to split layout"]
  Se > 120 chars: truncar com "…" e registrar
```

### ST-02: Sem Foto (URL vazia)

```
Input:
  title: "Audiência pública sobre segurança"
  theme: seguranca
  photoUrl: ""
  outputType: feed-square

Esperado:
  layout_family: split
  crop_strategy.method: solidBg
  overlay.type: none (não há foto para cobrir)
  warnings: ["photo_missing: URL empty, using solid background"]
  Fundo: #0D0D0D (primary)
```

### ST-03: Foto Muito Poluída + Título Médio

```
Input:
  title: "Festival de cultura popular reúne artistas de toda a região metropolitana"
  theme: cultura
  photo: imagem com muitas cores, texturas e elementos
  outputType: og

Esperado:
  overlay.opacity: 0.75-0.85 (elevado)
  overlay.type: dark-uniform
  warnings: ["photo_busy: increased overlay to 0.80"]
  Se ainda ilegível com 0.85: fallback para split
```

### ST-04: Tema Sóbrio + Formato Vertical (Story)

```
Input:
  title: "Reforma tributária: impactos no setor"
  theme: economia (formal)
  outputType: story (1080×1920)

Esperado:
  layout_family: story
  overlay.type: frosted-panel (temas formais usam glass)
  typography.title_case: title (Title Case para formal)
  badge posição: top-left (32px, 180px) — abaixo zona de perfil
  Contraste mantido apesar do formato vertical
```

### ST-05: Foto Escura + Tema Impactante

```
Input:
  title: "Denúncia: desvio de verbas"
  theme: denuncia
  photo: imagem muito escura (avg luminância < 0.15)
  outputType: og

Esperado:
  overlay.opacity: 0.20-0.30 (leve — foto já é escura)
  overlay.type: gradient-scrim (NÃO dark-uniform)
  typography: text-shadow heavy multi-layer
  warnings: ["photo_dark: reduced overlay to 0.25"]
  Tema denuncia normalmente pede overlay 0.75, mas foto escura inverte a regra
```

### ST-06: Foto Clara (Fundo Branco)

```
Input:
  title: "Campanha de vacinação infantil"
  theme: saude
  photo: foto com fundo branco/claro (avg luminância > 0.85)
  outputType: card

Esperado:
  overlay.opacity: 0.70+ (forçar contraste)
  overlay.type: dark-uniform
  warnings: ["photo_light: increased overlay to 0.72"]
  Alternativa: trocar para split com fundo escuro
```

### ST-07: Título UPPERCASE no Limite

```
Input:
  title: "Operação prende quadrilha que fraudava benefícios do INSS" (57 chars)
  theme: seguranca

Validar:
  Tema impactante permite UPPERCASE até 60 chars ✓ (57 < 60)
  typography.title_case: upper
  Mas se fosse 61 chars → sentence case
  Se fosse outro tema → sentence case (limite geral é 40 chars)
```

### ST-08: Badge + Frame Collision

```
Input:
  title: "Inauguração do centro comunitário"
  theme: campanha
  frame: glass (passado manualmente pelo usuário)

Validar:
  Badge campanha é colorido (#009C3B) e bold
  Frame glass é decorativo
  Regra de exclusão mútua: badge bold + frame bold = PROIBIDO
  → Frame deve ser rebaixado para sutil (opacity 0.08) ou removido
  warnings: ["frame_demoted: mutual exclusion with bold badge"]
```

### ST-09: Foto Horizontal → Formato Vertical (Story)

```
Input:
  photo: 1600×900 (16:9 horizontal)
  outputType: story (1080×1920 — 9:16 vertical)

Validar:
  crop_strategy.method: coverFit (NUNCA distorcer)
  crop_strategy.focus: center ou face
  Grandes áreas da foto serão cortadas — ok, mas:
  ☐ Rostos NÃO podem ser cortados
  ☐ Se rosto é cortado → shift crop ou fallback para split
  ☐ Muito conteúdo perdido → considerar split com foto menor
```

### ST-10: Todos os Campos Opcionais Vazios

```
Input:
  title: "Título qualquer"
  theme: saude
  photoUrl: "https://..."
  outputType: og
  subtitle: ""
  date: ""
  author: ""
  siteName: ""

Esperado:
  Layout Standard funciona normalmente
  Sem metadados: pular layer L5 (data • autor)
  Sem branding: pular layer L6 (URL)
  Composição mais limpa — apenas badge + título sobre foto
  Nenhuma warning (campos opcionais vazios é normal)
```

### ST-11: Tema Desconhecido

```
Input:
  theme: "tecnologia" (não existe nos 14 temas)

Esperado:
  Fallback para tema campanha
  badge_bg: #009C3B, style: padrao
  warnings: ["theme_unknown: 'tecnologia' not found, defaulting to campanha"]
```

### ST-12: Múltiplos Fallbacks Simultâneos

```
Input:
  title: "Título com 95 caracteres para testar o comportamento do engine quando múltiplas condições degradam"
  theme: "desconhecido"
  photoUrl: "" (sem foto)
  outputType: story

Esperado:
  3 fallbacks ativados:
    1. photo_missing → split com fundo sólido
    2. title_long → forçar split + fonte menor
    3. theme_unknown → default campanha
  Se > 3 fallbacks simultâneos → forçar Split + fundo sólido (modo seguro)
  warnings: ["photo_missing", "title_long: 95 chars", "theme_unknown: defaulting to campanha"]
```

## Checklist de Validação

Após resolver cada stress test, verificar:

- [ ] JSON de saída é válido e completo (todos os campos do schema)
- [ ] `warnings` array contém todas as ações de fallback
- [ ] Composição visual é legível a 400px de largura
- [ ] Contraste WCAG AA mantido (≥ 4.5:1)
- [ ] Nenhum texto fora da safe zone
- [ ] Nenhum rosto cortado
- [ ] Dimensão exata do outputType
