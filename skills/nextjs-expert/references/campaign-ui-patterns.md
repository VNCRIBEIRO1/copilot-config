# Campaign UI Patterns — Authority, Institutional & Political Web Design

> Reference for building web UIs that convey **authority, competence, seriousness, and trust**.
> Specifically tuned for political campaigns, military/police candidates, and institutional sites.
> Anti-pattern: childish flat-color blocks, rainbow cards, playful rounded corners.

## 1. Design Philosophy: Authority vs. Playful

**NEVER** produce UI that feels like:
- Google's flat Material Design primary colors
- Children's educational apps
- Startup landing pages with rainbow gradients
- E-commerce product cards

**ALWAYS** produce UI that feels like:
- Bloomberg Terminal / Financial Times
- Government portals (whitehouse.gov, MoD sites)
- Premium law firm websites
- Military/defense contractor sites (Lockheed Martin, Thales)
- High-end political campaign sites (obamabarack.com, macron2022.fr)

### Visual Hierarchy of Seriousness

| Level | Look | Used For |
|-------|------|----------|
| 1 — Maximum Authority | Dark bg, gold accents, serif headers, minimal color | Hero, main CTA |
| 2 — Institutional | Dark/charcoal bg, muted accent, glassmorphism cards | Feature sections |
| 3 — Confident | White bg, single accent color, strong typography | Content sections |
| 4 — Balanced | Light gray bg, two accent colors, clean grid | Info sections |
| 5 — Approachable | Light bg, warmer colors, rounded cards | Community/social |

## 2. Color Application Rules

### The 60-30-10-5 Rule for Authority

```
60% — Base (Dark: #0D0D0D / #111 / #1A1A1A)
30% — Surface (Charcoal: #1F1F1F / #222 / Cards/containers)
 5% — Primary Accent (Green: #009C3B / Brand color — used SPARINGLY)
 3% — Secondary Accent (Gold: #FFD700 — highlights, borders, badges)
 2% — White/Light (Text, icons, dividers — NOT backgrounds)
```

### Critical Anti-Patterns

| DON'T | WHY | DO INSTEAD |
|-------|-----|-----------|
| Flat saturated colored cards (red bg, pink bg, blue bg) | Looks like a children's toy, destroys authority | Dark cards with colored accent border/icon |
| Rainbow color scheme (each card different color) | Visual chaos, no brand cohesion | Monochromatic with ONE accent color |
| Large colored blocks without texture | Looks cheap, generic | Add subtle gradient, noise, border-glow |
| Bright text on bright backgrounds | Low contrast, unprofessional | Dark bg + light text OR light bg + dark text |
| Evenly-sized identical cards in grid | Boring, lacks hierarchy | Vary card sizes, use bento layout, feature 1 card |
| Full saturation accent colors | Screams "startup" not "authority" | Muted or darkened accents with opacity |

### Color Application per Component

```
Card Container:
  ✗ bg-green-500 (flat color = childish)
  ✗ bg-pink-600 text-white (saturated = toy-like)
  ✓ bg-[#111]/80 border border-white/10 backdrop-blur (glassmorphism = authority)
  ✓ bg-gradient-to-b from-white/5 to-transparent border border-accent/20 (subtle luxury)

Icon Container:
  ✗ bg-red-100 text-red-600 (Material Design = generic)
  ✓ bg-accent/10 text-accent ring-1 ring-accent/20 (subtle brand)
  ✓ bg-gradient-to-br from-accent/20 to-accent/5 text-accent (prestige)

Badge / Tag:
  ✗ bg-blue-500 text-white rounded-full (generic startup badge)
  ✓ bg-gold/10 text-gold border border-gold/30 (prestige badge)
  ✓ bg-white/5 text-white/70 border border-white/10 (glass tag)

CTA Button:
  ✗ bg-red-500 hover:bg-red-600 (aggressive, unprofessional)
  ✓ bg-accent text-white shadow-[0_0_20px_rgba(0,156,59,0.3)] (authoritative glow)
  ✓ bg-gradient-to-r from-accent to-accent-dark border border-accent/50 (premium gradient)
```

## 3. Card Design Patterns for Authority

