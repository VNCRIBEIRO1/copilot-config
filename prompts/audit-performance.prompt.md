---
description: "Audit Next.js site performance, run Lighthouse, analyze bundle, fix issues. Use when: checking performance, optimizing Core Web Vitals, running Lighthouse, analyzing bundle size, fixing LCP/CLS/INP."
---

# Performance Audit

Run a complete performance audit on the current Next.js project and fix issues.

## Procedure

### 1. Build Analysis
```bash
npm run build
```
Check the build output for:
- Page sizes (First Load JS)
- Static vs dynamic pages
- Any warnings about large bundles

### 2. Bundle Analysis
```bash
ANALYZE=true npm run build
```
If `@next/bundle-analyzer` is not installed, install it first:
```bash
npm i -D @next/bundle-analyzer
```
Identify the largest chunks and recommend splits.

### 3. Image Audit
Scan all `<Image>` and `<img>` usage:
- [ ] Hero/LCP images have `priority`
- [ ] All images have explicit `sizes` prop
- [ ] No oversized images (check dimensions vs display size)
- [ ] `next.config.ts` has `formats: ["image/avif", "image/webp"]`

### 4. Font Audit
- [ ] Using `next/font` (not external `<link>`)
- [ ] `display: "swap"` set
- [ ] Only needed weights loaded
- [ ] Subset to `latin`

### 5. Script Audit
- [ ] Analytics scripts use `strategy="lazyOnload"`
- [ ] No render-blocking external scripts
- [ ] Third-party scripts loaded conditionally

### 6. Component Audit
- [ ] Heavy below-fold components use `dynamic(() => import())`
- [ ] Client components are minimal (no unnecessary `"use client"`)
- [ ] Lists use meaningful `key` props
- [ ] Animations use compositor-only properties (`transform`, `opacity`)

### 7. CSS Audit
- [ ] No unused large CSS files
- [ ] Tailwind purge is working (check output CSS size)
- [ ] `will-change` used sparingly (only during animation)

### 8. Lighthouse Run (if Playwright available)
Navigate to the site and capture Lighthouse metrics via browser tools.

## Output
Generate a report with:
1. Current scores (estimated from build output)
2. Issues found (categorized: Critical / Warning / Info)
3. Fixes applied (with before/after code)
4. Remaining recommendations

## Reference
Load `nextjs-expert` skill → [performance.md](~/.copilot/skills/nextjs-expert/references/performance.md) for detailed optimization patterns.
