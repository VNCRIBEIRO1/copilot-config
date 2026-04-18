---
description: "Use when: building commercial forecasting system, demand prediction, inventory control, market basket analysis, clustering, regression ML.NET, DDD bounded contexts, C# domain modeling, previsão de demanda, controle de estoque, análise de cesta de compras, sazonalidade, feriados brasileiros, supermercado, comércio varejista, multi-tenant SaaS, autenticação JWT, integração ERP PDV, dashboard previsões, conveniência, padaria, comércio em geral."
applyTo: "**/*.cs"
---

# Sistema de Previsão de Necessidades do Comércio — Regras DDD + ML

## Visão Geral

Plataforma **multi-tenant SaaS** que conecta a qualquer comércio (supermercado, conveniência,
padaria, atacado, etc.), importa dados do sistema existente (via API, CSV ou acesso direto)
e prevê demanda usando dados retroativos.

Cada tenant (loja/rede) tem login próprio, configura sua integração com o ERP/PDV,
e acessa um dashboard com previsões, alertas e recomendações personalizadas.

Detecta automaticamente gatilhos (feriados, fim de mês, promoções, sazonalidade, clima)
para ajustar estoque, pedir insumos e gerar alertas de reposição.

Algoritmos core: **Regressão** (previsão de vendas), **MBA/Apriori** (associação de produtos),
**K-Means** (segmentação de produtos/clientes).

---

## 1. Bounded Contexts (separação obrigatória)

Nunca misture responsabilidades entre contextos. Cada BC tem seu próprio modelo de domínio.

| Bounded Context       | Responsabilidade                                       | Core?   | Integra com               |
|-----------------------|--------------------------------------------------------|---------|---------------------------|
| **Forecasting**       | Previsão de demanda, simulações, regras de negócio     | Sim     | Todos                     |
| **Inventory**         | Estoque atual, insumos, alertas baixo estoque          | Sim     | Forecasting, Procurement  |
| **Sales**             | Histórico de vendas, pedidos realizados                | Sim     | Forecasting               |
| **Identity**          | Tenants, usuários, autenticação, autorização, planos   | Sim     | Todos (cross-cutting)     |
| **Integration**       | Conectores com ERPs/PDVs, importação, sync de dados    | Sim     | Sales, Inventory, ProductCatalog |
| **Calendar**          | Feriados (BR), promoções, eventos externos             | Suporte | Forecasting               |
| **ProductCatalog**    | Catálogo de produtos e insumos                         | Suporte | Todos                     |
| **Procurement**       | Fornecedores, pedidos de compra                        | Suporte | Inventory                 |
| **Notification**      | Alertas, recomendações, canais (email, push, in-app)   | Suporte | Forecasting, Inventory    |

### Context Map

- **Forecasting** é o **Core Domain** — gera o valor do sistema.
- **Identity** é **Generic Subdomain** mas obrigatório — isola tenants e controla acesso.
- **Integration** é **Supporting Domain** — adapta dados do mundo externo para o domínio.
- Comunicação entre BCs via **Domain Events publicados** (MediatR in-process ou MassTransit + RabbitMQ).
- Nunca referência direta entre Aggregates de BCs diferentes — use Integration Events.
- **Todo dado pertence a um Tenant** — `TenantId` é filtro global obrigatório (query filter EF Core).

### Ubiquitous Language (usar em todo o código)

- `Tenant` — comércio cadastrado (supermercado, conveniência, padaria, etc.)
- `Estabelecimento` — unidade física de um Tenant (uma loja da rede)
- `ConectorExterno` — adaptador que fala com o ERP/PDV do Tenant
- `SincronizacaoDeDados` — processo de importar/atualizar dados do sistema externo
- `PrevisaoDeDemanda` — projeção de vendas futuras por produto/período
- `ImpactoDeEventoExterno` — fator multiplicador causado por feriado/promoção/clima
- `AlertaDeReposicao` — notificação de estoque abaixo do ponto de pedido
- `FatorSazonalidade` — coeficiente histórico por época do ano
- `RegrasDeAssociacao` — resultado do MBA (antecedente → consequente)
- `ClusterDeProdutos` — grupo de produtos com comportamento de venda similar
- `CestaDeCompras` — conjunto de produtos em uma mesma transação
- `Recomendacao` — sugestão acionável gerada pelo sistema (comprar X, promover Y)

---

## 2. Estrutura da Solução (.sln)

