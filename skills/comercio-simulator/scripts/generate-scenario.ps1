<#
.SYNOPSIS
    Gerador de dados de vendas realistas para o Sistema de Previsao de Demanda do Comercio.
.DESCRIPTION
    Gera CSVs com padroes de varejo brasileiro: promocoes, feriados, sazonalidade,
    ciclo salarial, churn, stockouts, cross-sell, crise, delivery, inauguracao.
    Cada cenario embute eventos conhecidos para validar se o motor de previsao
    detecta corretamente.
.PARAMETER Cenario
    Nome do cenario a gerar. Opcoes: promocao, churn, blackfriday, sazonalidade,
    feriado-pascoa, ciclo-salarial, stockout, completo, concorrente-direto,
    reajuste-preco, combo-crosssell, hangover-longo, crise-economica, delivery,
    multi-evento, inauguracao, sazonalidade-verao, semana-consumidor
.PARAMETER Dias
    Numero de dias de historico (default: 90)
.PARAMETER Output
    Caminho do arquivo CSV de saida
.EXAMPLE
    .\generate-scenario.ps1 -Cenario promocao -Dias 90
    .\generate-scenario.ps1 -Cenario completo -Dias 120 -Output cenario-completo.csv
#>
param(
    [Parameter(Mandatory=$true)]
    [ValidateSet("promocao","churn","blackfriday","sazonalidade","feriado-pascoa","ciclo-salarial","stockout","completo","concorrente-direto","reajuste-preco","combo-crosssell","hangover-longo","crise-economica","delivery","multi-evento","inauguracao","sazonalidade-verao","semana-consumidor")]
    [string]$Cenario,

    [int]$Dias = 90,

    [string]$Output = ""
)

if (-not $Output) { $Output = "cenario-$Cenario.csv" }

# === PRODUCT CATALOG ===
$produtos = @(
    @{ Nome="Arroz 5kg";           Preco=22.90; Codigo="7891000100101"; Media=45; Cat="Graos" }
    @{ Nome="Feijao Carioca 1kg";  Preco=8.49;  Codigo="7891000100201"; Media=32; Cat="Graos" }
    @{ Nome="Acucar 1kg";           Preco=4.99;  Codigo="7891000100301"; Media=48; Cat="Mercearia" }
    @{ Nome="Oleo de Soja 900ml";  Preco=7.99;  Codigo="7891000100401"; Media=30; Cat="Mercearia" }
    @{ Nome="Macarrao 500g";        Preco=3.49;  Codigo="7891000100501"; Media=38; Cat="Mercearia" }
    @{ Nome="Leite Integral 1L";   Preco=5.29;  Codigo="7891000100601"; Media=55; Cat="Laticinios" }
    @{ Nome="Pao de Forma";         Preco=8.99;  Codigo="7891000100701"; Media=35; Cat="Padaria" }
    @{ Nome="Cafe 500g";            Preco=18.90; Codigo="7891000100801"; Media=25; Cat="Bebidas" }
    @{ Nome="Farinha de Trigo 1kg";Preco=5.49;  Codigo="7891000100901"; Media=20; Cat="Mercearia" }
    @{ Nome="Sabao em Po 1kg";      Preco=12.90; Codigo="7891000101001"; Media=28; Cat="Limpeza" }
)

# === DATE SETUP ===
$hoje = Get-Date
$dataFim = $hoje.AddDays(-1)  # yesterday
$dataInicio = $dataFim.AddDays(-$Dias + 1)

# === FERIADOS BRASILEIROS (fixos + moveis 2024-2027) ===
$feriados = @(
    "2024-01-01","2024-02-12","2024-02-13","2024-03-29","2024-04-21","2024-05-01",
    "2024-05-30","2024-06-12","2024-09-07","2024-10-12","2024-11-02","2024-11-15",
    "2024-12-25",
    "2025-01-01","2025-03-03","2025-03-04","2025-04-18","2025-04-21","2025-05-01",
    "2025-06-12","2025-06-19","2025-09-07","2025-10-12","2025-11-02","2025-11-15",
    "2025-12-25",
    "2026-01-01","2026-02-16","2026-02-17","2026-04-03","2026-04-21","2026-05-01",
    "2026-06-04","2026-06-12","2026-09-07","2026-10-12","2026-11-02","2026-11-15",
    "2026-12-25",
    "2027-01-01","2027-02-08","2027-02-09","2027-03-26","2027-04-21","2027-05-01",
    "2027-05-27","2027-06-12","2027-09-07","2027-10-12","2027-11-02","2027-11-15",
    "2027-12-25"
) | ForEach-Object { [datetime]::ParseExact($_, "yyyy-MM-dd", $null).Date }

