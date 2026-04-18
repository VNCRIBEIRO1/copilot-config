---
name: business-proposal
description: "Generate professional business proposals (PDF + HTML) for tech services: websites, CRM, WhatsApp automation, chatbots, dashboards, APIs, e-commerce. Use when: creating proposals, generating quotes, making commercial offers, writing project scopes, pricing packages, client presentations, sales documents, orçamentos, propostas comerciais."
argument-hint: "Describe the client and what they need (e.g., 'CRM + WhatsApp automation for dental clinic')"
---

# Business Proposal Generator

Generate professional, branded proposals in Markdown + HTML + PDF for technology services.

## When to Use
- Client asks for a quote/proposal
- Need to scope a new project
- Creating a commercial offer for websites, CRM, automations, or AI
- Generating a PDF proposal to send via WhatsApp/email

## Identity
- **Name**: Vinícius Ribeiro
- **WhatsApp**: (18) 99631-1933
- **Brand**: Tech solutions specialist
- Update these in [config](./references/config.json) as needed

## Procedure

### Step 1: Gather Requirements
Interview the user (or extract from conversation) to fill this brief:
- **Client name** and business type
- **Pain points** — what problem are they trying to solve?
- **Services needed** — map to the [service catalog](./references/services.json)
- **Scale** — how many users, locations, volume?
- **Timeline** — urgency level
- **Budget range** — if mentioned

### Step 2: Select Package Tier
Based on requirements, recommend a tier from the service catalog:

| Tier | Target | Characteristics |
|------|--------|----------------|
| **Básico** | Micro/pequena empresa, MEI | Essential features, fast delivery, lower investment |
| **Profissional** | Média empresa, growing | Full features, integrations, training included |
| **Enterprise** | Grande empresa, multi-unit | Custom development, SLA, dedicated support, scaling |

If the project spans multiple services (e.g., site + CRM + WhatsApp), create a **combined package** with itemized pricing.

### Step 3: Generate Proposal Content
Create the proposal with these sections (all required):

1. **Capa** — Client name, project title, date, proposal number
2. **Sobre Nós** — Brief intro, expertise highlights, differentials
3. **Entendimento do Projeto** — Restate client's needs and goals in their language
4. **Escopo de Serviços** — Detailed deliverables list per service, with checkmarks
5. **Metodologia** — How the project will be executed (phases/sprints)
6. **Cronograma** — Timeline with milestones and delivery dates
7. **Investimento** — Pricing table with tier selected, payment conditions
8. **Diferenciais** — Why choose us (tech stack, support, guarantees)
9. **Próximos Passos** — Clear CTA with acceptance instructions
10. **Termos** — Validity (15 days), payment terms, IP transfer, warranty

### Step 4: Capture Client Site Screenshots (Optional — for proposals with visual evidence)
If the client already has a site (or competitor reference), use the `web-inspector` skill to:
1. Navigate to the client's current site
2. Capture fullPage desktop + mobile screenshots
3. Screenshots are auto-optimized by hooks (retina + embed versions)
4. Use `*-embed.png` files in the proposal HTML (800px wide, optimized)
5. Include a **"Situação Atual"** section in the proposal showing the current site with annotations

For before/after proposals (redesign), capture the current site and annotate issues.

### Step 5: Output Files
Generate three files in the output directory:

```
proposals/{client-slug}/
├── proposta-{client-slug}.md        # Complete proposal in Markdown
├── proposta-{client-slug}.html      # Styled HTML from template
├── proposta-{client-slug}.pdf       # PDF exported via Playwright
└── screenshots/                     # Client site captures (if applicable)
    ├── manifest.json
    └── *.png
```

1. Generate the `.md` file with full proposal content
2. Inject into the [HTML template](./assets/template.html)
3. If screenshots were captured, embed `*-embed.png` files in the HTML using `<img>` tags with `class="screenshot-embed"`
4. Run [PDF export script](./scripts/export-pdf.mjs) to generate the PDF

### Step 6: Review Checklist
Before delivering, verify:
- [ ] Client name spelled correctly throughout
- [ ] All services from brief are covered in scope
- [ ] Pricing is consistent (totals match line items)
- [ ] Timeline is realistic for the scope
- [ ] Contact info and WhatsApp number present
- [ ] PDF renders correctly (no broken layout)
- [ ] Proposal number is unique

## Pricing Guidelines
Reference the [service catalog](./references/services.json) for base pricing. Adjust based on:
- **Complexity multiplier**: Simple (1x), Medium (1.5x), Complex (2x), Enterprise (3x)
- **Urgency**: Standard timeline (1x), Fast track (1.3x), Rush (1.5x)
- **Bundle discount**: 2 services (-10%), 3+ services (-15%)

## Writing Style
- Professional but approachable (not corporate-stiff)
- Portuguese (pt-BR)
- Use "você" (not "vós" or "senhor")
- Highlight ROI and business impact, not just features
- Include specific numbers and metrics when possible
- Short paragraphs, bullet points, visual hierarchy

## Output Format
Always output the Markdown first for review, then generate HTML + PDF on confirmation.
