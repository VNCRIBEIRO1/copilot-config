# Templates de Dataset — Pares Q&A por Categoria

Use estes templates como referência para gerar pares pergunta-resposta para fine-tuning.
Cada template mostra o padrão e variações de formulação.

## System Prompt Padrão

```
Você é um assistente especializado em direito previdenciário brasileiro. Responda com base na legislação vigente (Lei 8.213/91, Lei 8.212/91, Decreto 3.048/99, EC 103/2019) e jurisprudência consolidada. Cite sempre o fundamento legal. Se a dúvida exigir análise de caso concreto, oriente a buscar um advogado previdenciarista. Nunca invente artigos de lei ou súmulas inexistentes.
```

## Aposentadoria por Idade

### Exemplo 1 — Pergunta direta
```json
{"role": "user", "content": "Qual a idade mínima para me aposentar por idade?"}
{"role": "assistant", "content": "Após a Reforma da Previdência (EC 103/2019), a aposentadoria por idade exige: 65 anos para homens e 62 anos para mulheres, além de tempo mínimo de contribuição de 20 anos (homens) ou 15 anos (mulheres), conforme art. 201, §7°, I da CF/88 com redação dada pela EC 103/2019. A carência é de 180 contribuições mensais (art. 25, II, Lei 8.213/91)."}
```

### Exemplo 2 — Pergunta contextualizada
```json
{"role": "user", "content": "Tenho 63 anos, sou mulher e contribuí por 16 anos. Posso me aposentar?"}
{"role": "assistant", "content": "Sim, com base na regra permanente da EC 103/2019, a senhora atende os requisitos: (1) idade mínima de 62 anos ✅ (tem 63); (2) tempo mínimo de contribuição de 15 anos para mulheres ✅ (tem 16 anos); (3) carência de 180 contribuições ✅ (16 anos = 192 contribuições se ininterruptas). O valor será calculado com base em 60% da média de todos os salários de contribuição desde julho/1994, acrescido de 2% por ano que exceder 15 anos de contribuição — no seu caso, 60% + 2% (1 ano excedente) = 62% do salário de benefício. Recomendo agendar no Meu INSS ou ligar no 135."}
```

### Exemplo 3 — Pergunta coloquial
```json
{"role": "user", "content": "Meu pai tem 66 anos e trabalhou a vida toda sem carteira assinada na roça. Ele pode se aposentar?"}
{"role": "assistant", "content": "Possivelmente sim, como segurado especial (trabalhador rural). A aposentadoria por idade rural tem requisitos diferentes: 60 anos para homens (art. 48, §1°, Lei 8.213/91) — seu pai já tem 66, então atende à idade. Ele precisa comprovar 180 meses de efetivo exercício de atividade rural, mesmo sem contribuições formais. A comprovação exige início de prova material (ex: contratos de arrendamento, notas fiscais de venda de produção, cadastro no INCRA, declaração do sindicato rural) complementada por prova testemunhal (Súmula 149/STJ). O valor será de 1 salário mínimo. Recomendo procurar o sindicato rural da região para obter a Declaração de Atividade Rural e agendar atendimento no INSS."}
```

## Benefícios por Incapacidade

### Exemplo 1
```json
{"role": "user", "content": "Estou com hérnia de disco e não consigo trabalhar. Que benefício posso pedir?"}
{"role": "assistant", "content": "Você pode requerer o auxílio por incapacidade temporária (antigo auxílio-doença), previsto no art. 59 da Lei 8.213/91. Requisitos: (1) carência de 12 contribuições mensais — dispensada se a hérnia de disco decorrer de acidente de trabalho; (2) qualidade de segurado; (3) incapacidade temporária para a atividade habitual, comprovada por perícia médica do INSS. O benefício corresponde a 91% do salário de benefício, limitado à média dos 12 últimos salários de contribuição. Nos primeiros 15 dias de afastamento, o empregador paga normalmente; a partir do 16° dia, o INSS assume. Para requerer, acesse o Meu INSS, selecione 'Auxílio por Incapacidade Temporária' e agende a perícia. Leve todos os laudos, exames de imagem e receitas médicas atualizadas."}
```

## BPC/LOAS

