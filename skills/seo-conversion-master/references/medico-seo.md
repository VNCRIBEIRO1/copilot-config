# SEO para Clínicas e Profissionais Médicos — Referência Completa

## Contexto YMYL

Medicina é o setor **YMYL mais rigoroso** do Google. O algoritmo exige:

- **CRM/CRO visível** em toda página
- **Resolução CFM 2.336/2023** — nova regulação de publicidade médica
- **E-E-A-T nível máximo** — credencial obrigatória, fonte científica para claims
- **Revisão médica declarada** — "Conteúdo revisado por Dr. [Nome] CRM [X]"

## Keywords de Alta Conversão — Médico

### Por Especialidade (Intenção Transacional)

| Cluster | Keywords Primárias | Keywords Long-tail |
|---------|--------------------|--------------------|
| Clínico Geral | médico clínico geral [cidade] | consulta clínico geral particular, clínico geral perto de mim |
| Dermatologia | dermatologista [cidade] | dermatologista acne adulta, tratamento melasma [cidade] |
| Ortopedia | ortopedista [cidade] | ortopedista joelho [cidade], cirurgia coluna [cidade] |
| Ginecologia | ginecologista [cidade] | ginecologista particular [cidade], exame preventivo [cidade] |
| Cardiologia | cardiologista [cidade] | check-up cardiológico, eletrocardiograma [cidade] |
| Pediatria | pediatra [cidade] | pediatra neonatal, pediatra particular perto de mim |
| Psiquiatria | psiquiatra [cidade] | psiquiatra ansiedade [cidade], medicação antidepressivo |
| Oftalmologia | oftalmologista [cidade] | cirurgia miopia [cidade], exame de vista [cidade] |
| Odontologia | dentista [cidade] | implante dentário preço, clareamento dental [cidade] |
| Nutrição | nutricionista [cidade] | nutricionista esportivo, dieta para emagrecer [cidade] |
| Cirurgia Plástica | cirurgião plástico [cidade] | rinoplastia preço [cidade], abdominoplastia [cidade] |
| Urologia | urologista [cidade] | urologista particular [cidade], exame próstata [cidade] |

### Keywords de Procedimentos (Ultra Alta Conversão)

| Keyword Pattern | Conversão | Observação |
|-----------------|-----------|------------|
| "[procedimento] preço [cidade]" | Altíssima | Paciente decidido, buscando onde fazer |
| "[exame] perto de mim" | Altíssima | Urgência/conveniência |
| "[especialidade] que aceita [convênio]" | Alta | Plano de saúde é decisor |
| "agendar [consulta/exame] [cidade]" | Altíssima | Pronto para converter |
| "[sintoma] — qual médico procurar" | Média | Topo de funil, capturar com blog |

## Schema JSON-LD — Médico/Clínica

### Para Médico Individual

```json
{
  "@context": "https://schema.org",
  "@type": "Physician",
  "name": "Dr. [Nome]",
  "description": "[especialidade] em [cidade]. CRM/[UF] [número].",
  "url": "[URL]",
  "telephone": "[tel]",
  "image": "[foto profissional]",
  "medicalSpecialty": "[MedicalSpecialty — ex: Dermatology]",
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
  "hasCredential": {
    "@type": "EducationalOccupationalCredential",
    "credentialCategory": "Professional License",
    "recognizedBy": {
      "@type": "Organization",
      "name": "Conselho Regional de Medicina"
    },
    "identifier": "CRM/[UF] [número]"
  },
  "alumniOf": [
    { "@type": "EducationalOrganization", "name": "[Residência]" },
    { "@type": "EducationalOrganization", "name": "[Faculdade]" }
  ],
  "availableService": [
    {
      "@type": "MedicalProcedure",
      "name": "[procedimento]",
      "procedureType": "http://schema.org/NoninvasiveProcedure"
    }
  ],
  "isAcceptingNewPatients": true,
  "insuranceAccepted": ["[convênio 1]", "[convênio 2]"],
  "sameAs": ["[LinkedIn]", "[Doctoralia]"]
}
```

### Para Clínica

```json
{
  "@context": "https://schema.org",
  "@type": "MedicalClinic",
  "name": "[Nome da Clínica]",
  "description": "[descrição com especialidades e cidade]",
  "url": "[URL]",
  "telephone": "[tel]",
  "medicalSpecialty": ["Dermatology", "Cardiology"],
  "address": { ... },
  "geo": { ... },
  "openingHoursSpecification": [ ... ],
  "employee": [
    {
      "@type": "Physician",
      "name": "Dr. [Nome]",
      "medicalSpecialty": "[especialidade]"
    }
  ],
  "availableService": [ ... ],
  "isAcceptingNewPatients": true
}
```

## Copy Persuasivo — Padrões Médico

### Title Tags (alta CTR)

| Modelo | Exemplo |
|--------|---------|
| [Especialidade] em [Cidade] — Dr. [Nome] CRM [X] | Dermatologista em Campinas — Dra. Maria CRM/SP 123456 |
| [Procedimento] [Cidade] · Agende com Dr. [Nome] | Rinoplastia São Paulo · Agende com Dr. Silva |
| [Especialidade] [Cidade] — Clínica [Nome] | Cardiologista Ribeirão Preto — Clínica CardioVida |