function Is-Holiday([datetime]$d) { return $feriados -contains $d.Date }
function Is-HolidayEve([datetime]$d) { return $feriados -contains $d.AddDays(1).Date }

# === DAY OF WEEK FACTOR ===
function Get-DowFactor([datetime]$d) {
    switch ($d.DayOfWeek) {
        "Monday"    { 0.85 }
        "Tuesday"   { 0.88 }
        "Wednesday" { 1.00 }
        "Thursday"  { 1.00 }
        "Friday"    { 1.15 }
        "Saturday"  { 1.25 }
        "Sunday"    { 0.70 }
        default     { 1.00 }
    }
}

# === SALARY CYCLE FACTOR ===
function Get-SalaryCycleFactor([datetime]$d) {
    $dia = $d.Day
    $diasNoMes = [DateTime]::DaysInMonth($d.Year, $d.Month)
    if ($dia -le 5)             { return 1.12 }  # pagamento mensal
    if ($dia -ge 15 -and $dia -le 20) { return 1.08 }  # quinzena
    if ($dia -ge 21 -and $dia -le 24) { return 0.95 }  # dinheiro curto
    if ($dia -ge ($diasNoMes - 5))    { return 1.15 }  # vespera pagamento
    return 1.00
}

# === SEASONALITY FACTOR ===
function Get-SeasonFactor([datetime]$d, [string]$cat) {
    $mes = $d.Month
    $base = switch ($mes) {
        1  { 1.15 }  # verao + ferias
        2  { 1.10 }  # carnaval
        3  { 1.00 }
        4  { 1.05 }  # pascoa
        5  { 0.95 }
        6  { 1.10 }  # festas juninas
        7  { 0.90 }  # inverno
        8  { 0.92 }
        9  { 0.95 }
        10 { 1.00 }
        11 { 1.10 }  # BF
        12 { 1.25 }  # natal
        default { 1.00 }
    }
    # Category-specific adjustments
    if ($cat -eq "Bebidas" -and $mes -in 6,7,8) { $base *= 1.20 }  # cafe no inverno
    if ($cat -eq "Laticinios" -and $mes -in 6,7,8) { $base *= 1.10 }
    if ($cat -eq "Bebidas" -and $mes -in 12,1,2) { $base *= 1.15 }
    return $base
}

# === RANDOM WITH SEED ===
$rng = [System.Random]::new(42)
function Get-Variance { return 0.7 + ($rng.NextDouble() * 0.6) }  # 0.7 to 1.3

