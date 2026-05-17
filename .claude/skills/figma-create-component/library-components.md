# Component Index

Source: see [`figma.config.json`](../../../figma.config.json) `.library.fileUrl` (single source of truth for the published file key — the link below is for human navigation only).

[Figma file `<FIGMA_FILE_KEY>`](https://www.figma.com/design/<FIGMA_FILE_KEY>/MUI-Library)

Total: **93 components** on 1 page (31 component sets / primitives + 62 icon library entries). Before creating anything new, grep this file for the name — if it exists, import via `importComponentByKeyAsync` / `importComponentSetByKeyAsync` and reuse. Never recreate an existing component.

**Node IDs** are not listed here. The single source of truth is [`figma.config.json`](../../../figma.config.json) under `library.index.componentSetsAndPrimitives.<Name>.nodeId`, `library.index.icons.<Name>.nodeId`, and `library.index.componentSpecs.<Name>.*`. Look up the ID there at use time — duplicating it in this doc lets the two drift.

**Variant counts** in parentheses indicate the node is a `COMPONENT_SET` with that many variants; entries without a count are single `COMPONENT` nodes.

---

## Page: `Foundation Components` (id `<NODE_ID>`) — 93 components

### Component sets & primitives — 31 entries

| Name                          | Notes                     |
| ----------------------------- | ------------------------- |
| `<Button>`                    | SET (90)                  |
| `<IconButton>`                | SET (90)                  |
| `<DialogActions>`             |                           |
| `<DialogContent>`             | SET (2)                   |
| `<DialogTitle>`               |                           |
| `<Dialog>`                    | SET (5)                   |
| `<PaginationItem>`            | SET (288)                 |
| `<Pagination>`                | SET (36)                  |
| `<NavMenu>`                   | SET (2)                   |
| `<NavMenuItem>`               | SET (5)                   |
| `<TextField>`                 | SET (120)                 |
| `<Select>`                    | SET (120)                 |
| `<AutocompleteMenu>`          | SET (3)                   |
| `<AutocompleteOption>`        | SET (5)                   |
| `<AutocompleteMultipleValue>` | SET (3)                   |
| `<PinInput>`                  | SET (8)                   |
| `<Checkbox>`                  | SET (258)                 |
| `<CheckboxFormControl>`       | SET (276)                 |
| `<CheckboxGroup>`             | SET (54)                  |
| `<Radio>`                     | SET (174)                 |
| `<RadioFormControl>`          | SET (192)                 |
| `<RadioGroup>`                | SET (54)                  |
| `<FormLabel>`                 | SET (6)                   |
| `<DirectionFormControl>`      | SET (4)                   |
| `<Chip>`                      | SET (120)                 |
| `<Avatar>`                    |                           |
| `<Icon>`                      | SET (6) — variant wrapper |
| `<Snackbar>`                  | SET (15)                  |
| `<SnackbarSeverityIcon>`      | SET (4)                   |
| `<Tooltip>`                   | SET (24)                  |
| `<Typography>`                | SET (26)                  |

### Icon library — 62 entries

All icons are monochrome and intended to be used inside `<IconButton>`, `<Button>`, `<Chip>`, etc. The "Glyph source" column records the upstream Iconify name (mostly `material-symbols:*` from Google's `material-design-icons` family); the Figma component itself wraps an inline SVG vector authored against the 24×24 grid.

| Name               | Glyph source                                       |
| ------------------ | -------------------------------------------------- |
| ArrowSolid         | `material-symbols:arrow-back-ios-new-rounded`      |
| ArrowFilled        | `material-symbols:arrow-back-2`                    |
| User               | `gg:profile`                                       |
| Detail             | `bx:detail`                                        |
| Close              | `mingcute:close-fill`                              |
| Delete             | `material-symbols:delete-outline`                  |
| Lock               | `mingcute:lock-fill`                               |
| Unlock             | `mingcute:unlock-fill`                             |
| Eye                | `mdi:eye`                                          |
| EyeClose           | `mdi:eye-off`                                      |
| Email              | `material-symbols:mail-outline-rounded`            |
| EmailSend          | `material-symbols:outgoing-mail-outline`           |
| Logout             | `material-symbols:logout`                          |
| Loading            | `tdesign:loading`                                  |
| Route              | `material-symbols:route`                           |
| Audit              | `material-symbols:order-approve-outline-sharp`     |
| Log                | `material-symbols:event-note-outline-rounded`      |
| Menu               | `material-symbols:menu`                            |
| Admin              | `material-symbols:admin-panel-settings-outline`    |
| Edit               | `material-symbols:edit-square-outline-rounded`     |
| Verified           | `material-symbols:verified-user-outline`           |
| UserChecked        | `ri:user-follow-fill`                              |
| UserDisabled       | `ri:user-forbid-fill`                              |
| CheckCircleSolid   | `material-symbols:check-circle-outline`            |
| CheckCircleFilled  | `material-symbols:check-circle`                    |
| WarnCircleSolid    | `material-symbols:error-outline-rounded`           |
| WarnCircleFilled   | `material-symbols:error-rounded`                   |
| DangerCircleSolid  | `material-symbols:dangerous-outline`               |
| DangerCircleFilled | `material-symbols:dangerous-rounded`               |
| More               | `material-symbols:more-vert`                       |
| Download           | `material-symbols:download`                        |
| Copy               | `material-symbols:content-copy-outline`            |
| Check              | `material-symbols:check-rounded`                   |
| Upload             | `material-symbols:upload`                          |
| Link               | `material-symbols:link`                            |
| Empty              | _(custom — empty-state placeholder)_               |
| i18n               | `material-symbols:translate`                       |
| SelectArrow        | `material-symbols:select-arrow`                    |
| Search             | `material-symbols:search`                          |
| Add                | `material-symbols:add-diamond-outline-sharp`       |
| Home               | `material-symbols:home-outline`                    |
| Settings           | `material-symbols:settings-outline`                |
| Filter             | `material-symbols:filter-list`                     |
| Notifications      | `material-symbols:notifications-outline`           |
| Calendar           | `material-symbols:calendar-month-outline`          |
| Refresh            | `material-symbols:refresh`                         |
| Star               | `material-symbols:star-outline`                    |
| Help               | `material-symbols:help-outline`                    |
| Folder             | `material-symbols:folder-outline`                  |
| Share              | `material-symbols:share-outline`                   |
| ChevronUp          | `material-symbols:keyboard-arrow-up`               |
| ChevronDown        | `material-symbols:keyboard-arrow-down`             |
| ChevronLeft        | `material-symbols:keyboard-arrow-left`             |
| ChevronRight      | `material-symbols:keyboard-arrow-right`             |
| ArrowUp            | `material-symbols:arrow-upward`                    |
| ArrowDown          | `material-symbols:arrow-downward`                  |
| Save               | `material-symbols:save-outline`                    |
| Print              | `material-symbols:print-outline`                   |
| Bookmark           | `material-symbols:bookmark-outline`                |
| Phone              | `material-symbols:call-outline`                    |
| CloseCircleSolid   | `material-symbols:cancel-outline`                  |
| CloseCircleFilled  | `material-symbols:cancel`                          |