```
Comercio.sln
├── src/
│   ├── Comercio.Domain/              # Entidades, VOs, Events, Interfaces (SEM dependências externas)
│   │   ├── Common/
│   │   │   ├── ITenantScoped.cs      # interface { TenantId TenantId; }
│   │   │   ├── AggregateRoot.cs
│   │   │   └── DomainException.cs
│   │   ├── Identity/
│   │   │   ├── Entities/             # Tenant, Usuario, Estabelecimento
│   │   │   ├── ValueObjects/         # Email, SenhaHash, Plano, TenantId
│   │   │   ├── Events/              # TenantCriado, UsuarioRegistrado
│   │   │   └── Repositories/
│   │   ├── Integration/
│   │   │   ├── Entities/             # ConectorExterno, ConfiguracaoIntegracao
│   │   │   ├── ValueObjects/         # TipoSistema, CredencialApi, EndpointConfig
│   │   │   ├── Events/              # SincronizacaoCompleta, ImportacaoFalhou
│   │   │   ├── Services/            # IConectorFactory, ISincronizadorDeDados
│   │   │   └── Repositories/
│   │   ├── Forecasting/
│   │   │   ├── Entities/
│   │   │   ├── ValueObjects/
│   │   │   ├── Events/
│   │   │   ├── Services/            # Domain Services (interfaces)
│   │   │   └── Repositories/        # Interfaces only
│   │   ├── Inventory/
│   │   ├── Sales/
│   │   ├── Calendar/
│   │   ├── ProductCatalog/
│   │   ├── Procurement/
│   │   └── Notification/
│   │       ├── Entities/             # Alerta, Recomendacao, CanalNotificacao
│   │       ├── Events/              # AlertaEnviado
│   │       └── Repositories/
│   ├── Comercio.Application/         # Commands, Queries, Handlers (MediatR + CQRS)
│   │   ├── Common/
│   │   │   ├── ITenantContext.cs     # { TenantId TenantAtual; }
│   │   │   └── Behaviors/           # TenantValidationBehavior (MediatR pipeline)
│   │   ├── Identity/
│   │   │   ├── Commands/            # RegistrarTenantCommand, LoginCommand
│   │   │   └── Queries/             # ObterPerfilTenantQuery
│   │   ├── Integration/
│   │   │   ├── Commands/            # ConfigurarIntegracaoCommand, SincronizarDadosCommand
│   │   │   └── Queries/             # ObterStatusIntegracaoQuery
│   │   ├── Forecasting/
│   │   │   ├── Commands/
│   │   │   ├── Queries/
│   │   │   └── EventHandlers/
│   │   ├── Notification/
│   │   │   ├── Commands/            # EnviarAlertaCommand
│   │   │   └── Queries/             # ObterNotificacoesQuery
│   │   └── ... (por BC)
│   ├── Comercio.Infrastructure/       # EF Core, ML.NET, Repos concretos, APIs externas
│   │   ├── Persistence/
│   │   │   ├── ComercioDbContext.cs   # query filters globais por TenantId
│   │   │   ├── Configurations/       # Fluent API por entity
│   │   │   └── Migrations/
│   │   ├── Identity/
│   │   │   ├── JwtTokenService.cs
│   │   │   ├── SenhaHashService.cs
│   │   │   └── TenantContext.cs       # resolve TenantId do JWT claim
│   │   ├── Integration/
│   │   │   ├── Conectores/           # um por tipo de sistema
│   │   │   │   ├── GenericApiConector.cs    # REST genérico
│   │   │   │   ├── CsvImportConector.cs     # upload CSV manual
│   │   │   │   ├── OdbcConector.cs          # acesso direto ao banco do ERP
│   │   │   │   └── NFeImportConector.cs     # importação via XML de NF-e
│   │   │   ├── ConectorFactory.cs
│   │   │   └── SincronizadorDeDados.cs
│   │   ├── MachineLearning/
│   │   │   ├── RegressionModel.cs
│   │   │   ├── MarketBasketAnalyzer.cs  # Apriori custom
│   │   │   └── ProductClusterer.cs      # K-Means via ML.NET
│   │   ├── ExternalServices/
│   │   │   ├── FeriadoService.cs        # BrazilHolidays.Net wrapper
│   │   │   └── ClimaService.cs          # OpenWeather API
│   │   └── Messaging/
│   ├── Comercio.API/                  # Minimal API ou Controllers
│   │   ├── Endpoints/
│   │   │   ├── AuthEndpoints.cs       # login, registro, refresh token
│   │   │   ├── TenantEndpoints.cs     # CRUD tenant, config integração
│   │   │   ├── IntegracaoEndpoints.cs # testar conexão, sincronizar, status
│   │   │   ├── DashboardEndpoints.cs  # previsões, alertas, recomendações
│   │   │   └── ForecastEndpoints.cs   # previsão por produto/período
│   │   ├── Middleware/
│   │   │   ├── TenantMiddleware.cs    # extrai TenantId do JWT e injeta no contexto
│   │   │   └── ExceptionMiddleware.cs
│   │   └── Hubs/
│   │       └── DashboardHub.cs        # SignalR para real-time no dashboard
│   └── Comercio.Web/                  # Frontend Blazor Server (.NET 8)
│       ├── Pages/
│       │   ├── Login.razor
│       │   ├── Registro.razor
│       │   ├── ConfigurarIntegracao.razor
│       │   ├── ImportarCsv.razor          # upload + preview + confirmar import
│       │   ├── Dashboard.razor
│       │   └── Previsoes.razor
│       ├── Components/
│       │   ├── CsvUploader.razor           # drag-and-drop + validação client-side
│       │   ├── CsvPreviewTable.razor       # preview das primeiras 10 linhas
│       │   ├── AlertaCard.razor
│       │   ├── PrevisaoChart.razor          # gráfico vendas reais vs previstas
│       │   └── StatusIntegracao.razor
│       └── Shared/
├── tests/
│   ├── Comercio.Domain.Tests/         # 100% cobertura no domínio
│   ├── Comercio.Application.Tests/
│   └── Comercio.Infrastructure.Tests/
```