### Pattern A: Glass Authority Card
```tsx
<div className="group relative overflow-hidden rounded-xl border border-white/10 bg-white/[0.03] p-6 backdrop-blur-sm transition-all duration-300 hover:border-accent/30 hover:bg-white/[0.06]">
  {/* Subtle gradient overlay */}
  <div className="absolute inset-0 bg-gradient-to-br from-accent/5 via-transparent to-transparent opacity-0 transition-opacity group-hover:opacity-100" />
  
  {/* Gold accent line top */}
  <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-gold/50 to-transparent" />
  
  <div className="relative z-10">
    {/* Icon with glow */}
    <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-accent/10 text-accent ring-1 ring-accent/20 transition-all group-hover:bg-accent/20 group-hover:shadow-[0_0_15px_rgba(0,156,59,0.2)]">
      <Icon className="h-5 w-5" />
    </div>
    <h3 className="mt-4 text-lg font-bold text-white">{title}</h3>
    <p className="mt-2 text-sm text-white/50">{description}</p>
  </div>
</div>
```

### Pattern B: Bordered Authority Card
```tsx
<div className="group relative rounded-xl border border-white/[0.08] bg-[#0F0F0F] p-6 transition-all duration-300 hover:border-white/20">
  {/* Left accent bar */}
  <div className="absolute left-0 top-4 bottom-4 w-0.5 bg-gradient-to-b from-accent via-accent/50 to-transparent rounded-full transition-all group-hover:h-3/4" />
  
  <div className="pl-4">
    <span className="text-xs font-semibold uppercase tracking-[0.2em] text-accent/70">Bandeira</span>
    <h3 className="mt-2 text-lg font-bold text-white">{title}</h3>
    <p className="mt-2 text-sm text-white/40 leading-relaxed">{description}</p>
  </div>
</div>
```

### Pattern C: Bento Feature Card (varying sizes)
```tsx
{/* Featured card - spans 2 cols */}
<div className="col-span-2 row-span-2 relative overflow-hidden rounded-2xl border border-white/10 bg-gradient-to-br from-accent/10 via-black to-black p-8">
  <div className="absolute top-0 right-0 w-1/2 h-full bg-gradient-to-l from-accent/5 to-transparent" />
  <Icon className="h-10 w-10 text-accent" />
  <h3 className="mt-6 text-2xl font-bold text-white">{title}</h3>
  <p className="mt-3 text-base text-white/60 max-w-md">{description}</p>
  <div className="mt-6 flex items-center gap-2 text-sm text-accent">
    <span>Saiba mais</span>
    <ArrowRight className="h-4 w-4" />
  </div>
</div>

{/* Regular cards */}
<div className="relative overflow-hidden rounded-2xl border border-white/10 bg-[#111] p-6">
  <Icon className="h-8 w-8 text-gold" />
  <h3 className="mt-4 text-lg font-bold text-white">{title}</h3>
  <p className="mt-2 text-sm text-white/40">{description}</p>
</div>
```

### Pattern D: Compact Authority Strip (for quick bandeiras)
```tsx
{/* Full-width strip with contained items — NOT colored blocks */}
<div className="relative -mt-12 z-20">
  <div className="mx-auto max-w-6xl px-4">
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3">
      {items.map(item => (
        <div key={item.title} className="group flex items-center gap-3 rounded-xl border border-white/10 bg-black/60 backdrop-blur-md px-4 py-4 transition-all hover:border-accent/30 hover:bg-white/[0.05]">
          <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-accent/10 text-accent">
            <item.icon className="h-4 w-4" />
          </div>
          <span className="text-sm font-semibold text-white/80 group-hover:text-white">{item.title}</span>
        </div>
      ))}
    </div>
  </div>
</div>
```

## 4. Typography for Authority

### Scale
```
Hero headline:   text-5xl md:text-6xl lg:text-7xl font-black tracking-tight
Section title:   text-3xl md:text-4xl font-bold tracking-tight
Card title:      text-lg font-bold
Body:            text-base text-white/60 leading-relaxed
Label:           text-xs font-semibold uppercase tracking-[0.2em] text-accent/70
Caption:         text-sm text-white/40
```

### Fonts that convey authority
- **Montserrat** (800/900) — Strong, geometric, serious
- **Inter** (600/700) — Clean, institutional, modern
- **Playfair Display** — Serif elegance for hero headlines
- **Source Serif Pro** — Editorial authority (pair with sans body)
- **JetBrains Mono** — Technical credibility (data, stats)

