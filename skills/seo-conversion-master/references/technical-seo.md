# SEO Técnico — Referência Completa

## Core Web Vitals (2024+)

### Métricas e Limiares

| Métrica | Bom | Precisa Melhorar | Ruim |
|---------|-----|------------------|------|
| **LCP** (Largest Contentful Paint) | ≤2.5s | ≤4.0s | >4.0s |
| **INP** (Interaction to Next Paint) | ≤200ms | ≤500ms | >500ms |
| **CLS** (Cumulative Layout Shift) | ≤0.1 | ≤0.25 | >0.25 |

### Otimizações LCP
- Imagens hero: `<img>` com `fetchpriority="high"` e `loading="eager"`
- Preconnect para fontes: `<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>`
- Preload de imagem principal: `<link rel="preload" as="image" href="hero.webp">`
- Server-side rendering ou SSG para first paint
- CDN com edge caching (< 100ms TTFB)

### Otimizações INP
- Defer JavaScript não-crítico: `<script defer>`
- Code splitting — chunks < 50KB
- Debounce/throttle em event listeners
- `requestAnimationFrame` para updates visuais
- Web Workers para processamento pesado

### Otimizações CLS
- Dimensões explícitas em `<img>` e `<video>`: `width` e `height`
- `aspect-ratio` em CSS para containers de mídia
- Fontes: `font-display: swap` + preload do `.woff2`
- Anúncios/embeds: espaço reservado com min-height
- Animations: usar `transform` e `opacity` (não `width`/`height`/`top`/`left`)

## Meta Tags — Template Completo

```html
<head>
  <!-- Essenciais -->
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>[Title Tag — max 60 chars]</title>
  <meta name="description" content="[Meta description — 120-155 chars]">
  
  <!-- Canônica -->
  <link rel="canonical" href="https://[dominio]/[pagina]/">
  
  <!-- Robots -->
  <meta name="robots" content="index, follow, max-snippet:-1, max-image-preview:large, max-video-preview:-1">
  
  <!-- Open Graph (Facebook/LinkedIn) -->
  <meta property="og:type" content="website">
  <meta property="og:title" content="[Title — max 60 chars]">
  <meta property="og:description" content="[Description — max 200 chars]">
  <meta property="og:image" content="https://[dominio]/og-image.jpg">
  <meta property="og:image:width" content="1200">
  <meta property="og:image:height" content="630">
  <meta property="og:url" content="https://[dominio]/[pagina]/">
  <meta property="og:site_name" content="[Nome do Site]">
  <meta property="og:locale" content="pt_BR">
  
  <!-- Twitter Cards -->
  <meta name="twitter:card" content="summary_large_image">
  <meta name="twitter:title" content="[Title]">
  <meta name="twitter:description" content="[Description]">
  <meta name="twitter:image" content="https://[dominio]/og-image.jpg">
  
  <!-- Favicon -->
  <link rel="icon" href="/favicon.ico" sizes="32x32">
  <link rel="icon" href="/icon.svg" type="image/svg+xml">
  <link rel="apple-touch-icon" href="/apple-touch-icon.png">
  <link rel="manifest" href="/manifest.webmanifest">
  
  <!-- Preloads -->
  <link rel="preload" as="image" href="/hero.webp" fetchpriority="high">
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  
  <!-- JSON-LD Schema -->
  <script type="application/ld+json">
  {
    "@context": "https://schema.org",
    ...
  }
  </script>
</head>
```

## Sitemap.xml — Template

```xml
<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <url>
    <loc>https://[dominio]/</loc>
    <lastmod>2024-01-15</lastmod>
    <changefreq>weekly</changefreq>
    <priority>1.0</priority>
  </url>
  <url>
    <loc>https://[dominio]/servicos/</loc>
    <lastmod>2024-01-10</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.8</priority>
  </url>
  <url>
    <loc>https://[dominio]/sobre/</loc>
    <lastmod>2024-01-05</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.6</priority>
  </url>
  <url>
    <loc>https://[dominio]/blog/[artigo]/</loc>
    <lastmod>2024-01-15</lastmod>
    <changefreq>yearly</changefreq>
    <priority>0.5</priority>
  </url>
</urlset>
```

## Robots.txt — Template

```
User-agent: *
Allow: /

Sitemap: https://[dominio]/sitemap.xml

# Bloquear recursos desnecessários
Disallow: /api/
Disallow: /admin/
Disallow: /_next/data/
Disallow: /thank-you
```

## Canonical e Duplicação

### Regras
1. **Toda página deve ter canonical** — apontando para si mesma
2. **Trailing slash consistente** — escolher COM ou SEM e redirecionar
3. **HTTP → HTTPS** — redirect 301 permanente
4. **www → não-www** (ou vice-versa) — redirect 301
5. **Parâmetros de query** — canonical sem parâmetros
6. **Paginação** — `rel="canonical"` aponta para a 1ª página (ou self-referencing)
7. **hreflang** — se multilíngue, usar hreflang + canonical por idioma

### Redirects

| Situação | Redirect |
|----------|----------|
| Mudança de URL permanente | 301 (permanent) |
| Teste A/B temporário | 302 (temporary) |
| Domínio antigo → novo | 301 no nível do servidor |
| HTTP → HTTPS | 301 |
| Trailing slash | 301 |

