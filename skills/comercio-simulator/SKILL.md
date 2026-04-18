---
name: comercio-simulator
description: "Simulate realistic retail scenarios for the Comercio forecasting system: generate 60-90 day sales CSV with promotions, holidays, customer churn, competitor events, seasonal drops, stockouts, cross-selling, salary cycles, price elasticity, and multi-event combos. Use when: testing forecasting MVP, generating test data, simulating promotions, analyzing sales drop scenarios, testing customer loss, creating realistic retail CSV, testing demand prediction, validating alerts, running what-if scenarios, cenario de promocao, queda de vendas, perda de clientes, feriado, Black Friday, Pascoa, ciclo salarial, sazonalidade, stockout, cross-sell, elasticidade preco, combo promocional, liquidacao, concorrente, churn, impacto promocao, previsao demanda."
argument-hint: "Descreva o cenario: 'promocao de arroz 30% off semana que vem', 'queda de vendas por concorrente', 'Black Friday', 'sazonalidade inverno', 'combo arroz+feijao', 'stockout macarrao'"
---

# Comercio Scenario Simulator

Generate realistic retail sales data (CSV) covering up to 90 days, run it through the forecasting engine, and analyze predictions against known events. Each scenario embeds controlled patterns so you can validate if the engine detects promotions, churn, holidays, and anomalies correctly.

**Scripts**: [generate-scenario.ps1](./scripts/generate-scenario.ps1) | [run-scenario.ps1](./scripts/run-scenario.ps1)
**Deep reference**: [retail-intelligence.md](./references/retail-intelligence.md) | [engine-internals.md](./references/engine-internals.md) | [scenarios-catalog.md](./references/scenarios-catalog.md)

## When to Use

- Plan a **real promotion** and predict its impact before running it
- Simulate **customer churn** from a competitor opening nearby
- Test **what-if scenarios**: "what if we discount Arroz 30% for 7 days?"
- Validate the engine detects **holidays**, **salary cycles**, **seasonal shifts**
- Stress-test with **multi-event overlaps** (promo + holiday + churn)
- Generate **presentation-ready data** showing the system's predictive capability
- Understand **post-promotion hangover** and plan inventory accordingly
- Detect **price elasticity** effects and measure demand sensitivity

## System Context

- **Project path**: `c:\Users\Usuario\Downloads\agentes\comercio\`
- **Server start**: `dotnet run --project src\Comercio.Web` (from comercio dir)
- **DB reset**: `Remove-Item "src\Comercio.Web\comercio.db*" -Force`
- **PATH fix** (every terminal): `$env:Path = [System.Environment]::GetEnvironmentVariable("Path", "Machine") + ";" + [System.Environment]::GetEnvironmentVariable("Path", "User")`
- **Registration payload**: `{"nomeEmpresa":"Mercado Demo","tipoComercio":"Supermercado","email":"admin@demo.com","senha":"Senha123!"}`
- **CSV format**: `;` separator, columns: `data;produto;quantidade;preco_unitario;codigo`
- **Date format**: `dd/MM/yyyy` (Brazilian)
- **Lookback window**: 12 months from system date
- **Minimum data**: 7 days per product; average > 0.1 units

## Procedure

### Phase 1: Scenario Definition

Map the user's request to one or more patterns from the [scenarios catalog](./references/scenarios-catalog.md). Key parameters to define:

| Parameter | Description | Default |
|-----------|-------------|---------|
| **Dias** | Days of historical data | 90 |
| **Produtos** | Which products are affected | All 10 |
| **Evento** | Type of event (promo, churn, holiday...) | Required |
| **Intensidade** | Multiplier strength | Varies by event |
| **Periodo** | When in the timeline the event occurs | Last 30 days |
| **Sobreposicao** | Combine with other events? | No |

### Phase 2: CSV Generation

Use `generate-scenario.ps1` or generate inline. The CSV MUST follow the engine's input rules:

```powershell
# Using the script (18 built-in scenarios)
powershell -ExecutionPolicy Bypass -File generate-scenario.ps1 -Cenario promocao -Dias 90

# Available scenarios:
# Base:      promocao, churn, blackfriday, sazonalidade, feriado-pascoa, ciclo-salarial, stockout, completo
# Advanced:  concorrente-direto, reajuste-preco, combo-crosssell, hangover-longo, crise-economica
# Extended:  delivery, multi-evento, inauguracao, sazonalidade-verao, semana-consumidor
```

For custom scenarios, generate CSV inline following the [quantity formula](./references/engine-internals.md#quantity-formula).

### Phase 3: Execute

```powershell
# Full automated pipeline
powershell -ExecutionPolicy Bypass -File run-scenario.ps1 -CsvPath cenario-promocao.csv
```

Or manual step-by-step:
1. Stop server → delete DB → restart server
2. Register tenant (POST `/api/auth/registrar`)
3. Import CSV (POST `/api/integracao/csv` multipart)
4. Generate forecasts (POST `/api/forecast/gerar`)
5. Get dashboard (GET `/api/dashboard/{tenantId}`)

### Phase 4: Analysis

Compare predictions against known embedded patterns. Use the [validation checklist](./references/scenarios-catalog.md#validation-master-checklist) and generate a report.

## Quick Reference: Engine Behavior

The engine applies these multipliers **multiplicatively** to the base (average by day-of-week):

| Factor | Value | When Applied |
|--------|-------|-------------|
| Holiday | ×1.35 | Exact holiday date |
| Holiday eve | ×1.25 | Day before holiday |
| End of month | ×1.15 | Last 5 days of month |
| Start of month | ×1.10 | First 5 days of month |
| Trend | mediaRecente/mediaAnterior | Clamped [0.5, 2.0] |
| Seasonality | mediaMes/mediaGeral | Clamped [0.5, 2.0] |

**Confidence**: `100 - (CV × 50)`, clamped [40%, 95%], `-5%` per week beyond day 14.
**Alerts**: Top 5 products by 30d volume → `PrevisaoAlta`; holidays in horizon → `EventoProximo` (max 3).
**Important**: Engine doesn't distinguish promo spikes from organic growth. It sees all as "data".
