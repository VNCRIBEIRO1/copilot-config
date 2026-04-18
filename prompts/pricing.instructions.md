---
description: "Use when discussing pricing, quotes, budgets, costs, valores, orçamentos, precificação, cobranças. Rules for consistent pricing across all proposals and conversations."
---

# Regras de Precificação — Vinícius Ribeiro

## Fonte de Verdade
Sempre consultar o catálogo de serviços em `~/.copilot/skills/business-proposal/references/services.json` para faixas de preço base antes de sugerir valores.

## Regras de Ouro

1. **Nunca dar preço sem entender o escopo** — Pergunte primeiro, precifique depois
2. **Sempre apresentar range, não valor fixo** — "Entre R$ 5.000 e R$ 8.000" (dá margem para negociação)
3. **Destacar o ROI** — "Investimento de R$ X com retorno estimado de Y"
4. **Usar "investimento", não "custo"** — Linguagem de valor
5. **Incluir o que NÃO está no escopo** — Evita escopo-creep

## Multiplicadores

| Fator | Multiplicador | Quando aplicar |
|-------|--------------|----------------|
| Complexidade simples | 1.0x | Padrão, sem customização pesada |
| Complexidade média | 1.5x | Integrações específicas, regras de negócio |
| Complexidade alta | 2.0x | Múltiplas integrações, lógica complexa |
| Enterprise | 3.0x | SLA, multi-tenant, alta disponibilidade |
| Urgência fast-track | 1.3x | Metade do prazo normal |
| Urgência rush | 1.5x | Menos de 1 semana |
| Bundle 2 serviços | -10% | Desconto por pacote |
| Bundle 3+ serviços | -15% | Desconto por pacote |

## Condições Padrão de Pagamento
- **50%** na aprovação (sinal)
- **25%** na entrega do protótipo funcional
- **25%** na entrega final aprovada
- Métodos: PIX, transferência bancária, boleto
- Multa por atraso: 2% + juros de 1% a.m.

## Validade
- Propostas válidas por **15 dias**
- Após vencimento, valores sujeitos a reajuste

## Manutenção Mensal (pós-projeto)
- Básica: R$ 200-500/mês (updates, backup, SSL)
- Profissional: R$ 500-1.500/mês (suporte, pequenas alterações, monitoramento)
- Enterprise: R$ 1.500-5.000/mês (SLA, suporte prioritário, evolução contínua)

## Red Flags (recusar ou cobrar premium)
- Cliente quer "só uma coisinha" sem especificar escopo
- Prazo impossível sem pagamento de urgência
- "Depois te pago" sem contrato
- Escopo que muda a cada reunião sem change request formal