### Regras de Dependência (obrigatório)

- `Domain` → **ZERO** dependências externas (sem EF, sem ML.NET, sem HTTP)
- `Application` → depende de `Domain`
- `Infrastructure` → depende de `Domain` + `Application`
- `API` → depende de `Application` + `Infrastructure` (composição no Program.cs)
- Testes de `Domain` → **sem banco, sem ML, sem I/O** (testes puros)

---

## 3. Modelagem Tática do Domínio

### Value Objects (sempre imutáveis, sempre com validação)

```csharp
public record Quantidade
{
    public int Valor { get; }
    public Quantidade(int valor)
    {
        if (valor < 0) throw new DomainException("Quantidade não pode ser negativa");
        Valor = valor;
    }
}

public record Percentual(decimal Valor);       // 0-100
public record Periodo(DateOnly Inicio, DateOnly Fim);
public record FatorSazonal(decimal Multiplicador);
```

### Entities e Aggregate Roots

- Toda Entity tem um ID tipado (ex: `ProdutoId`, `TransacaoId`) — nunca `int` ou `Guid` cru.
- Aggregate Root é o único ponto de entrada para alterar o estado do agregado.
- Regras de negócio ricas **dentro** da Entity, não em Services anêmicos.

### Domain Events

- Nomenclatura: verbo no passado → `PrevisaoAtualizada`, `EstoqueBaixoDetectado`, `PedidoCompraGerado`
- Publicados via `RaiseDomainEvent()` dentro do Aggregate Root.
- Handlers em `Application` reagem e orquestram entre BCs.

### Domain Services

- Só para lógica que **não pertence a uma única Entity** (ex: cálculo que precisa de 2+ Aggregates).
- Interface no `Domain`, implementação no `Infrastructure`.

---

## 4. Algoritmos e Onde Ficam

| Algoritmo     | Interface (Domain)           | Implementação (Infrastructure) | Biblioteca      |
|---------------|------------------------------|--------------------------------|-----------------|
| Regressão     | `IRegressionModel`           | `RegressionModel.cs`           | ML.NET FastTreeTweedie |
| MBA (Apriori) | `IMarketBasketAnalyzer`      | `MarketBasketAnalyzer.cs`      | Custom C# (Apriori) |
| Clustering    | `IProductClusterer`          | `ProductClusterer.cs`          | ML.NET KMeans   |

### 4a. Regressão — Previsão de Demanda

- Usa ML.NET `FastTreeTweedie` para regression ou `ForecastBySsa` para time series.
- Features obrigatórias: `DiaDaSemana`, `Mes`, `IsFeriado`, `IsPromocao`, `IsFimDeMes`.
- Features opcionais: `TemperaturaMedia`, `DiaDoPagamento`, `EventoEspecial`.
- Treinar com no mínimo 12 meses de dados históricos.
- Horizon default: 30 dias.

### 4b. MBA — Market Basket Analysis

- Implementação Apriori customizada em C# puro (~150 linhas).
- Parâmetros default: `minSupport = 0.01`, `minConfidence = 0.6`.
- Input: transações agrupadas por `TransactionId` → `HashSet<ProdutoId>`.
- Output: `List<AssociacaoRule>` com `Antecedents`, `Consequents`, `Support`, `Confidence`, `Lift`.
- Regras com `Lift > 1.0` indicam associação positiva real.

