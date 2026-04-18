---
name: therapeutic-evolution-flow
description: 'Implement and audit the complete therapeutic session lifecycle for multi-tenant SaaS: session notes (therapist + patient), private clinical notes, evolution timeline, post-session feedback flow, realistic seed data. Use when: building session management, clinical records, patient portal evolution, therapist notes, post-session workflow, multi-tenant session data, seeding demo data for mental health SaaS.'
argument-hint: 'Describe which part of the session lifecycle to implement or audit'
---

# Therapeutic Evolution Flow

Complete workflow for implementing the session lifecycle in a multi-tenant mental health SaaS.

## Architecture Overview

### Data Model (existing tables)
| Table | Purpose | Key Fields |
|-------|---------|------------|
| `appointments` | Sessions | tenantId, patientId, date, status, **notes** (admin), **patientNotes**, **therapistFeedback** |
| `clinical_records` | Prontuário | tenantId, patientId, therapistId, sessionNumber, clinicalNotes, interventions, homework, mood, **private** flag |
| `triages` | Pre-session intake | tenantId, appointmentId, mood, anxietyLevel, mainConcern |
| `documents` | Files/notes | tenantId, patientId, type (`session_note`), content |

### Three Layers of Notes

1. **therapistFeedback** (on `appointments`) — Visible to patient in Evolution timeline. Written post-session.
2. **patientNotes** (on `appointments`) — Patient's own reflection. Written post-session from portal.
3. **clinicalRecords** (separate table) — Private by default (`private: true`). Only non-private records surface in patient Evolution. Contains structured clinical data.

### Session Lifecycle

```
1. Patient books session (portal/agendar)
2. Pre-session triage (portal/triagem/[id]) — mood, anxiety, concerns
3. Session happens (sala-espera → Jitsi videocall)
4. Post-session:
   a. Therapist marks "completed" in admin/agenda
   b. Therapist writes therapistFeedback (visible to patient)
   c. Therapist writes private clinical record (prontuário)
   d. Patient writes patientNotes from portal/sessoes
5. Evolution timeline shows completed sessions with feedback exchange
```

## Multi-Tenant Checklist

Every query MUST filter by `tenantId`:
- [ ] `/api/portal/evolution` — appointments AND clinical_records queries
- [ ] `/api/portal/appointments` — all queries
- [ ] `/api/clinical-records` — all queries
- [ ] Seed script — ALL inserts must include tenantId

## Private Notes UX Rules

- Admin UI must clearly label: "⚠️ Esta anotação é privada — o paciente NÃO verá"
- Private clinical records: red/amber border, lock icon, explicit warning text
- Non-private records: green border, visible icon, note that patient CAN see
- Toggle between private/visible must confirm with the therapist

## Color Palette Guidelines (SaaS)

For professional health SaaS, avoid overly pastel/light palettes:
- Background: off-white `#FAF7F5` (slightly warmer than pure white, not pink)
- Cards: `#FFFFFF` with subtle shadow
- Primary: `#B8895C` (warm gold, more saturated)
- Teal: `#0f766e` (keep — good contrast)
- Text: `#2D1F15` (darker brown for better readability)
- Muted: `#6B5445` (keep)
- Borders: `#D4C5B8` (slightly darker for definition)

## Seed Data Requirements

Realistic demo must include:
- 1 tenant with slug, branding, active plan
- 1 admin/therapist user with tenant_membership(admin)
- 3+ patients with tenant_membership(patient) + patients record
- 8+ completed sessions across patients with:
  - therapistFeedback populated
  - patientNotes populated
  - notes (admin-only context)
- 5+ clinical_records with mix of private/non-private
- Triages for upcoming sessions
- Payments linked to sessions
- Realistic dates spanning 4-6 weeks back

## Implementation Checklist

1. Fix tenantId filters on evolution API
2. Add private notes distinction in admin UI
3. Ensure AppointmentDetailModal has clear private/visible note sections
4. Populate seed with therapistFeedback + patientNotes
5. Set some clinical_records to private:false for evolution display
6. Verify evolution page renders feedback exchange correctly
7. Audit color palette for professional appearance
8. Build → deploy → screenshot verification
