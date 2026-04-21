# SKILL: lucas-mangolin-seo

## Purpose
SEO auditing and optimization for lucasmangolin.vercel.app — Next.js App Router, single-page with anchor navigation.

## Site Facts
- **URL**: https://lucasmangolin.vercel.app
- **Lawyer**: Lucas Mangolin Alves — OAB/SP 422.779
- **Location**: Presidente Epitácio/SP — Geo: -21.76, -52.10
- **Key phrases**: "advogado presidente epitácio", "advogado p epitácio sp", "holding familiar SP", "usucapião presidente epitácio"
- **Target**: local SEO (single city), legal services, preventive law
- **Stack**: Next.js 16 App Router, `src/app/sitemap.ts`, `src/app/robots.ts`

## SEO Checklist
- [ ] Title template: `%s | Lucas Mangolin Advocacia`
- [ ] Default title: `Lucas Mangolin Alves — Advogado OAB/SP 422.779 | Presidente Epitácio/SP`
- [ ] 15+ geo-targeted keywords in `layout.tsx` metadata
- [ ] Geo meta tags: `geo.region`, `geo.placename`, `geo.position`, `ICBM`
- [ ] JSON-LD: `LegalService` + `LocalBusiness` combined, with `areaServed`, `founder`, `geo`
- [ ] sitemap.ts: all anchor sections listed with priorities
- [ ] robots.ts: allow all, sitemap declared
- [ ] OG image: 1200×630 — check `/public/og-image.jpg`
- [ ] Articles section: each article has `<h3>` title and body with legal keywords
- [ ] Glossary: 12 terms with definitions — SEO long-tail targets

## Key Files
- `src/app/layout.tsx` — metadata export
- `src/app/page.tsx` — JSON-LD script
- `src/app/sitemap.ts`
- `src/app/robots.ts`
- `src/components/Glossary.tsx`
- `src/components/Articles.tsx`

## Audit Workflow
1. Run `npm run build` — check for static generation issues
2. Inspect `<head>` in browser for title, meta, canonical
3. Test sitemap: `/sitemap.xml`
4. Test robots: `/robots.txt`
5. Validate JSON-LD: https://validator.schema.org
6. Check Core Web Vitals: Lighthouse mobile score
7. Verify geo meta tags render correctly
8. Check OG preview: https://og-image-checker.vercel.app or LinkedIn post inspector

## Common Issues & Fixes
- **Missing canonical**: Add `alternates: { canonical: "https://lucasmangolin.vercel.app" }` to layout metadata
- **OG image missing**: Create `/public/og-image.jpg` 1200×630 with lawyer photo + name + OAB
- **Duplicate titles on anchor pages**: anchor sections do NOT generate separate pages — sitemap entries with `#` are informational only
- **JSON-LD not rendering in SSR**: The `<script>` in page.tsx must be inside `<>` fragment — verified OK
