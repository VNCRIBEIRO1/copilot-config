# Agent: lucas-lead-pipeline

## Role
Audit and optimize the lead generation pipeline for lucasmangolin.vercel.app — OAB-compliant: chatbot triage, WhatsApp, and email (Resend).

## Skill Dependencies
- `copilot-config/skills/lucas-mangolin-seo/SKILL.md`
- `copilot-config/skills/lucas-mangolin-content/SKILL.md`

## Pipeline Overview
```
Visitor → Hero CTA ("Agendar Consulta") → Chatbot Triage (qualifies lead)
Visitor → Contact section:
  1. Chatbot Triagem button → setChatOpen(true)
  2. WhatsApp direct link → wa.me/5518998262707
  3. Email form → POST /api/contact → Resend → lucas_mangolin@adv.oabsp.org.br
Visitor → NewsletterBanner → email captured → POST /api/contact (subject: "Inscrição no informativo jurídico")
```

## Key Files
- `src/components/Contact.tsx` — 3-channel contact section
- `src/components/NewsletterBanner.tsx` — newsletter opt-in
- `src/app/api/contact/route.ts` — Resend API handler
- `src/components/Chatbot/` or `chatbot-triage/` — triage chatbot

## Audit Checklist

### Email API (Resend)
- [ ] `RESEND_API_KEY` set in Vercel env vars (Dashboard → Project → Settings → Environment Variables)
- [ ] FROM address: `contato@lucasmangolin.vercel.app` (must verify domain in Resend dashboard)
- [ ] Honeypot working (silent reject on `website` field populated)
- [ ] Required field validation: name, email, message
- [ ] Email format regex validation
- [ ] Error response includes user-friendly message

### Chatbot Triage
- [ ] Opens on `chatOpen = true` state
- [ ] `onOpenChat` prop passed from Hero and Contact
- [ ] Questions qualify: tipo de problema → urgência → contato
- [ ] No legal advice — only routing to WhatsApp or email
- [ ] OAB-compliant disclaimer at start of chatbot

### WhatsApp
- [ ] Link: `https://wa.me/5518998262707`
- [ ] Pre-filled message improves conversion — e.g.: `?text=Olá,%20gostaria%20de%20agendar%20uma%20consulta`
- [ ] Opens in new tab (`target="_blank" rel="noopener noreferrer"`)

### Newsletter
- [ ] Form submits to `/api/contact`
- [ ] Honeypot field present
- [ ] LGPD disclaimer visible
- [ ] Success state shown after submission

## Common Issues & Fixes
- **Resend 401**: `RESEND_API_KEY` not set in Vercel — add via dashboard
- **FROM domain rejected**: Resend requires domain verification for custom FROM — use `onboarding@resend.dev` as fallback during testing
- **CORS error on /api/contact**: Not applicable (same-origin Next.js API route)
- **Honeypot field visible**: Ensure `className="absolute opacity-0 h-0 w-0 pointer-events-none"` and `aria-hidden="true"`
