---
# ============================================================
# SKILL: Mapeador e Executor de Scripts Locais
# OpenClaw AI Agent — Skill Custom v1.0.0
# Criado em: 2026-03-07
# Idioma: Português (PT-BR)
# ============================================================

name: mapeador-executor
version: "1.0.0"
author: openclaw-user
language: pt-BR

description: |
  Esta skill transforma o agente OpenClaw em um controle remoto do seu computador via
  WhatsApp ou Telegram. Permite mapear pastas, listar arquivos recursivamente,
  executar comandos shell seguros (ls, find, tree, grep, dir etc.), salvar resultados
  em arquivos .txt no workspace local (~/.openclaw/workspace), e atualizar o MEMORY.md
  com resumos da estrutura de arquivos para que o agente "lembre" do ambiente do usuário
  entre conversas. Tudo roda local, sem enviar dados para fora da máquina.

  Quando usar:
    - Usuário pede para "mapear", "escanear", "listar" ou "ver" uma pasta
    - Usuário quer saber quais arquivos existem em um diretório
    - Usuário precisa buscar arquivos por extensão, nome ou padrão
    - Usuário quer executar um comando shell simples e seguro
    - Usuário quer salvar resultado de um scan em arquivo
    - Usuário quer que o agente "saiba" a estrutura do projeto

# Palavras e frases que ativam esta skill (Portuguese PT-BR triggers)
triggers:
  - "mapear pasta"
  - "mapear diretório"
  - "mapear projeto"
  - "listar arquivos"
  - "listar pasta"
  - "listar diretório"
  - "escanear pasta"
  - "escanear diretório"
  - "escanear downloads"
  - "escanear documentos"
  - "escanear projeto"
  - "ver estrutura"
  - "mostrar estrutura"
  - "estrutura de pastas"
  - "quais arquivos"
  - "buscar arquivos"
  - "encontrar arquivos"
  - "find arquivos"
  - "rodar comando"
  - "executar comando"
  - "rodar script"
  - "executar script"
  - "tree pasta"
  - "árvore de pastas"
  - "ls pasta"
  - "dir pasta"
  - "grep no projeto"
  - "busca no código"

# Esta skill pode ser chamada diretamente pelo usuário
user-invocable: true

# Configurações de segurança padrão
security:
  sandbox: true                   # Sempre rodar em modo sandbox se disponível
  readonly_first: true            # Preferir comandos read-only antes de write
  require_confirmation_for_write: true   # Pedir confirmação antes de gravar arquivos fora do workspace
  allowed_write_paths:
    - "~/.openclaw/workspace"     # Único diretório onde pode gravar sem confirmação
    - "./workspace"               # Relativo ao diretório do agente
  blocked_commands:               # Comandos NUNCA permitidos
    - "rm -rf"
    - "del /f /q"
    - "format"
    - "mkfs"
    - "dd if="
    - "shutdown"
    - "reboot"
    - "> /dev/sd"
    - "DROP TABLE"
    - "DROP DATABASE"

# Binários necessários para funcionalidade completa
metadata:
  openclaw:
    requires:
      bins:
        - name: "tree"
          optional: true
          fallback: "find"        # Se tree não existir, usa find
          install_hint: "sudo apt install tree  # Linux | brew install tree  # macOS | winget install tree  # Windows"
        - name: "find"
          optional: false         # find é obrigatório (ou dir no Windows)
        - name: "grep"
          optional: true
          fallback: "Select-String"  # PowerShell fallback
        - name: "ls"
          optional: true
          fallback: "dir"         # Windows fallback
      tools:
        - exec    # Para executar comandos shell
        - read    # Para ler arquivos de resultado
        - write   # Para salvar resultados e atualizar MEMORY.md
        - append  # Para adicionar ao MEMORY.md sem sobrescrever

---

# 🗺️ Mapeador e Executor de Scripts Locais

> **Skill OpenClaw** — Controle remoto do seu PC via WhatsApp/Telegram  
> Versão 1.0.0 | Idioma: PT-BR | Segurança: Sandbox ativo

---

## 📋 Índice

