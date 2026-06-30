# Kotieshwara Associates Website - Context & Technical Report

This document provides a comprehensive overview of the **Kotieshwara Associates** Solar energy showcase website, listing all active sections, layout structures, visual effects, and behavioral animations implemented.

---

## 🏛️ Website Structure & Sections

The application is built as a single-page landing page (`index.html`) optimized for rapid response times, high client trust, and lead extraction.

| Section | Target Pointer | Layout Description |
| :--- | :--- | :--- |
| **1. Header & Navigation** | `#navbar` | Semitransparent sticky top-bar wrapping logo branding, interactive page anchors, and dynamic scroll track indicators. |
| **2. Hero & Lead Capture** | `#hero` | Dual-column premium split. Left side: Tagline headings, brand caption, trust badge. Right side: High-conversion quote request form. |
| **3. Products Showcase** | `#products` | Perfectly balanced 2-column card grid highlighting *Solar Rooftop Systems* and *Solar Street Lights*. |
| **4. Expert Services** | `#services` | 3-column service catalog layout summarizing *Supply & Distribution*, *Installation*, and *Maintenance*. |
| **5. Implementation Timeline** | `.process-section` | Alternating timeline step-by-step layout (*Site Survey*, *System Design*, *Installation*, *Savings*) using custom-made illustrations. |
| **6. Savings Calculator** | `#calculator` | Card layout featuring user billing input filters and an expanding details summary dashboard. |
| **7. Testimonial Scroll-track** | `.testimonials-section` | Multi-card horizontal swipe scrollboard displaying real-world client reviews. |
| **8. Interactive FAQs** | `.faq-section`| Centered vertical stack of toggle-active accordion cards answering standard inquiries. |
| **9. Navigation Footer** | `footer` | Deep navy block organizing site maps, contact numbers, address, and legal details. |
| **10. Mobile Sticky Form Bar** | `#mobileStickyForm` | Persistent overlay slide bar locked to mobile screen bottoms to capture on-the-go leads. |

---

## 💫 Interactive Effects & Animations

To deliver a premium, modern experience, the website utilizes a customized suite of visual effects, scroll events, and hardware-accelerated animations:

### 1. Header Navigation Indicators & Sticky State
*   **Dynamic Scroll Progress Bar (`#scrollProgress`)**: A high-performance horizontal progress bar aligned to the top edge of the viewport. JavaScript calculates the scroll ratio:
    $$\text{percent} = \frac{\text{window.scrollY}}{\text{scrollHeight} - \text{clientHeight}} \times 100$$
    and updates the CSS width dynamically.
*   **Sticky Header Switch**: Scrolls past `60px` trigger `.scrolled` state class injecting a solid white backdrop filters and navy color updates.
*   **Dynamic Logo CSS Filter inversion**: The `KA-logo.png` image toggles filters dynamically:
    *   *Default Hero Position*: `filter: brightness(0) invert(1)` renders the logo as solid white to offer clean contrast on the dark background image.
    *   *Scrolled Sticky Position*: Removes filters to render the monogram in its original deep navy blue color against the white header state.

### 2. Premium Hero Interactions
*   **Interactive Background Parallax**: JavaScript tracks scrolling positions and translates the `.hero` background Y coordinate:
    $$\text{backgroundPositionY} = \text{scrollY} \times 0.45 \text{ px}$$
    This creates an immersive 3D parallax scroll depth where the background shifts slower than foreground form card.
*   **Masked Tagline Word-Clip reveal**: The primary tagline ("Your Trusted Solar Partner.") is encased in masked inline-block spans (`overflow: hidden`). When loaded, inner words ascend from below (`translateY(110%)` to `translateY(0)`) using staggered animation-delays (`0.15s`, `0.28s`, `0.4s`, `0.52s`) over cubic-bezier curves for a high-end cinematic fade.
*   **Staggered Fade Slide-Up**: Text subtitles and badges fade in and slide up (`translateY(25px)` to `0`) stouter after the tagline reveals complete.

### 3. Cards & Hover Transitions
*   **Products & Services Hover Lift**: Floating Cards (`.product-card`, `.service-card`, `.segment-card`) translate upwards by `-6px` to `-8px` while drawing rich, diffused drop shadows (`rgba(29, 78, 216, 0.08)`) and matching primary blue borders on hover.
*   **Image Zoom Scale**: Timeline process graphics scale smoothly to `1.05` zoom factor when users focus or hover their parent cards.

### 4. Mathematical Calculator Expander
*   **Expansion Transition**: Triggering the ROI calculator submits a calculation script. The dashboard outcome panel (`.calc-result`) expands from `max-height: 0` to `500px` using CSS transition curves to prevent sudden layout jumps.

### 5. Accordions & Sliding Toggles
*   **FAQ Drawer Swaps**: Tapping FAQ headers toggles active states. Javascript measures current active panels and expands/collapses heights smoothly using transition animations.
