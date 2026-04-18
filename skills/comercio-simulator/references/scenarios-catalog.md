# Scenarios Catalog

Comprehensive library of retail scenarios with exact parameters, expected engine behavior, and validation criteria. Each scenario is calibrated to what PrevisaoEngine can actually detect.

## Scenario Index

| # | Scenario | Complexity | Days | Key Factor Tested |
|---|----------|-----------|------|-------------------|
| 1 | Promocao Relampago | Simple | 60 | Trend spike + hangover |
| 2 | Churn por Concorrente | Simple | 90 | Sustained trend decline |
| 3 | Black Friday | Simple | 60 | Holiday multiplier + spike |
| 4 | Sazonalidade Inverno | Medium | 90 | Monthly seasonality factor |
| 5 | Feriado Pascoa | Simple | 60 | Holiday + eve multipliers |
| 6 | Ciclo Salarial | Simple | 60 | Month boundary multipliers |
| 7 | Stockout Cascata | Medium | 60 | Missing data handling |
| 8 | Liquidacao Pos-Natal | Medium | 90 | Deep discount + volume spike |
| 9 | Concorrente Direto | Medium | 90 | Category-selective churn |
| 10 | Reajuste de Preco | Medium | 60 | Price change + demand shift |
| 11 | Combo Cross-Sell | Medium | 60 | Correlated product patterns |
| 12 | Fim Promocao Hangover | Medium | 90 | Post-spike decline analysis |
| 13 | Crise Economica | Complex | 90 | Global decline + category shift |
| 14 | Delivery/E-commerce | Medium | 60 | New channel growth |
| 15 | Multi-Evento Completo | Complex | 90 | All factors combined |
| 16 | Inauguracao de Loja | Medium | 45 | Ramp-up from zero |
| 17 | Sazonalidade Verao | Medium | 90 | Opposite of inverno |
| 18 | Semana do Consumidor | Simple | 60 | March event spike |

---

## Scenario 1: Promocao Relampago

**Story**: Arroz 5kg promoted at 30% off for 5 days. Volume spikes during promo, then drops below normal for 3-4 days as customers already stocked up (pantry loading effect).

**Parameters**:
```
Produto alvo: Arroz 5kg
Desconto: 30% (preco: 22.90 -> 16.03)
Duracao promo: 5 dias (dia -12 a dia -8 do historico)
Spike: +60% durante promo
Hangover: -28% por 4 dias apos (dia -7 a dia -4)
Retorno ao normal: dia -3 em diante
```

**Engine behavior**:
- Trend factor: slightly UP (promo spike raises last-30d average)
- The hangover partially offsets, but net effect is still positive
- Day-of-week averages skewed if promo spans different weekdays
- Confidence: slightly LOWER due to increased variance from spike+hangover

**Expected dashboard output**:
- Arroz near top of volume ranking (top 5 → PrevisaoAlta alert)
- Forecast 7d: inflated ~10-15% above true baseline
- Forecast 30d: moderately inflated ~5-10%

**Validation**:
- [ ] Arroz appears in top-5 alerts
- [ ] Confidence for Arroz < 85% (variance from promo)
- [ ] Forecast > pre-promo baseline (engine absorbed the spike)

---

## Scenario 2: Churn por Concorrente

**Story**: A new Atacadao opened 2km away. Over 6 weeks, customers gradually migrated. Non-perishable categories hit hardest; fresh/bakery categories retained (convenience purchases).

**Parameters**:
```
Duracao: 90 dias (6 semanas de queda + 6 semanas anteriores estavel)
Produtos afetados: Arroz, Feijao, Acucar, Oleo, Macarrao, Farinha, Sabao (non-perishable)
Taxa de queda: -5% por semana (compounding)
Semana 1: x0.95, Semana 2: x0.90, ..., Semana 6: x0.74
Produtos mantidos: Leite, Pao, Cafe (perishable/convenience) - sem queda
```

