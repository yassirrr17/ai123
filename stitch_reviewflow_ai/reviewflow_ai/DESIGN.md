---
name: ReviewFlow AI
colors:
  surface: '#f9f9ff'
  surface-dim: '#d3daef'
  surface-bright: '#f9f9ff'
  surface-container-lowest: '#ffffff'
  surface-container-low: '#f1f3ff'
  surface-container: '#e9edff'
  surface-container-high: '#e1e8fd'
  surface-container-highest: '#dce2f7'
  on-surface: '#141b2b'
  on-surface-variant: '#434655'
  inverse-surface: '#293040'
  inverse-on-surface: '#edf0ff'
  outline: '#737686'
  outline-variant: '#c3c6d7'
  surface-tint: '#0053db'
  primary: '#004ac6'
  on-primary: '#ffffff'
  primary-container: '#2563eb'
  on-primary-container: '#eeefff'
  inverse-primary: '#b4c5ff'
  secondary: '#006c49'
  on-secondary: '#ffffff'
  secondary-container: '#6cf8bb'
  on-secondary-container: '#00714d'
  tertiary: '#3e3fcc'
  on-tertiary: '#ffffff'
  tertiary-container: '#585be6'
  on-tertiary-container: '#f1eeff'
  error: '#ba1a1a'
  on-error: '#ffffff'
  error-container: '#ffdad6'
  on-error-container: '#93000a'
  primary-fixed: '#dbe1ff'
  primary-fixed-dim: '#b4c5ff'
  on-primary-fixed: '#00174b'
  on-primary-fixed-variant: '#003ea8'
  secondary-fixed: '#6ffbbe'
  secondary-fixed-dim: '#4edea3'
  on-secondary-fixed: '#002113'
  on-secondary-fixed-variant: '#005236'
  tertiary-fixed: '#e1e0ff'
  tertiary-fixed-dim: '#c0c1ff'
  on-tertiary-fixed: '#07006c'
  on-tertiary-fixed-variant: '#2f2ebe'
  background: '#f9f9ff'
  on-background: '#141b2b'
  surface-variant: '#dce2f7'
typography:
  display:
    fontFamily: Inter
    fontSize: 48px
    fontWeight: '700'
    lineHeight: 56px
    letterSpacing: -0.02em
  headline-lg:
    fontFamily: Inter
    fontSize: 32px
    fontWeight: '700'
    lineHeight: 40px
    letterSpacing: -0.02em
  headline-lg-mobile:
    fontFamily: Inter
    fontSize: 24px
    fontWeight: '700'
    lineHeight: 32px
    letterSpacing: -0.01em
  headline-md:
    fontFamily: Inter
    fontSize: 24px
    fontWeight: '600'
    lineHeight: 32px
  headline-sm:
    fontFamily: Inter
    fontSize: 20px
    fontWeight: '600'
    lineHeight: 28px
  body-lg:
    fontFamily: Inter
    fontSize: 18px
    fontWeight: '400'
    lineHeight: 28px
  body-md:
    fontFamily: Inter
    fontSize: 16px
    fontWeight: '400'
    lineHeight: 24px
  body-sm:
    fontFamily: Inter
    fontSize: 14px
    fontWeight: '400'
    lineHeight: 20px
  label-md:
    fontFamily: Inter
    fontSize: 14px
    fontWeight: '600'
    lineHeight: 20px
  label-sm:
    fontFamily: Inter
    fontSize: 12px
    fontWeight: '500'
    lineHeight: 16px
    letterSpacing: 0.05em
rounded:
  sm: 0.25rem
  DEFAULT: 0.5rem
  md: 0.75rem
  lg: 1rem
  xl: 1.5rem
  full: 9999px
spacing:
  unit: 4px
  xs: 4px
  sm: 8px
  md: 16px
  lg: 24px
  xl: 32px
  2xl: 48px
  3xl: 64px
  gutter: 20px
  margin-mobile: 16px
  margin-desktop: 40px
  max-width: 1280px
---

## Brand & Style
The design system is engineered to project **Reliability, Growth, and Precision**. As a B2B SaaS for local New Zealand businesses, the interface must bridge the gap between high-end AI technology and the practical, hardworking nature of service providers like barbers and mechanics.

