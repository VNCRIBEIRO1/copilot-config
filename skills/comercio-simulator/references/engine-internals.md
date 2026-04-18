# Engine Internals Reference

Exact formulas, detection capabilities, and limitations of PrevisaoEngine.cs.
Use this to calibrate CSV data so the engine produces meaningful predictions.

## Prediction Formula

```
previsao = base_value
         * tendencia
         * fator_sazonalidade
         * fator_feriado
         * fator_vespera
         * fator_fim_mes
         * fator_inicio_mes
```

All factors are **multiplicative**. Final output: `max(1, round(previsao))` — never predicts 0.

### base_value (Day-of-Week Average)

```csharp
// Groups all historical transactions by DayOfWeek
// Returns average quantity for that specific weekday
// Fallback: overall average if fewer than 3 samples for a weekday
base_value = historico
    .Where(t => t.DataVenda.DayOfWeek == targetDay)
    .Average(t => t.Quantidade);
```

**Implication for scenarios**: To make the engine predict HIGH on Saturdays, embed higher Saturday quantities in the CSV. The engine learns per-weekday baselines.

### tendencia (Trend Factor)

```csharp
mediaRecente = avg(last 30 days)
mediaAnterior = avg(days -60 to -31)
tendencia = Clamp(mediaRecente / mediaAnterior, 0.5, 2.0)
```

- Requires **5+ days** in each 30-day window; otherwise tendencia = 1.0
- Clamped to [0.5, 2.0] — the engine won't predict more than 2x growth or 50% decline from trend alone

**Implication for scenarios**: 
- To trigger trend UP: make last-30-day average significantly higher than prior-30-day
- To trigger trend DOWN (churn): make last-30-day average lower
- Need at least 60 days of data for trend to work properly
- A sudden 1-week spike won't move the 30-day average much — use sustained patterns

### fator_sazonalidade (Monthly Seasonality)

```csharp
mediaMes = avg(all transactions in the same calendar month historically)
mediaGeral = avg(all transactions)
sazonalidade = Clamp(mediaMes / mediaGeral, 0.5, 2.0)
```

- Also clamped [0.5, 2.0]
- Only meaningful with multi-month data spanning different months
- With 90-day data covering 3 months, some seasonality is captured

**Implication for scenarios**: To simulate winter seasonality, put lower quantities in Jun/Jul/Aug months and higher in Dec/Jan. The engine compares month-level averages.

### fator_feriado (Holiday Multiplier)

```csharp
// Fixed multiplier, no learning
fator_feriado = 1.35  // Exact holiday date
```

Built-in holidays (hardcoded in engine):
- Ano Novo (01/01)
- Carnaval (terça, calculated)
- Sexta-feira Santa (calculated)
- Tiradentes (21/04)
- Dia do Trabalho (01/05)
- Independência (07/09)
- Nossa Senhora Aparecida (12/10)
- Finados (02/11)
- Proclamação da República (15/11)
- Natal (25/12)

**Implication**: The engine applies 1.35 REGARDLESS of actual data on holidays. Even if your CSV shows low holiday sales, the forecast boosts by 35%.

### fator_vespera (Holiday Eve)

```csharp
fator_vespera = 1.25  // Day before any holiday
```

**Implication**: Stacks with other factors. Holiday eve on a Saturday end-of-month: `1.25 * 1.25 * 1.15 = 1.797` — almost 80% boost.

### fator_fim_mes / fator_inicio_mes

```csharp
fator_fim_mes = 1.15    // Days 27-31 of month (last 5 days)
fator_inicio_mes = 1.10  // Days 1-5 of month (first 5 days)
```

These are **fixed** — no learning. Applied based on calendar position only.

## Confidence Formula

```csharp
cv = stddev / mean  // Coefficient of Variation
confianca_base = 100 - (cv * 50)
confianca = Clamp(confianca_base, 40, 95)

// Horizon penalty
if (diasNoFuturo > 14) confianca -= 5
if (diasNoFuturo > 21) confianca -= 5  // cumulative: -10 total
```

**What drives confidence DOWN**:
- High variance in historical data (high CV)
- Predictions far into the future (>14 days: -5%, >21 days: -10%)

**What drives confidence UP**:
- Consistent daily quantities (low CV)
- Near-term predictions (< 14 days)

**Range**: Always between 40% and 95%, never outside.

**Implication for scenarios**:
- Stable product (e.g., Leite ~55/day with +-5): confidence ~85-95%
- Volatile product (e.g., post-promo swings 20-80): confidence ~50-65%
- To test low confidence: embed high variance in the CSV data

## Alert Generation

### Volume-Based Alerts (always generated)

