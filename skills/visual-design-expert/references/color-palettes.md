# Color Palettes Reference

## Professional Color Palettes by Industry

### Law / Legal
- Primary: #1A1A2E (Deep Navy) or #2C3E50 (Dark Blue-Gray)
- Accent: #C9A96E (Gold) or #8B6914 (Dark Gold)
- Background: #FAFAF8 (Warm White)
- Text: #333333 (Charcoal)

### Healthcare / Medical
- Primary: #0077B6 (Medical Blue)
- Accent: #00B4D8 (Teal)
- Background: #F8FDFF (Ice White)
- Text: #2D3436 (Dark Gray)

### Technology / SaaS
- Primary: #6C5CE7 (Electric Purple) or #0984E3 (Bright Blue)
- Accent: #00CEC9 (Cyan) or #FD79A8 (Pink)
- Background: #0D1117 (Dark) or #FFFFFF (Light)
- Text: #E1E4E8 (Light) or #24292F (Dark)

### Real Estate / Luxury
- Primary: #1B1B1B (Black)
- Accent: #D4AF37 (Gold)
- Background: #F5F5F0 (Cream)
- Text: #333333 (Charcoal)

### Food & Beverage
- Primary: #E17055 (Warm Orange) or #D63031 (Red)
- Accent: #00B894 (Green) or #FDCB6E (Yellow)
- Background: #FFF8F0 (Warm White)
- Text: #2D3436 (Dark Gray)

### Creative / Design Agency
- Primary: #FF6B6B (Coral)
- Accent: #4ECDC4 (Mint) or #FFE66D (Yellow)
- Background: #F7F7F7 (Light Gray)
- Text: #2C2C2C (Near Black)

### Finance / Banking
- Primary: #0A3D62 (Deep Blue)
- Accent: #079992 (Teal)
- Background: #F6F8FA (Cool White)
- Text: #2C3A47 (Dark Blue-Gray)

### Education
- Primary: #341F97 (Royal Purple) or #1E3799 (Navy)
- Accent: #F39C12 (Amber)
- Background: #FAFBFC (White)
- Text: #333333 (Charcoal)

## Color Harmony Formulas

### From a Single Brand Color (Hex: #XXXXXX)
1. **Complementary**: Rotate hue 180°
2. **Analogous**: Rotate hue ±30°
3. **Triadic**: Rotate hue ±120°
4. **Split-Complementary**: Rotate 150° and 210°
5. **Tetradic**: Rotate 90°, 180°, 270°

### Generating Shades & Tints
- **Shade** (darker): Mix with black or reduce lightness in HSL
- **Tint** (lighter): Mix with white or increase lightness in HSL
- Common scale: 50, 100, 200, 300, 400, 500, 600, 700, 800, 900, 950

## Accessible Color Combinations (WCAG AA)

| Background | Text | Ratio | Pass? |
|-----------|------|-------|-------|
| #FFFFFF | #333333 | 12.63:1 | AAA |
| #FFFFFF | #767676 | 4.54:1 | AA |
| #1A1A2E | #FFFFFF | 15.79:1 | AAA |
| #1A1A2E | #C9A96E | 6.89:1 | AAA |
| #F5F5F0 | #333333 | 11.37:1 | AAA |
| #0D1117 | #58A6FF | 5.32:1 | AA |

## CSS Custom Properties Template

```css
:root {
  /* Primary */
  --color-primary-50: #f0f4ff;
  --color-primary-100: #dbe4ff;
  --color-primary-500: #4263eb;
  --color-primary-600: #3b5bdb;
  --color-primary-900: #1b2a6e;
  
  /* Accent */
  --color-accent-400: #d4af37;
  --color-accent-500: #c9a96e;
  
  /* Neutral */
  --color-neutral-50: #fafafa;
  --color-neutral-100: #f5f5f5;
  --color-neutral-200: #e5e5e5;
  --color-neutral-300: #d4d4d4;
  --color-neutral-500: #737373;
  --color-neutral-700: #404040;
  --color-neutral-800: #262626;
  --color-neutral-900: #171717;
  
  /* Semantic */
  --color-success: #22c55e;
  --color-warning: #f59e0b;
  --color-error: #ef4444;
  --color-info: #3b82f6;
}
```