1. [Quando usar esta skill](#quando-usar-esta-skill)
2. [Exemplos de pedidos por voz ou texto](#exemplos-de-pedidos)
3. [Fluxo de raciocínio do agente](#fluxo-de-raciocínio)
4. [Ferramentas utilizadas](#ferramentas-utilizadas)
5. [Exemplos de comandos](#exemplos-de-comandos)
6. [Regras de segurança](#regras-de-segurança)
7. [Formato de saída](#formato-de-saída)
8. [Atualização do MEMORY.md](#atualização-do-memorymd)
9. [Tratamento de erros](#tratamento-de-erros)
10. [Variáveis de contexto](#variáveis-de-contexto)

---

## 🎯 Quando usar esta skill

Use esta skill **sempre que o usuário quiser saber sobre arquivos e pastas do computador**, incluindo:

- **Exploração**: "Mostra o que tem na pasta Downloads"
- **Busca**: "Encontra todos os arquivos .py no meu projeto"
- **Auditoria**: "Quantos arquivos JavaScript tenho no projeto?"
- **Organização**: "Lista as pastas dentro de Documentos"
- **Grep/busca de conteúdo**: "Busca por TODO nos meus arquivos .js"
- **Salvar inventário**: "Mapeia o projeto e salva em arquivo"
- **Memória**: "Aprende a estrutura do meu projeto"

> **NUNCA use esta skill para**: deletar arquivos, modificar código fora do workspace,
> executar instaladores, acessar pastas do sistema sem permissão explícita.

---

## 🗣️ Exemplos de Pedidos

O usuário pode pedir de várias formas, inclusive via **mensagem de voz transcrita**:

### Via texto no WhatsApp:
```
"mapeia minha pasta Downloads"
"lista todos os .py no projeto em ~/Projetos/meu-app"
"mostra a estrutura de pastas do projeto"
"executa find . -name *.js e salva o resultado"
"escaneia ~/Documents e me diz quantos PDFs tem"
"busca por TODO nos arquivos .js do projeto"
"árvore de pastas de ~/Projetos até 3 níveis"
```

### Via áudio (transcrição automática):
```
"escaneia a pasta downloads"
"lista os arquivos python no projeto"
"me mostra o que tem na pasta documentos"
"quantos arquivos tem no meu projeto"
"salva a lista de arquivos num txt"
```

---

## 🧠 Fluxo de Raciocínio do Agente

Quando esta skill for ativada, siga **exatamente** este fluxo passo a passo:

### PASSO 1 — Entender o pedido

Analise o pedido do usuário e identifique:

```yaml
análise:
  ação: "mapear | listar | buscar | executar | grep | contar"
  alvo_pasta: "caminho especificado ou PERGUNTAR"
  filtro: "extensão, padrão ou nome de arquivo (se mencionado)"
  profundidade: "número de níveis (padrão: 3)"
  salvar_resultado: "true se usuário pediu para salvar"
  atualizar_memoria: "true por padrão"
```

**Se o usuário NÃO especificou a pasta**, pergunte:

> "📁 Em qual pasta você quer que eu escaneie? Por exemplo: `~/Downloads`, `~/Documentos`, `~/Projetos/meu-app` ou `.` para o diretório atual?"

### PASSO 2 — Detectar o sistema operacional

Antes de montar o comando, verifique o SO via exec:

```bash
# Linux/macOS
uname -s

# Windows (PowerShell)
$env:OS
```

Com base no SO, adapte os comandos:

| Operação | Linux/macOS | Windows (PowerShell) |
|---|---|---|
| Listar arquivos | `ls -la` | `Get-ChildItem -Force` |
| Árvore de pastas | `tree -L 3` | `tree /F /A` |
| Buscar arquivos | `find . -name "*.py"` | `Get-ChildItem -Recurse -Filter "*.py"` |
| Buscar conteúdo | `grep -r "TODO" .` | `Select-String -Recurse "TODO"` |
| Contar arquivos | `find . -type f | wc -l` | `(Get-ChildItem -Recurse -File).Count` |

### PASSO 3 — Montar o comando apropriado

Escolha o comando baseado na ação identificada:

#### 🌳 Para visão geral da estrutura (mapear/árvore):
```bash
# Linux/macOS — tree disponível
tree -L 3 -a --dirsfirst "/caminho/da/pasta"

# Linux/macOS — fallback sem tree
find "/caminho/da/pasta" -maxdepth 3 | head -100

# Windows
tree "C:\caminho\da\pasta" /F /A
```

#### 📄 Para listar arquivos com filtro de extensão:
```bash
# Linux/macOS
find "/caminho" -name "*.py" -type f

# Windows PowerShell
Get-ChildItem -Path "C:\caminho" -Recurse -Filter "*.py" | Select-Object FullName

# Resultado mais compacto
find "/caminho" -name "*.py" -type f | sort
```

#### 🔍 Para busca de conteúdo (grep):
```bash
# Linux/macOS
grep -r "padrão" "/caminho" --include="*.js" -l

# Windows PowerShell
Select-String -Path "C:\caminho\**\*.js" -Pattern "padrão" | Select-Object Filename, LineNumber
```

#### 📊 Para contar arquivos por tipo:
```bash
# Linux/macOS
find "/caminho" -type f | sed 's/.*\.//' | sort | uniq -c | sort -rn

# Windows PowerShell
Get-ChildItem -Recurse -File | Group-Object Extension | Sort-Object Count -Descending | Select-Object Name, Count
```

### PASSO 4 — Executar via tool `exec`

```
exec(comando_montado_no_passo_3)
```

**Limites de segurança OBRIGATÓRIOS antes de exec:**
- ✅ Comando é read-only? → Executar direto
- ⚠️ Comando grava fora do workspace? → Pedir confirmação
- ❌ Comando está na lista de bloqueados? → RECUSAR e explicar

### PASSO 5 — Processar o output

Se o output tiver **mais de 50 linhas** ou **mais de 3.000 caracteres**:
1. Salvar output completo em arquivo `.txt` no workspace
2. Mostrar ao usuário apenas o **resumo** (top 20 linhas + estatísticas)

Se o output couber na tela:
1. Mostrar direto na resposta formatada

### PASSO 6 — Salvar resultado no workspace

Se o output for grande OU o usuário pediu para salvar:

```
write(
  path: "~/.openclaw/workspace/scan_[nome-pasta]_[data].txt",
  content: output_completo
)
```

Exemplo de nome de arquivo:
```
scan_downloads_2026-03-07.txt
scan_projetos_meu-app_2026-03-07.txt
busca_py_projetos_2026-03-07.txt
```

### PASSO 7 — Atualizar MEMORY.md

**Sempre** que um scan for executado, adicione um resumo ao MEMORY.md:

```
append(
  path: "~/.openclaw/memory/MEMORY.md",
  content: resumo_formatado
)
```

Formato do resumo (ver seção [Atualização do MEMORY.md](#atualização-do-memorymd)).

### PASSO 8 — Responder ao usuário

Monte uma resposta clara e amigável com:
1. ✅ Confirmação do que foi feito
2. 📊 Estatísticas principais (qtd arquivos, tamanho, tipos)
3. 📄 Preview do resultado (se coube) ou link para o arquivo salvo
4. 💾 Confirmação de que MEMORY.md foi atualizado

---

## 🔧 Ferramentas Utilizadas

### `exec` — Executor de comandos shell
```yaml
tool: exec
uso: Rodar tree, find, ls, dir, grep, Get-ChildItem etc.
segurança: Sempre verificar contra lista de comandos bloqueados
timeout: 30 segundos (aumentar para pastas grandes)
```

### `read` — Leitura de arquivos
```yaml
tool: read
uso: Ler arquivo de resultado após salvar, ou ler MEMORY.md existente
exemplo: read("~/.openclaw/workspace/scan_downloads_2026-03-07.txt")
```

### `write` — Escrita de arquivos
```yaml
tool: write
uso: Salvar resultado completo do scan em arquivo .txt no workspace
destino_seguro: "~/.openclaw/workspace/"
confirmação: Necessária para outros destinos
```

### `append` — Adição ao MEMORY.md
```yaml
tool: append
uso: Adicionar resumo do scan ao MEMORY.md sem apagar histórico anterior
destino: "~/.openclaw/memory/MEMORY.md"
```

---

## 💻 Exemplos de Comandos

### Exemplo 1 — Mapear pasta Downloads
**Pedido do usuário:** "mapeia minha pasta downloads"

```bash
# Agente detecta: Linux/macOS com tree instalado
tree -L 3 --dirsfirst ~/Downloads

# Saída esperada (resumo):
# Downloads/
# ├── Documentos/
# │   ├── relatorio.pdf
# │   └── planilha.xlsx
# ├── Fotos/
# │   └── 2025/
# ├── arquivo1.zip
# └── video.mp4
# 
# 3 directories, 4 files
```

**Resposta do agente:**
> 📂 **Downloads mapeado!**
> 
> Encontrei **3 subpastas** e **4 arquivos** na raiz.
> Principais tipos: `.pdf`, `.xlsx`, `.zip`, `.mp4`
> 
> Resultado completo salvo em: `workspace/scan_downloads_2026-03-07.txt`
> MEMORY.md atualizado ✅

---

### Exemplo 2 — Listar todos os .py em um projeto
**Pedido:** "lista todos os arquivos python no projeto em ~/Projetos/meu-app"

```bash
find ~/Projetos/meu-app -name "*.py" -type f | sort
```

```
# Saída:
~/Projetos/meu-app/main.py
~/Projetos/meu-app/src/api.py
~/Projetos/meu-app/src/models/user.py
~/Projetos/meu-app/tests/test_api.py
~/Projetos/meu-app/utils/helpers.py
```

**Resposta:**
> 🐍 **5 arquivos Python** encontrados em `~/Projetos/meu-app`:
> ```
> main.py
> src/api.py
> src/models/user.py
> tests/test_api.py
> utils/helpers.py
> ```
> MEMORY.md atualizado com estrutura do projeto ✅

---

### Exemplo 3 — Grep por TODO no código
**Pedido:** "busca por TODO nos meus arquivos javascript do projeto"

```bash
grep -r "TODO" ~/Projetos/meu-app --include="*.js" -n
```

**Resposta:**
> 🔍 **Encontrei 7 TODOs** nos arquivos `.js`:
> 
> ```
> src/app.js:45: // TODO: implementar autenticação
> src/api.js:12: // TODO: adicionar rate limiting
> ...
> ```

---

### Exemplo 4 — Contar arquivos por tipo
**Pedido:** "quantos arquivos de cada tipo tem no projeto"

```bash
find ~/Projetos/meu-app -type f | sed 's/.*\.//' | sort | uniq -c | sort -rn
```

**Resposta:**
> 📊 **Distribuição de arquivos no projeto:**
> 
> | Extensão | Quantidade |
> |---|---|
> | `.js`  | 45 |
> | `.json` | 12 |
> | `.md`  | 8  |
> | `.css`  | 6  |
> | `.html` | 3  |
> 
> **Total: 74 arquivos**

---

### Exemplo 5 — Salvar resultado em arquivo
**Pedido:** "escaneia Downloads e salva num txt"

```bash
# 1. Executar scan
tree ~/Downloads -a > /tmp/scan_temp.txt 2>&1

# 2. Ler resultado
read("/tmp/scan_temp.txt")

# 3. Salvar no workspace
write("~/.openclaw/workspace/scan_downloads_2026-03-07.txt", conteúdo)
```

---

### Exemplo 6 — Windows PowerShell
**Pedido (Windows):** "lista os arquivos na pasta Documentos"

```powershell
Get-ChildItem -Path "$env:USERPROFILE\Documents" -Recurse |
  Select-Object Name, Extension, Length, LastWriteTime |
  Format-Table -AutoSize
```

---

### Exemplo 7 — Busca por arquivos grandes
**Pedido:** "mostra os arquivos maiores que 100MB na pasta Downloads"

```bash
# Linux/macOS
find ~/Downloads -type f -size +100M -exec ls -lh {} \; | sort -k5 -rh

# Windows PowerShell
Get-ChildItem -Path "$env:USERPROFILE\Downloads" -Recurse -File |
  Where-Object { $_.Length -gt 100MB } |
  Sort-Object Length -Descending |
  Select-Object Name, @{N="Tamanho(MB)";E={[math]::Round($_.Length/1MB,2)}}
```

---

## 🔒 Regras de Segurança

### ✅ Comandos SEMPRE permitidos (read-only):
```
ls, ls -la, ls -R
dir, dir /s
tree, tree /F
find -name, find -type f, find -maxdepth
Get-ChildItem, Get-Item
cat (leitura), type (Windows)
grep -r (busca), Select-String
wc -l, wc -c
du -sh (tamanho de pasta)
stat (metadados)
echo, Write-Host
pwd, cd (sem modificar)
```

### ⚠️ Comandos que REQUEREM confirmação do usuário:
```
cp, mv, copy, move    — copia/move arquivos
mkdir, md             — cria diretórios
touch, New-Item       — cria arquivos
chmod, icacls         — muda permissões
zip, tar -c           — compacta arquivos
find ... -exec        — find com execução
```

### ❌ Comandos NUNCA permitidos (bloqueados):
```
rm, rm -rf, del, rmdir /s   — DELETA arquivos
format, mkfs, dd            — FORMATA disco
shutdown, reboot, halt      — DESLIGA sistema
kill, pkill, Stop-Process   — MATA processos (exceto com confirmação)
curl | bash, wget | sh      — Execução remota direta
sudo su, runas /user:root   — Elevação de privilégio
> /etc/, > /sys/, > C:\Windows\  — Escrita em pastas do sistema
DROP TABLE, DROP DATABASE   — Comandos SQL destrutivos
```

### 🏖️ Regra do Sandbox:
Se `sandbox: true` estiver configurado:
- Todos os outputs são salvos em `~/.openclaw/workspace/`
- Nenhum arquivo é criado fora do workspace sem confirmação explícita
- O agente informa ao usuário: "Modo sandbox ativo — resultado salvo em workspace/"

---

## 📝 Formato de Saída

### Resposta padrão para scan bem-sucedido:
```
🗺️ **Scan concluído!** [nome-da-pasta]
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

📊 **Estatísticas:**
• Total de arquivos: X
• Total de pastas: Y  
• Tamanho total: Z MB
• Tipos mais comuns: .ext1 (N), .ext2 (N)

📁 **Estrutura (top 3 níveis):**
[preview da árvore aqui — máx 30 linhas]

💾 **Resultado completo:** workspace/scan_xxx_data.txt
🧠 **MEMORY.md:** atualizado com resumo
```

### Resposta para busca de arquivo:
```
🔍 **Busca por *.py em ~/Projetos**
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

✅ Encontrados: X arquivos

[lista de caminhos]

💾 Salvo em: workspace/busca_py_2026-03-07.txt
```

---

## 🧠 Atualização do MEMORY.md

### Formato do bloco a ser adicionado ao MEMORY.md:
```markdown
## 🗺️ Scan: [nome-pasta] — [data hora]

**Pasta:** `~/caminho/da/pasta`  
**SO:** Linux 22.04 / macOS 14 / Windows 11  
**Executado em:** 2026-03-07 14:32:00  

### Estatísticas:
- **Arquivos totais:** 234
- **Pastas totais:** 18
- **Tamanho total:** 1.2 GB
- **Tipos de arquivo:** `.py` (45), `.json` (32), `.md` (12), `.js` (8)

### Estrutura principal:
```
meu-projeto/
├── src/           (45 arquivos)
├── tests/         (12 arquivos)
├── docs/          (8 arquivos)
└── config/        (5 arquivos)
```

### Notas:
- Arquivo mais recente: `src/main.py` (2026-03-06)
- Arquivo maior: `data/dataset.csv` (450 MB)
- Resultado completo: `workspace/scan_meu-projeto_2026-03-07.txt`

---
```

### Regra do MEMORY.md:
- **NUNCA sobrescrever** o MEMORY.md — sempre usar `append`
- Adicionar separador `---` entre entradas
- Manter histórico de todos os scans
- Se MEMORY.md não existir, criá-lo com cabeçalho padrão

### Cabeçalho padrão do MEMORY.md (se não existir):
```markdown
# 🧠 OpenClaw — Memória do Agente

> Arquivo gerado automaticamente pela skill `mapeador-executor`  
> Contém histórico de scans e estrutura de pastas do usuário  
> Última atualização: [data]

---
```

---

## ⚠️ Tratamento de Erros

### Pasta não encontrada:
```
❌ **Pasta não encontrada:** `~/caminho/inexistente`

Verifique se o caminho está correto. Exemplos válidos:
• `~/Downloads`
• `~/Documents`  
• `~/Projetos/meu-app`
• `.` (pasta atual)

Qual pasta você quer escanear?
```

### Permissão negada:
```
🔒 **Sem permissão** para acessar: `/etc/shadow`

Esta pasta requer privilégios de administrador.
Posso escanear uma pasta dentro do seu diretório home (~)?
```

### Comando bloqueado:
```
🚫 **Comando bloqueado por segurança**

O comando `rm -rf ~/Downloads` não é permitido pois pode deletar arquivos.
Esta skill é focada em **leitura e mapeamento**.

Se precisar deletar arquivos, faça diretamente no terminal com cuidado.
```

### Output muito grande (> 10.000 linhas):
```
⚠️ **Output muito grande** (estimativa: ~50.000 linhas)

Vou fazer um scan com limitação de profundidade (3 níveis) para não travar.
Resultado completo seria salvo em arquivo. Quer prosseguir? [sim/não]
```

### tree não instalado:
```
ℹ️ `tree` não encontrado. Usando `find` como alternativa.
(Para instalar: sudo apt install tree)
```

---

## 🔢 Variáveis de Contexto

O agente deve manter estas variáveis durante a execução da skill:

```yaml
contexto_skill:
  ultima_pasta_escaneada: null       # Último caminho escaneado
  ultimo_comando_executado: null     # Último comando exec rodado
  arquivos_encontrados: 0            # Contador de arquivos
  pastas_encontradas: 0              # Contador de pastas
  resultado_salvo_em: null           # Path do arquivo salvo
  so_detectado: null                 # "linux" | "macos" | "windows"
  tree_disponivel: false             # Se tree está instalado
  sandbox_ativo: true                # Modo sandbox
  sessao_inicio: null                # Timestamp de início
```

---

## 📦 Estrutura de Arquivos da Skill

```
~/.openclaw/
├── skills/
│   └── mapeador-executor/
│       └── SKILL.md          ← Este arquivo
├── workspace/
│   ├── scan_downloads_2026-03-07.txt
│   ├── scan_projetos_2026-03-07.txt
│   └── busca_py_2026-03-07.txt
└── memory/
    └── MEMORY.md             ← Memória persistente dos scans
```

---

## 🔄 Prompts Internos do Agente

### Prompt de sistema para esta skill:
```
Você é o OpenClaw, um agente AI que ajuda o usuário a mapear e explorar
arquivos do computador via WhatsApp/Telegram.

Regras ABSOLUTAS:
1. Nunca execute comandos destrutivos (rm, del, format, shutdown)
2. Sempre informe o usuário antes de salvar arquivos
3. Prefira comandos read-only
4. Se a pasta não foi especificada, PERGUNTE antes de executar
5. Sempre atualize o MEMORY.md após cada scan bem-sucedido
6. Responda sempre em Português (PT-BR)
7. Use emojis para tornar a resposta mais visual e fácil de ler no celular
8. Se o output for grande, mostre apenas o resumo e salve o completo em arquivo

Formato de resposta ideal para WhatsApp:
- Curto e direto (máx 10 linhas visíveis)
- Emojis para organizar visualmente
- Estatísticas claras (X arquivos, Y pastas)
- Confirmação de onde foi salvo
```

### Prompt para pedir pasta quando não especificada:
```
📁 Em qual pasta você quer que eu escaneie?

Exemplos:
• ~/Downloads
• ~/Documentos
• ~/Projetos/nome-do-projeto
• . (pasta atual)

Ou me diz o tipo de busca:
• "arquivos .py" → busco arquivos Python
• "arquivos grandes" → busco +100MB
• "mais recentes" → busco últimos 7 dias
```

---

## 📱 Integração WhatsApp/Telegram

### Comandos rápidos via mensagem:
```
/scan [pasta]          → Mapeia pasta com tree
/ls [pasta]            → Lista arquivos (1 nível)
/find [ext] [pasta]    → Busca por extensão
/grep [termo] [pasta]  → Busca conteúdo
/save                  → Salva último resultado em arquivo
/memory                → Mostra resumo do MEMORY.md
```

### Reconhecimento de voz (NLP para PT-BR):
```yaml
padrões_voz:
  "escaneia [PASTA]":     scan de [PASTA]
  "mapeia [PASTA]":       tree de [PASTA]
  "lista [EXT] em [PASTA]": find [EXT] em [PASTA]
  "quantos arquivos em":  count files
  "busca [TERMO] em":     grep [TERMO]
  "salva o resultado":    write to workspace
  "o que tem em [PASTA]": ls [PASTA]
```

---

## 🧪 Exemplos de Teste

Para testar esta skill, o agente deve conseguir responder corretamente a:

```
✅ "mapeia ~/Downloads"
✅ "lista arquivos .py em ~/Projetos"
✅ "quantos arquivos tem em ~/Documentos"
✅ "busca por console.log nos .js do projeto"
✅ "mostra arquivos maiores que 50MB"
✅ "salva o resultado da busca num arquivo"
✅ "escaneia a pasta downloads" (via áudio)
✅ "tree do projeto até 2 níveis"

❌ "deleta os arquivos grandes" → BLOQUEADO
❌ "formata o HD" → BLOQUEADO  
❌ "rm -rf /" → BLOQUEADO + ALERTA
```

---

*Skill criada para OpenClaw AI Agent | PT-BR | v1.0.0 | 2026-03-07*  
*Repositório: https://github.com/openclaw/openclaw*