## Imagens — Otimização

### Formatos
| Formato | Uso | Suporte |
|---------|-----|---------|
| **WebP** | Fotos, ilustrações | 97%+ browsers |
| **AVIF** | Fotos (melhor compressão) | 92%+ browsers |
| **SVG** | Ícones, logos, ilustrações simples | 100% |
| **PNG** | Transparência quando WebP não aceita | 100% |

### Checklist Imagens
- [ ] Nome descritivo: `dermatologista-tratamento-acne-campinas.webp`
- [ ] Alt text descritivo (5-15 palavras): "Dra. Maria realizando tratamento de acne em clínica em Campinas"
- [ ] Dimensões explícitas (width/height)
- [ ] Lazy loading: `loading="lazy"` (exceto hero)
- [ ] Compressão: qualidade 75-85% para fotos
- [ ] Responsive: `srcset` com 480w, 768w, 1200w
- [ ] Aspect ratio definido via CSS

```html
<img
  src="/images/hero.webp"
  srcset="/images/hero-480.webp 480w, /images/hero-768.webp 768w, /images/hero-1200.webp 1200w"
  sizes="(max-width: 768px) 100vw, 50vw"
  alt="[descrição contextual com keyword natural]"
  width="1200"
  height="630"
  loading="eager"
  fetchpriority="high"
  decoding="async"
>
```

## Velocidade — Checklist Técnico

### HTML/CSS
- [ ] Minificar HTML, CSS, JS
- [ ] Critical CSS inline no `<head>`
- [ ] Purge CSS não-usado (Tailwind: já faz automaticamente)
- [ ] Fontes: max 2 famílias, preload, `font-display: swap`

### JavaScript
- [ ] Defer scripts não-críticos
- [ ] Code splitting por rota
- [ ] Tree shaking ativo
- [ ] Chunks < 50KB (ideal)
- [ ] Remover polyfills desnecessários

### Servidor
- [ ] Gzip ou Brotli (preferir Brotli)
- [ ] Cache headers: `Cache-Control: public, max-age=31536000, immutable` para assets
- [ ] CDN (Vercel Edge, Cloudflare, etc.)
- [ ] TTFB < 200ms (ideal < 100ms)
- [ ] HTTP/2 ou HTTP/3

## URL Structure — Boas Práticas

### Regras
1. **Curta e descritiva**: `/dermatologista-campinas/` (não `/servicos/categoria/subcategoria/item/`)
2. **Keywords na URL**: sim, mas sem forçar
3. **Hifens** (não underscores): `/terapia-de-casal/`
4. **Minúsculas**: sempre
5. **Sem acentos**: `/advogado-previdenciario/` (não `/advogado-previdenciário/`)
6. **Trailing slash consistente**
7. **Profundidade máxima**: 3 níveis (`/area/subarea/pagina/`)

### Exemplos por Setor

| Setor | URL | Página |
|-------|-----|--------|
| Psicologia | `/terapia-ansiedade/` | Serviço |
| Psicologia | `/blog/como-lidar-com-ansiedade/` | Blog |
| Jurídico | `/inventario-extrajudicial/` | Serviço |
| Jurídico | `/blog/documentos-para-inventario/` | Blog |
| Médico | `/dermatologista/` | Serviço |
| Médico | `/blog/tratamento-acne-adulta/` | Blog |

## Internal Linking — Estratégia

### Princípios
1. **Âncora descritiva**: "terapia de casal" (não "clique aqui")
2. **Link contextual**: dentro do conteúdo, não em listas aleatórias
3. **Profundidade**: toda página acessível em ≤3 cliques da home
4. **Distribuição de link juice**: mais links internos → mais autoridade
5. **Hub pages**: página de serviço principal linka para sub-serviços

### Modelo Hub & Spoke
```
[Home] → [Áreas de Atuação] → [Direito de Família]
                                    ↓
                              [Divórcio] ← [Blog: Como funciona divórcio]
                              [Inventário] ← [Blog: Documentos para inventário]
                              [Guarda] ← [Blog: Tipos de guarda]
```

## Checklist SEO Técnico — Auditoria

### Crawlability
- [ ] Sitemap.xml atualizado e enviado no GSC
- [ ] Robots.txt não bloqueia páginas importantes
- [ ] Sem links quebrados (404)
- [ ] Redirects 301 funcionando
- [ ] Canonical correto em todas as páginas

### Indexability
- [ ] Páginas indexadas no Google (site:dominio.com)
- [ ] Sem `noindex` acidental
- [ ] Meta robots correto
- [ ] Conteúdo thin (<300 palavras) identificado e expandido

### Performance
- [ ] Core Web Vitals verdes (LCP, INP, CLS)
- [ ] PageSpeed Insights > 90 (mobile)
- [ ] TTFB < 200ms
- [ ] Imagens otimizadas (WebP/AVIF)

### Mobile
- [ ] Mobile-friendly (Lighthouse 100%)
- [ ] Tap targets ≥ 48px
- [ ] Font size ≥ 16px base
- [ ] Viewport meta tag presente
- [ ] Conteúdo não corta em mobile

### Segurança
- [ ] HTTPS ativo
- [ ] Certificate válido
- [ ] Mixed content resolvido
- [ ] Headers de segurança (HSTS, X-Frame-Options)
