# Design System

## Philosophy

- Clean
- Friendly
- Calm
- Functional over decorative

---

## Core Principles

1. Clarity over visual noise
2. Consistency over one-off styling
3. Comfortable spacing for longer study sessions
4. Soft feedback instead of harsh UI contrast
5. Appearance should respect user preference without changing product structure

---

## Visual Direction

- Product feel: focused, mature, approachable
- Avoid: neon tones, dashboard-like density, noisy micro-surfaces
- Prefer: soft surfaces, clear hierarchy, readable helper copy, obvious primary actions

---

## Themes

Supported appearance modes:
- `System`
- `Light`
- `Dark`

The active theme must flow through the shared theme layer, navigation container, tab bar, and screen/component surfaces. Theme state must not be implemented as isolated one-off screen styles.

---

## Palette

### Light

- Background: `#F7F8FC`
- Surface: `#FFFFFF`
- Surface muted: `#EEF1F7`
- Text primary: `#162033`
- Text secondary: `#5B6780`
- Text muted: `#8A94A6`
- Primary: `#4F7CFF`
- Primary pressed: `#3E68E8`
- Primary soft: `#E8F0FF`
- Success: `#35B67A`
- Success soft: `#E7F8EF`
- Warning: `#F0A54A`
- Warning soft: `#FFF3E3`
- Error: `#E35D6A`
- Error soft: `#FDECEF`
- Border: `#D8DFEA`
- Border strong: `#C4CEDD`

### Dark

- Background: `#0F1521`
- Surface: `#161E2C`
- Surface muted: `#1D2738`
- Text primary: `#F3F6FF`
- Text secondary: `#B7C1D4`
- Text muted: `#8B96AA`
- Primary: `#7D9EFF`
- Primary pressed: `#6B8EF5`
- Primary soft: `#223152`
- Success: `#4FD093`
- Success soft: `#1C3A2B`
- Warning: `#F3B868`
- Warning soft: `#3A2D1D`
- Error: `#F07A86`
- Error soft: `#3B2027`
- Border: `#2A364A`
- Border strong: `#394963`

---

## Components

- Screen header card
- Surface card
- Primary button
- Secondary button
- Choice chip
- Feedback state card
- Readiness badge
- Study card

---

## Layout

- 8pt spacing base with larger breathing room on main cards
- Rounded surfaces for group clarity
- Helper text should stay close to the control it explains
- Empty and loading states should remain centered and calm

---

## Typography

- Hero
- Title
- Subtitle
- Body
- Body small
- Caption
- Overline

---

## State Rules

Must exist for:
- Empty state
- Loading state
- Error state
- Success/summary state

States should be:
- actionable
- low-noise
- visually consistent with the same surface language used elsewhere

---

## Study Screen Rules

- Should feel like a focused session mode, not a utility page
- Setup remains visible and clear before the session starts
- Current session context remains visible while studying
- Feedback should feel calm and informative, not punitive

---

## Forbidden

- Random styles per screen
- Harsh feedback colors without soft backgrounds
- Dense layout blocks with no breathing room
- Inline styles everywhere
- Unstructured UI