### 4c. Clustering — Segmentação

- ML.NET K-Means com features: `MediaVendasDia`, `DesvioPadrao`, `PrecoMedio`, `FrequenciaCompra`.
- Default: 8 clusters (ajustar com Elbow Method ou Silhouette Score).
- Usar para: identificar produtos premium vs. commodities, fast movers vs. slow movers.

---

## 5. Gatilhos de Previsão (não só feriado!)

O sistema deve detectar e reagir a TODOS estes gatilhos:

| Gatilho                     | Fonte de Dados              | Impacto Típico         |
|-----------------------------|-----------------------------|------------------------|
| Feriado nacional/municipal  | BrazilHolidays.Net          | +20-40% em sazonais    |
| Fim de mês / dia pagamento  | Calendário fixo             | +15% em supermercado   |
| Black Friday / Natal        | Calendar BC                 | +50-200% depende setor |
| Promoção cadastrada         | Calendar BC                 | Multiplicador custom   |
| Clima (calor/frio extremo)  | OpenWeather API             | +30% bebidas/sorvetes  |
| Aumento salário mínimo      | Evento manual               | +10% cesta básica      |
| Volta às aulas              | Calendar BC                 | +80% material escolar  |
| Dia das Mães/Pais/Crianças  | Calendar BC                 | +60-100% na categoria  |
| Evento local (show, jogo)   | Cadastro manual             | Impacto localizado     |

### Regra de composição de fatores

Quando múltiplos gatilhos coincidem, NÃO somar multiplicadores — compor:
```
FatorFinal = FatorBase × FatorFeriado × FatorPromocao × FatorClima
```

---

## 6. Fluxo Completo (Pipeline Diário)

```
1. Job diário (Hangfire/Quartz) → dispara GerarPrevisoesCommand
2. Calendar BC carrega feriados + promoções dos próximos 30 dias
3. Sales BC exporta histórico de vendas (últimos 12 meses)
4. Forecasting Domain Service:
   a. Aplica regras de negócio simples (feriados, fim de mês)
   b. Executa ML.NET Regression com features temporais
   c. Executa MBA para detectar associações novas
   d. Executa Clustering para reclassificar produtos (semanal)
   e. Gera PrevisaoDemanda por produto/período
   f. Publica evento PrevisaoAtualizada
5. Inventory reage:
   - Se previsão > estoque atual → cria AlertaDeReposicao
   - Se estoque < ponto mínimo → publica EstoqueBaixoDetectado
6. Procurement reage:
   - AlertaDeReposicao → gera PedidoCompra automático (ou sugestão)
7. API expõe dashboard com previsões, alertas, sugestões
```

---

## 7. Multi-Tenancy (arquitetura obrigatória)

### Estratégia: Banco compartilhado com Row-Level Isolation

Todos os tenants usam o **mesmo banco de dados**, isolados por `TenantId` em cada tabela.
Escolhida por custo e simplicidade. Escalar para banco por tenant só se necessário.

### Regras de isolamento

- **TODA entity que contém dados de negócio** implementa `ITenantScoped`:

```csharp
public interface ITenantScoped
{
    TenantId TenantId { get; }
}
```

- No `DbContext`, aplicar **Global Query Filter** obrigatório:

```csharp
// ComercioDbContext.cs
protected override void OnModelCreating(ModelBuilder builder)
{
    // Para CADA entity que implementa ITenantScoped:
    builder.Entity<Produto>().HasQueryFilter(p => p.TenantId == _tenantContext.TenantAtual);
    builder.Entity<Transacao>().HasQueryFilter(t => t.TenantId == _tenantContext.TenantAtual);
    // ... todas as entities
}
```

- **NUNCA** permitir query sem filtro de tenant — o query filter global garante isso.
- Entities do BC `Identity` (Tenant, Usuario) NÃO têm query filter — são cross-tenant.
- Índices compostos obrigatórios: `(TenantId, ...)` em toda tabela filtrada.

### TenantContext (resolve quem é o tenant atual)

```csharp
// Infrastructure/Identity/TenantContext.cs
public class TenantContext : ITenantContext
{
    private readonly IHttpContextAccessor _http;

    public TenantId TenantAtual =>
        new TenantId(Guid.Parse(_http.HttpContext!.User.FindFirst("tenant_id")!.Value));
}
```

- O `TenantId` vem do claim JWT `tenant_id`, injetado no token no login.
- Registrar como **Scoped** no DI (1 instância por request HTTP).

### MediatR Pipeline Behavior (validação automática)

