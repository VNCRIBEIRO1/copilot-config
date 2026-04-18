# Sistema de Temas — Consistência Visual

Cada tema define: cor do badge, intensidade de overlay, estilo tipográfico e frame.
Usar SEMPRE o mesmo visual para o mesmo tema, em qualquer peça.

## Tabela Mestre de Temas

| Tema | Badge BG | Badge Text | Overlay | Estilo |
|------|----------|-----------|---------|--------|
| `legislacao` | `#D4AF37` | `#000` | 0.70 | Formal |
| `saude` | `#16A34A` | `#FFF` | 0.60 | Padrão |
| `seguranca` | `#DC2626` | `#FFF` | 0.70 | Impactante |
| `educacao` | `#2563EB` | `#FFF` | 0.60 | Padrão |
| `infraestrutura` | `#EA580C` | `#FFF` | 0.60 | Padrão |
| `meioambiente` | `#059669` | `#FFF` | 0.55 | Leve |
| `economia` | `#7C3AED` | `#FFF` | 0.60 | Formal |
| `campanha` | `#009C3B` | `#FFF` | 0.60 | Padrão |
| `denuncia` | `#991B1B` | `#FFF` | 0.75 | Impactante |
| `evento` | `#0891B2` | `#FFF` | 0.55 | Leve |
| `cultura` | `#A855F7` | `#FFF` | 0.55 | Leve |
| `esporte` | `#F59E0B` | `#000` | 0.55 | Leve |
| `juventude` | `#FFCC00` | `#000` | 0.55 | Leve |
| `animal` | `#22C55E` | `#000` | 0.60 | Padrão |

## Estilos por Grupo

### Formal (legislacao, economia)

| Aspecto | Especificação |
|---------|---------------|
| Overlay | 0.65–0.75, gradient ou frosted glass panel |
| Título | Montserrat 700, tracking +0.02em, Title Case |
| Layout preferido | Magazine (glass panel) ou Standard |
| Frame | Glass frame ou nenhum |
| Accent line | Cor gold `#D4AF37` |

### Impactante (seguranca, denuncia)

| Aspecto | Especificação |
|---------|---------------|
| Overlay | 0.70–0.80, dark heavy |
| Título | Montserrat 800, tracking 0, UPPERCASE (até 60 chars) |
| Layout preferido | Standard com overlay pesado |
| Frame | Nenhum (foco total no conteúdo) |
| Accent line | Cor do badge (vermelho) |

### Padrão (saude, educacao, infraestrutura, campanha, animal)

| Aspecto | Especificação |
|---------|---------------|
| Overlay | 0.55–0.65, gradient scrim bottom |
| Título | Montserrat 700, tracking 0, Sentence case |
| Layout preferido | Standard |
| Frame | Nenhum ou shadow-box sutil |
| Accent line | Cor do badge |

### Leve (meioambiente, evento, cultura, esporte, juventude)

| Aspecto | Especificação |
|---------|---------------|
| Overlay | 0.50–0.60, gradient scrim suave |
| Título | Montserrat 600, tracking 0, Sentence case |
| Layout preferido | Standard ou Centered |
| Frame | Rounded corners 12–16px |
| Accent line | Cor do badge |

## Emojis por Tema (Marcador Interno)

> **Uso restrito**: emojis são marcadores internos de debug/prototipagem.
> NUNCA incluir emojis na saída visual final (nem em badges, nem em títulos, nem em metadados).
> Se um badge precisar de ícone, usar SVG ou glyph tipográfico.

<details>
<summary>Tabela de referência interna (expandir apenas para debug)</summary>

| Tema | Ref | Tema | Ref |
|------|-----|------|-----|
| legislacao | scales | economia | chart |
| saude | hospital | campanha | megaphone |
| seguranca | shield | denuncia | warning |
| educacao | books | evento | calendar |
| infraestrutura | building | cultura | masks |
| meioambiente | leaf | esporte | ball |
| juventude | graduation | animal | paw |

</details>

## Regras de Consistência

### Cor

1. Cada tema usa **UMA cor primária** (badge bg). Essa cor aparece em:
   - Badge background
   - Accent line
   - States interativos (hover/active)
2. Text color do badge: preto para badges claros (luminância > 0.5), branco para escuros
3. Overlay é **SEMPRE preto**. Cor do tema no badge e accent, NUNCA no overlay

### Combinações Proibidas

| Proibido | Por quê |
|----------|---------|
| Overlay colorido (não-preto) | Poluição visual, inconsistência |
| Badge bold + frame bold juntos | Competição visual, dois destaques |
| UPPERCASE em título > 60 chars | Ilegível, cansativo |
| Mais de 2 cores de destaque | Perde foco, amador |
| Texto sem tratamento sobre foto clara | Ilegível, falha de acessibilidade |
| Frame ornamental em card de denúncia | Contradição tonal |
| Emoji em OG image / contexto formal | Quebra a seriedade |

## Código — THEME_BADGES Object

```javascript
const THEME_BADGES = {
  legislacao:     { label: 'LEGISLAÇÃO',     bg: '#D4AF37', text: '#000', overlay: 0.70, style: 'formal' },
  saude:          { label: 'SAÚDE',          bg: '#16A34A', text: '#FFF', overlay: 0.60, style: 'padrao' },
  seguranca:      { label: 'SEGURANÇA',      bg: '#DC2626', text: '#FFF', overlay: 0.70, style: 'impactante' },
  educacao:       { label: 'EDUCAÇÃO',        bg: '#2563EB', text: '#FFF', overlay: 0.60, style: 'padrao' },
  infraestrutura: { label: 'INFRAESTRUTURA', bg: '#EA580C', text: '#FFF', overlay: 0.60, style: 'padrao' },
  meioambiente:   { label: 'MEIO AMBIENTE',  bg: '#059669', text: '#FFF', overlay: 0.55, style: 'leve' },
  economia:       { label: 'ECONOMIA',        bg: '#7C3AED', text: '#FFF', overlay: 0.60, style: 'formal' },
  campanha:       { label: 'CAMPANHA',        bg: '#009C3B', text: '#FFF', overlay: 0.60, style: 'padrao' },
  denuncia:       { label: 'DENÚNCIA',        bg: '#991B1B', text: '#FFF', overlay: 0.75, style: 'impactante' },
  evento:         { label: 'EVENTO',          bg: '#0891B2', text: '#FFF', overlay: 0.55, style: 'leve' },
  cultura:        { label: 'CULTURA',         bg: '#A855F7', text: '#FFF', overlay: 0.55, style: 'leve' },
  esporte:        { label: 'ESPORTE',         bg: '#F59E0B', text: '#000', overlay: 0.55, style: 'leve' },
  juventude:      { label: 'JUVENTUDE',       bg: '#FFCC00', text: '#000', overlay: 0.55, style: 'leve' },
  animal:         { label: 'CAUSA ANIMAL',    bg: '#22C55E', text: '#000', overlay: 0.60, style: 'padrao' },
};
```
