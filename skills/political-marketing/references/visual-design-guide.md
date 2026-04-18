# Visual Design Guide — Political Campaign Web & Print

> Bridge between political identity/strategy and actual UI/visual implementation.
> This reference tells you HOW a candidate's profile translates into colors, typography, layouts, and components.

## 1. Identity → Visual Translation Matrix

Every political candidate has a **persona archetype** that must dictate visual choices:

### Archetype → Visual Language

| Archetype | Colors | Typography | Layout | Textures | Icons | Mood |
|-----------|--------|------------|--------|----------|-------|------|
| **Military / Police (Autoridade)** | Black + Green + Gold | Montserrat 900, uppercase, tight tracking | Dark bg, glass cards, gold accents, tactical diagonal lines | Noise, gradient mesh, diagonal stripes | Shield, Target, Star | Commanding, precise, institutional |
| **Evangelical / Familia** | Warm black + Amber + Gold | Serif (Playfair), warm weights | Warm tones, soft shadows, editorial feel | Soft gradients, warm overlays | Cross, Heart, Home, Book | Trustworthy, traditional, warm |
| **Progressista / Juventude** | Dark slate + Cyan + Violet | Inter, clean geometric, bold | Bright accents on dark, rounded corners, bento | Gradient blob, aurora, neon glow | Zap, Users, Globe, Sparkles | Modern, energetic, inclusive |
| **Agro / Rural** | Dark earth + Forest green + Amber | Slab serif, grounded | Earth tones, natural textures, wide layouts | Wood grain, topographic lines | Tractor, Leaf, Sun, Mountain | Grounded, honest, hardworking |
| **Empresário / Gestão** | Navy + Silver + White | Inter/Helvetica, clean, corporate | Clean grids, whitespace, data-forward | Subtle grid patterns, clean lines | BarChart, TrendingUp, Building | Competent, efficient, modern |
| **Médico / Saúde** | White + Blue + Green | Open Sans, accessible, clean | Light bg, clean cards, blue accents | Subtle gradients, clinical clean | Stethoscope, Heart, Shield | Caring, credible, scientific |
| **Professor / Educador** | Warm white + Amber + Sage green | Georgia/Merriweather serif | Editorial layout, book-like margins | Paper texture, classical | BookOpen, GraduationCap, Lightbulb | Wise, approachable, thoughtful |
| **Delegado / Justiça** | Dark + Red + Gold | Bold sans-serif, aggressive tracking | Dark authority, stripe accents, badge layouts | Tactical patterns, star badges | Scale, Gavel, BadgeCheck | Just, firm, uncompromising |

## 2. Color Application Rules by Candidate Type

### Military/Police Candidate (ex: Tenente Spinelli)

```
PRIMARY PALETTE:
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
#0D0D0D   Rich Black        Background, base     60%
#111111   Surface Dark       Cards, containers    15%
#1A1A1A   Surface Light      Hover states         10%
#009C3B   Institutional Green  Accent, icons, CTA   5%
#FFD700   Gold               Prestige, borders     3%
#FFFFFF   White              Text primary          5%
rgba(255,255,255,0.6)  Text muted           2%
rgba(255,255,255,0.08) Border default

NEVER USE:
- Pink, bright red, orange, bright blue as card backgrounds
- Rainbow multi-color schemes
- Pastel colors
- White/light backgrounds for main sections (undermines authority)

ACCENT APPLICATION:
- Green: CTA buttons, icon containers, active borders, links
- Gold: Badges, top/bottom lines, dividers, "prestige" labels, number highlights
- White: Text only, never as section background in dark theme
```

### How Flat Colors DESTROY Authority

The human eye processes color before shape. When you use **5 different saturated colors** next to each other:

1. **Cognitive overload** — viewer doesn't know where to look (no hierarchy)
2. **Brand dissolution** — the brand palette becomes invisible
3. **Childish association** — primary colors = children's products (LEGO, Fisher Price, Google)
4. **Zero differentiation** — looks like every generic template

When you use **one accent color on dark glass**:
1. **Clear hierarchy** — accent draws the eye to what matters
2. **Brand reinforcement** — every element reinforces the palette
3. **Authority association** — dark + metallic = Bloomberg, James Bond, luxury
4. **Professional differentiation** — stands out from generic political sites

## 3. Card Design Standards

### Level 1: Glass Authority Card (DEFAULT for campaign sites)
```
Background:   bg-white/[0.03] OR bg-[#111]
Border:       border border-white/[0.08]
Hover border: border-accent/30
Blur:         backdrop-blur-sm (optional, subtle)
Transition:   duration-300, ease-out
Hover effect: -translate-y-0.5 + shadow-[0_8px_30px_rgba(0,0,0,0.3)]
Icon:         bg-accent/10 text-accent ring-1 ring-accent/20
Gold accent:  Top border line bg-gradient-to-r from-transparent via-gold/50 to-transparent (h-px)
```

### Level 2: Bordered Card (for lists, features)
```
Background:   bg-[#0F0F0F]
Border:       border border-white/[0.08]
Left accent:  w-0.5 bg-gradient-to-b from-accent via-accent/50 to-transparent
Label:        text-xs font-semibold uppercase tracking-[0.2em] text-accent/70
```

