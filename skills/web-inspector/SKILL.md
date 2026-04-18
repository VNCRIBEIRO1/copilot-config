---
name: web-inspector
description: 'Navigate websites, take screenshots (fullPage/element/viewport/mobile/dark-mode), audit visual elements, compare layouts A/B, and index captures to the project. Use when: inspecting sites, capturing screenshots, visual QA, auditing pages, comparing layouts, collecting evidence, saving page captures, indexing screenshots to project folders.'
argument-hint: 'URL to inspect and what to capture'
---

# Web Inspector

Skill para navegar sites, capturar screenshots multi-viewport, auditar e indexar ao projeto.

> **Integração com hooks**: Screenshots capturados por esta skill são automaticamente otimizados pelo hook `optimize-screenshot` (gera versão retina + embed). Nenhuma ação manual necessária.

## Ferramentas MCP

Todas as ferramentas `mcp_microsoft_pla_browser_*` estão disponíveis. Principais:

| Ferramenta | Uso |
|------------|-----|
| `browser_navigate` | Navegar para URL |
| `browser_snapshot` | Estrutura acessível da página (refs clicáveis) |
| `browser_take_screenshot` | Screenshot (viewport, fullPage, elemento) |
| `browser_resize` | Redimensionar viewport |
| `browser_evaluate` | Executar JS na página |
| `browser_click` | Interagir com elementos |
| `browser_emulate` | Emulação de dispositivo (mobile, tablet) |
| `browser_close` | Liberar recursos |

## Procedimento Principal

### 1. Preparar

Pergunte ou infira:
- **URL** do site
- **Diretório de saída** (padrão: `screenshots/{dominio}/`)
- **Modo de captura**: standard, multi-viewport, comparação A/B, auditoria
- **Viewports desejados**: desktop, tablet, mobile (ou todos)

### 2. Navegar e Analisar

```
1. browser_navigate → URL alvo
2. browser_snapshot → entender estrutura (hero, nav, footer, CTAs, seções)
3. Identificar links internos para captura multi-página
```

### 3. Capturar Screenshots

**Nomeação obrigatória**: `{pagina}-{viewport}-{tipo}.png`
- Página com nome composto: `presidente-prudente-desktop-full.png`
- Sufixos de viewport: `desktop`, `mobile`, `tablet`
- Sufixos de tipo: `full` (fullPage), `viewport`, `element`

**Para cada viewport desejado:**
```
1. browser_resize → dimensões do viewport
2. browser_evaluate → scroll até o final (trigger lazy-loading)
3. Aguardar 1-2s para rendering
4. browser_take_screenshot → fullPage=true, salvar com nome correto
```

**Para múltiplas páginas:**
```
1. Capturar página atual em todos os viewports
2. browser_snapshot → encontrar links de navegação
3. browser_click → próxima página
4. Repetir 1-3
```

### 4. Indexar ao Projeto

Executar o script de indexação para gerar `manifest.json`:

```bash
node ~/.copilot/skills/web-inspector/scripts/index-screenshots.mjs <diretorio> <url-do-site>
```

Ou construir manualmente o manifest durante o processo com esta estrutura:

```json
{
  "site": "https://exemplo.com",
  "captured_at": "2026-04-13T12:00:00Z",
  "viewport_configs": {
    "desktop": { "width": 1920, "height": 1080 },
    "tablet": { "width": 768, "height": 1024 },
    "mobile": { "width": 375, "height": 812 }
  },
  "pages": [
    {
      "url": "https://exemplo.com/",
      "title": "Home",
      "screenshots": [
        {
          "file": "home-desktop-full.png",
          "embed_file": "home-desktop-full-embed.png",
          "type": "fullPage",
          "viewport": "desktop",
          "size_kb": 245,
          "description": "Home — desktop fullPage"
        }
      ]
    }
  ],
  "total_captures": 6
}
```

### 5. Fechar Browser

```
browser_close → liberar recursos
```

---

## Workflows Especializados

### Multi-Viewport (Captura Responsiva)

Captura a mesma página em 3 breakpoints para verificar responsividade:

```
Para cada página:
  1. browser_resize(1920, 1080) → screenshot {page}-desktop-full.png
  2. browser_resize(768, 1024)  → screenshot {page}-tablet-full.png
  3. browser_resize(375, 812)   → screenshot {page}-mobile-full.png
```

### Dark Mode

Se o site suporta, ativar via `prefers-color-scheme`:

```
1. browser_evaluate → window.matchMedia('(prefers-color-scheme: dark)').matches
   (verificar se já está dark)
2. browser_evaluate → document.documentElement.classList.add('dark')
   OU
   browser_evaluate → document.documentElement.style.colorScheme = 'dark'
3. screenshot {page}-desktop-dark.png
4. Reverter: document.documentElement.style.colorScheme = 'light'
```

### Comparação A/B (Antes/Depois)

Para comparar duas versões de um site (deploy anterior vs novo):

```
1. Capturar URL-A em desktop-full → {label-a}-desktop-full.png
2. Navegar para URL-B
3. Capturar em desktop-full → {label-b}-desktop-full.png
4. Reportar diferenças visuais observadas no snapshot
```

Usar timestamps para versões do mesmo site: `home-desktop-full-2026-04-13.png`

### Captura para Propostas Comerciais

Screenshots otimizados para embed em propostas PDF:

```
1. Capturar fullPage desktop (1920×1080) → para visão geral
2. Browser_snapshot → identificar seções-chave
3. Capturar viewport de cada seção → hero, features, pricing, footer
4. O hook optimize-screenshot gera versões -embed (800px) automaticamente
5. Usar arquivos *-embed.png no HTML da proposta
```

## Viewports de Referência

| Dispositivo | Largura | Altura | Uso |
|-------------|---------|--------|-----|
| Mobile (iPhone 14) | 390 | 844 | Padrão mobile |
| Mobile (SE) | 375 | 667 | Mobile compacto |
| Tablet (iPad) | 768 | 1024 | Padrão tablet |
| Laptop | 1366 | 768 | Notebooks |
| Desktop HD | 1920 | 1080 | Padrão desktop |
| Desktop 2K | 2560 | 1440 | Monitores grandes |

## Dicas

- **fullPage=true** captura a página inteira com scroll completo
- **browser_snapshot** antes de interagir — retorna refs clicáveis para `browser_click`
- **lazy-loading**: sempre faça scroll+espere antes de capturar fullPage:
  ```
  browser_evaluate → window.scrollTo(0, document.body.scrollHeight)
  ```
- **SPAs**: aguarde `networkidle` após navegação para conteúdo dinâmico
- **Screenshots de elemento**: use `ref` do snapshot para captura cirúrgica
- **Hook automático**: cada screenshot é otimizado automaticamente (retina 1600px + embed 800px, PNG compression level 9)
