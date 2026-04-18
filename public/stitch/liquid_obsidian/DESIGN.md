# Design System Document: Liquid Glass & Dark Tonalism

## 1. Overview & Creative North Star

### The Creative North Star: "The Obsidian Curator"
This design system moves away from the sterile, flat world of traditional SaaS dashboards and toward a high-end, editorial digital experience. It is defined by "The Obsidian Curator"—a philosophy where the UI acts as a dark, polished gallery for user data. By leveraging high-contrast typography, intentional asymmetry, and deep tonal layering, we create an environment that feels expensive, private, and technologically advanced.

The core of this aesthetic is the **Liquid Glass** effect. Instead of solid blocks of color, we treat containers as translucent slices of dark obsidian and frosted glass. We break the "template" look by avoiding rigid grid containers in favor of overlapping elements, floating glass cards, and soft glowing highlights that guide the eye through the information hierarchy.

---

## 2. Colors & Surface Philosophy

The palette is rooted in a deep, near-black neutral base, allowing the energetic primary green (`#B7DE05`) to act as a high-precision laser rather than a simple brand color.

### The "No-Line" Rule
**Strict Mandate:** Designers are prohibited from using 1px solid borders to define sections or containers. 
Structure must be achieved through:
- **Tonal Shifts:** Moving from `surface` to `surface-container-low`.
- **Soft Shadows:** Utilizing ambient occlusion rather than structural lines.
- **Negative Space:** Using the spacing scale to create mental boundaries.

### Surface Hierarchy & Nesting
Treat the UI as a physical stack of materials. 
1. **The Base:** `surface` (#131410) acts as the floor.
2. **The Layout:** Use `surface-container-low` (#1b1c18) for large background sections.
3. **The Elements:** Use `surface-container-highest` (#343530) for interactive cards or floating modules.
4. **The "Glass" Overlay:** For premium modals or tooltips, use a semi-transparent version of `surface-bright` with a 20px `backdrop-blur`.

### The "Glass & Gradient" Rule
Standard flat colors lack "soul." Main CTAs and high-impact containers should utilize a subtle linear gradient. 
*   **CTA Gradient:** `primary_container` (#b7de05) to `primary` (#d2fb35) at a 135-degree angle.
*   **Glow Effect:** On hover, primary elements should emit a soft 20px blur glow using the `primary` token at 15% opacity.

---

## 3. Typography

The system uses **Inter**, optimized for high-contrast legibility on dark surfaces. We use a "tight-wide" approach: display text is tightly tracked and authoritative, while labels are wide-spaced and technical.

*   **Display (lg, md, sm):** Used for "Obsidian" headlines. Bold weights, reduced letter-spacing (-0.02em). These are the editorial anchors of the page.
*   **Headline & Title:** Used for module headers. High contrast (`on_surface` #e4e3db) ensures immediate scannability against the dark background.
*   **Body (lg, md, sm):** Optimized for reading. Use `on_surface_variant` (#c5c9ae) for secondary body text to reduce eye strain and create visual hierarchy.
*   **Label (md, sm):** Always uppercase with +0.05em letter-spacing. Used for "System Engine" tags or metadata to provide a technical, precision-engineered feel.

---

## 4. Elevation & Depth

We replace Material shadows with **Tonal Layering** and **Ambient Glows**.

### The Layering Principle
Depth is achieved by "stacking." A `surface-container-lowest` (#0e0f0b) card placed on a `surface-container-low` (#1b1c18) section creates an "inset" effect, perfect for input fields or data zones.

### Ambient Shadows
For floating elements (like the Resume Success Rate card), use a "Shadow-Glow."
*   **Blur:** 40px to 60px.
*   **Color:** `surface_tint` (#afd500) at 5% opacity. This mimics light passing through green-tinted glass.

### The "Ghost Border" Fallback
If accessibility requires a container boundary, use the **Ghost Border**:
*   **Stroke:** 1px
*   **Color:** `outline_variant` (#454934) at 20% opacity.
*   **Effect:** It should be felt, not seen.

---

## 5. Components

### Buttons
- **Primary:** Gradient fill (`primary_container` to `primary`). 
- **Secondary:** Liquid Glass style. Transparent background, 20px backdrop-blur, Ghost Border.
- **States:** On hover, the primary button’s glow expands; the secondary button’s backdrop-blur increases in intensity.

### Input Fields & Cards
- **Forbid Dividers:** Do not use lines to separate list items. Use 16px (`spacing.4`) or 24px (`spacing.6`) of vertical white space or a 2% shift in background hex.
- **Cards:** Apply `xl` (1.5rem) roundedness for large containers and `md` (0.75rem) for nested elements to create a rhythmic "nested" curve aesthetic.

### Liquid Chips
- **Selection Chips:** Use `secondary_container` with `on_secondary_container` text.
- **Status Chips:** Small, high-contrast pills with a subtle glow matching the status color (e.g., Error uses `error_container` with a 4% `error` glow).

### Additional: The "System Pulse" Loader
Instead of a spinning wheel, use a horizontal line that pulses with a `primary` to `primary_container` gradient, appearing to flow through the "liquid glass" surface.

---

## 6. Do's and Don'ts

### Do:
*   **Do** use asymmetrical layouts. Let an image overlap the boundary of a container to create depth.
*   **Do** use `on_surface_variant` for all non-essential text to ensure the `primary` green pop is meaningful.
*   **Do** use `backdrop-blur` (16px–32px) on any element that floats above the background.

### Don't:
*   **Don't** use pure white (#FFFFFF) for text. Use `on_surface` (#e4e3db) to maintain the premium, moody atmosphere.
*   **Don't** use 100% opaque borders. They break the "Liquid Glass" illusion.
*   **Don't** use standard drop shadows. If it doesn't look like ambient light, it doesn't belong in this system.
*   **Don't** crowd the layout. If in doubt, increase spacing by one tier on the scale (e.g., move from `spacing.8` to `spacing.10`).