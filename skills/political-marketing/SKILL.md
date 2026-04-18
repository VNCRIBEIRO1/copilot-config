---
name: political-marketing
description: "Guia completo de assessoria política brasileira com design visual integrado: partidos TSE, cargos eletivos, identidades políticas, marketing digital eleitoral 2026, psicologia do voto, legislação eleitoral (Lei 9.504, Lei da Ficha Limpa, Resolução TSE 23.732/2024), regulamentação IA em campanhas, cotas de gênero, FEFC, HGPE, tradução identidade→visual (paletas por arquétipo, tipografia por candidato, cards de autoridade, grids institucionais, anti-patterns visuais), design de campanha web e print. Use when: creating political campaigns, advising candidates, building candidate profiles, designing electoral strategy, making political banners, understanding Brazilian parties and elections, checking electoral compliance, party colors, coalition building, debate preparation, crisis management, GOTV mobilization, designing campaign websites, choosing campaign color palettes, creating authority/institutional UI."
argument-hint: "Descreva o candidato, cargo, partido e objetivo (ex: 'vereador Republicanos Presidente Prudente, identidade visual militar/policial')"
---

# Political Marketing — Assessoria Política Brasileira + Design Visual Integrado

Skill completa para assessoria política, marketing eleitoral, **design visual de campanha** e construção de identidade de candidatos no Brasil.
Cobre todo o ciclo: pré-campanha → perfil → estratégia → **identidade visual** → produção de conteúdo → GOTV → pós-eleição.

## Quick-Start (Roteamento Rápido)

Não carregue tudo. Identifique a demanda e carregue apenas o necessário:

| O que o usuário quer | Referência(s) a carregar | Template |
|---------------------|--------------------------|---------| 
| Perfil / persona / identidade do candidato | `identidades-politicas.md` + `partidos-brasil.md` | `perfil-candidato.md` |
| Estratégia / plano de campanha completo | `marketing-politico-2026.md` + `psicologia-eleitoral.md` | `estrategia-campanha.md` |
| Persuasão / comunicação / discurso / debate | `psicologia-eleitoral.md` | — |
| Cargo / requisitos / prazos / teto de gastos | `cargos-eletivos.md` | — |
| Legislação / compliance / IA / deepfake | `legislacao-eleitoral.md` | — |
| Partido / coligação / federação / cores | `partidos-brasil.md` | — |
| **Design visual / identidade visual / paleta de cores** | **`visual-design-guide.md`** | — |
| **Site de campanha / UI / componentes visuais** | **`visual-design-guide.md`** + delegar execução ao **nextjs-expert** | — |
| Material visual / santinho / banner Canvas | `visual-design-guide.md` + delegar ao **canvas-banners** skill | — |
| Campanha completa (tudo) | Carregar progressivamente conforme avança | Ambos |

## ⚠️ Regra Crítica: Identidade → Visual

**Todo material visual DEVE ser derivado do arquétipo do candidato.** Nunca escolher cores, fontes ou layouts arbitrariamente.

Fluxo obrigatório:
1. Identificar **arquétipo** do candidato (militar, evangélico, progressista, agro, etc.)
2. Consultar **[visual-design-guide.md](references/visual-design-guide.md)** → coluna do arquétipo
3. Extrair paleta, tipografia, textura e layout correspondentes
4. Aplicar ao material (site, banner, santinho, post)

**Exemplo — Candidato Militar/Policial:**
```
Arquétipo: Militar/Autoridade
Cores:     Black #0D0D0D + Green #009C3B + Gold #FFD700
Fontes:    Montserrat 800-900 (head) + Open Sans (body)
Layout:    Dark bg, glass cards, gold accents, diagonal stripes
Textura:   Noise overlay, gradient mesh, tactical lines
Tom:       Commanding, precise, institutional
NUNCA:     Cores pastel, fundo claro, cards coloridos flat, estética infantil
```

## Workflow

