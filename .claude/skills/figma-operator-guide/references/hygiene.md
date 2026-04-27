# File hygiene: leave the file navigable

Designers and downstream AI agents both rely on structure. Dirty files silently degrade every tool that touches them.

## 1. Meaningful layer names

**Symptom:** `Frame 247`, `Rectangle 12`, `Group 7`, `Component 1 Copy 3` throughout.

**Why it matters:**

- Designers can't navigate.
- Code Connect, audit plugins, and handoff tools reason about intent from layer names.
- Figma's own accessibility / touch-target detection is **name-based**.

**Fix:** Name every frame, group, and component by **role**, not shape — `Header`, `Action Bar`, `Tag / Success`, `Policy Row`. If you use Figma's AI rename pass, verify results — it only touches default names and can hallucinate.

## 2. Orphan / hidden layers

**Symptom:** Invisible layers, zero-opacity rectangles, leftover scratch frames off-canvas.

**Fix:** Sweep before declaring done. They inflate file size and confuse both humans and agents.

## 3. Detached instances

**Symptom:** A raw frame copy where an instance should be — usually because the model edited past the component's override surface, or the main component was deleted.

**Fix:** Never detach to "tweak." Extend the main component (new variant / property) and keep the instance. Treat any detached instance as a bug. See [component-rules.md](component-rules.md).

## 4. Page organization

**Symptom:** Screens, components, explorations, and scratch work all on `Page 1`.

**Fix:** Respect the file's existing page convention — e.g. `📐 Cover`, `🧩 Components`, `🖼 Screens`, `🧪 Explorations`. New components belong on the components / library page, not inline next to the consuming screen.

## Self-check

- [ ] No layer is named `Frame NN` / `Rectangle N` / default-style.
- [ ] No hidden, zero-opacity, or off-canvas debris.
- [ ] Zero detached instances.
- [ ] New nodes placed on the appropriate page, not dumped on `Page 1`.
