---
name: direito-previdenciario
description: "Base de conhecimento jurídico em direito previdenciário brasileiro: INSS, aposentadoria, benefícios por incapacidade, pensão por morte, BPC/LOAS, reforma da previdência EC 103/2019, Lei 8.213/91, Lei 8.212/91, Decreto 3.048/99, jurisprudência TNU/STJ, contribuições, segurados, carência, tempo de contribuição, regras de transição, salário-maternidade, auxílio-reclusão, CTC, perícia médica, ações judiciais previdenciárias. Use when: building legal chatbot dataset, generating Q&A pairs for fine-tuning, validating legal accuracy of LLM responses, creating previdenciário training data, checking legislation references, answering social security law questions."
argument-hint: "Descreva a dúvida previdenciária ou o tipo de conteúdo jurídico que precisa (ex: 'gerar Q&A sobre aposentadoria especial', 'validar resposta sobre BPC/LOAS')"
---

# Direito Previdenciário Brasileiro — Base de Conhecimento Jurídica

Skill especializada em direito previdenciário para geração de datasets de fine-tuning,
validação de respostas de LLM e consulta legislativa/jurisprudencial.

## Quick-Start (Roteamento)

| Demanda | Referência a carregar |
|---------|----------------------|
| Legislação / artigos de lei | [legislacao.md](./references/legislacao.md) |
| Benefícios INSS (tipos, requisitos, valores) | [beneficios.md](./references/beneficios.md) |
| Reforma da Previdência / regras de transição | [reforma-ec103.md](./references/reforma-ec103.md) |
| Jurisprudência (súmulas, repetitivos, TNU) | [jurisprudencia.md](./references/jurisprudencia.md) |
| Procedimentos admin e judiciais | [procedimentos.md](./references/procedimentos.md) |
| Gerar pares Q&A para dataset | [dataset-templates.md](./references/dataset-templates.md) |

## Workflow Principal

### Para gerar dataset de fine-tuning:
1. Identificar categoria (aposentadoria, incapacidade, pensão, BPC, etc.)
2. Carregar referência legislativa correspondente
3. Gerar pares Q&A no formato JSONL (chat template Phi-3)
4. Validar fundamentação legal (artigo + lei corretos)
5. Incluir variações de pergunta (formal, coloquial, com contexto)

### Para validar resposta de LLM:
1. Extrair citações legais da resposta (artigos, leis, súmulas)
2. Verificar existência e correção contra referências
3. Checar se a informação está atualizada (pós-EC 103/2019 se aplicável)
4. Sinalizar alucinações: artigos inexistentes, valores incorretos, prazos errados

## Formato de Q&A para Dataset

```jsonl
{"messages": [{"role": "system", "content": "Você é um assistente especializado em direito previdenciário brasileiro. Responda com base na legislação vigente e jurisprudência consolidada. Cite sempre o fundamento legal."}, {"role": "user", "content": "{pergunta natural}"}, {"role": "assistant", "content": "{resposta com fundamentação legal}"}]}
```

### Regras para geração de Q&A:
- Sempre citar artigo + lei/decreto (ex: "art. 48 da Lei 8.213/91")
- Incluir referência a EC 103/2019 quando pertinente (pré/pós reforma)
- Usar linguagem acessível na resposta, sem perder a precisão jurídica
- Adicionar disclaimer quando a pergunta exige análise de caso concreto
- Nunca inventar artigos, súmulas ou valores inexistentes

## Categorias de Conteúdo

| Categoria | Subcategorias | Volume sugerido |
|-----------|---------------|-----------------|
| Aposentadorias | por idade, tempo contribuição, especial, rural, PcD, professor | 150+ pares |
| Incapacidade | auxílio-doença, aposent. invalidez, auxílio-acidente | 100+ pares |
| Pensão e morte | pensão por morte, auxílio-reclusão | 80+ pares |
| BPC/LOAS | idoso, PcD, renda per capita, revisão | 80+ pares |
| Contribuições | segurados, alíquotas, GPS, MEI, facultativo | 60+ pares |
| Regras transição | pedágio, pontos, idade progressiva, exclusão | 80+ pares |
| Maternidade/família | salário-maternidade, salário-família | 40+ pares |
| Processos | admin INSS, judicial, perícia, prazos | 60+ pares |
| Geral | conceitos, princípios, história, RGPS vs RPPS | 50+ pares |
| **TOTAL** | | **700+ pares** |

## Regras de Ouro

1. **Precisão legal**: toda informação deve ter fundamento em legislação vigente
2. **Atualização**: considerar EC 103/2019 como marco — indicar regra antiga vs nova
3. **Sem parecer jurídico**: informações gerais, nunca substituir consulta a advogado
4. **LGPD**: nunca incluir dados pessoais reais nos exemplos
5. **Fundamentação**: toda resposta cita no mínimo 1 artigo de lei
6. **Honestidade**: se não houver resposta definitiva, orientar a buscar profissional

## Referências

| Arquivo | Conteúdo |
|---------|----------|
| [legislacao.md](./references/legislacao.md) | Leis, decretos, INs — texto e resumos dos principais dispositivos |
| [beneficios.md](./references/beneficios.md) | Todos os benefícios INSS com requisitos, carência, valor, duração |
| [reforma-ec103.md](./references/reforma-ec103.md) | EC 103/2019 completa: regras permanentes e 5 regras de transição |
| [jurisprudencia.md](./references/jurisprudencia.md) | Súmulas vinculantes, repetitivos STJ, TNU — previdenciário |
| [procedimentos.md](./references/procedimentos.md) | Fluxos administrativos INSS e judiciais, prazos, recursos |
| [dataset-templates.md](./references/dataset-templates.md) | Templates e exemplos prontos de Q&A por categoria |
