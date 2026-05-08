# SEO para Escritórios de Advocacia — Referência Completa

## Contexto YMYL

Direito é **YMYL** — conteúdo que impacta direitos, finanças e liberdade. Google exige:

- **OAB visível** em toda página (rodapé, about, schema)
- **Provimento 205/2021 OAB** — regula publicidade de advogados
- **Código de Ética OAB (Lei 8.906/94)** — Art. 28 a 34
- **E-E-A-T máximo** — credenciais, publicações, formação acadêmica

## Keywords de Alta Conversão — Jurídico

### Por Área de Atuação (Intenção Transacional)

| Cluster | Keywords Primárias | Keywords Long-tail |
|---------|--------------------|--------------------|
| Família | advogado família [cidade] | advogado divórcio [cidade], pensão alimentícia advogado |
| Inventário | advogado inventário [cidade] | inventário extrajudicial preço, quanto custa inventário |
| Trabalhista | advogado trabalhista [cidade] | advogado rescisão indireta, reclamação trabalhista advogado |
| Imobiliário | advogado imobiliário [cidade] | usucapião advogado [cidade], regularização de imóvel |
| Tributário | advogado tributário [cidade] | planejamento tributário empresa, recuperação de tributos |
| Empresarial | advogado empresarial [cidade] | abertura de holding familiar, acordo de sócios advogado |
| Criminal | advogado criminal [cidade] | advogado habeas corpus, advogado crime [tipo] |
| Previdenciário | advogado INSS [cidade] | aposentadoria negada advogado, revisão aposentadoria |
| Patrimonial | proteção patrimonial [cidade] | blindagem patrimonial advogado, holding familiar |
| Consumidor | advogado consumidor [cidade] | reclamação produto defeituoso, indenização consumidor |

### Keywords com Maior Intenção de Contratação

| Keyword Pattern | Volume Relativo | Conversão |
|-----------------|-----------------|-----------|
| "advogado para [processo específico]" | Médio | Altíssima |
| "quanto custa [tipo de processo]" | Alto | Alta |
| "preciso de advogado para [situação]" | Médio | Altíssima |
| "advogado [especialidade] perto de mim" | Alto | Altíssima |
| "escritório de advocacia [cidade]" | Médio | Alta |
| "consulta advogado online" | Alto | Média-Alta |

## Schema JSON-LD — Escritório de Advocacia

```json
{
  "@context": "https://schema.org",
  "@type": "LegalService",
  "name": "[Nome do Escritório]",
  "description": "[Descrição 150-200 chars com especialidades e cidade]",
  "url": "[URL]",
  "telephone": "[telefone]",
  "image": "[logo ou fachada]",
  "priceRange": "$$",
  "address": {
    "@type": "PostalAddress",
    "streetAddress": "[endereço]",
    "addressLocality": "[cidade]",
    "addressRegion": "[UF]",
    "postalCode": "[CEP]",
    "addressCountry": "BR"
  },
  "geo": {
    "@type": "GeoCoordinates",
    "latitude": "[lat]",
    "longitude": "[lng]"
  },
  "openingHoursSpecification": [
    {
      "@type": "OpeningHoursSpecification",
      "dayOfWeek": ["Monday","Tuesday","Wednesday","Thursday","Friday"],
      "opens": "08:00",
      "closes": "18:00"
    }
  ],
  "founder": {
    "@type": "Person",
    "name": "[Nome do Advogado]",
    "jobTitle": "Advogado",
    "hasCredential": {
      "@type": "EducationalOccupationalCredential",
      "credentialCategory": "Professional License",
      "recognizedBy": {
        "@type": "Organization",
        "name": "Ordem dos Advogados do Brasil"
      },
      "identifier": "OAB/[UF] [número]"
    },
    "alumniOf": {
      "@type": "EducationalOrganization",
      "name": "[Universidade]"
    },
    "knowsAbout": ["Direito de Família", "Inventário", "Proteção Patrimonial"]
  },
  "hasOfferCatalog": {
    "@type": "OfferCatalog",
    "name": "Serviços Jurídicos",
    "itemListElement": [
      {
        "@type": "Offer",
        "itemOffered": {
          "@type": "Service",
          "name": "Consultoria em Proteção Patrimonial",
          "description": "[descrição]"
        }
      }
    ]
  },
  "sameAs": ["[LinkedIn]", "[Instagram]"]
}
```

### Schema para Advogado Individual (Person)

```json
{
  "@context": "https://schema.org",
  "@type": "Attorney",
  "name": "[Nome]",
  "jobTitle": "Advogado",
  "description": "[especialidade + cidade]",
  "url": "[URL]",
  "telephone": "[tel]",
  "address": { ... },
  "hasCredential": {
    "@type": "EducationalOccupationalCredential",
    "credentialCategory": "Professional License",
    "identifier": "OAB/SP [número]"
  },
  "alumniOf": [
    { "@type": "EducationalOrganization", "name": "[Graduação]" },
    { "@type": "EducationalOrganization", "name": "[Pós-graduação]" }
  ],
  "award": ["[prêmios]"],
  "author": {
    "@type": "Book",
    "name": "[livro publicado]",
    "datePublished": "[ano]"
  }
}
```

## Copy Persuasivo — Padrões Jurídico

### Title Tags (alta CTR)

| Modelo | Exemplo |
|--------|---------|
| Advogado [Especialidade] [Cidade] — [Nome] OAB/[UF] | Advogado Família Presidente Epitácio — Lucas Mangolin OAB/SP |
| [Serviço] em [Cidade] · [Nome] Advocacia | Inventário Extrajudicial em São Paulo · Silva Advocacia |
| [Problema] — Advogado Especialista [Cidade] | Divórcio — Advogado Especialista em Campinas |

### Meta Descriptions (comprovadas)