### Exemplo 1
```json
{"role": "user", "content": "Minha avó tem 67 anos e nunca trabalhou. Ela tem direito a algum benefício?"}
{"role": "assistant", "content": "Sim, ela pode ter direito ao BPC/LOAS (Benefício de Prestação Continuada), previsto no art. 20 da Lei 8.742/93 (LOAS) e regulamentado pelo art. 203, V da CF/88. É um benefício assistencial (não previdenciário) que não exige contribuição ao INSS. Requisitos: (1) idade de 65 anos ✅ (tem 67); (2) renda familiar per capita igual ou inferior a 1/4 do salário mínimo. Para calcular: some toda a renda bruta dos membros da família que moram na mesma casa e divida pelo número de pessoas. Se o resultado for ≤ R$ 353,00 (1/4 de R$ 1.412 em 2024), ela tem direito. O valor é de 1 salário mínimo mensal. Não gera 13° salário e não gera pensão por morte. Requerimento pelo Meu INSS ou 135."}
```

## Pensão por Morte

### Exemplo 1
```json
{"role": "user", "content": "Meu marido faleceu, ele era aposentado. Tenho direito à pensão? Quanto vou receber?"}
{"role": "assistant", "content": "Sim, como cônjuge, você tem direito à pensão por morte (art. 74, Lei 8.213/91). Após a EC 103/2019, o valor é calculado assim: 50% da aposentadoria do falecido + 10% por cada dependente (incluindo você). Se você for a única dependente: 50% + 10% = 60% do valor da aposentadoria dele. Se tiverem filhos menores de 21 anos (ou inválidos), cada um conta como +10%, até o máximo de 100%. A duração para cônjuge depende da sua idade na data do óbito e do tempo de casamento/contribuição: se o casamento tinha mais de 2 anos E ele tinha mais de 18 contribuições, a duração varia de 3 anos (se você tem menos de 22 anos) até vitalícia (se tem 45 anos ou mais), conforme art. 77, §2°, V da Lei 8.213/91. Requeira imediatamente no Meu INSS — se dentro de 90 dias do óbito, os valores retroagem à data do falecimento (art. 74, I)."}
```

## Reforma — Regras de Transição

### Exemplo 1
```json
{"role": "user", "content": "Qual a melhor regra de transição para se aposentar em 2026?"}
{"role": "assistant", "content": "Depende do seu tempo de contribuição e idade. Em 2026, as regras de transição exigem:\n\n1. **Pontos** (art. 15, EC 103): 103 pontos (homem) ou 93 (mulher) + 35/30 anos de contribuição. Ex: homem com 35 anos de contribuição precisa ter 68 anos de idade (35+68=103).\n\n2. **Idade progressiva** (art. 16): 35/30 anos de contribuição + idade de 64,5 (homem) / 59,5 (mulher).\n\n3. **Pedágio 50%** (art. 17): apenas para quem faltava ≤2 anos em 2019. Em 2026, todos já teriam completado.\n\n4. **Pedágio 100%** (art. 20, §1°): 60/57 anos + 35/30 de contribuição + pedágio de 100% do que faltava em 13/11/2019. Esta geralmente dá o **melhor valor**, pois o coeficiente é 100% do salário de benefício (sem a redução a 60%).\n\n5. **Transição por idade** (art. 18): 65/62 anos + 15 anos de contribuição.\n\nRecomendo simular no Meu INSS ou consultar um advogado previdenciarista para calcular qual regra gera o maior benefício no seu caso específico."}
```

## Padrão de Variações (para cada tema, gerar)

1. **Pergunta direta** — "Quais os requisitos de X?"
2. **Pergunta contextualizada** — "Tenho X anos, contribuí Y, posso Z?"
3. **Pergunta coloquial** — "Meu pai/mãe/avó pode se aposentar?"
4. **Pergunta sobre valor** — "Quanto vou receber de X?"
5. **Pergunta sobre procedimento** — "Como faço para pedir X?"
6. **Pergunta sobre negativa** — "O INSS negou meu X, o que faço?"
7. **Pergunta comparativa** — "Qual a diferença entre X e Y?"
8. **Pergunta sobre prazo** — "Qual o prazo para X?"
9. **Pergunta pós-reforma** — "O que mudou em X com a reforma?"
10. **Pergunta sobre documentos** — "Que documentos preciso para X?"
