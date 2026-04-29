# Component Index

Source: [Figma file `KQjP6W9Uw1PN0iipwQHyYn`](https://www.figma.com/design/KQjP6W9Uw1PN0iipwQHyYn/MUI-Library)

Total: **83 components** on 1 page (22 component sets / primitives + 61 icon library entries). Before creating anything new, grep this file for the name — if it exists, import via `importComponentByKeyAsync` / `importComponentSetByKeyAsync` and reuse. Never recreate an existing component.

**Variant counts** in parentheses indicate the node is a `COMPONENT_SET` with that many variants; entries without a count are single `COMPONENT` nodes.

---

## Page: `Foundation Components` (id `0:1`) — 63 components

### Component sets & primitives — 22 entries

| Name                     | Node ID    | Notes      |
| ------------------------ | ---------- | ---------- |
| `<Button>`               | `1:4109`   | SET (90)   |
| `<IconButton>`           | `1:4571`   | SET (90)   |
| `<DialogActions>`        | `1:4757`   |            |
| `<DialogContent>`        | `1:4761`   | SET (2)    |
| `<DialogTitle>`          | `1:4768`   |            |
| `<Dialog>`               | `1:4772`   | SET (5)    |
| `<PaginationItem>`       | `1:5098`   | SET (288)  |
| `<Pagination>`           | `1:5675`   | SET (36)   |
| `<NavigateBefore>`       | `224:4189` | SET (3)    |
| `<NavigateNext>`         | `224:4199` | SET (3)    |
| `<TextField>`            | `1:6266`   | SET (120)  |
| `<Checkbox>`             | `1:7228`   | SET (258)  |
| `<CheckboxFormControl>`  | `1:7367`   | SET (276)  |
| `<CheckboxGroup>`        | `306:6886` | SET (54)   |
| `<Radio>`                | `292:6292` | SET (174)  |
| `<RadioFormControl>`     | `295:5573` | SET (192)  |
| `<RadioGroup>`           | `296:5915` | SET (54)   |
| `<FormLabel>`            | `1:7696`   | SET (6)    |
| `<DirectionFormControl>` | `1:7709`   | SET (4)    |
| `<Chip>`                 | `342:7102` | SET (60)   |
| `<Avatar>`               | `394:7033` |            |
| `<Icon>`                 | `3:2722`   | SET (6) — variant wrapper |

### Icon library — 62 entries

All icons are monochrome and intended to be used inside `<IconButton>`, `<Button>`, `<Chip>`, etc. The "Glyph source" column records the upstream Iconify name (mostly `material-symbols:*` from Google's `material-design-icons` family); the Figma component itself wraps an inline SVG vector authored against the 24×24 grid.

| Name               | Node ID    | Glyph source                                       |
| ------------------ | ---------- | -------------------------------------------------- |
| ArrowSolid         | `3:2740`   | `material-symbols:arrow-back-ios-new-rounded`      |
| ArrowFilled        | `3:2744`   | `material-symbols:arrow-back-2`                    |
| User               | `3:2748`   | `gg:profile`                                       |
| Detail             | `3:2754`   | `bx:detail`                                        |
| Close              | `3:2759`   | `mingcute:close-fill`                              |
| Delete             | `3:2765`   | `material-symbols:delete-outline`                  |
| Lock               | `3:2769`   | `mingcute:lock-fill`                               |
| Unlock             | `3:2775`   | `mingcute:unlock-fill`                             |
| Eye                | `3:2781`   | `mdi:eye`                                          |
| EyeClose           | `3:2785`   | `mdi:eye-off`                                      |
| Email              | `3:2789`   | `material-symbols:mail-outline-rounded`            |
| EmailSend          | `3:2793`   | `material-symbols:outgoing-mail-outline`           |
| Logout             | `3:2797`   | `material-symbols:logout`                          |
| Loading            | `3:2801`   | `tdesign:loading`                                  |
| Route              | `3:2805`   | `material-symbols:route`                           |
| Audit              | `3:2809`   | `material-symbols:order-approve-outline-sharp`     |
| Log                | `3:2813`   | `material-symbols:event-note-outline-rounded`      |
| Menu               | `3:2817`   | `material-symbols:menu`                            |
| Admin              | `3:2821`   | `material-symbols:admin-panel-settings-outline`    |
| Edit               | `3:2825`   | `material-symbols:edit-square-outline-rounded`     |
| Verified           | `3:2829`   | `material-symbols:verified-user-outline`           |
| UserChecked        | `3:2833`   | `ri:user-follow-fill`                              |
| UserDisabled       | `3:2837`   | `ri:user-forbid-fill`                              |
| CheckCircleSolid   | `3:2841`   | `material-symbols:check-circle-outline`            |
| CheckCircleFilled  | `3:2845`   | `material-symbols:check-circle`                    |
| WarnCircleSolid    | `3:2849`   | `material-symbols:error-outline-rounded`           |
| WarnCircleFilled   | `3:2853`   | `material-symbols:error-rounded`                   |
| DangerCircleSolid  | `3:2857`   | `material-symbols:dangerous-outline`               |
| DangerCircleFilled | `3:2861`   | `material-symbols:dangerous-rounded`               |
| More               | `3:2865`   | `material-symbols:more-vert`                       |
| Download           | `3:2869`   | `material-symbols:download`                        |
| Copy               | `3:2873`   | `material-symbols:content-copy-outline`            |
| Check              | `3:2877`   | `material-symbols:check-rounded`                   |
| Upload             | `3:2881`   | `material-symbols:upload`                          |
| Link               | `3:2885`   | `material-symbols:link`                            |
| Empty              | `3:2889`   | _(custom — empty-state placeholder)_               |
| i18n               | `3:2896`   | `material-symbols:translate`                       |
| SelectArrow        | `3:2900`   | `material-symbols:select-arrow`                    |
| Search             | `3:2904`   | `material-symbols:search`                          |
| Add                | `3:2908`   | `material-symbols:add-diamond-outline-sharp`       |
| Home               | `475:7459` | `material-symbols:home-outline`                    |
| Settings           | `477:7463` | `material-symbols:settings-outline`                |
| Filter             | `479:7463` | `material-symbols:filter-list`                     |
| Notifications      | `479:7466` | `material-symbols:notifications-outline`           |
| Calendar           | `479:7469` | `material-symbols:calendar-month-outline`          |
| Refresh            | `479:7472` | `material-symbols:refresh`                         |
| Star               | `481:7463` | `material-symbols:star-outline`                    |
| Help               | `481:7466` | `material-symbols:help-outline`                    |
| Folder             | `481:7469` | `material-symbols:folder-outline`                  |
| Share              | `481:7472` | `material-symbols:share-outline`                   |
| ChevronUp          | `512:7497` | `material-symbols:keyboard-arrow-up`               |
| ChevronDown        | `512:7501` | `material-symbols:keyboard-arrow-down`             |
| ChevronLeft        | `512:7505` | `material-symbols:keyboard-arrow-left`             |
| ChevronRight       | `512:7509` | `material-symbols:keyboard-arrow-right`            |
| ArrowUp            | `512:7513` | `material-symbols:arrow-upward`                    |
| ArrowDown          | `513:7497` | `material-symbols:arrow-downward`                  |
| Save               | `513:7501` | `material-symbols:save-outline`                    |
| Print              | `513:7505` | `material-symbols:print-outline`                   |
| Bookmark           | `513:7509` | `material-symbols:bookmark-outline`                |
| Phone              | `513:7513` | `material-symbols:call-outline`                    |
| CloseCircleSolid   | `590:7638` | `material-symbols:cancel-outline`                  |
| CloseCircleFilled  | `665:11127` | `material-symbols:cancel`                         |
