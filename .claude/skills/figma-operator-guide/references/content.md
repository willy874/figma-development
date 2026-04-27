# Content: realistic, honest, stress-tested

Placeholder content hides layout bugs. Invented product copy creates downstream confusion. Both are easy to avoid.

## 1. No Lorem ipsum, no generic placeholders

**Symptom:** `Lorem ipsum dolor sit amet`, `John Doe`, `user@example.com`, `$1,234.56` in every text slot.

**Why it matters:** Stakeholders review _content_ and _information hierarchy_, not boxes. Generic placeholders mask truncation bugs, wrap issues, and empty-state problems.

**Fix:** Use realistic, domain-accurate strings. For this repo (Merak / ZTNA), prefer:

- Service names: `payroll-api`, `jira-prod`, `hr-portal`
- Routes / hosts: `10.0.12.44:5432`, `vpn.corp.internal`
- Policy titles: `Finance → SAP (business hours)`, `Contractors read-only DB`
- Roles: `Network Engineer`, `Security Reviewer`, `Operations Manager`

## 2. Don't hallucinate product copy

**Symptom:** Button labels, headings, or menu items the model _invented_ that don't match the product's voice or existing feature naming.

**Fix:**

- Cross-check labels against existing screens or i18n keys before writing them.
- If the exact string is unknown, mark it `[TBD: <short description of intent>]` — do **not** invent authoritative-looking copy that a reviewer might believe is final.
- Prefer reusing phrasing that exists elsewhere in the product over coining new terminology.

## 3. Stress-test with real-shape data

**Symptom:** Every table row contains short, uniform strings. Layout breaks the moment a real 40-character value appears.

**Fix:** Include, at minimum:

- One row with a realistically **long** value (truncation / wrap)
- One row with an **empty** value (null / missing data state)
- One **edge case** (very large number, long date, multi-line address, zero, negative, etc.)

If the screen has empty, loading, or error states, that coverage lives in [states.md](states.md).

## Self-check

- [ ] No Lorem ipsum, no `John Doe`-style placeholders.
- [ ] Product copy either came from the spec / existing UI or is clearly marked `[TBD: …]`.
- [ ] At least one long value, one empty value, and one edge case in any list / table.
- [ ] Content uses the product's domain vocabulary, not generic SaaS filler.