1. **Identificar o contexto**: cargo, partido, região, público-alvo
2. **Verificar compliance**: consultar [legislacao-eleitoral.md](references/legislacao-eleitoral.md) (prazos, proibições, cotas)
3. **Construir identidade**: consultar [identidades-politicas.md](references/identidades-politicas.md)
4. **Posicionar no espectro**: consultar [partidos-brasil.md](references/partidos-brasil.md)
5. **Preencher perfil**: usar template [perfil-candidato.md](templates/perfil-candidato.md)
6. **Definir identidade visual**: consultar **[visual-design-guide.md](references/visual-design-guide.md)** → escolher arquétipo → extrair paleta + tipografia + layout
7. **Definir estratégia**: usar template [estrategia-campanha.md](templates/estrategia-campanha.md)
8. **Planejar comunicação**: consultar [marketing-politico-2026.md](references/marketing-politico-2026.md)
9. **Aplicar persuasão**: consultar [psicologia-eleitoral.md](references/psicologia-eleitoral.md)
10. **Gerar materiais visuais**: entregar briefing visual ao skill **canvas-banners** (banners) ou **nextjs-expert** (site), incluindo arquétipo, paleta, e referências do visual-design-guide
11. **Revisar compliance final**: checar CNPJ, rótulo IA, teto de gastos, cotas de gênero

## Referências

| Arquivo | Conteúdo |
|---------|----------|
| [partidos-brasil.md](references/partidos-brasil.md) | 30 partidos TSE, bancadas, cores hex, espectro ideológico, bandeiras, FEFC |
| [cargos-eletivos.md](references/cargos-eletivos.md) | Cargos federais/estaduais/municipais, requisitos, suplentes, calendário 2026 |
| [identidades-politicas.md](references/identidades-politicas.md) | Profissões, causas, identidades demográficas, combinações, anti-personas |
| [marketing-politico-2026.md](references/marketing-politico-2026.md) | Estratégias digitais, 9 plataformas, influencers, debates, calendário de conteúdo |
| [psicologia-eleitoral.md](references/psicologia-eleitoral.md) | 14 vieses cognitivos, Cialdini, persuasão ética, psicologia de debate, território emocional |
| [legislacao-eleitoral.md](references/legislacao-eleitoral.md) | Lei 9.504, Ficha Limpa, cotas 30%, IA/deepfake, impulsionamento, HGPE, doações |
| **[visual-design-guide.md](references/visual-design-guide.md)** | **Tradução identidade→visual: paleta por arquétipo, tipografia por candidato, card patterns, grid layouts, anti-patterns, checklist visual, design de site/print/social** |

## Templates

| Template | Uso |
|----------|-----|
| [perfil-candidato.md](templates/perfil-candidato.md) | Perfil completo: dados, identidade, narrativa, público, viabilidade legal, auditoria digital |
| [estrategia-campanha.md](templates/estrategia-campanha.md) | Plano operacional: 5 fases, orçamento, alianças, GOTV, crise, pós-eleição |

## Regras de ouro

1. **Legalidade primeiro**: toda estratégia deve respeitar a Lei 9.504, Lei da Ficha Limpa e resoluções TSE vigentes
2. **Ética**: sem deepfakes, sem fake news, sem manipulação — persuasão ética apenas
3. **Transparência IA**: conteúdo gerado por IA deve ser identificado conforme Resolução TSE 23.732/2024
4. **Cotas de gênero**: garantir mínimo 30% de candidaturas para cada gênero (Lei 9.504, Art. 10 §3)
5. **Acessibilidade**: materiais devem incluir Libras/legendas quando aplicável (Resolução TSE)
6. **Dados reais**: usar dados oficiais do TSE, IBGE e fontes verificáveis
7. **Consistência**: toda peça de comunicação deve estar alinhada ao perfil do candidato (tom, cores, narrativa)
8. **Compliance visual**: todo material deve conter CNPJ de campanha e identificação de IA quando aplicável
