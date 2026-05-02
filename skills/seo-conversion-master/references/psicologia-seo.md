# SEO para Psicologia — Referência Completa

## Contexto YMYL

Psicologia é classificado pelo Google como **YMYL (Your Money, Your Life)** — conteúdo que afeta saúde mental e bem-estar. O algoritmo exige:

- **CRP visível** em toda página (rodapé, about, schema)
- **Abordagem ética** — nunca prometer cura, usar "pode ajudar", "costuma contribuir"
- **Referências científicas** quando citar técnicas ou resultados
- **Resolução CFP 11/2018** — publicidade do psicólogo obedece ao Código de Ética

## Keywords de Alta Conversão — Psicologia

### Por Especialidade (Intenção Transacional)

| Cluster | Keywords Primárias | Keywords Long-tail |
|---------|--------------------|--------------------|
| Ansiedade | psicólogo ansiedade [cidade] | tratamento ansiedade psicólogo, terapia para ansiedade perto de mim |
| Depressão | psicólogo depressão [cidade] | terapia para depressão online, psicólogo especialista depressão |
| Casal | terapia de casal [cidade] | terapia de casal preço, terapeuta de casal perto de mim |
| Infantil | psicólogo infantil [cidade] | psicóloga infantil comportamental, terapia para crianças |
| TCC | terapia cognitivo comportamental [cidade] | psicólogo TCC ansiedade, TCC para TOC |
| Online | psicólogo online | terapia online preço, consulta psicólogo online |
| TDAH | psicólogo TDAH [cidade] | avaliação neuropsicológica TDAH, laudo TDAH psicólogo |
| Luto | terapia para luto | psicólogo para luto [cidade], como lidar com perda |
| Autoestima | terapia autoestima | psicólogo autoestima baixa, como melhorar autoestima |
| Burnout | psicólogo burnout | tratamento burnout, síndrome de burnout terapia |

### Por Intenção de Busca

| Intenção | Keywords | Tipo de Página |
|----------|----------|----------------|
| Transacional | "agendar psicólogo", "marcar consulta psicólogo" | Página de agendamento |
| Comercial | "melhor psicólogo [cidade]", "psicólogo recomendado" | Landing page com provas sociais |
| Informacional | "o que é TCC", "como funciona terapia" | Blog post + CTA interno |
| Navegacional | "[nome do psicólogo]" | Home/About otimizada |

## Schema JSON-LD — Psicólogo

```json
{
  "@context": "https://schema.org",
  "@type": "Psychologist",
  "name": "[Nome Completo]",
  "description": "[Descrição 150-200 chars focada em especialidade]",
  "url": "[URL do site]",
  "telephone": "[telefone com DDD]",
  "image": "[URL foto profissional]",
  "priceRange": "$$",
  "address": {
    "@type": "PostalAddress",
    "streetAddress": "[rua e número]",
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
      "dayOfWeek": ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"],
      "opens": "08:00",
      "closes": "18:00"
    }
  ],
  "hasCredential": {
    "@type": "EducationalOccupationalCredential",
    "credentialCategory": "Professional License",
    "recognizedBy": {
      "@type": "Organization",
      "name": "Conselho Regional de Psicologia"
    },
    "identifier": "CRP [XX/XXXXX]"
  },
  "alumniOf": {
    "@type": "EducationalOrganization",
    "name": "[Universidade]"
  },
  "knowsAbout": ["Terapia Cognitivo-Comportamental", "Ansiedade", "Depressão"],
  "availableService": [
    {
      "@type": "MedicalTherapy",
      "name": "Psicoterapia Individual",
      "description": "[descrição]"
    },
    {
      "@type": "MedicalTherapy",
      "name": "Terapia de Casal",
      "description": "[descrição]"
    }
  ],
  "sameAs": [
    "[LinkedIn]",
    "[Instagram]"
  ]
}
```

## Copy Persuasivo — Padrões Psicologia

### Title Tags (comprovados alta CTR)

| Modelo | Exemplo | CTR esperado |
|--------|---------|--------------|
| [Especialidade] em [Cidade] — [Nome] Psicóloga | Terapia de Casal em Campinas — Dra. Maria Silva Psicóloga | 4-6% |
| Psicólogo [Especialidade] [Cidade] · Agende Sua Sessão | Psicólogo Ansiedade São Paulo · Agende Sua Sessão | 5-7% |
| [Problema] — [Solução] com [Nome] CRP [X] | Ansiedade — Tratamento com Psicóloga Ana CRP 06/12345 | 4-5% |

### Meta Descriptions (comprovadas)

| Modelo | Exemplo |
|--------|---------|
| [Problema]? [Solução]. [Credencial]. [CTA]. | Sofre com ansiedade? Terapia especializada com abordagem TCC. Psicóloga CRP 06/12345. Agende sua primeira sessão. |
| [Benefício] com [Nome], [especialidade] em [cidade]. [Diferencial]. [CTA]. | Supere a depressão com Dra. Ana, psicóloga em SP. +10 anos de experiência em TCC. Primeira sessão com desconto. |

