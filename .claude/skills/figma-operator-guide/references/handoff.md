# Handoff readiness

Fidelity to the mock isn't the finish line. The file also has to communicate intent to the next person (or agent) that opens it.

## 1. Information hierarchy

### Weak hierarchy

**Symptom:** Everything visually the same weight — the primary action competes with tertiary links; headings don't read as headings.
**Fix:** One clear primary action per screen region. Use size, weight, and color from the type/color systems to enforce scan order (F/Z pattern respected where applicable).

### Generic "AI slop" layouts

**Symptom:** Hero + three-column feature cards + CTA — the default template the model reaches for regardless of the task.
**Fix:** Start from the **user's task**, not a layout template. If the same macro-layout keeps appearing across unrelated features, the model is defaulting — reset and design from the task.

## 2. Developer annotations

**Symptom:** Animations, conditional visibility, validation rules, empty-state copy, and role-based differences implied by visuals alone.

**Fix:** Add dev-mode annotations or a dedicated `✏️ Notes` frame for anything a developer would otherwise have to guess:

- Transition / animation timing
- What triggers a state change
- Validation messages and rules
- Permission / role gating
- Empty-state copy and illustrations
- Accessibility labels (see [accessibility.md](accessibility.md))

## 3. Code Connect mappings

**Symptom:** Components that have a real code counterpart aren't mapped, so Dev Mode shows generated pseudo-code instead of the actual import statement.

**Fix:** When a Figma component corresponds 1:1 to a real code component in the repo, add the Code Connect mapping. See the `figma:figma-code-connect` skill for the mechanics.

## Self-check

- [ ] One clear primary action per screen region; headings read as headings.
- [ ] The macro-layout is driven by the task, not a reusable template shape.
- [ ] Non-visual behaviors (animation, validation, role gating, empty-state copy) are annotated.
- [ ] Every component with a code counterpart has a Code Connect mapping.