```csharp
// Application/Common/Behaviors/TenantValidationBehavior.cs
public class TenantValidationBehavior<TRequest, TResponse> : IPipelineBehavior<TRequest, TResponse>
{
    private readonly ITenantContext _tenant;

    public async Task<TResponse> Handle(TRequest request, ...)
    {
        if (_tenant.TenantAtual == default)
            throw new UnauthorizedAccessException("Tenant não identificado");
        return await next();
    }
}
```

---

## 8. Identity BC — Autenticação e Autorização

### Entidades do Domínio

```csharp
public class Tenant : AggregateRoot<TenantId>
{
    public NomeEmpresa Nome { get; private set; }          // "Supermercado Bom Preço"
    public TipoComercio Tipo { get; private set; }          // Supermercado, Conveniencia, Padaria, Atacado
    public Plano PlanoAtual { get; private set; }           // Free, Basico, Profissional
    public bool Ativo { get; private set; }
    public DateTimeOffset CriadoEm { get; private set; }

    private List<Estabelecimento> _estabelecimentos = new();
    public IReadOnlyCollection<Estabelecimento> Estabelecimentos => _estabelecimentos.AsReadOnly();

    private List<Usuario> _usuarios = new();
    public IReadOnlyCollection<Usuario> Usuarios => _usuarios.AsReadOnly();

    public void AdicionarEstabelecimento(NomeLoja nome, Endereco endereco) { ... }
    public void AdicionarUsuario(Email email, SenhaHash senha, Perfil perfil) { ... }
}

public enum TipoComercio { Supermercado, Conveniencia, Padaria, Atacado, Restaurante, Outro }
public enum Plano { Free, Basico, Profissional }
public enum Perfil { Admin, Gerente, Operador, Visualizador }
```

### Fluxo de Autenticação

```
1. POST /api/auth/registrar → cria Tenant + Usuario admin
2. POST /api/auth/login → valida email+senha → retorna JWT com claims:
   { sub: userId, tenant_id: tenantId, perfil: "Admin", estabelecimento_id: "..." }
3. Toda request autenticada → TenantMiddleware extrai tenant_id do JWT
4. TenantContext resolve → EF Core filtra automaticamente
5. Refresh token via POST /api/auth/refresh
```

### Regras de autorização por Perfil

| Perfil        | Pode ver dashboard | Configurar integração | Gerenciar usuários | Ver previsões |
|---------------|-------------------|-----------------------|--------------------|---------------|
| Admin         | ✅                | ✅                     | ✅                  | ✅             |
| Gerente       | ✅                | ✅                     | ❌                  | ✅             |
| Operador      | ✅                | ❌                     | ❌                  | ✅             |
| Visualizador  | ✅                | ❌                     | ❌                  | ❌ (só alertas)|

### JWT Config

- Access token: 15 min de validade
- Refresh token: 7 dias, armazenado em HttpOnly cookie
- Senha: hash com BCrypt (nunca MD5/SHA)
- Rate limit no login: 5 tentativas/min por IP

---

## 9. Integration BC — Conectores com Sistemas Externos

### Estratégia: Adapter Pattern + Factory

Cada tipo de sistema externo (ERP, PDV, planilha) tem um **Conector** que implementa
`IConectorExterno`. O Tenant configura qual conector usar e as credenciais.

### Entidades do Domínio

```csharp
public class ConfiguracaoIntegracao : AggregateRoot<ConfiguracaoIntegracaoId>, ITenantScoped
{
    public TenantId TenantId { get; private set; }
    public EstabelecimentoId EstabelecimentoId { get; private set; }
    public TipoSistema TipoSistema { get; private set; }      // PDV_Generico, Bling, Tiny, TOTVS, SAP, CSV, ODBC, NFe
    public EndpointConfig Endpoint { get; private set; }        // URL + headers
    public CredencialApi Credencial { get; private set; }       // api key/token/user+pass (encriptado)
    public bool Ativa { get; private set; }
    public TimeSpan IntervaloSync { get; private set; }         // a cada 1h, 6h, 24h
    public DateTimeOffset? UltimaSincronizacao { get; private set; }
    public StatusIntegracao Status { get; private set; }        // Configurada, Testada, Ativa, Erro

    public void TestarConexao() { ... }  // valida credenciais
    public void MarcarSincronizada(DateTimeOffset quando) { ... }
    public void RegistrarErro(string mensagem) { ... }
}

public enum TipoSistema
{
    ApiGenerica,      // REST endpoint genérico (GET /vendas, GET /produtos)
    Bling,            // ERP Bling (muito usado no BR)
    Tiny,             // ERP Tiny
    TOTVS,            // TOTVS Protheus
    Nuvemshop,        // E-commerce Nuvemshop
    CsvUpload,        // Upload manual de CSV
    OdbcDireto,       // Acesso direto ao banco do ERP via ODBC
    NFeXml            // Importação via XML de Nota Fiscal Eletrônica
}
```

