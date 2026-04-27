# Accessibility: catch what the mock hides

A visually polished mock can be completely unusable. Verify these before claiming done.

## 1. Contrast

**Symptom:** Light gray text on white. Low-contrast placeholder text. Disabled states indistinguishable from enabled.

**Fix:** Verify WCAG AA with a contrast plugin:

- **Body text:** ≥ 4.5 : 1
- **Large text (≥ 18.66px bold / 24px regular):** ≥ 3 : 1
- **Non-text UI (icons, input borders, focus rings):** ≥ 3 : 1

AI frequently picks aesthetic low-contrast palettes — always verify.

## 2. Touch / click targets

**Symptom:** A 20×20 icon button with no padded hit area.

**Fix:** Interactive targets ≥ **44 × 44** effective size. Achieve this with Auto Layout **padding on the interactive frame** — not with a separate invisible rectangle behind the icon.

## 3. Icon-only controls

**Symptom:** Icon button with no text, no tooltip annotation, no accessible-label note.

**Fix:** Annotate the intended label (tooltip text, `aria-label`) on the component property or in a dev-note so implementation isn't guessed. See [handoff.md](handoff.md) for annotation conventions.

## 4. Focus visibility

If the system publishes a focus-ring style, apply it on every interactive component's focus variant. "No visible focus state" is an accessibility bug, not a style choice.

## Self-check

- [ ] WCAG AA contrast passes on text and non-text UI.
- [ ] All interactive targets ≥ 44 × 44 effective.
- [ ] Every icon-only control has an accessible-label note.
- [ ] Every interactive component has a visible focus state.
