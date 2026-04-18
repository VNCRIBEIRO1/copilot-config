# Retail Intelligence — Padrões de Comportamento de Mercado

## 1. Ciclo de Vida de uma Promoção

```
                    PICO
                   /    \
                  /      \
        RAMP-UP /        \ HANGOVER
               /          \
BASELINE ─────/            \──── NOVO BASELINE
              │            │
              │  PROMOÇÃO  │ PÓS-PROMO
              │   ATIVA    │ (CANIBALIZAÇÃO)
```

### Fases Detalhadas

| Fase | Duração | Efeito Quantidade | Efeito Preço |
|------|---------|-------------------|--------------|
| **Pré-anúncio** | 1-2 dias | -5% (espera) | Normal |
| **Ramp-up** | 1-3 dias | +20-40% gradual | Desconto ativo |
| **Pico** | 1-2 dias | +60-150% | Desconto máximo |
| **Sustentação** | 3-7 dias | +40-60% estável | Desconto ativo |
| **Hangover** | 3-5 dias | -20-35% abaixo baseline | Preço normal |
| **Recuperação** | 5-10 dias | Volta gradual ao baseline | Preço normal |

### Multiplicadores por Tipo de Promoção

| Tipo | Desconto Típico | Multiplicador Qtd | Duração | Hangover |
|------|----------------|-------------------|---------|----------|
| Oferta do Dia | 10-15% | 1.3-1.5× | 1 dia | 1 dia |
| Oferta da Semana | 15-25% | 1.5-1.8× | 7 dias | 3 dias |
| Liquidação | 30-50% | 2.0-3.0× | 3-5 dias | 5-7 dias |
| Leve 3 Pague 2 | ~33% efetivo | 2.5-3.5× | 7-14 dias | 7 dias |
| Combo | 15-20% efetivo | 1.4× ambos | 7 dias | 2 dias |

## 2. Fatores de Perda de Clientes

### Causas e Indicadores

| Causa | Padrão de Dados | Velocidade | Produtos Afetados |
|-------|-----------------|------------|-------------------|
| **Concorrente direto** | Queda uniforme -15-25% | 2-4 semanas | Todos |
| **Atacadão/atacarejo** | Queda em compras grandes | 3-6 semanas | Grãos, limpeza, higiene |
| **Delivery (iFood, Rappi)** | Queda em perecíveis | 1-2 meses | Refeições prontas, snacks |
| **Mudança de preço** | Queda imediata pós-reajuste | 1-3 dias | Produto reajustado + substitutos |
| **Qualidade percebida** | Queda gradual em categoria | 1-3 meses | Categoria específica |
| **Estacionamento/acesso** | Queda em horários de pico | Semanas | Todos (mais em Sáb/Dom) |
| **Sazonalidade demográfica** | Queda cíclica anual | Meses | Depende do público |

### Padrão de Churn por Segmento

```
Semana 1: -5%  (primeiros clientes migram)
Semana 2: -8%  (boca-a-boca)
Semana 3: -12% (hábito mudando)
Semana 4: -15% (estabiliza no novo patamar)
Semana 5+: -15% a -20% (platô)
```

**Exceções à migração:**
- Padaria/pão fresco: clientes mantêm (conveniência diária)
- Açougue de qualidade: clientes mantêm (confiança)
- Produtos exclusivos/marca própria: sem equivalente no concorrente

## 3. Sazonalidade Brasileira — Calendário Comercial

### Feriados Fixos com Impacto

| Data | Evento | Efeito Geral | Categorias Impactadas |
|------|--------|--------------|----------------------|
| 01/01 | Ano Novo | -40% (fechado) | Bebidas +100% (véspera) |
| Fev/Mar | Carnaval | -30% (4 dias) | Bebidas +80%, Snacks +60% |
| Mar/Abr | Páscoa | Variável | Chocolate +200%, Bacalhau +150% |
| 01/05 | Dia do Trabalho | -50% | Churrasco +40% (véspera) |
| Jun | Festa Junina | +20% regional | Milho, amendoim, canjica +100% |
| 12/06 | Dia dos Namorados | +10% | Vinhos +80%, Chocolate +60% |
| Ago | Dia dos Pais | +5% | Bebidas premium +30% |
| 07/09 | Independência | -30% | Churrasco +30% (véspera) |
| 12/10 | Crianças + Padroeira | -40% | Snacks +20% (véspera) |
| 02/11 | Finados | -50% | Mínimo impacto |
| 15/11 | Proclamação República | -30% | Normal |
| 25/12 | Natal | -50% (fechado) | Tudo +40-80% (semana anterior) |

### Ciclo Mensal Salarial (Brasil)

```
Dia 01-05: +12% (pagamento mensal, benefícios)
Dia 06-14: baseline
Dia 15-20: +8% (adiantamento quinzenal)
Dia 21-24: -5% (dinheiro curto)
Dia 25-31: +15% (pagamento + véspera de mês)
```

**Produtos mais sensíveis ao ciclo salarial:**
- Cesta básica (arroz, feijão, óleo): Forte correlação
- Limpeza/higiene: Compra mensal concentrada
- Snacks/guloseimas: Anti-correlação (compra quando tem extra)

### Sazonalidade Climática