### Text treatments
```css
/* Gold accent text — use sparingly for prestige */
.text-prestige {
  background: linear-gradient(135deg, #FFD700, #CCA900);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
}

/* Subtle text shadow for depth on dark bg */
.text-authority {
  text-shadow: 0 1px 2px rgba(0,0,0,0.5);
}

/* Letter spacing for labels/badges */
.label-authority {
  font-size: 0.75rem;
  font-weight: 600;
  letter-spacing: 0.15em;
  text-transform: uppercase;
}
```

## 5. Grid Layouts for Institutional Sites

### Never: Flat equal grid
```
❌ [Card] [Card] [Card] [Card] [Card]  ← boring, no hierarchy, no focus
```

### Always: Hierarchy-driven layouts

```
✅ Bento:
╔══════════╦═══╦═══╗
║ Featured ║ B ║ C ║
║          ║   ║   ║
╠══════════╬═══╩═══╣
║    D     ║   E   ║
╚══════════╩═══════╝

✅ Compact strip (overlapping hero):
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
[🛡 Seg.Pub] [♀ Prot.Mulher] [⊕ Crime] [🏘 Comun.] [🏛 Gestão]
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

✅ Staggered / offset:
[Card A]          [Card B]
       [Card C]          [Card D]
[Card E]          [Card F]

✅ Feature spotlight + thumbnails:
╔═══════════════╦══════╗
║               ║  B   ║
║    MAIN       ╠══════╣
║    FEATURE    ║  C   ║
║               ╠══════╣
╚═══════════════╩══════╝
```

## 6. Section Backgrounds & Textures

### Dark authority sections
```css
/* Base: Pure dark */
.section-dark { background: #0D0D0D; }

/* With subtle noise — adds TEXTURE, feels premium */
.section-dark-textured {
  background: #0D0D0D;
  position: relative;
}
.section-dark-textured::after {
  content: "";
  position: absolute; inset: 0;
  background: url("data:image/svg+xml,...noise...");
  opacity: 0.03;
  pointer-events: none;
  mix-blend-mode: overlay;
}

/* With gradient mesh — feels cinematic */
.section-cinematic {
  background: #0D0D0D;
  background-image:
    radial-gradient(ellipse at 20% 50%, rgba(0,156,59,0.08) 0%, transparent 50%),
    radial-gradient(ellipse at 80% 20%, rgba(255,215,0,0.05) 0%, transparent 40%);
}

/* With diagonal lines — feels tactical/military */
.section-tactical {
  background: repeating-linear-gradient(
    -45deg,
    transparent,
    transparent 40px,
    rgba(255,255,255,0.02) 40px,
    rgba(255,255,255,0.02) 41px
  );
}
```

### Section dividers (not just bg color changes)
```tsx
{/* Gold line divider */}
<div className="h-px bg-gradient-to-r from-transparent via-gold/30 to-transparent" />

{/* Angled divider */}
<div className="h-16 -mt-16 bg-gradient-to-b from-transparent to-surface" style={{ clipPath: 'polygon(0 0, 100% 100%, 0 100%)' }} />

{/* Double line */}
<div className="flex items-center gap-4 mx-auto max-w-xs">
  <div className="h-px flex-1 bg-white/10" />
  <div className="h-1.5 w-1.5 rotate-45 bg-gold" />
  <div className="h-px flex-1 bg-white/10" />
</div>
```

## 7. Micro-interactions for Authority

Interactions should feel **PRECISE and CONTROLLED**, not bouncy or playful.

```
✗ scale(1.1) duration-150  ← too fast, too much, feels cheap
✗ bounce/spring animation  ← playful, undermines seriousness
✗ wobble/shake on hover    ← cartoon-like

✓ scale(1.02) duration-300 ← subtle lift, professional
✓ translateY(-2px) duration-300 ← refined elevation
✓ border-color transition 300ms ← sophisticated state change
✓ opacity transition 200ms      ← clean fade
✓ shadow-glow transition 500ms  ← premium light effect
```

### Hover patterns
```tsx
// Authority card hover
"transition-all duration-300 hover:-translate-y-0.5 hover:border-accent/30 hover:shadow-[0_8px_30px_rgba(0,0,0,0.3)]"

// CTA hover — glow, not scale
"transition-all duration-300 hover:shadow-[0_0_25px_rgba(0,156,59,0.4)] hover:brightness-110"

// Text link hover — underline reveal
"relative after:absolute after:bottom-0 after:left-0 after:h-px after:w-0 after:bg-accent after:transition-all hover:after:w-full"
```