**Engine behavior**:
- Trend factor for affected products: ~0.74 (mediaRecente much lower than mediaAnterior)
- Trend for unaffected products: ~1.0 (stable)
- Clear divergence between product groups in forecast
- Confidence stays reasonable (steady decline = moderate variance)

**Expected dashboard output**:
- Unaffected products (Leite, Pao, Cafe) dominate top-5 by volume
- Affected products have lower 30d forecasts
- Alerts mainly for high-volume stable products, not declining ones

**Validation**:
- [ ] Trend factor visible: affected products predict LESS than 30d ago baseline
- [ ] Leite/Pao/Cafe maintain stable forecasts
- [ ] Total 30d volume lower than if no churn

---

## Scenario 3: Black Friday

**Story**: Black Friday on the last Friday of November in the data. Massive spike for 3 days (Fri-Sun), then sharp drop.

**Parameters**:
```
Evento: Black Friday (ultima sexta de novembro)
Pre-BF (7 dias antes): +10% gradual ramp-up (anticipation)
Dia BF (sexta): +120% all products
Sabado pos-BF: +80%
Domingo pos-BF: +40%
Segunda pos-BF: -30% (market hangover)
Restante da semana: -15% por 5 dias
Retorno ao normal: ~10 dias pos-BF
```

**Engine behavior**:
- If BF is hardcoded as holiday: 1.35 multiplier on the date automatically
- BF is NOT in the engine's hardcoded holiday list
- Engine sees it purely as data — the spike raises averages and trend
- Day-of-week averages heavily skewed for that specific Friday/Saturday

**Expected dashboard output**:
- All products get inflated 30d forecasts (BF inflated the averages)
- Confidence may drop slightly (one massive outlier day)
- No specific holiday alert for BF (it's not in the engine's holiday list)

