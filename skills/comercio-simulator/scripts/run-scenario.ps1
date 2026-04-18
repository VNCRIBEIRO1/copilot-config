<#
.SYNOPSIS
    Executa cenario completo no Sistema de Previsao de Demanda.
.DESCRIPTION
    Registra tenant, importa CSV, gera previsoes e exibe dashboard comparativo.
    Usado apos gerar um cenario com generate-scenario.ps1.
.PARAMETER CsvPath
    Caminho do arquivo CSV gerado pelo generate-scenario.ps1
.PARAMETER Port
    Porta do servidor (default: 5000)
.PARAMETER DiasHorizonte
    Horizonte de previsao em dias (default: 30)
.EXAMPLE
    .\run-scenario.ps1 -CsvPath cenario-promocao.csv
    .\run-scenario.ps1 -CsvPath cenario-completo.csv -DiasHorizonte 14
#>
param(
    [Parameter(Mandatory=$true)]
    [string]$CsvPath,

    [int]$Port = 5000,

    [int]$DiasHorizonte = 30
)

$baseUrl = "http://localhost:$Port"
$ErrorActionPreference = "Stop"

if (-not (Test-Path $CsvPath)) {
    Write-Host "ERRO: Arquivo nao encontrado: $CsvPath" -ForegroundColor Red
    exit 1
}

$csvInfo = Get-Item $CsvPath
$csvLines = (Get-Content $CsvPath).Count - 1  # minus header

Write-Host ""
Write-Host "=====================================" -ForegroundColor Cyan
Write-Host " Comercio - Executor de Cenario" -ForegroundColor Cyan
Write-Host "=====================================" -ForegroundColor Cyan
Write-Host "CSV: $($csvInfo.Name) ($csvLines linhas)"
Write-Host "Servidor: $baseUrl"
Write-Host "Horizonte: $DiasHorizonte dias"
Write-Host ""

# === STEP 1: Register ===
Write-Host "[1/4] Registrando tenant..." -ForegroundColor Yellow
try {
    $regBody = @{
        nomeEmpresa = "Mercado Demo"
        tipoComercio = "Supermercado"
        email = "admin@demo.com"
        senha = "Senha123!"
    } | ConvertTo-Json
    $reg = Invoke-RestMethod -Uri "$baseUrl/api/auth/registrar" -Method POST `
        -ContentType "application/json" -Body $regBody
    $tenantId = $reg.tenantId
    Write-Host "  OK - TenantId: $tenantId" -ForegroundColor Green
} catch {
    Write-Host "  ERRO: $($_.Exception.Message)" -ForegroundColor Red
    exit 1
}

# === STEP 2: Import CSV ===
Write-Host "[2/4] Importando CSV..." -ForegroundColor Yellow
try {
    Add-Type -AssemblyName System.Net.Http
    $form = [System.Net.Http.MultipartFormDataContent]::new()
    $form.Add([System.Net.Http.StringContent]::new($tenantId), "tenantId")
    $bytes = [System.IO.File]::ReadAllBytes((Resolve-Path $CsvPath).Path)
    $fileContent = [System.Net.Http.ByteArrayContent]::new($bytes)
    $fileContent.Headers.ContentType = [System.Net.Http.Headers.MediaTypeHeaderValue]::new("text/csv")
    $form.Add($fileContent, "arquivo", $csvInfo.Name)
    $client = [System.Net.Http.HttpClient]::new()
    $response = $client.PostAsync("$baseUrl/api/integracao/csv", $form).Result
    $importJson = $response.Content.ReadAsStringAsync().Result | ConvertFrom-Json
    Write-Host "  OK - Linhas: $($importJson.linhasProcessadas), Produtos: $($importJson.produtosCriados), Transacoes: $($importJson.transacoesCriadas)" -ForegroundColor Green
    if ($importJson.erros.Count -gt 0) {
        Write-Host "  Erros: $($importJson.erros -join '; ')" -ForegroundColor Red
    }
} catch {
    Write-Host "  ERRO: $($_.Exception.Message)" -ForegroundColor Red
    exit 1
}

# === STEP 3: Generate Forecasts ===
Write-Host "[3/4] Gerando previsoes ($DiasHorizonte dias)..." -ForegroundColor Yellow
try {
    $forecastBody = @{ tenantId = $tenantId; diasHorizonte = $DiasHorizonte } | ConvertTo-Json
    $forecast = Invoke-RestMethod -Uri "$baseUrl/api/forecast/gerar" -Method POST `
        -ContentType "application/json" -Body $forecastBody
    Write-Host "  OK - Previsoes: $($forecast.totalPrevisoes), Produtos: $($forecast.produtosAnalisados)" -ForegroundColor Green
} catch {
    Write-Host "  ERRO: $($_.Exception.Message)" -ForegroundColor Red
    exit 1
}