## 8. Component Anti-Pattern Gallery

### BandeirasSection — Before vs After

**BEFORE (childish):**
```tsx
// ❌ Flat saturated colored blocks — looks like Google IO or a preschool app
<div className="bg-green-600 rounded-xl p-5">
  <Shield />
  <span>Segurança Pública</span>
</div>
<div className="bg-pink-600 rounded-xl p-5">
  <Heart />
  <span>Proteção à Mulher</span>
</div>
<div className="bg-red-600 rounded-xl p-5">...</div>
<div className="bg-blue-600 rounded-xl p-5">...</div>
<div className="bg-yellow-400 text-black rounded-xl p-5">...</div>
```

**AFTER (authority):**
```tsx
// ✓ Dark glass cards with subtle accent, all using brand palette
<div className="group flex items-center gap-3 rounded-xl border border-white/[0.08] bg-white/[0.03] backdrop-blur-sm px-5 py-4 transition-all duration-300 hover:border-accent/30 hover:bg-white/[0.06]">
  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-accent/10 text-accent ring-1 ring-accent/20 group-hover:shadow-[0_0_12px_rgba(0,156,59,0.2)]">
    <Shield className="h-4.5 w-4.5" />
  </div>
  <div>
    <span className="text-sm font-bold text-white/90">Segurança Pública</span>
  </div>
</div>
```

## 9. Campaign Page Section Order (Recommended)

```
1. Hero (full-screen, cinematic, candidate image)
2. Bandeiras Strip (compact, overlapping hero -mt-12, glass cards)
3. About / Bio (split layout, image + text, authority tone)
4. Key Issue Spotlight (bento grid, 1 featured + 4 small)
5. Stats / Numbers bar (counter animation, dark bg, gold accents)
6. News / Updates (horizontal scroll or 3-col grid)
7. Testimonials / Endorsements (carousel or quote blocks)
8. Social Proof / Media (logo ticker, press mentions)
9. CTA Section (full-width, gradient, single strong action)
10. Footer (minimal, dark, gold accents)
```

## 10. Responsive Authority Design

Mobile is where most political traffic comes from. Authority must persist.

```
Desktop (lg+):   5-col bento, glassmorphism, hover effects, parallax
Tablet (md):     3-col grid, simplified effects, touch targets 48px+
Mobile (sm):     2-col or stack, NO hover effects, larger text, thumb zones

Key rules:
- Cards stack to single column on mobile with full-width feel
- Icons stay 40px+ on mobile for thumb targets
- Text size: body min 16px mobile (no zoom trigger)
- Padding: increase on mobile (px-5 vs px-4) for edge breathing room
- Glassmorphism works on mobile but reduce blur intensity (blur-sm not blur-xl)
```

## 11. Dark Theme Palette Combinations for Political Campaigns

### Military / Police Candidate (Spinelli)
```
Base:     #0D0D0D (rich black)
Surface:  #111111, #161616, #1A1A1A
Accent:   #009C3B (institutional green)
Prestige: #FFD700 → #CCA900 (gold gradient)
Text:     #FFFFFF (primary), rgba(255,255,255,0.6) (muted), rgba(255,255,255,0.4) (caption)
Borders:  rgba(255,255,255,0.08) (default), rgba(0,156,59,0.3) (hover)
Danger:   #DC2626 (for CTAs about crime stats)
```

### Conservative / Traditionalist
```
Base:     #0A1628 (navy-black)
Surface:  #0F1D32, #152238
Accent:   #1E40AF (deep blue)
Prestige: #B8860B → #8B6914 (antique gold)
Text:     #F1F5F9, rgba(241,245,249,0.6)
```

### Progressive / Youth
```
Base:     #0F172A (slate)
Surface:  #1E293B, #334155
Accent:   #06B6D4 (cyan/teal)
Secondary: #8B5CF6 (violet)
Text:     #F8FAFC, rgba(248,250,252,0.6)
```

### Evangelical / Social Conservative
```
Base:     #1C1917 (warm black)
Surface:  #292524, #44403C
Accent:   #B45309 (amber)
Prestige: #F59E0B (warm gold)
Text:     #FAFAF9, rgba(250,250,249,0.6)
```