### Interface do Conector (Domain)

```csharp
// Domain/Integration/Services/IConectorExterno.cs
public interface IConectorExterno
{
    TipoSistema TipoSuportado { get; }
    Task<bool> TestarConexaoAsync(ConfiguracaoIntegracao config);
    Task<List<TransacaoImportada>> ImportarVendasAsync(ConfiguracaoIntegracao config, Periodo periodo);
    Task<List<ProdutoImportado>> ImportarProdutosAsync(ConfiguracaoIntegracao config);
    Task<List<EstoqueImportado>> ImportarEstoqueAsync(ConfiguracaoIntegracao config);
}

// Infrastructure/Integration/ConectorFactory.cs
public class ConectorFactory : IConectorFactory
{
    public IConectorExterno Criar(TipoSistema tipo) => tipo switch
    {
        TipoSistema.ApiGenerica => new GenericApiConector(_httpClient),
        TipoSistema.Bling      => new BlingConector(_httpClient),
        TipoSistema.CsvUpload  => new CsvImportConector(),
        TipoSistema.OdbcDireto => new OdbcConector(),
        TipoSistema.NFeXml     => new NFeImportConector(),
        _ => throw new DomainException($"Conector não implementado: {tipo}")
    };
}
```

### Fluxo de Setup da Integração (por tenant)

```
1. Admin do tenant acessa /configurar-integracao
2. Escolhe TipoSistema (dropdown: Bling, CSV, API genérica, etc.)
3. Preenche credenciais (API key, URL, user/pass — depende do tipo)
4. Clica "Testar Conexão" → backend chama IConectorExterno.TestarConexaoAsync()
5. Se OK → Status = Testada → Admin ativa a integração
6. Job Hangfire agenda sync periódico conforme IntervaloSync
7. Cada sync: importa vendas + produtos + estoque → transforma em entities do domínio
8. Publica evento SincronizacaoCompleta → Forecasting reprocessa previsões
```

### Conector CSV — Primeiro a Implementar (MVP)

O CSV é o conector prioritário porque:
- Qualquer comércio pode exportar do sistema atual (Excel → CSV)
- Não depende de API de terceiro
- Permite onboarding imediato de qualquer tenant

#### Fluxo completo do CSV Import (Blazor Server)

```
1. Admin acessa /importar-csv
2. Drag-and-drop do arquivo CSV (componente CsvUploader.razor)
3. Backend faz parse + validação:
   a. Verifica encoding (UTF-8, Latin1)
   b. Detecta separador (; ou , ou \t)
   c. Mapeia colunas (auto-detect ou manual)
   d. Valida tipos (Data, Quantidade numérica, etc.)
   e. Retorna preview das 10 primeiras linhas + erros encontrados
4. Usuário revisa preview na CsvPreviewTable.razor
   - Pode remapear colunas se auto-detect errou
   - Vê lista de erros/warnings por linha
5. Confirma importação → backend processa em batch:
   a. Cria/atualiza Produtos no ProductCatalog
   b. Cria Transacoes no Sales
   c. Atualiza Estoque no Inventory (se coluna presente)
   d. Publica ImportacaoCsvCompleta com contadores
6. Dashboard mostra: "Importados 12.450 registros de 6 meses"
```

#### Schema CSV aceito (flexível)

```csv
# Mínimo obrigatório (3 colunas):
Data,Produto,Quantidade

# Completo (todas as colunas reconhecidas):
TransactionId,Data,Hora,ProdutoId,ProdutoNome,Categoria,Quantidade,ValorUnitario,ClienteId

# Variações aceitas nos nomes de coluna:
# Data: data, date, dt_venda, data_venda
# Produto: produto, produtoNome, descricao, item, product
# Quantidade: quantidade, qtd, qty, qtde
# Valor: valor, preco, valorUnitario, price, vlr_unitario
```

#### Regras de validação do CSV

- Tamanho máximo: 50MB por upload
- Encoding auto-detect: UTF-8 → Latin1 → Windows-1252 (fallback)
- Linhas com erro: **não bloqueia** — importa as válidas, reporta as inválidas
- Duplicatas: detecta por (Data + ProdutoId + Quantidade) — pede confirmação
- Mínimo para ser útil: 90 dias de dados, 500+ linhas

### Segurança das Credenciais