# === STEP 4: Dashboard ===
Write-Host "[4/4] Obtendo dashboard..." -ForegroundColor Yellow
try {
    $dash = Invoke-RestMethod -Uri "$baseUrl/api/dashboard/$tenantId"
} catch {
    Write-Host "  ERRO: $($_.Exception.Message)" -ForegroundColor Red
    exit 1
}

# === REPORT ===
Write-Host ""
Write-Host "=====================================" -ForegroundColor Cyan
Write-Host " RESULTADO DO CENARIO" -ForegroundColor Cyan
Write-Host "=====================================" -ForegroundColor Cyan
Write-Host ""

Write-Host "KPIs:" -ForegroundColor White
Write-Host "  Produtos:          $($dash.topProdutos.Count)"
Write-Host "  Previsao 7 dias:   $($dash.totalPrevisoes7d) unidades"
Write-Host "  Previsao 30 dias:  $($dash.totalPrevisoes30d) unidades"
Write-Host "  Alertas ativos:    $($dash.alertasAtivos)"
Write-Host ""

Write-Host "Top Produtos (Demanda Prevista):" -ForegroundColor White
Write-Host ("{0,-4} {1,-25} {2,10} {3,10} {4,10}" -f "#", "PRODUTO", "PREV.7D", "PREV.30D", "CONFIANCA")
Write-Host ("{0,-4} {1,-25} {2,10} {3,10} {4,10}" -f "---", "-------------------------", "----------", "----------", "----------")
$i = 1
foreach ($p in $dash.topProdutos) {
    $conf = "$([math]::Round($p.confianca))%"
    Write-Host ("{0,-4} {1,-25} {2,10} {3,10} {4,10}" -f $i, $p.produtoNome, $p.previsao7d, $p.previsao30d, $conf)
    $i++
}
Write-Host ""

Write-Host "Alertas Recentes:" -ForegroundColor White
foreach ($a in $dash.alertasRecentes) {
    $icon = switch ($a.severidade) {
        "Urgente"      { "[!!!]" }
        "Atencao"      { "[!!] " }
        "Informativo"  { "[i]  " }
        default        { "[?]  " }
    }
    $cor = switch ($a.severidade) {
        "Urgente"      { "Red" }
        "Atencao"      { "Yellow" }
        "Informativo"  { "Cyan" }
        default        { "White" }
    }
    Write-Host "  $icon $($a.titulo)" -ForegroundColor $cor
    Write-Host "        $($a.descricao)" -ForegroundColor Gray
}

Write-Host ""
Write-Host "=====================================" -ForegroundColor Green
Write-Host " Cenario executado com sucesso!" -ForegroundColor Green
Write-Host " Dashboard: $baseUrl/dashboard" -ForegroundColor Green
Write-Host "=====================================" -ForegroundColor Green
Write-Host ""

# Return data for programmatic use
return @{
    TenantId = $tenantId
    Import = $importJson
    Forecast = $forecast
    Dashboard = $dash
}