# === SCENARIO-SPECIFIC FACTORS ===
function Get-ScenarioFactor([datetime]$d, [hashtable]$prod, [string]$cenario, [int]$diasTotais) {
    $diasDesdeInicio = ($d - $dataInicio).Days
    $diasAteFim = ($dataFim - $d).Days
    $fatorQtd = 1.0
    $fatorPreco = 1.0

    switch ($cenario) {
        "promocao" {
            # Promocao de Arroz 5kg: 30% off, dias 10-15 antes do fim
            if ($prod.Nome -eq "Arroz 5kg" -and $diasAteFim -ge 5 -and $diasAteFim -le 12) {
                $fatorQtd = 1.6 + ($rng.NextDouble() * 0.3)  # +60-90%
                $fatorPreco = 0.70  # 30% desconto
            }
            # Pos-promo: hangover
            if ($prod.Nome -eq "Arroz 5kg" -and $diasAteFim -ge 1 -and $diasAteFim -lt 5) {
                $fatorQtd = 0.72  # -28%
            }
            # Promocao de Leite: 20% off, dias 20-25 antes do fim
            if ($prod.Nome -eq "Leite Integral 1L" -and $diasAteFim -ge 15 -and $diasAteFim -le 22) {
                $fatorQtd = 1.45
                $fatorPreco = 0.80
            }
            if ($prod.Nome -eq "Leite Integral 1L" -and $diasAteFim -ge 10 -and $diasAteFim -lt 15) {
                $fatorQtd = 0.78
            }
        }
        "churn" {
            # Concorrente abriu: queda gradual ultimas 4 semanas
            $semanaChurn = [math]::Floor(($diasTotais - $diasAteFim) / 7) - [math]::Floor(($diasTotais - 28) / 7)
            if ($diasAteFim -lt 28) {
                $semanasDeChurn = [math]::Floor((28 - $diasAteFim) / 7) + 1
                $fatorChurn = [math]::Pow(0.95, $semanasDeChurn)  # -5%/semana
                $fatorQtd = $fatorChurn
                # Padaria e Laticinios resistem (conveniencia)
                if ($prod.Cat -in "Padaria","Laticinios") {
                    $fatorQtd = [math]::Max($fatorQtd, 0.95)
                }
            }
        }
        "blackfriday" {
            # Simula periodo BF: pico nos ultimos 5-8 dias
            if ($diasAteFim -ge 3 -and $diasAteFim -le 5) {
                # Ramp-up
                $fatorQtd = 1.3 + ($rng.NextDouble() * 0.3)
                $fatorPreco = 0.85
            }
            if ($diasAteFim -ge 1 -and $diasAteFim -le 2) {
                # Pico BF
                $fatorQtd = 2.0 + ($rng.NextDouble() * 0.8)  # +100-180%
                $fatorPreco = 0.70  # 30% off geral
            }
            if ($diasAteFim -eq 0) {
                # Pos-BF
                $fatorQtd = 0.65
            }
        }
        "sazonalidade" {
            # Ja coberto pelo Get-SeasonFactor, mas intensifica
            # Nada extra -- o season factor ja modula
        }
        "feriado-pascoa" {
            # Pascoa: detectar feriado mais proximo e modular
            # Chocolate/Leite/Acucar: pico 7 dias antes de Pascoa
            $proximaPascoa = $feriados | Where-Object { $_.Month -in 3,4 -and $_ -ge $dataInicio -and $_ -le $dataFim } | Select-Object -First 1
            if ($proximaPascoa) {
                $diasAtePascoa = ($proximaPascoa - $d).Days
                if ($diasAtePascoa -ge 1 -and $diasAtePascoa -le 7) {
                    if ($prod.Cat -in "Mercearia","Laticinios") {
                        $fatorQtd = 1.3 + (0.1 * (7 - $diasAtePascoa))  # crescente
                    }
                }
                if ($diasAtePascoa -eq 0) { $fatorQtd = 0.50 }  # fechado
                if ($diasAtePascoa -ge -3 -and $diasAtePascoa -lt 0) { $fatorQtd = 0.85 }  # pos
            }
        }
        "ciclo-salarial" {
            # Intensifica o ciclo salarial para cesta basica
            if ($prod.Cat -in "Graos","Mercearia") {
                $dia = $d.Day
                if ($dia -le 5) { $fatorQtd = 1.20 }
                elseif ($dia -ge 25) { $fatorQtd = 1.18 }
                elseif ($dia -ge 21 -and $dia -le 24) { $fatorQtd = 0.82 }
            }
        }
        "stockout" {
            # Macarrao fica em falta por 10 dias no meio do periodo
            $meioPerido = [math]::Floor($diasTotais / 2)
            if ($prod.Nome -eq "Macarrao 500g" -and $diasDesdeInicio -ge $meioPerido -and $diasDesdeInicio -lt ($meioPerido + 10)) {
                $fatorQtd = 0.0  # STOCKOUT
            }
            # Farinha e Arroz sobem na falta de macarrao (substitutos)
            if ($prod.Nome -in "Farinha de Trigo 1kg","Arroz 5kg" -and $diasDesdeInicio -ge $meioPerido -and $diasDesdeInicio -lt ($meioPerido + 10)) {
                $fatorQtd = 1.25
            }
        }
        "completo" {
            # Combina tudo: promocao + churn leve + sazonalidade + ciclo salarial
            # Promocao de Cafe: 25% off ultimos 8 dias
            if ($prod.Nome -eq "Cafe 500g" -and $diasAteFim -ge 2 -and $diasAteFim -le 9) {
                $fatorQtd = 1.55
                $fatorPreco = 0.75
            }
            if ($prod.Nome -eq "Cafe 500g" -and $diasAteFim -ge 0 -and $diasAteFim -lt 2) {
                $fatorQtd = 0.75
            }
            # Churn leve (-3%/semana nas ultimas 3 semanas) exceto Padaria
            if ($diasAteFim -lt 21 -and $prod.Cat -notin "Padaria","Laticinios") {
                $semanasDeChurn = [math]::Floor((21 - $diasAteFim) / 7) + 1
                $fatorQtd *= [math]::Pow(0.97, $semanasDeChurn)
            }
            # Ciclo salarial intensificado para graos
            if ($prod.Cat -eq "Graos") {
                $dia = $d.Day
                if ($dia -le 5) { $fatorQtd *= 1.10 }
                elseif ($dia -ge 25) { $fatorQtd *= 1.08 }
            }
        }
        "concorrente-direto" {
            # Padaria/bakery opened nearby: Pao, Leite, Cafe decline selectively
            if ($diasAteFim -lt 30) {
                $semanasDeChurn = [math]::Floor((30 - $diasAteFim) / 7) + 1
                if ($prod.Nome -eq "Pao de Forma") {
                    $fatorQtd = [math]::Pow(0.93, $semanasDeChurn)  # -7%/week
                }
                elseif ($prod.Nome -eq "Leite Integral 1L") {
                    $fatorQtd = [math]::Pow(0.96, $semanasDeChurn)  # -4%/week
                }
                elseif ($prod.Nome -eq "Cafe 500g") {
                    $fatorQtd = [math]::Pow(0.97, $semanasDeChurn)  # -3%/week
                }
                # All other products unaffected (fatorQtd stays 1.0)
            }
        }
        "reajuste-preco" {
            # Oleo price raised 20% at day -30; demand drops 15% over 2 weeks
            if ($prod.Nome -eq "Oleo de Soja 900ml" -and $diasAteFim -lt 30) {
                $fatorPreco = 1.20  # new price
                if ($diasAteFim -ge 16 -and $diasAteFim -lt 23) {
                    $fatorQtd = 0.92  # week 1: -8%
                }
                elseif ($diasAteFim -lt 16) {
                    $fatorQtd = 0.85  # week 2+: -15% stabilized
                }
            }
        }
        "combo-crosssell" {
            # Arroz+Feijao correlated, Macarrao+Farinha correlated
            # High days for one = high days for partner
            $dayHash = ($d.DayOfYear * 7 + $d.Year) % 100
            if ($prod.Nome -eq "Arroz 5kg" -or $prod.Nome -eq "Feijao Carioca 1kg") {
                if ($dayHash -gt 60) { $fatorQtd = 1.20 }  # both high together
                elseif ($dayHash -lt 25) { $fatorQtd = 0.82 }  # both low together
            }
            if ($prod.Nome -eq "Macarrao 500g" -or $prod.Nome -eq "Farinha de Trigo 1kg") {
                if ($dayHash -gt 70) { $fatorQtd = 1.18 }
                elseif ($dayHash -lt 20) { $fatorQtd = 0.85 }
            }
        }
        "hangover-longo" {
            # 2-week promo on Cafe, then deep 10-day hangover, slow recovery
            if ($prod.Nome -eq "Cafe 500g") {
                if ($diasAteFim -ge 31 -and $diasAteFim -le 44) {
                    $fatorQtd = 1.70; $fatorPreco = 0.75  # promo period
                }
                elseif ($diasAteFim -ge 21 -and $diasAteFim -lt 31) {
                    $fatorQtd = 0.65  # hangover
                }
                elseif ($diasAteFim -ge 11 -and $diasAteFim -lt 21) {
                    $fatorQtd = 0.85  # recovery
                }
                elseif ($diasAteFim -lt 11) {
                    $fatorQtd = 0.92  # new normal slightly below
                }
            }
        }
        "crise-economica" {
            # Global decline starting at day -60, differential by category
            if ($diasAteFim -lt 60) {
                $progressao = [math]::Min(1.0, (60 - $diasAteFim) / 30.0)
                switch ($prod.Cat) {
                    "Graos"      { $fatorQtd = 1.0 - (0.10 * $progressao) }  # -10% max
                    "Mercearia"  { $fatorQtd = 1.0 - (0.18 * $progressao) }  # -18%
                    "Laticinios" { $fatorQtd = 1.0 - (0.08 * $progressao) }  # -8%
                    "Padaria"    { $fatorQtd = 1.0 - (0.05 * $progressao) }  # -5%
                    "Bebidas"    { $fatorQtd = 1.0 - (0.30 * $progressao) }  # -30% (premium)
                    "Limpeza"    { $fatorQtd = 1.0 - (0.20 * $progressao) }  # -20%
                    default      { $fatorQtd = 1.0 - (0.12 * $progressao) }
                }
                $fatorPreco = 1.0 + (0.05 * $progressao)  # inflation +5%
            }
        }
        "delivery" {
            # Delivery channel launched at day -30: +15% overall, weekends +20%
            if ($diasAteFim -lt 30) {
                $fatorQtd = 1.12  # base +12%
                if ($d.DayOfWeek -eq "Saturday" -or $d.DayOfWeek -eq "Sunday") {
                    $fatorQtd = 1.22  # weekends stronger
                }
                # Breakfast products boosted more
                if ($prod.Nome -in "Pao de Forma","Leite Integral 1L","Cafe 500g") {
                    $fatorQtd *= 1.10  # additional +10%
                }
            }
        }
        "multi-evento" {
            # Combine: promo Arroz + competitor Pao + salary cycle + holiday in horizon
            # Promo Arroz: 30% off dias -45 a -38
            if ($prod.Nome -eq "Arroz 5kg" -and $diasAteFim -ge 38 -and $diasAteFim -le 45) {
                $fatorQtd = 1.65; $fatorPreco = 0.70
            }
            if ($prod.Nome -eq "Arroz 5kg" -and $diasAteFim -ge 33 -and $diasAteFim -lt 38) {
                $fatorQtd = 0.75  # hangover
            }
            # Competitor Pao: -5%/week last 30 days
            if ($prod.Nome -in "Pao de Forma","Leite Integral 1L" -and $diasAteFim -lt 30) {
                $semanasDeChurn = [math]::Floor((30 - $diasAteFim) / 7) + 1
                $fatorQtd *= [math]::Pow(0.95, $semanasDeChurn)
            }
            # Salary cycle for grains
            if ($prod.Cat -eq "Graos") {
                $dia = $d.Day
                if ($dia -le 5) { $fatorQtd *= 1.12 }
                elseif ($dia -ge 25) { $fatorQtd *= 1.15 }
            }
        }
        "inauguracao" {
            # New store: grand opening spike decaying over 3 weeks
            $semana = [math]::Floor($diasDesdeInicio / 7) + 1
            if ($semana -le 1) { $fatorQtd = 2.0 }      # week 1: +100%
            elseif ($semana -le 2) { $fatorQtd = 1.50 }  # week 2: +50%
            elseif ($semana -le 3) { $fatorQtd = 1.20 }  # week 3: +20%
            # After week 3: normal (1.0)
        }
        "sazonalidade-verao" {
            # Summer (Dec-Feb): Acucar/Sabao UP, Cafe/Farinha DOWN
            $mes = $d.Month
            if ($mes -in 12,1,2) {
                if ($prod.Nome -eq "Acucar 1kg") { $fatorQtd = 1.15 }
                elseif ($prod.Nome -eq "Sabao em Po 1kg") { $fatorQtd = 1.10 }
                elseif ($prod.Nome -eq "Leite Integral 1L") { $fatorQtd = 1.10 }
                elseif ($prod.Nome -eq "Cafe 500g") { $fatorQtd = 0.85 }
                elseif ($prod.Nome -eq "Farinha de Trigo 1kg") { $fatorQtd = 0.90 }
            }
        }
        "semana-consumidor" {
            # Dia do Consumidor (March 15) -- week-long promo, NOT engine holiday
            # Last 7 days of data: all products -15% price +40% volume
            if ($diasAteFim -lt 7) {
                $fatorQtd = 1.40; $fatorPreco = 0.85
                # Non-perishables stockpiled more
                if ($prod.Cat -in "Limpeza","Bebidas") {
                    $fatorQtd = 1.60
                }
            }
            # Pre-event ramp-up (dias -10 to -7)
            elseif ($diasAteFim -ge 7 -and $diasAteFim -lt 10) {
                $fatorQtd = 1.08  # slight anticipation
            }
        }
    }

    return @{ Qtd = $fatorQtd; Preco = $fatorPreco }
}