### Level 3: Featured Card (1 per section, spans 2+ cols)
```
Background:   bg-gradient-to-br from-accent/10 via-black to-black
Border:       border border-white/10
Size:         col-span-2 row-span-2
CTA:          text-accent with arrow icon
```

### FORBIDDEN Card Styles
```
❌ bg-green-600 rounded-xl p-5        → childish flat color
❌ bg-pink-600 text-white rounded-xl  → toy store aesthetic
❌ bg-red-600 rounded-xl              → danger/error association
❌ bg-blue-600 rounded-xl             → generic template
❌ bg-yellow-400 text-black           → construction warning aesthetic
```

## 4. Typography System for Campaigns

### Scale (Tailwind v4)
```
--text-hero:     clamp(2.5rem, 5vw, 4.5rem)  font-black tracking-tight
--text-section:  clamp(1.75rem, 3vw, 2.5rem) font-bold tracking-tight
--text-card:     1.125rem (text-lg)           font-bold
--text-body:     1rem (text-base)             font-normal text-white/60 leading-relaxed
--text-label:    0.75rem                      font-semibold uppercase tracking-[0.2em]
--text-caption:  0.875rem (text-sm)           font-normal text-white/40
```

### Font Pairing by Archetype
```
Military:    Montserrat (800-900, headings) + Open Sans (400-600, body)
Evangelical: Playfair Display (headings) + Lora (body)
Progressive: Inter (headings) + Inter (body, lighter)
Agro:        Bitter (headings) + Source Sans Pro (body)
Corporate:   Inter (headings) + Inter (body)
```

### Text Treatments
```css
/* Gold gradient text — for numbers, prestige labels */
.text-gold-gradient {
  background: linear-gradient(135deg, #FFD700, #CCA900);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
}

/* Green accent text — for labels, CTAs */
.text-accent-glow {
  color: #009C3B;
  text-shadow: 0 0 20px rgba(0, 156, 59, 0.3);
}

/* Authority heading — uppercase with wide tracking */
.heading-authority {
  font-weight: 800;
  text-transform: uppercase;
  letter-spacing: 0.05em;
}
```

## 5. Section Patterns for Campaign Sites

### Hero Section
- Full-screen or 85vh minimum
- Candidate image: either background with gradient overlay OR split layout
- Dark gradient overlay: `from-black via-black/60 to-black/80`
- Headline: font-black, large, gold or white
- Slogan: text-xl, white/70, below headline
- CTA: accent bg, glow shadow, clear action text
- Scroll indicator at bottom (animated)

### Bandeiras Strip (Quick Platform Overview)
- Position: `-mt-12 z-20` overlapping hero
- Container: `max-w-6xl`
- Items: glass cards with icon + title (NO colored backgrounds)
- Grid: `grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3`
- Cards: `border border-white/10 bg-black/60 backdrop-blur-md`
- All icons: same accent color (brand consistency)

### About / Bio
- Split layout: 50/50 image + text on desktop
- Image: rounded corners, subtle border, shadow-2xl
- Text side: label "Sobre" + heading + rich text + CTA
- Background: darker than hero section

### Stats Bar
- Full-width dark bg with noise texture
- 3-4 large numbers with gold color or gradient
- Counter animation on scroll (Framer Motion)
- Suffix/prefix labels in white/40

### Feature Spotlight (Bento Grid)
```
lg:grid-cols-3 gap-4
First item: col-span-2 row-span-2 (featured)
Remaining: regular size cards
```

## 6. Print / Social Media Visual Rules

### Santinho (7×10cm)
```
Top 40%:    Candidate photo (bust, looking at camera)
Middle:     Name (bold, large) + Party + Number
Bottom:     3 key bandeiras as icon+text rows
Colors:     Same palette as website
```

### Instagram Post (1080×1080)
```
Background: Dark gradient or solid dark
Photo:      Left or center, with gradient fade
Text:       Right side or overlay, Montserrat bold
Badge:      Party + number in accent colored pill
```

### Story (1080×1920)
```
Top:        Badge with name + party
Middle:     Full bleed candidate photo
Bottom:     Call to action + @handle
```

## 7. Visual Quality Checklist

Before delivering ANY campaign visual element:

- [ ] **No flat colored cards** — all cards use glass/dark/bordered pattern
- [ ] **Brand palette only** — NO off-brand colors (pink, bright red, orange)
- [ ] **60-30-10 rule** — dark base dominant, accent is sparse
- [ ] **Gold used sparingly** — borders, dividers, badges only
- [ ] **Typography hierarchy** — different sizes, weights, and opacity for different content levels
- [ ] **Texture present** — noise, gradient mesh, or diagonal lines (no naked flat backgrounds)
- [ ] **Hover is subtle** — 300ms, slight translate/border-color/glow, NO scale > 1.03
- [ ] **Mobile tested** — authority persists at small screens
- [ ] **Contrast WCAG AA** — text/bg ratio >= 4.5:1
- [ ] **Icon consistency** — all icons same size, same accent color, same container style
