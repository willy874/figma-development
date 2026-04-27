# Discovery: before you write anything to Figma

The single highest-leverage step. Skipping it causes the two most expensive failure modes — rebuilding components from rectangles, and inventing tokens that don't exist.

## Required order, every session

1. **`get_libraries`** — know which libraries are enabled in this file.
2. **`search_design_system(<concept>)`** — run once per distinct element you intend to create (`"button"`, `"input"`, `"tag"`, `"modal"`, `"table"`, `"avatar"`…). Do this **before** drafting geometry.
3. **`get_variable_defs`** — load the variable namespace (color, spacing, radius, typography) so every later binding references a real token.

## Rules

- **No new rectangle-and-text "button" if `search_design_system("button")` returns a match.** Same rule for every primitive.
- When an existing component is "close but not exact," prefer reusing it and flagging the mismatch to the user, over building a one-off copy.
- When search returns nothing, say so explicitly before falling back to building from scratch — and consider whether a new reusable component should be published (see [components.md](components.md)).
- Treat `get_variable_defs` output as the source of truth for colors/spacing/typography. The screenshot is a visual target, not a token spec.

## Self-check before leaving discovery

- [ ] I know which libraries are enabled.
- [ ] For every distinct UI primitive in the target design, I searched the design system.
- [ ] I have the variable namespace loaded and know roughly which tokens cover the design's colors / spacings / radii / typography.

Only after all three are true should you start placing nodes.