- Credenciais do tenant **SEMPRE encriptadas** no banco (AES-256 + chave por tenant ou Data Protection API).
- Nunca logar credenciais em texto plano.
- Endpoint de config retorna `"***masked***"` — nunca expõe a credencial salva.

---

## 10. Dashboard e Notificações

### Telas do Frontend (fluxo do usuário)

```
Login → Dashboard (home do tenant)
  ├── Cards de resumo: previsão 7/30 dias, alertas ativos, última sync
  ├── Gráfico: vendas reais vs. previstas (line chart)
  ├── Lista: Top 10 produtos com maior previsão de aumento
  ├── Lista: Alertas de reposição (estoque baixo previsto)
  ├── Lista: Recomendações MBA ("quem compra X leva Y")
  └── Status da integração (última sync, erros)

Configurações
  ├── Dados do tenant / estabelecimento
  ├── Configurar integração (tipo, credenciais, intervalo)
  ├── Gerenciar usuários (Admin only)
  └── Preferências de notificação
```

### Notification BC

```csharp
public class Alerta : AggregateRoot<AlertaId>, ITenantScoped
{
    public TenantId TenantId { get; private set; }
    public TipoAlerta Tipo { get; private set; }          // ReposicaoUrgente, PrevisaoAlta, SyncFalhou, RecomendacaoMBA
    public string Titulo { get; private set; }             // "Feriado Tiradentes: +42% churrasco"
    public string Descricao { get; private set; }          // detalhes acionáveis
    public Severidade Severidade { get; private set; }     // Informativo, Atencao, Urgente
    public bool Lido { get; private set; }
    public DateTimeOffset CriadoEm { get; private set; }

    public void MarcarComoLido() { Lido = true; }
}

public enum TipoAlerta { ReposicaoUrgente, PrevisaoAlta, PrevisaoBaixa, SyncFalhou, RecomendacaoMBA, EventoProximo }
public enum Severidade { Informativo, Atencao, Urgente }
```

### Real-time via SignalR

```csharp
// API/Hubs/DashboardHub.cs
public class DashboardHub : Hub
{
    // Grupos por TenantId — cada tenant só recebe seus alertas
    public override async Task OnConnectedAsync()
    {
        var tenantId = Context.User!.FindFirst("tenant_id")!.Value;
        await Groups.AddToGroupAsync(Context.ConnectionId, $"tenant-{tenantId}");
    }
}

// Quando uma previsão é gerada:
await _hubContext.Clients.Group($"tenant-{tenantId}")
    .SendAsync("NovoAlerta", alerta);
```

### Exemplos de alertas gerados automaticamente

| Gatilho                  | Alerta gerado                                                       |
|--------------------------|---------------------------------------------------------------------|
| Feriado em 7 dias        | "Tiradentes (21/04): +35% em carnes e bebidas. Sugiro pedir 120kg." |
| Estoque < ponto mínimo   | "Arroz 5kg: estoque atual 15un, previsão 7 dias = 80un. REPOR."    |
| MBA detectou associação  | "Clientes que compram carvão também levam cerveja (lift 3.2)."      |
| Sync falhou              | "Integração Bling falhou às 03:00. Verificar credenciais."          |
| Previsão de queda        | "Vendas de sorvete caindo 25% — fim do verão. Reduzir pedido."      |

---

## 11. Pipeline Diário Atualizado (com multi-tenancy)

```
1. Job Hangfire (a cada IntervaloSync por tenant):
   a. Para CADA tenant ativo com integração configurada:
      i.   ConectorFactory.Criar(tenant.TipoSistema)
      ii.  ImportarVendas + ImportarProdutos + ImportarEstoque
      iii. Transforma em entities do domínio (com TenantId)
      iv.  Publica SincronizacaoCompleta

2. Job diário (1x/dia, para todos os tenants):
   a. Calendar BC carrega feriados + promoções dos próximos 30 dias
   b. Para CADA tenant com dados suficientes (>= 3 meses):
      i.   Sales BC exporta histórico (últimos 12 meses, filtrado por TenantId)
      ii.  Forecasting aplica regras + ML.NET (modelo treinado POR TENANT)
      iii. Gera PrevisaoDemanda por produto/período
      iv.  Publica PrevisaoAtualizada

3. Event handlers reagem:
   - Inventory: previsão > estoque → cria AlertaDeReposicao
   - Notification: gera Alerta + envia via SignalR para dashboard do tenant
   - Procurement: AlertaDeReposicao urgente → sugere PedidoCompra

4. Dashboard do tenant atualiza em real-time via SignalR
```

### Modelo ML por Tenant