### Estrutura H ideal — Página Médica

```
H1: [Especialidade / Procedimento] em [Cidade]
  H2: O Que É [Procedimento / Condição]
    H3: Indicações
    H3: Como Funciona o Tratamento
  H2: Benefícios do [Tratamento/Consulta]
    H3: Resultados Esperados
    H3: Tempo de Recuperação
  H2: Sobre o Dr. [Nome]
    H3: Formação e Residência
    H3: Convênios Aceitos
  H2: Perguntas Frequentes
  H2: Agende Sua Consulta
```

### FAQ Schema — Médico (perguntas que convertem)

1. "O [procedimento] dói?" — Reduzir medo, converter hesitantes
2. "Quanto custa [consulta/procedimento]?" — Transparência = confiança
3. "O convênio [nome] cobre [procedimento]?" — Capturar busca comercial
4. "Quanto tempo leva a recuperação?" — Gerir expectativas
5. "Quais exames preciso para a consulta?" — Facilitador de agendamento
6. "A clínica aceita atendimento particular?" — Capturar urgentes
7. "É necessário encaminhamento?" — Remover barreira

## Gatilhos Mentais para Conversão — Médico

| Gatilho | Aplicação | Exemplo |
|---------|-----------|---------|
| **Credencial** | Primeiro visível | "Dr. [Nome] · CRM/SP [X] · Residência em [Hospital de referência]" |
| **Tecnologia** | Diferencial | "Equipamento de última geração para diagnóstico preciso" |
| **Conforto** | Reduzir medo | "Ambiente acolhedor, atendimento humanizado" |
| **Conveniência** | CTA | "Agende pelo WhatsApp em segundos" |
| **Convênios** | Lista visível | "Aceitamos: Unimed, Amil, Bradesco Saúde, SulAmérica" |
| **Urgência legítima** | Checkup | "Prevenção é o melhor tratamento — agende seu check-up" |

## Compliance — Publicidade Médica

### Resolução CFM 2.336/2023 (Nova) — Permitido:
- ✅ Divulgar qualificação (CRM, RQE, título de especialista)
- ✅ Informar procedimentos que realiza
- ✅ Usar redes sociais para educação em saúde
- ✅ Antes/depois com consentimento formal (NOVIDADE 2023)
- ✅ Divulgar preços de consultas/procedimentos (NOVIDADE 2023)
- ✅ Depoimentos com consentimento

### Proibido:
- ❌ Garantir resultado
- ❌ Desqualificar outros profissionais
- ❌ Usar imagens de antes/depois editadas ou enganosas
- ❌ Selfies durante procedimentos
- ❌ Promover tratamento não reconhecido pelo CFM
- ❌ Usar termos superlativos ("o melhor", "o único")
- ❌ Exercer captação indevida de pacientes
- ❌ Divulgar equipamento como garantia de resultado

### Obrigatório em toda publicidade:
- Nome do médico e CRM
- RQE (se especialista)
- "Agende sua consulta" (não "agende sua cirurgia")

## GEO / AI Search — Médico

### Onde Médicos São Citados por AI

| Plataforma AI | O que cita |
|---------------|------------|
| Google AI Overviews | GBP, Doctoralia, BoaConsulta, site da clínica |
| ChatGPT | Doctoralia, artigos médicos, Wikipedia, portais de saúde |
| Perplexity | Reviews, artigos científicos, diretórios |

### Ações GEO Específicas para Médico

1. **Perfil completo na Doctoralia e BoaConsulta** — plataformas mais citadas por LLMs
2. **Publicar conteúdo com referências PubMed/Scielo** — 30-40% mais visibilidade AI
3. **Responder perguntas no Doctoralia** — alimenta base das Generative Engines
4. **"Revisado por Dr. [Nome] CRM XX"** em todo conteúdo — E-E-A-T explícito
5. **Schema Physician/MedicalClinic no HTML estático (SSR)** — obrigatório para AI crawlers
6. **YouTube com vídeos educativos** médicos — altíssima exposição em AI search
7. **Aparecer em listas "melhores [especialidade] de [cidade]"** — fator #1 AI visibility
8. **Bing Places completo** — Microsoft/ChatGPT usam dados Bing

### Template de Conteúdo para AI Visibility

```markdown
## [Pergunta que paciente faria ao ChatGPT]

[Resposta direta, factual, 1-2 frases]

Segundo estudo publicado em [revista científica], [dado verificável].

*Conteúdo revisado por Dr. [Nome], CRM/UF XXXXX — [Especialidade]*
```

## Métricas de Sucesso

| Métrica | Benchmark Médico |
|---------|-----------------|
| Taxa de conversão (visita → agendamento) | 3-10% |
| CTR orgânico | 4-8% |
| Tempo na página | >2min |
| Bounce rate | <40% |
| Posição média (keywords locais) | Top 3 |
| Reviews Google (mínimo) | 20+ com 4.7★ |
| Custo por lead (referência) | R$30-150 |