# === GENERATE CSV ===
$linhas = [System.Collections.Generic.List[string]]::new()
$linhas.Add("data;produto;quantidade;preco_unitario;codigo")

$totalLinhas = 0
$d = $dataInicio
while ($d -le $dataFim) {
    foreach ($prod in $produtos) {
        # Base quantity
        $qty = $prod.Media

        # Natural variance
        $qty *= Get-Variance

        # Day of week
        $qty *= (Get-DowFactor $d)

        # Salary cycle
        $qty *= (Get-SalaryCycleFactor $d)

        # Seasonality
        $qty *= (Get-SeasonFactor $d $prod.Cat)

        # Holiday
        if (Is-Holiday $d) { $qty *= 1.35 }
        elseif (Is-HolidayEve $d) { $qty *= 1.25 }

        # Scenario-specific
        $cenarioFator = Get-ScenarioFactor $d $prod $Cenario $Dias
        $qty *= $cenarioFator.Qtd
        $preco = [math]::Round($prod.Preco * $cenarioFator.Preco, 2)

        # Finalize
        $qty = [math]::Max(0, [math]::Round($qty))

        if ($qty -gt 0) {
            $dataStr = $d.ToString("dd/MM/yyyy")
            $linhas.Add("$dataStr;$($prod.Nome);$qty;$preco;$($prod.Codigo)")
            $totalLinhas++
        }
    }
    $d = $d.AddDays(1)
}

