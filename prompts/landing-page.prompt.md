---
description: "Generate a complete Next.js landing page with advanced effects. Use when: building landing pages, creating campaign sites, generating full-page layouts."
---

# Landing Page Generator

Generate a complete, production-ready Next.js landing page.

## Inputs

Ask the user for:
1. **Purpose**: What is the page for? (campaign, product, portfolio, event, saas)
2. **Colors**: Primary, accent, and background colors (or a mood: dark, light, vibrant)
3. **Sections**: Which sections to include (or "all" for full page)
4. **Effects**: Animation level (minimal, moderate, heavy)
5. **Content**: Real content or placeholder?

## Available Sections (compose in order)

1. Hero (full-screen / split / video / carousel)
2. Logo ticker / social proof
3. Feature grid (2-4 columns with icons)
4. Stats counter bar
5. Zigzag alternating content
6. Bento grid showcase
7. Testimonials carousel
8. Team grid
9. Timeline / trajectory
10. Pricing cards
11. FAQ accordion
12. CTA banner
13. Footer with newsletter

## Procedure

1. Load the `nextjs-expert` skill for templates and effects
2. Create `globals.css` with the design system (colors, fonts, variables)
3. Create each section as a separate component in `src/components/sections/`
4. Compose sections in `src/app/page.tsx`
5. Add animation wrappers (FadeIn, StaggerContainer) based on effects level
6. Create `opengraph-image.tsx` matching the color scheme
7. Set up full metadata in `layout.tsx`
8. Run `npm run build` to validate

## Effects by Level

**Minimal**: FadeIn on scroll only, no parallax, subtle transitions
**Moderate**: FadeIn + StaggerContainer + scroll progress bar + gradient animations + hover effects
**Heavy**: All of moderate + parallax + GSAP pinning + kinetic typography + 3D tilt + aurora background + noise overlay

## Output

A complete page with:
- All components properly typed (TypeScript)
- Responsive (mobile-first)
- Accessible (ARIA, reduced-motion)
- Performance-optimized (next/image, next/font, dynamic imports)
- SEO-ready (metadata, OG image)