### Estrutura H ideal — Página de Serviço

```
H1: Psicólogo Especialista em Ansiedade em [Cidade]
  H2: Como a Terapia Pode Ajudar com a Ansiedade
    H3: O Que É a Terapia Cognitivo-Comportamental (TCC)
    H3: Quanto Tempo Dura o Tratamento
  H2: Para Quem É Indicada a Psicoterapia
    H3: Sinais de Que Você Pode Precisar de Ajuda
    H3: A Terapia Online Funciona?
  H2: Sobre [Nome do Psicólogo]
    H3: Formação e Credenciais
    H3: Abordagem Terapêutica
  H2: Perguntas Frequentes
  H2: Agende Sua Sessão
```

### FAQ Schema — Psicologia (alta conversão)

Perguntas comprovadas que geram cliques:

1. "Quanto custa uma sessão de terapia?" — Converter via transparência
2. "Quanto tempo leva para a terapia fazer efeito?" — Gerir expectativas = confiança
3. "Psicólogo online funciona mesmo?" — Converter hesitantes
4. "Qual a diferença entre psicólogo e psiquiatra?" — Capturar topo de funil
5. "Como funciona a primeira sessão?" — Reduzir ansiedade de agendamento
6. "Terapia é sigilo absoluto?" — Gerar confiança (Trust do E-E-A-T)
7. "O convênio cobre psicólogo?" — Capturar buscas comerciais

## Gatilhos Mentais para Conversão — Psicologia

| Gatilho | Aplicação | Exemplo |
|---------|-----------|---------|
| **Empatia** | Primeiro parágrafo | "Sei que dar o primeiro passo pode parecer difícil..." |
| **Segurança** | Logo após empatia | "Sessões 100% sigilosas, conforme Código de Ética do CFP" |
| **Autoridade** | Credenciais visíveis | "CRP XX/XXXXX · Especialista em TCC · +X anos" |
| **Prova social** | Depoimentos anônimos | "Após 3 meses, sinto que voltei a ter controle..." |
| **Escassez** | Agendamento | "Horários limitados esta semana" |
| **Facilidade** | CTA | "Agende em 30 segundos pelo WhatsApp" |

## Compliance — Publicidade do Psicólogo

### Permitido (Resolução CFP 11/2018):
- ✅ Informar qualificação, título, CRP
- ✅ Divulgar áreas de atuação
- ✅ Usar testemunhos com consentimento e sem identificação
- ✅ Oferecer informação gratuita sobre saúde mental
- ✅ Divulgar valores e formas de pagamento

### Proibido:
- ❌ Prometer resultados ("garantia de cura")
- ❌ Usar título de "Dr." sem doutorado
- ❌ Fazer diagnóstico via conteúdo
- ❌ Sensacionalismo ou autopromação exagerada
- ❌ Expor pacientes (mesmo com consentimento do nome)
- ❌ Usar vocabulário que induza tratamento urgente desnecessário

## GEO / AI Search — Psicologia

### Onde Psicólogos São Citados por AI

| Plataforma AI | O que cita |
|---------------|------------|
| Google AI Overviews | GBP, Doctoralia, Psicologia Viva, conteúdo do site |
| ChatGPT | Doctoralia, Zenklub, artigos autoritativos |
| Perplexity | Reviews, artigos, diretórios |

### Ações GEO Específicas para Psicologia

1. **Perfil completo na Doctoralia e Psicologia Viva** — LLMs citam estas plataformas
2. **Publicar artigos em portais de saúde mental** — menções sem link contam para AI
3. **Responder perguntas no Doctoralia** — alimenta base de conhecimento dos LLMs
4. **Conteúdo com citações científicas** — "Segundo estudo publicado no Journal of Anxiety Disorders..."
5. **Schema Psychologist no HTML estático (SSR)** — AI crawlers não executam JavaScript
6. **YouTube com vídeos curtos** de psicoeducação — alta exposição em Generative Engines
7. **Aparecer em listas "melhores psicólogos de [cidade]"** — fator #1 de AI visibility

### Template de Conteúdo para AI Visibility

```markdown
## [Pergunta que paciente faria ao ChatGPT]

[Resposta direta em 1-2 frases]

Segundo [fonte científica/CFP], [dado verificável].

"[Citação de especialista]" — [Nome], CRP XX/XXXXX
```

## Métricas de Sucesso

| Métrica | Benchmark Psicologia |
|---------|---------------------|
| Taxa de conversão (visita → agendamento) | 3-8% |
| CTR orgânico | 4-7% |
| Tempo na página | >2min30s |
| Bounce rate páginas de serviço | <45% |
| Posição média (keywords locais) | Top 3 |
| Reviews Google (mínimo) | 15+ com 4.5★ |