- Cada tenant tem seu **próprio modelo treinado** — dados de um não vazam para outro.
- Modelos salvos em: `ml-models/{tenantId}/regression.zip`, `ml-models/{tenantId}/clusters.zip`
- Re-treino automático: semanal ou quando volume de dados novos > 20% do dataset anterior.

## 12. Stack Tecnológica (confirmada)

| Camada       | Tecnologia                                  |
|--------------|---------------------------------------------|
| Runtime      | .NET 8+ (LTS)                               |
| Domínio      | C# puro (sem frameworks)                    |
| CQRS         | MediatR                                     |
| ORM          | EF Core (Owned Types para VOs)              |
| ML           | ML.NET (Regression, Clustering, Time Series)|
| MBA          | Apriori custom C#                           |
| Feriados     | BrazilHolidays.Net (NuGet)                  |
| Auth         | ASP.NET Identity + JWT Bearer tokens        |
| Frontend     | Blazor Server (.NET 8)                      |
| Real-time    | SignalR (dashboard live)                     |
| Testes       | xUnit + FluentAssertions + NSubstitute      |
| Background   | Hangfire ou Quartz.NET                       |
| Mensageria   | MediatR (in-process) → MassTransit + RabbitMQ (scale) |
| API          | Minimal API (.NET 8)                        |
| Banco        | PostgreSQL (multi-tenant com query filters)  |
| Cache        | Redis (opcional, para dashboard performance) |

---

## 13. Regras de Código (obrigatórias)

### Naming

- Classes: PascalCase — `PrevisaoDemanda`, `AlertaDeReposicao`
- Interfaces: `I` prefix — `IProdutoRepository`, `IRegressionModel`
- Domain Events: passado — `PrevisaoAtualizada`, `EstoqueBaixoDetectado`
- Commands: imperativo — `GerarPrevisoesCommand`, `BaixarEstoqueCommand`
- Queries: interrogativo — `ObterPrevisaoPorProdutoQuery`

### Invariantes

- Nunca expor collections mutáveis — sempre `IReadOnlyCollection` com backing `_list`
- Validação no construtor dos Value Objects (fail fast)
- Aggregate Root é o único que publica Domain Events
- Nenhum `public set` em Entities — apenas métodos com nome de negócio

### Persistência

- EF Core Owned Types para Value Objects (sem tabelas separadas)
- Shadow Properties para metadados (CreatedAt, UpdatedAt) — não poluir domínio
- Repository pattern: interface no Domain, implementação no Infrastructure
- Unit of Work via `DbContext.SaveChangesAsync()` + dispatch de eventos

### Testes

- Domain: 100% cobertura, sem banco, sem ML, sem I/O
- Application: mock de repositórios e serviços externos
- Infrastructure: testes de integração com banco in-memory ou Testcontainers
- Padrão: Arrange-Act-Assert com nomes descritivos (`Deve_GerarPrevisao_QuandoFeriadoDetectado`)

---

## 14. Dados de Entrada (schema mínimo do supermercado)

```csv
TransactionId,Data,Hora,ProdutoId,ProdutoNome,Categoria,Quantidade,ValorUnitario,ClienteId
```

Campos obrigatórios: `TransactionId`, `Data`, `ProdutoId`, `Quantidade`.
Campos opcionais mas recomendados: `Categoria`, `ValorUnitario`, `ClienteId`, `Hora`.

Mínimo para treino útil: **12 meses** de dados, **1000+ transações**.

---

## 15. Roadmap

### Fase 1 — MVP (CSV + Dashboard)
- [x] Multi-tenancy com query filters
- [x] Identity BC (registro, login JWT, perfis)
- [x] Conector CSV (upload, parse, validação, import)
- [x] Forecasting básico (regressão + feriados)
- [x] Dashboard Blazor Server (previsões, alertas)
- [x] SignalR real-time no dashboard

### Fase 2 — Conectores + ML Avançado
- [ ] Conector API Genérica (REST)
- [ ] Conector Bling ERP
- [ ] MBA (Market Basket Analysis / Apriori)
- [ ] Clustering K-Means (segmentação de produtos)
- [ ] Sync automático via Hangfire

### Fase 3 — Escala
- [ ] Conectores TOTVS, Tiny, Nuvemshop, ODBC, NF-e XML
- [ ] OpenWeather API para fator clima
- [ ] Planos e pricing (Free/Básico/Profissional)
- [ ] Event Sourcing para histórico completo de previsões
- [ ] Export de relatórios PDF/Excel

### Fase 4 — Expansão
- [ ] App mobile (MAUI) com push notifications
- [ ] Marketplace de conectores (comunidade contribui adaptadores)
- [ ] Microservices reais (um container por BC)
- [ ] Análise de sentimento de redes sociais (opcional)