```csharp
// After generating all predictions:
topProducts = predictions
    .GroupBy(product)
    .OrderByDescending(sum of predicted quantity over 30 days)
    .Take(5)

foreach (product in topProducts) {
    if (product.rank <= 3) → AlertType.PrevisaoAlta, Severity.Atencao
    if (product.rank 4-5) → AlertType.PrevisaoAlta, Severity.Informativo
}
```

**Always 5 product alerts** (as long as 5+ products exist).

### Holiday Alerts (conditional)

```csharp
// Check for holidays within the forecast horizon (next 30 days)
holidaysInHorizon = hardcoded_holidays.Where(date within horizon)
foreach (holiday in holidaysInHorizon.Take(3)) {
    → AlertType.EventoProximo, Severity.Informativo
    // Justificativa mentions the holiday name and date
}
```

**Max 3 holiday alerts** even if more holidays exist in horizon.

### Import Alert (always 1)

```csharp
// After CSV import
→ AlertType.ImportacaoCompleta, Severity.Informativo
// Message: "X linhas importadas, Y produtos, Z transacoes"
```

### Total Alerts Per Run: 6-9

- 5 volume alerts (always)
- 0-3 holiday alerts (depends on horizon)
- 1 import alert (always)

### What the Engine Does NOT Generate Alerts For

- Declining trends (no "sales dropping" alert)
- Products below a threshold
- Stockout detection
- Anomalous spikes
- Price changes
- Competitor impact

## CSV Parser (CsvParser.cs)

### Date Formats (tried in order)
1. `dd/MM/yyyy`
2. `yyyy-MM-dd`
3. `dd-MM-yyyy`
4. `dd/MM/yyyy HH:mm`
5. `yyyy-MM-dd HH:mm:ss`
6. `dd.MM.yyyy`
7. `M/d/yyyy`

### Separator Auto-Detection
Tests: `;`, `,`, `\t`, `|` — picks whichever produces most columns on header line.

### Column Mapping (case-insensitive)
| Field | Accepted Names |
|-------|---------------|
| Date | data, date, data_venda, dt_venda |
| Product | produto, product, nome_produto, descricao |
| Quantity | quantidade, qty, quantity, qtd, qtde |
| Price | preco, price, preco_unitario, valor, valor_unitario |
| Code | codigo, code, ean, barcode, cod_produto |

### Encoding
Tries: UTF-8 strict → Latin1 fallback → UTF-8 relaxed.

### Quantity Rules
- Must be > 0
- Decimal values are `Math.Ceiling()` to integer
- Zero or negative quantities are SKIPPED (not imported)

## Detection Capabilities Matrix

What the engine CAN vs CAN'T detect:

| Pattern | Detects? | How | Limitation |
|---------|----------|-----|------------|
| Weekly cycle (Sat high, Sun low) | YES | Day-of-week averages | Needs 3+ weeks data |
| Sustained growth/decline | YES | Trend factor (30d/30d) | Clamped at 2x, needs 60d |
| Monthly seasonality | PARTIAL | Month avg vs global avg | Needs multi-month data |
| Fixed holidays | YES | Hardcoded multiplier | Same 1.35 for all holidays |
| Salary cycle (month boundaries) | YES | Fixed 1.15/1.10 multipliers | Not data-driven |
| Promotion spike | INDIRECT | Raises trend + weekday avg | Can't distinguish promo vs organic |
| Post-promo hangover | INDIRECT | Lowers trend if recent | Misses the cause |
| Competitor churn | INDIRECT | Trend factor decreases | No root cause attribution |
| Stockout | NO | Product just shows 0 qty | Excluded from predictions if <7 days |
| Price elasticity | NO | Ignores price column for predictions | Price stored but unused |
| Cross-sell correlation | NO | Each product predicted independently | No basket analysis |
| Weather impact | NO | No external data inputs | Fixed seasonality only |
| Event-specific boost | NO | Only knows hardcoded holidays | Custom events invisible |

## Key Calibration Tips

1. **To ensure trend detection**: Provide 60+ days with clear slope in the last 30 vs prior 30
2. **To maximize confidence**: Keep daily variance < 20% (std/mean < 0.2 → confidence > 90%)
3. **To trigger holiday alerts**: Set forecast horizon to include a holiday date
4. **To test minimum data**: Provide exactly 7 days for one product (edge case)
5. **To see clamping**: Make last-30d average 3x the prior-30d → trend caps at 2.0
6. **For presentation data**: Use 90 days, stable base, one clear event → clean before/after
7. **The engine combines multipliers**: A Saturday (high weekday avg) + holiday (1.35) + month-end (1.15) can produce predictions 2-3x normal
