---
description: "Convert an approved business proposal into a service contract (contrato de prestação de serviços). Use when: gerar contrato, converter proposta em contrato, contrato de prestação de serviços, formalizar projeto, contract generation."
agent: "agent"
argument-hint: "Reference the proposal (e.g., 'proposta VR-2026-003 aprovada pelo João')"
---

# Gerador de Contrato de Prestação de Serviços

Convert an approved proposal into a formal Brazilian service contract.

## Context
- **Contratada**: Vinícius Ribeiro — CPF/CNPJ a definir
- **WhatsApp**: (18) 99631-1933
- Extract project details from the referenced proposal or conversation

## Required Information
Gather from context or ask:
1. **Contratante**: Nome completo, CPF/CNPJ, endereço
2. **Serviço**: Descrição detalhada (do escopo da proposta)
3. **Valor total**: E forma de pagamento (parcelas, datas)
4. **Prazo**: Data de início e entrega prevista
5. **Foro**: Cidade para resolução de litígios

## Contract Structure (Cláusulas)

Generate in Markdown with these sections:

1. **Identificação das Partes** — Dados completos de contratante e contratada
2. **Objeto do Contrato** — Descrição do serviço baseada no escopo da proposta
3. **Obrigações da Contratada** — Entregas, prazos, suporte
4. **Obrigações do Contratante** — Fornecer materiais, aprovações, pagamentos
5. **Valor e Pagamento** — Valor, parcelas, datas, multa por atraso
6. **Prazo de Execução** — Cronograma com milestones
7. **Propriedade Intelectual** — Transferência após quitação total
8. **Confidencialidade** — LGPD compliance, sigilo de dados
9. **Garantia** — 30 dias para correção de bugs pós-entrega
10. **Rescisão** — Condições para ambas as partes
11. **Multas e Penalidades** — Atraso de pagamento (2% + 1% a.m.), atraso de entrega
12. **Foro** — Comarca eleita
13. **Disposições Gerais** — Comunicação por e-mail/WhatsApp válida

## Rules
- Linguagem jurídica clara mas acessível
- Português (pt-BR) formal
- Baseado no Código Civil brasileiro (arts. 593-609 — prestação de serviços)
- Incluir campos {{PREENCHER}} para dados faltantes
- Incluir campo para assinatura digital ou física com testemunhas
- LGPD: incluir cláusula de tratamento de dados pessoais

## Output
```
proposals/{client-slug}/
├── contrato-{client-slug}.md      # Contrato completo em Markdown
└── contrato-{client-slug}.html    # Versão HTML para impressão/PDF
```

Use the business-proposal HTML template adapted for contract layout when generating HTML.