| Modelo |
|--------|
| [Problema]? [Solução jurídica específica]. Advogado com [credencial]. Atendimento em [cidade]. [CTA: Consulte agora]. |
| Especialista em [área] com [X] anos de experiência. [Diferencial: OAB/UF, pós-graduação, publicações]. Consulta presencial e online. |

### Estrutura H ideal — Página de Área Jurídica

```
H1: Advogado Especialista em [Área] em [Cidade]
  H2: Como Podemos Ajudar com [Situação Específica]
    H3: [Serviço 1 — ex: Inventário Extrajudicial]
    H3: [Serviço 2 — ex: Inventário Judicial]
  H2: Quando Procurar um Advogado de [Área]
    H3: Situações Mais Comuns
    H3: Documentos Necessários
  H2: Por Que Escolher o Escritório [Nome]
    H3: Formação e Especialização
    H3: Atendimento Personalizado
  H2: Perguntas Frequentes sobre [Área]
  H2: Fale com um Advogado Agora
```

### FAQ Schema — Jurídico (perguntas que convertem)

1. "Quanto custa um advogado para [tipo de processo]?" — Transparência gera confiança
2. "Quanto tempo demora um [processo específico]?" — Calibrar expectativas
3. "Quais documentos preciso para [processo]?" — Capturar quem já decidiu agir
4. "Posso resolver [situação] sem ir ao tribunal?" — Converter com solução extrajudicial
5. "O que acontece se eu não [ação jurídica]?" — Urgência legítima
6. "Preciso de advogado para [situação]?" — Topo do funil transacional
7. "Como funciona a primeira consulta?" — Reduzir barreira de conversão

## Gatilhos Mentais para Conversão — Jurídico

| Gatilho | Aplicação | Exemplo |
|---------|-----------|---------|
| **Urgência legítima** | Prazos processuais | "Prazos judiciais são improrrogáveis — não deixe prescrever" |
| **Autoridade** | Credenciais | "OAB/SP · Pós em Direito Tributário pelo IBET · Autor publicado" |
| **Consequência** | Risco de não agir | "Sem inventário, bens ficam indisponíveis e conflitos familiares aumentam" |
| **Facilidade** | Primeiro passo | "Atendimento inicial sem compromisso — entenda seus direitos" |
| **Prova social** | Resultados | "Mais de X processos conduzidos com sucesso na região" |
| **Especificidade** | Nicho | "Atuação exclusiva em proteção patrimonial e direito de família" |

## Compliance — Publicidade do Advogado

### Provimento 205/2021 OAB — Permitido:
- ✅ Divulgar áreas de atuação e especialidades
- ✅ Publicar artigos, dar entrevistas, produzir conteúdo educativo
- ✅ Usar redes sociais para divulgação informativa
- ✅ Informar nome, OAB, endereço, telefone
- ✅ Divulgar eventos, cursos, publicações
- ✅ Marketing digital (Google Ads, SEO, redes sociais)
- ✅ Depoimentos de clientes com consentimento

### Proibido (Art. 28-34 EAOAB + Provimento):
- ❌ Prometer resultado ("ganhamos todas as causas")
- ❌ Captar clientes diretamente (ambulance chasing)
- ❌ Mercantilizar a advocacia (preços chamativos, promoções)
- ❌ Usar termos como "grátis", "sem custo", "desconto" na 1ª consulta
- ❌ Revelar detalhes de causas (sigilo profissional)
- ❌ Comparar-se depreciativamente com outros advogados
- ❌ Divulgar valores de sentenças/acordos
- ❌ Usar linguagem sensacionalista

### Zona Cinza (usar com cautela):
- ⚠️ "Primeira consulta" — permitido informar que existe, evitar "grátis"
- ⚠️ "Resultado" — pode citar experiência, evitar "garantia"
- ⚠️ Depoimentos — genéricos, sem identificar caso

## GEO / AI Search — Jurídico

### Onde Advogados São Citados por AI

| Plataforma AI | O que cita |
|---------------|------------|
| Google AI Overviews | GBP, JusBrasil, site do escritório |
| ChatGPT | JusBrasil, Migalhas, Conjur, Wikipedia |
| Perplexity | Artigos jurídicos, reviews, diretórios |

### Ações GEO Específicas para Jurídico

1. **Publicar artigos no JusBrasil** — plataforma jurídica #1 citada por LLMs no Brasil
2. **Contribuir com Migalhas e Conjur** — menções elevam autoridade em AI
3. **Responder perguntas no JusBrasil** — alimenta respostas de ChatGPT/Gemini sobre direito BR
4. **Conteúdo com citações de jurisprudência** — "Conforme STJ, REsp nº XXXX..."
5. **Artigos de opinião em jornais regionais** — menções não-estruturadas = novo backlink
6. **Schema LegalService/Attorney no HTML estático** — AI crawlers não executam JS
7. **Aparecer em listas "melhores advogados de [cidade]"** ou rankings como Análise Advocacia

### Template de Conteúdo para AI Visibility

```markdown
## [Pergunta jurídica que cliente faria ao ChatGPT]

[Resposta direta, factual, 1-2 frases]

De acordo com o [Código Civil/CLT/CF], Art. [X]: [citação legal].

"[Opinião especializada]" — [Nome], OAB/UF XXXXX
```

## Métricas de Sucesso

| Métrica | Benchmark Jurídico |
|---------|-------------------|
| Taxa de conversão (visita → contato) | 2-6% |
| CTR orgânico | 3-6% |
| Tempo na página (serviço) | >2min |
| Bounce rate páginas de serviço | <50% |
| Posição média (keywords locais) | Top 5 |
| Reviews Google (mínimo) | 10+ com 4.5★ |
| Custo por lead (referência Google Ads) | R$50-200 |