**Validation**:
- [ ] NO holiday alert for Black Friday (engine doesn't know BF)
- [ ] All product forecasts inflated vs pre-BF levels
- [ ] Confidence slightly lower than pure stable scenario

---

## Scenario 4: Sazonalidade Inverno

**Story**: June-August in Brazil. Hot beverages (cafe) and comfort food UP; cold beverages and cleaning products DOWN.

**Parameters**:
```
Duracao: 90 dias cobrindo Jun-Jul-Ago
Categoria Aquecimento (UP):
  Cafe: +25% base, Leite: +15%, Acucar: +10%, Farinha: +10%
Categoria Frio (DOWN):
  (simulated via lower base): baseline -15% for these months
Categoria Estavel:
  Arroz, Feijao, Macarrao, Oleo: sem alteracao sazonal
Sabao em Po: -10% (menos lavagem de roupa no frio)
```

**Engine behavior**:
- Monthly seasonality factor kicks in: mediaMes vs mediaGeral differs by month
- Products with consistent 3-month highs get sazonalidade > 1.0
- Products with consistent 3-month lows get sazonalidade < 1.0
- With only 3 months of data, seasonality factor is moderate (not extreme)

**Expected dashboard output**:
- Cafe predicted as high-volume (base + seasonality boost)
- If forecast horizon falls in same months, seasonality amplifies predictions

**Validation**:
- [ ] Cafe and Leite appear in top-5 by volume
- [ ] Products stable across months show sazonalidade ~1.0
- [ ] Total forecast reflects winter patterns

---

## Scenario 5: Feriado Pascoa

**Story**: Easter with 7-day ramp-up. Chocolate-adjacent products spike. Sexta-feira Santa is engine holiday + Domingo de Pascoa.

**Parameters**:
```
Data: Sexta-feira Santa (engine hardcoded holiday)
Pre-Pascoa (7 dias antes): Acucar +30%, Leite +20%, Farinha +25%
Vespera (quinta-feira santa): All +20%
Sexta-feira Santa: -40% on most products (comercio fechado)
  BUT engine will apply 1.35 holiday multiplier to forecast
Sabado de Aleluia: +50% (compras de ultima hora)
Domingo Pascoa: -60% (fechado)
Segunda pos-Pascoa: normaliza
```

**Engine behavior**:
- Sexta-feira Santa: engine applies 1.35 (hardcoded), but actual CSV has LOW data
- This creates a MISMATCH: engine predicts high, actual was low
- Thursday ante-holiday: engine applies 1.25 (vespera)
- The conflicting data (low actual + high multiplier) is a known limitation

**CRITICAL INSIGHT**: This scenario reveals an engine weakness. Holidays where stores are CLOSED get a +35% boost in forecasts. The engine assumes holidays = more sales.

**Validation**:
- [ ] Sexta-feira Santa appears in holiday alerts
- [ ] Engine forecast for Sexta-feira Santa is BOOSTED despite low actual data
- [ ] Pre-Pascoa products (Acucar, Leite, Farinha) show elevated trend
- [ ] Document the mismatch between forecast and reality for closed-store holidays

---

## Scenario 6: Ciclo Salarial

**Story**: Brazilian salary cycle: most workers paid on 5th (monthly) or 20th (bi-weekly). Spending peaks at month boundaries.

**Parameters**:
```
Duracao: 60 dias (2 meses completos)
Dias 1-5 cada mes: +12% all products (pagamento caiu)
Dias 6-19: baseline normal
Dias 20-24: +8% (bi-weekly payment)
Dias 25-31: +15% all products (anticipacao + pagamento quinzena)
Cesta basica: efeito amplificado x1.5 (Arroz, Feijao, Oleo, Acucar)
Produtos de limpeza/luxo: efeito menor x0.8
```

**Engine behavior**:
- Fixed multipliers: fator_fim_mes = 1.15 (days 27-31), fator_inicio_mes = 1.10 (days 1-5)
- Engine captures days 27-31 and 1-5 but MISSES days 20-24 (bi-weekly)
- The bi-weekly payment effect is invisible to the engine

**Expected dashboard output**:
- Forecasts for month-boundary dates are 10-15% higher than mid-month
- Products with amplified salary effect show higher overall averages

**Validation**:
- [ ] Predictions for days 1-5 show ~10% boost
- [ ] Predictions for days 27-31 show ~15% boost
- [ ] Mid-month predictions are lower (no multiplier)
- [ ] Document: engine misses the 20-24 bi-weekly spike

---

## Scenario 7: Stockout Cascata

**Story**: Macarrao supplier ran out for 10 days. During stockout, customers substituted with Arroz and Farinha (carb substitution).

**Parameters**:
```
Produto em falta: Macarrao
Periodo stockout: dia -15 a dia -6 (10 dias, zero sales)
Substitutos: Arroz +15%, Farinha +20% during stockout period
Retorno: Macarrao volta com +30% spike (pent-up demand, 3 dias)
Normalizacao: 5 dias apos retorno
```

**Engine behavior**:
- Macarrao: 0 quantity days are SKIPPED by CSV parser (qty must be > 0)
- If Macarrao has < 7 valid days total, it's EXCLUDED from forecasts entirely
- With 60 days total minus 10 stockout days = 50 valid days → still forecasted
- Stockout days create a "gap" that LOWERS the average
- Substitutes show temporary elevation in averages

**CRITICAL INSIGHT**: The engine doesn't know about stockouts. It just sees lower average. If a product has frequent stockouts embedded in data, forecasts will be systematically LOW.

**Validation**:
- [ ] Macarrao forecast is LOWER than true demand (stockout bias)
- [ ] Arroz and Farinha show slightly elevated forecasts (substitution absorbed)
- [ ] If stockout = entire period, product may be excluded (<7 days)

---

## Scenario 8: Liquidacao Pos-Natal

**Story**: January clearance sale. December had Natal boost, January has deep discounts on everything to clear inventory.

**Parameters**:
```
Duracao: 90 dias (Nov-Dez-Jan)
Novembro: baseline normal
Dezembro: +30% volume (festas), preco normal
  Natal (25/12): engine holiday 1.35
  Vespera (24/12): engine eve 1.25
Janeiro 1-7: -20% (ressaca pos-festas)
Janeiro 8-31: Liquidacao -40% preco, +50% volume
  Cesta basica less affected: +20% volume only
```

**Engine behavior**:
- November = baseline, December = high, January = mixed
- Trend: January avg vs December avg → trend < 1.0 for products without liquidacao boost
- Seasonality: December month avg > general avg → sazonalidade_dec > 1.0
- If forecast horizon is in January: seasonality factor for January may be < 1.0 (lower month avg historically) OR > 1.0 (if liquidacao volume offsets)

**Validation**:
- [ ] Natal gets holiday alert
- [ ] December products show high forecasts
- [ ] January forecasts reflect the mixed signal (lower price, higher volume)
- [ ] Trend factor varies per product

---

## Scenario 9: Concorrente Direto (Category-Selective Churn)

**Story**: A specialized bakery/padaria opened nearby. Only bakery-adjacent products lost sales; everything else stable.

**Parameters**:
```
Duracao: 90 dias
Produtos afetados (-20% gradual over 4 weeks):
  Pao de Forma: -25% (direct competition)
  Leite: -15% (bundled purchases with bread)
  Cafe: -10% (morning coffee + bread routine)
Produtos nao afetados: Arroz, Feijao, Acucar, Oleo, Macarrao, Farinha, Sabao
Timing: Churn starts at day -30, deepens weekly
  Weeks -4: x0.95, -3: x0.90, -2: x0.85, -1: x0.80
```

**Engine behavior**:
- CLEAR trend divergence between affected and unaffected groups
- Pao de Forma: trend ~0.80, Cafe: trend ~0.90
- Unaffected products: trend ~1.0
- This is the clearest scenario for demonstrating per-product trend sensitivity

**Validation**:
- [ ] Pao, Leite, Cafe have visibly lower 30d forecasts
- [ ] Other products maintain normal forecast levels
- [ ] Top-5 alerts shift to unaffected high-volume products
- [ ] Demonstrates the engine can detect SELECTIVE decline

---

## Scenario 10: Reajuste de Preco

**Story**: Supplier raised Oleo de Soja price by 20%. Customers reduced purchases due to price elasticity.

**Parameters**:
```
Duracao: 60 dias
Produto: Oleo de Soja
Dia -30: preco sobe de 7.99 para 9.59 (+20%)
Reacao do consumidor: -15% volume gradual over 2 weeks
  Semana 1: -8%
  Semana 2: -15%
  Estabiliza em -15% do baseline
Substituto: Nenhum simulado (oleo nao tem substituto direto)
```

**Engine behavior**:
- Engine IGNORES price data for predictions (only stores it)
- Detects volume decline purely through trend factor
- Trend: recent 30d avg lower than prior 30d avg → trend ~0.85
- The engine will predict lower volume WITHOUT knowing the cause is price

**CRITICAL INSIGHT**: Price elasticity effects are invisible to the engine's reasoning. It attributes the decline to "trend" generically. For a real system, this matters: the engine can't tell you "sales dropped because price went up."

**Validation**:
- [ ] Oleo forecast drops by ~15%
- [ ] Engine justificativa mentions "tendencia" not "preco"
- [ ] Price change is stored in DB but unused in prediction
- [ ] Demonstrates the engine's price-blindness

---

## Scenario 11: Combo Cross-Sell

**Story**: Arroz + Feijao always bought together. Macarrao + Farinha also paired. Test if the engine captures correlated demand (spoiler: it doesn't).

**Parameters**:
```
Duracao: 60 dias
Pares correlatos:
  Arroz + Feijao: correlation 0.85 (when Arroz goes up, Feijao goes up)
  Macarrao + Farinha: correlation 0.75
Implementacao: On high-Arroz days, also boost Feijao proportionally
  Arroz random up +20% → Feijao also up +15%
  Macarrao random up +15% → Farinha also up +10%
Non-correlated: Leite, Cafe, Pao (independent random variation)
```

**Engine behavior**:
- Each product predicted INDEPENDENTLY
- No cross-product correlation captured
- Both Arroz and Feijao will show similar weekday patterns (always high together, always low together)
- BUT this is coincidental correlation, not causation that the engine models

**Validation**:
- [ ] Arroz and Feijao have similar day-of-week patterns (both high on same days)
- [ ] Engine doesn't link them — no "basket" concept in alerts
- [ ] Demonstrates the independent-prediction limitation

---

## Scenario 12: Fim Promocao Hangover

**Story**: Long 2-week promotion ended. Deep post-promo decline as customers already bought ahead. The HANGOVER is the focus.

**Parameters**:
```
Duracao: 90 dias
Produto: Cafe 500g
Pre-promo (dias -90 a -45): stable baseline (25/dia)
Promo (dias -44 a -31): desconto 25%, volume +70% (42/dia)
Hangover (dias -30 a -21): volume -35% (16/dia) — pantry loaded
Recovery (dias -20 a -11): gradual return -15% (21/dia)
New normal (dias -10 a -1): slight undershoot -8% (23/dia)
```

**Engine behavior**:
- Trend: mediaRecente (last 30d spans hangover + recovery + new normal) vs mediaAnterior (30d spans promo period)
- Last 30d avg: ~(16*10 + 21*10 + 23*10)/30 = 20.0
- Prior 30d avg: ~(42*14 + 25*16)/30 = 33.0 (roughly)
- Trend: 20.0/33.0 = 0.61 → engine sees DECLINING trend
- This is MISLEADING: the business is actually healthy, the decline is just post-promo normalization

**CRITICAL INSIGHT**: This is the engine's biggest blind spot with promotions. A successful promotion FOLLOWED BY expected hangover looks like a declining business to the engine. Real-world implication: don't run promotions right before a forecasting cycle.

**Validation**:
- [ ] Cafe shows trend < 1.0 (declining) despite healthy underlying demand
- [ ] Forecast 30d is BELOW the true baseline of 25/dia
- [ ] Confidence may be lower due to high variance across the 90 days
- [ ] Document this as a known engine limitation for promotion planning

---

## Scenario 13: Crise Economica

**Story**: General economic downturn (inflation spike, unemployment rise). All products decline but at different rates. Essentials hold better; non-essentials drop more.

**Parameters**:
```
Duracao: 90 dias
Fase 1 (dia -90 a -61): normal baseline
Fase 2 (dia -60 a -31): decline begins
  Essenciais (Arroz, Feijao, Oleo, Acucar): -8% gradual
  Mercearia (Macarrao, Farinha): -12%
  Premium (Cafe, Sabao marca): -20%
  Pereciveis (Leite, Pao): -5% (inelastic)
Fase 3 (dia -30 a -1): plateau at reduced level
  Essenciais: -10% from baseline
  Mercearia: -18%
  Premium: -30%
  Pereciveis: -8%
Preco: +5% across all products (inflation passthrough)
```

**Engine behavior**:
- ALL products show trend < 1.0
- Differential decline rates visible per product
- Products with steepest decline (Premium) show lowest trend factors
- Price increase stored but NOT factored into predictions
- Seasonality may be affected if crisis data spans different months

**Validation**:
- [ ] All product forecasts are below historical baseline
- [ ] Premium products (Cafe, Sabao) show largest decline
- [ ] Essentials (Arroz, Feijao) show smallest decline
- [ ] Demonstrates differential sensitivity by product category
- [ ] Total 30d forecast significantly lower than pre-crisis level

---

## Scenario 14: Delivery/E-commerce Channel

**Story**: Store launched delivery via iFood/Rappi. New channel adds incremental sales, mostly on weekday evenings and weekends.

**Parameters**:
```
Duracao: 60 dias
Pre-delivery (dia -60 a -31): baseline only
Post-delivery (dia -30 a -1): +15% overall volume
  Weekday boost: +10% (delivery adds convenience)
  Weekend boost: +20% (lazy Sunday orders)
  Product mix shift: Pao +25%, Leite +20%, Cafe +15% (breakfast bundles)
  Cesta basica: +5% (less delivery-friendly, heavy items)
```

**Engine behavior**:
- Clear trend UP for all products (last-30d > prior-30d)
- Weekend day-of-week averages increase more than weekday
- Products with bigger delivery boost show higher trends
- Engine can't distinguish in-store vs delivery (just sees total volume)

**Validation**:
- [ ] All products show trend > 1.0
- [ ] Weekend predictions show proportionally larger increase
- [ ] Pao, Leite, Cafe have highest trend factors
- [ ] Top-5 alerts reflect the new volume leaders

---

## Scenario 15: Multi-Evento Completo

**Story**: The ultimate stress test. Layer multiple events in the same 90-day period: a holiday, a promotion, salary cycle, one competitor opening, and seasonal shift.

**Parameters**:
```
Duracao: 90 dias
Events layered:
  1. Holiday: Feriado in day -20 (engine hardcoded)
  2. Promotion: Arroz 30% off, dias -45 a -38 (7 dias)
  3. Post-promo hangover: Arroz -25% dias -37 a -33
  4. Competitor: Pao/Leite -5%/semana starting dia -30
  5. Salary cycle: +12% on dias 1-5 and 25-31 of each month
  6. Sazonalidade: Cafe +15% if winter months
All multipliers are MULTIPLICATIVE (they stack)
```

**Engine behavior**:
- Each factor contributes to the final prediction independently
- Stacking can produce extreme values: Saturday + holiday + month-end = 1.25 * 1.35 * 1.15 = 1.94x
- Some effects cancel: competitor churn (down) + salary cycle (up) → mixed signal
- Trend is NET of all effects in the last 30d vs prior 30d
- This scenario tests whether the engine gracefully handles complex, noisy data

**Validation**:
- [ ] Holiday appears in alerts
- [ ] Arroz elevated from promo effect on averages
- [ ] Pao/Leite show declining trend
- [ ] Month-boundary dates show 10-15% boost
- [ ] No crashes or NaN values despite complex stacking
- [ ] Confidence varies significantly per product (some stable, some volatile)

---

## Scenario 16: Inauguracao de Loja

**Story**: Brand new store opening. First 2 weeks have artificially high traffic (curiosity, grand opening promos). Then normalization.

**Parameters**:
```
Duracao: 45 dias (engine minimum viable: 7 dias per product)
Semana 1 (dias 1-7): Grand opening, all products +100%
Semana 2 (dias 8-14): Settling, +50%
Semana 3 (dias 15-21): +20% (still above future normal)
Semana 4-6 (dias 22-45): True baseline establishes
```

**Engine behavior**:
- Trend: DECLINING (first weeks inflated, recent weeks normal)
- Day-of-week averages SKEWED by grand opening spike
- Confidence: LOW (high variance from opening vs normal periods)
- Grand opening data pollutes the forecast — engine thinks demand is dropping

**CRITICAL INSIGHT**: For new stores, the first 2-3 weeks of data should ideally be excluded or the system should start forecasting only after 30+ days of normal operations.

**Validation**:
- [ ] Trend factor < 1.0 for all products (misleading decline)
- [ ] Confidence lower than stable-store scenarios
- [ ] Demonstrates why "burn-in period" is important for new stores

---

## Scenario 17: Sazonalidade Verao (Dec-Feb)

**Story**: Brazilian summer. Beverages and hygiene UP, comfort food DOWN.

**Parameters**:
```
Duracao: 90 dias (Dec-Jan-Feb)
UP:
  Leite: +10% (smoothies, cereal)
  Acucar: +15% (sucos, limonada)
  Sabao em Po: +10% (mais lavagem, mais suor)
DOWN:
  Cafe: -15% (less hot drinks)
  Farinha: -10% (less baking)
STABLE:
  Arroz, Feijao, Oleo, Macarrao, Pao
Special: Natal (25/12) and Ano Novo (01/01) hardcoded holidays
```

**Engine behavior**:
- Monthly seasonality: Dec/Jan/Feb averages vs global average
- Holiday multipliers active for Natal and Ano Novo
- If forecast horizon is in Feb, seasonality from Feb data applies
- Combined with holidays in December, December month average is inflated

**Validation**:
- [ ] Cafe forecast lower than annual baseline
- [ ] Acucar/Sabao forecast higher
- [ ] Natal and Ano Novo appear in holiday alerts (if in horizon)
- [ ] December month average includes holiday inflation

---

## Scenario 18: Semana do Consumidor

**Story**: March 15 = Dia do Consumidor. Retailers run week-long promos. NOT in engine's holiday list.

**Parameters**:
```
Duracao: 60 dias
Normal baseline: dia -60 a -11
Pre-evento (dia -10 a -8): +5% anticipacao
Semana do Consumidor (dia -7 a -1): all products -15% preco, +40% volume
  Destaque: Sabao em Po +60%, Cafe +50% (stockpiling non-perishables)
```

**Engine behavior**:
- NOT a hardcoded holiday → no automatic 1.35 multiplier
- Engine sees it purely as elevated data in the last week
- Raises trend factor (last-30d avg includes the spike)
- If all 60 days available, the 7-day spike is diluted in the 30-day window

**Validation**:
- [ ] NO holiday alert for Dia do Consumidor
- [ ] Trend slightly elevated for affected products
- [ ] Sabao and Cafe may enter top-5 by volume
- [ ] Lower effect than expected because 7 days diluted in 30-day average

---

## Validation Master Checklist

Use after ANY scenario execution:

### Data Quality
- [ ] CSV imported without errors (check import response)
- [ ] All 10 products present in dashboard
- [ ] Transaction count matches expected (products x days)
- [ ] Date range starts within 12-month lookback window

### Prediction Quality
- [ ] No NaN or null values in predictions
- [ ] All predictions >= 1 (engine floor)
- [ ] Confidence between 40% and 95% for all products
- [ ] Products with stable data have confidence > 80%
- [ ] Products with volatile data have confidence < 75%

### Alert Quality
- [ ] Exactly 5 product volume alerts generated
- [ ] Holiday alerts present for holidays in horizon (0-3)
- [ ] 1 import completion alert
- [ ] Alert severity matches expectation (Atencao vs Informativo)

### Trend Detection
- [ ] Products with intentional growth show trend > 1.0
- [ ] Products with intentional decline show trend < 1.0
- [ ] Stable products show trend ~1.0
- [ ] No trend should exceed [0.5, 2.0] range

### Known Limitations (document, don't treat as failures)
- [ ] Closed-store holidays still get 1.35 boost
- [ ] Post-promo hangover looks like declining business
- [ ] Price changes are invisible to predictions
- [ ] Cross-product correlation not captured
- [ ] Bi-weekly salary cycle (day 20) not detected
- [ ] Custom events (Black Friday, Dia do Consumidor) not detected as holidays
- [ ] New store grand-opening data pollutes forecasts

---

## Generating Custom Scenarios

For scenarios not in this catalog, follow this template:

```
1. STORY: One paragraph describing what happened in the real world
2. PARAMETERS:
   - Duration: N days
   - Products affected: list
   - Multiplier pattern: how quantity changes over time
   - Price changes: if any
   - Timing: when in the timeline
3. ENGINE PREDICTION:
   - Which factors are triggered? (trend, seasonality, holiday, month-boundary)
   - What does the engine see vs reality?
   - Known blind spots for this scenario?
4. VALIDATION:
   - What should the dashboard show?
   - Which alerts should fire?
   - What confidence range is expected?
5. INSIGHTS:
   - What does this teach about the engine?
   - What would a real retailer learn?
```

## Combining Scenarios

Any two scenarios can be combined by applying multipliers additively or multiplicatively:

**Additive** (independent events): Apply each scenario's multiplier separately. Example: Holiday (1.35) + Month-end (1.15) but they happen on different days.

**Multiplicative** (overlapping events): Multiply factors for the same day. Example: Holiday AND month-end on same day → 1.35 * 1.15 = 1.55.

**Conflicting** (opposing forces): Use net effect. Example: Churn (-20%) + Holiday (+35%) → net +8% on the holiday day.

Rule of thumb: Start simple (1 event), validate, then add complexity.