# Write without BOM
$utf8NoBom = [System.Text.UTF8Encoding]::new($false)
[System.IO.File]::WriteAllLines((Resolve-Path -Path "." -ErrorAction SilentlyContinue | Select-Object -ExpandProperty Path) + "\$Output", $linhas.ToArray(), $utf8NoBom)

Write-Host ""
Write-Host "=== Cenario: $Cenario ===" -ForegroundColor Cyan
Write-Host "Arquivo: $Output" -ForegroundColor Green
Write-Host "Periodo: $($dataInicio.ToString('dd/MM/yyyy')) a $($dataFim.ToString('dd/MM/yyyy')) ($Dias dias)"
Write-Host "Produtos: $($produtos.Count)"
Write-Host "Linhas geradas: $totalLinhas"
Write-Host ""

# Describe embedded events
switch ($Cenario) {
    "promocao" {
        Write-Host "Eventos embutidos:" -ForegroundColor Yellow
        Write-Host "  - Arroz 5kg: 30% desconto (dias -12 a -5), hangover -28% (dias -4 a -1)"
        Write-Host "  - Leite Integral 1L: 20% desconto (dias -22 a -15), hangover -22% (dias -14 a -10)"
    }
    "churn" {
        Write-Host "Eventos embutidos:" -ForegroundColor Yellow
        Write-Host "  - Queda gradual -5%/semana todas categorias (ultimas 4 semanas)"
        Write-Host "  - Excecao: Padaria e Laticinios resistem (conveniencia)"
    }
    "blackfriday" {
        Write-Host "Eventos embutidos:" -ForegroundColor Yellow
        Write-Host "  - Ramp-up +30-60% (dias -5 a -3)"
        Write-Host "  - Pico BF +100-180% com 30% desconto (dias -2 a -1)"
        Write-Host "  - Hangover -35% (ultimo dia)"
    }
    "stockout" {
        Write-Host "Eventos embutidos:" -ForegroundColor Yellow
        Write-Host "  - Macarrao 500g: STOCKOUT por 10 dias (meio do periodo)"
        Write-Host "  - Farinha/Arroz: +25% durante stockout (substitutos)"
    }
    "completo" {
        Write-Host "Eventos embutidos:" -ForegroundColor Yellow
        Write-Host "  - Cafe 500g: 25% desconto ultimos 8 dias + hangover"
        Write-Host "  - Churn leve -3%/semana (ultimas 3 semanas, exceto Padaria/Laticinios)"
        Write-Host "  - Ciclo salarial intensificado para Graos"
        Write-Host "  - Sazonalidade climatica por categoria"
    }
    "concorrente-direto" {
        Write-Host "Eventos embutidos:" -ForegroundColor Yellow
        Write-Host "  - Pao de Forma: -7%/semana (padaria concorrente)"
        Write-Host "  - Leite: -4%/semana, Cafe: -3%/semana (compras casadas)"
        Write-Host "  - Demais produtos: sem impacto"
    }
    "reajuste-preco" {
        Write-Host "Eventos embutidos:" -ForegroundColor Yellow
        Write-Host "  - Oleo de Soja: preco +20% a partir do dia -30"
        Write-Host "  - Queda de volume: -8% semana 1, -15% semana 2+"
        Write-Host "  - Engine ignora preco para previsao (ve so tendencia)"
    }
    "combo-crosssell" {
        Write-Host "Eventos embutidos:" -ForegroundColor Yellow
        Write-Host "  - Arroz+Feijao: correlacao 0.85 (altos/baixos juntos)"
        Write-Host "  - Macarrao+Farinha: correlacao 0.75"
        Write-Host "  - Engine preve cada produto independente (sem basket)"
    }
    "hangover-longo" {
        Write-Host "Eventos embutidos:" -ForegroundColor Yellow
        Write-Host "  - Cafe 500g: promo 25% off (dias -44 a -31)"
        Write-Host "  - Hangover -35% (dias -30 a -21)"
        Write-Host "  - Recovery parcial (dias -20 a -11)"
        Write-Host "  - Novo normal -8% (dias -10 a -1)"
        Write-Host "  - Engine ve tendencia em queda (falso negativo)"
    }
    "crise-economica" {
        Write-Host "Eventos embutidos:" -ForegroundColor Yellow
        Write-Host "  - Declinio global a partir do dia -60"
        Write-Host "  - Essenciais: -10%, Mercearia: -18%, Premium: -30%"
        Write-Host "  - Pereciveis: -8%, Limpeza: -20%"
        Write-Host "  - Inflacao: +5% nos precos"
    }
    "delivery" {
        Write-Host "Eventos embutidos:" -ForegroundColor Yellow
        Write-Host "  - Canal delivery ativo ultimos 30 dias: +12% geral"
        Write-Host "  - Fins de semana: +22%"
        Write-Host "  - Cafe da manha (Pao/Leite/Cafe): boost extra +10%"
    }
    "multi-evento" {
        Write-Host "Eventos embutidos:" -ForegroundColor Yellow
        Write-Host "  - Promo Arroz 30% off (dias -45 a -38) + hangover"
        Write-Host "  - Concorrente Pao/Leite: -5%/semana ultimos 30 dias"
        Write-Host "  - Ciclo salarial intensificado para Graos"
        Write-Host "  - Todos multiplicativos (acumulam)"
    }
    "inauguracao" {
        Write-Host "Eventos embutidos:" -ForegroundColor Yellow
        Write-Host "  - Semana 1: +100% (inauguracao)"
        Write-Host "  - Semana 2: +50%, Semana 3: +20%"
        Write-Host "  - Semana 4+: baseline normal"
        Write-Host "  - Engine ve tendencia em queda (falso declinio)"
    }
    "sazonalidade-verao" {
        Write-Host "Eventos embutidos:" -ForegroundColor Yellow
        Write-Host "  - Acucar +15%, Sabao +10%, Leite +10% (verao)"
        Write-Host "  - Cafe -15%, Farinha -10% (menos consumo quente)"
    }
    "semana-consumidor" {
        Write-Host "Eventos embutidos:" -ForegroundColor Yellow
        Write-Host "  - Semana do Consumidor: -15% preco, +40% volume ultimos 7 dias"
        Write-Host "  - Limpeza/Bebidas: +60% (estocagem nao-pereciveis)"
        Write-Host "  - NAO e feriado no engine (sem alerta)"
    }
}
