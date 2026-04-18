# Design System: Curator AI (Lime)
**Project ID:** 10418640775991713138

## 1. Visual Theme & Atmosphere
**The Digital Curator**
This design system moves beyond standard utilitarian interfaces into a high-end editorial experience. It embraces a premium, bespoke aesthetic characterized by intentional asymmetry, high-contrast typography scales, and layered glassmorphism. It explicitly rejects the "generic SaaS" look, leaning into a deep, authoritative tech environment punctuated by electric gradients and glowing accents. The atmosphere is dense but refined, feeling both professional and cutting-edge.

## 2. Color Palette & Roles
*   **Deep Tech Blue (Background):** `#0b1326` - The core foundation. An infinite, pigmented dark that establishes the premium editorial feel.
*   **Electric Purple (Primary):** `#7C3AED` (Override of original `#d2bbff`) - The "Hero" spark. Used for primary actions and crucial focal points.
*   **Cyan Pulse (Tertiary):** `#22D3EE` (Override of original `#2fd9f4`) - High-priority status indicators, data visualization, and subtle interactive glows.
*   **Low Surface (Sections):** `#131b2e` - Used for subtle structural grouping without borders.
*   **Elevated Surface (Cards):** `#171f33` or `#222a3d` - The primary background for interactive Bento cards and feature containers.
*   **Ghost Outline (Outline Variant):** `#45464d` - Used at 20% opacity as a fallback when accessibility requires a physical border.

## 3. Typography Rules
The typography blends geometric precision with utilitarian clarity.
*   **Display / Headlines:** *Plus Jakarta Sans*. Used for high-level branding, large impactful headlines (tight `-0.02em` tracking), and section headers. Creates the "Premium Magazine" feel.
*   **Body / Data:** *Inter*. The workhorse font for clarity in analysis portions and dense text blocks.
*   **Labels:** *Inter*. Used in All-Caps with wide `0.05em` tracking for metadata, category tags, or small status indicators.

## 4. Component Stylings
*   **Buttons:** Shapes use small-to-medium pill radiuses (`rounded-xl` or `rounded-2xl`). Primary buttons use a linear gradient background (`primary` to `primary_container`) with a subtle `tertiary` (Cyan) outer glow on hover to create "soul" and dimension.
*   **Bento Cards/Containers:** Strictly borderless. Depth and separation are achieved through background color shifts (e.g., `#171f33` sitting on `#0b1326`). Components must have at least `rounded-sm` corners (rejecting sharp `none` radiuses).
*   **Glass & Gradient (Floating Elements):** Popovers, modals, or floating headers use a `surface_variant` (`#2d3449`) base at 60% opacity paired with a heavy `backdrop-blur: 24px` for immersive depth.
*   **Inputs/Forms (The Inset Look):** Unfocused inputs use the recessed `surface_container_lowest` (`#060e20`) with a subtle blur. On focus, the Ghost Border transitions to 100% opacity of the Cyan (`#22D3EE`) color.

## 5. Layout Principles
*   **The "No-Line" Rule:** 1px solid borders are strictly prohibited for sectioning content. Boundaries are defined by tonal shifts between surface layers.
*   **Asymmetrical Bento Grids:** Layouts favor balanced asymmetry over rigid grids (e.g., a 66% width hero card paired with stacked 33% width secondary cards).
*   **Breathing Room:** Major sections utilize extensive vertical margins (8.5rem/`spacing-24`) to allow the high-end editorial typography space to breathe. Internal card padding is generous (2rem/`p-8`).
*   **Tonal Layering & Depth:** Ambient shadows are soft and diffused (e.g., an 8% opacity dark tint with a massive 7rem blur radius) instead of harsh drop shadows. Nested data relies on progressively lighter surface layers rather than structural lines.