| Estação | Meses | ↑ Demanda | ↓ Demanda |
|---------|-------|-----------|-----------|
| Verão (Dez-Fev) | Calor | Bebidas +30%, Sorvete +60%, Frutas +20% | Sopas -30%, Café -10% |
| Outono (Mar-Mai) | Transição | Grãos +10%, Conservas +15% | Sorvete -20% |
| Inverno (Jun-Ago) | Frio | Café +25%, Achocolatado +40%, Sopas +50% | Bebidas geladas -25% |
| Primavera (Set-Nov) | Transição | Saladas +15%, BF prep Nov | Estável |

## 4. Cross-Selling e Correlações de Produtos

### Cestas Típicas

| Produto Principal | Produtos Correlacionados | Correlação |
|-------------------|------------------------|------------|
| Arroz | Feijão (0.85), Óleo (0.60), Farinha (0.45) | Cesta básica |
| Macarrão | Molho de Tomate (0.90), Queijo Ralado (0.70) | Massa |
| Café | Açúcar (0.75), Leite (0.55), Filtro (0.40) | Café da manhã |
| Pão | Manteiga (0.80), Presunto (0.70), Queijo (0.65) | Café da manhã |
| Carne | Carvão (0.45), Cerveja (0.40), Sal Grosso (0.35) | Churrasco |
| Leite | Achocolatado (0.60), Cereal (0.50) | Matinal |

### Efeito Stockout (Produto Indisponível)

Quando produto A fica em falta:
- **Substituto direto** (marca diferente): Absorve 60-70% da demanda
- **Substituto indireto** (produto similar): Absorve 15-25%
- **Perda líquida**: 10-20% não compra nada
- **Efeito cascata**: Cliente frustrado pode abandonar cesta inteira (-5% geral)

## 5. Indicadores de Alerta para o Mercado

### Alertas de Ação Imediata

| Indicador | Threshold | Ação Recomendada |
|-----------|-----------|------------------|
| Queda >15% em 7 dias (produto) | Detectar trend < 0.85 | Verificar preço, estoque, qualidade |
| Queda >10% em 7 dias (geral) | Todos produtos caindo | Investigar concorrência |
| Pico >50% sem promoção | Sem evento cadastrado | Verificar se é orgânico ou erro de dados |
| Confiança <50% | CV alto | Produtos muito voláteis — precificar com cuidado |
| Estoque projetado < 3 dias | Prev.7d / estoque atual | Repor urgente |

### Alertas Preventivos

| Indicador | Horizonte | Ação |
|-----------|-----------|------|
| Feriado em 7 dias | Próximos 7d | Reforçar estoque de categorias impactadas |
| Promoção planejada | Data agendada | Comprar +60% do produto promovido |
| Fim de mês em 5 dias | Próximos 5d | Reforçar cesta básica |
| Início de estação | Próximos 15d | Ajustar mix de produtos sazonais |

## 6. Métricas de Saúde do Negócio

| Métrica | Cálculo | Saudável | Alerta | Crítico |
|---------|---------|----------|--------|---------|
| Ticket médio | Receita / Transações | Estável ou ↑ | -5% mês | -10% mês |
| Frequência | Transações / Clientes únicos | >2×/semana | <1.5×/semana | <1×/semana |
| Mix de categoria | % por categoria | Balanceado | 1 cat >40% | 1 cat >60% |
| Taxa de conversão promo | Qtd promo / Qtd normal | >1.3× | <1.2× | <1.1× |
| Churn rate | Clientes perdidos / Base | <5%/mês | 5-10%/mês | >10%/mês |
| Elasticidade preço | %ΔQtd / %ΔPreço | -1.0 a -1.5 | <-2.0 | <-3.0 |

## 7. Mapeamento Realidade → Engine

Como traduzir fenômenos reais para o que o PrevisaoEngine consegue processar:

| Fenômeno Real | Como Simular no CSV | O que o Engine Detecta |
|---------------|--------------------|-----------------------|
| Promoção 30% off | Aumento qty +60%, preço -30% | Trend UP (não sabe que é promo) |
| Concorrente abriu | Queda gradual -5%/semana | Trend DOWN |
| Natal | Dados altos em dezembro | Sazonalidade + Holiday 1.35 fixo |
| Clima frio | Café UP, Bebidas DOWN por 3 meses | Sazonalidade mensal |
| Pagamento caiu | Pico dias 1-5 e 25-31 | Month boundary 1.10/1.15 fixo |
| Stockout | Linhas com qty=0 (não importadas) | Média mais baixa (viés) |
| Aumento de preço | Preço UP no CSV | NADA (preço ignorado na previsão) |
| Cross-sell | Dois produtos correlacionados | NADA (previsão independente) |
| Feriado não-padrão (BF, Consumidor) | Dados altos na data | Trend UP (sem alerta de feriado) |

### Regra de Ouro para Simulação

1. **Mais dados = melhor**: 90 dias > 60 dias > 30 dias (mínimo 7 por produto)
2. **Um evento por vez**: Para validar detecção, isole fatores
3. **Compare com baseline**: Primeiro rode cenário "sazonalidade" puro, depois adicione eventos
4. **O engine não é mágico**: Ele calcula médias ponderadas — trate como "planilha inteligente"
5. **Multiplicadores se acumulam**: Sábado + feriado + fim-de-mês = 1.25 × 1.35 × 1.15 ≈ 1.94×
