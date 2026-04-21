# SKILL: lucas-mangolin-content

## Purpose
Legal content writing for Lucas Mangolin Alves — OAB/SP 422.779. Articles, glossary terms, FAQ entries, and newsletter content compliant with OAB Provimento 205/2021.

## Lawyer Profile
- **Name**: Lucas Mangolin Alves
- **OAB**: OAB/SP 422.779
- **Location**: Presidente Epitácio/SP — Av. Presidente Vargas, 1-58, Sala 2, Centro
- **Email**: lucas_mangolin@adv.oabsp.org.br
- **WhatsApp**: (18) 99826-2707
- **Practice areas**: Proteção patrimonial, família e sucessões, inventário, regularização de imóveis, direito societário, trabalhista empresarial
- **Education**: Toledo Prudente (2014–2018), IBET Direito Tributário (2019–2022)
- **Practice since**: 2019
- **Publications**: 6+ artigos, 7 apresentações acadêmicas, coautor "Direitos Humanos e Sociedade" (Grupo Multifoco, 2019)
- **Voice**: 1ª pessoa ("Atuo em...", "Ofereço...") — professional, accessible, preventive focus

## OAB Provimento 205/2021 Compliance Rules
### ✅ ALLOWED
- Educational articles about legal topics
- FAQ with general legal explanations
- Glossary of legal terms
- Curriculum / academic achievements
- Chatbot for triage / routing (not legal advice)
- Newsletter with educational content
- Passive contact form
- Area descriptions (neutral, factual)
- Quoting legal texts

### ❌ PROHIBITED
- Client testimonials or case outcomes
- "Best lawyer", "most experienced", comparative claims
- Explicit fee disclosure in marketing materials
- Result promises ("você receberá X", "garantimos Y")
- Mercantile lead-generation language
- Sensationalist or fear-based headlines

## Content Templates

### Article (Articles.tsx format)
```
title: "Título SEO — máx 60 chars",
preview: "Resumo de 1-2 frases com palavra-chave geolocalizada.",
body: [
  "<p>Parágrafo introdutório com contexto legal.</p>",
  "<p>Desenvolvimento — cite legislação (art. X da Lei Y).</p>",
  "<p>Orientação prática e preventiva.</p>",
  "<p><em>Este artigo tem caráter informativo...</em></p>",
]
```

### Glossary Term (Glossary.tsx format)
```
term: "Nome do Instituto",
definition: "Definição em linguagem acessível. Cite base legal quando relevante. Máx 3 frases."
```

### FAQ Entry (FAQ.tsx format)
```
question: "Pergunta frequente do cliente?",
answer: "Resposta objetiva em linguagem simples. Evite jargão. Indique buscar orientação específica ao final."
```

### Newsletter Issue
- **Subject**: Informativo Jurídico — [Tema] | Lucas Mangolin Advocacia
- **Format**: Intro curta (2 frases), 1 tema educativo (3 parágrafos), 1 dica preventiva, rodapé OAB

## Key Files to Edit
- `src/components/Articles.tsx` — array `articles[]`
- `src/components/Glossary.tsx` — array `terms[]`
- `src/components/FAQ.tsx` — array `faqs[]`
- `src/components/NewsletterBanner.tsx` — newsletter opt-in text

## SEO Keywords to Weave In
- "advogado presidente epitácio", "holding familiar SP"
- "inventário extrajudicial", "regularização de imóveis SP"
- "proteção patrimonial interior SP", "planejamento sucessório"
- "direito de família presidente epitácio", "usucapião SP"