The visual style is **Corporate Modern with a Minimalist lean**. It prioritizes extreme clarity and "breathing room" to reduce cognitive load for busy business owners. The aesthetic is defined by high-quality typography, a restrained but confident color palette, and a focus on data visualization that feels encouraging rather than overwhelming. The goal is to make the user feel like their business is in safe, professional hands.

## Colors
The palette is built on "Trust and Growth." 

*   **Primary (Success Blue):** Used for main actions, brand identity, and indicating a state of professional stability.
*   **Secondary (Growth Mint):** Reserved for positive metrics, "New Review" notifications, and success states. It represents the flourishing of the business.
*   **Neutral (Charcoal & Slate):** Used for text and structural elements to provide high contrast and accessibility.
*   **Background:** A very light, cool-toned gray to differentiate the app surface from standard white browser chrome, reducing eye strain.

Use semantic coloring for status: Blue for information, Mint for success, Amber for pending reviews, and Red for critical alerts.

## Typography
This design system utilizes **Inter** exclusively to ensure maximum legibility across all digital touchpoints. The type scale is optimized for "at-a-glance" reading, which is critical for business owners checking stats between appointments.

*   **Headlines:** Use tight letter-spacing and bold weights to create a sense of authority.
*   **Body:** Standard weights with generous line height (1.5x) to ensure long review texts are easy to digest.
*   **Labels:** Small caps or medium weights are used for metadata like dates, categories, and tags to differentiate them from actionable text.

## Layout & Spacing
The layout follows a **Fluid-to-Fixed grid model**. 

*   **Mobile:** Uses a single-column layout with 16px side margins. Cards span the full width to maximize content area.
*   **Desktop:** 12-column grid with a 20px gutter and 40px margins. Content is centered with a max-width of 1280px to prevent line lengths from becoming too long.
*   **Spacing Philosophy:** Use "Generous Padding." Avoid crowding information. Each module (Review Card, Stat Widget) should be separated by at least 24px (lg) to maintain a premium, uncluttered feel. Vertical rhythm should favor larger gaps (xl) between distinct sections to guide the user's eye.

## Elevation & Depth
Depth is created through **Low-contrast Outlines** and **Ambient Shadows**. This prevents the UI from feeling "heavy" or overly shaded.

*   **Level 0 (Background):** #f9fafb.
*   **Level 1 (Cards/Surface):** Pure white background with a 1px solid border (#e5e7eb).
*   **Level 2 (Hover/Active):** A very soft, diffused shadow (0px 4px 12px rgba(0, 0, 0, 0.05)) to indicate interactivity.
*   **Level 3 (Modals/Popovers):** Higher contrast shadow with a larger blur radius (0px 12px 24px rgba(0, 0, 0, 0.1)) to pull the element significantly forward.

Avoid pure black shadows; always use a slight blue tint in the shadow color to harmonize with the primary brand color.

## Shapes
The shape language is **distinctly rounded** to evoke friendliness and modern SaaS sensibilities. 

*   **Standard Elements:** Buttons, Input fields, and small UI elements use `rounded-md` (0.5rem / 8px).
*   **Containers:** Cards, modals, and large section containers use `rounded-xl` (1.5rem / 24px) to create a soft, high-end look.
*   **Decorative/Status:** Tags and "New" badges should use a full pill-shape to contrast against the more structured card corners.

## Components
Consistent component styling is vital for the professional "productivity tool" feel.

*   **Buttons:** Primary buttons use a solid Success Blue fill with white text. Secondary buttons use a white background with a 1px border and Blue text. Use 16px vertical and 24px horizontal padding for a "substantial" click area.
*   **Cards:** The cornerstone of the design system. Cards must have 24px internal padding, `rounded-xl` corners, and a subtle #e5e7eb border. No heavy shadows unless hovered.
*   **Input Fields:** Clean, white backgrounds with a subtle border. On focus, the border transitions to Success Blue with a 2px soft outer glow.
*   **Chips/Badges:** Use "Soft Teal" (#10b981 at 10% opacity) with dark green text for positive review counts. Use "Soft Gray" for neutral metadata.
*   **Data Visualization:** Sparklines and progress bars should use the Primary and Secondary colors. Avoid multi-color "rainbow" charts; keep it monochromatic or bi-color to maintain professionalism.
*   **Lists:** High-density lists (like a list of recent customers) should use subtle 1px dividers and generous vertical height (min-height 64px) for mobile-friendly tapping.