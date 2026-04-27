# 天璇 Component Index

Source: [Figma file `stse2CgIzOugynEdDSexS4`](https://www.figma.com/design/stse2CgIzOugynEdDSexS4/%E5%A4%A9%E7%92%87)

Total: **122 components** across 8 pages. Before creating anything new, grep this file for the name — if it exists, import via `importComponentByKeyAsync` / `importComponentSetByKeyAsync` and reuse. Never recreate an existing component.

**Variant counts** in parentheses indicate the node is a `COMPONENT_SET` with that many variants; entries without a count are single `COMPONENT` nodes.

---

## Page: `Icon` (id `796:7165`) — 41 components

Single icon library. All icons are monochrome and intended to be used inside `<IconButton>`, `<Button>`, `<Chip>`, etc.

| Name               | Node ID       | Notes                     |
| ------------------ | ------------- | ------------------------- |
| `<Icon>`           | `798:7408`    | SET (6) — variant wrapper |
| ArrowSolid         | `798:7398`    |                           |
| ArrowFilled        | `798:7414`    |                           |
| User               | `798:7415`    |                           |
| Detail             | `798:7417`    |                           |
| Close              | `798:7423`    |                           |
| Delete             | `798:7424`    |                           |
| Lock               | `798:7419`    |                           |
| Unlock             | `798:7420`    |                           |
| Eye                | `798:7421`    |                           |
| EyeClose           | `798:7422`    |                           |
| Email              | `798:7425`    |                           |
| EmailSend          | `798:7426`    |                           |
| Logout             | `798:7416`    |                           |
| Loading            | `798:9295`    |                           |
| Route              | `856:9779`    |                           |
| Audit              | `856:9780`    |                           |
| Log                | `856:9781`    |                           |
| Menu               | `856:9782`    |                           |
| Admin              | `857:9815`    |                           |
| Edit               | `924:18057`   |                           |
| Verified           | `858:10233`   |                           |
| UserChecked        | `858:10234`   |                           |
| UserDisabled       | `858:10235`   |                           |
| CheckCircleSolid   | `943:31003`   |                           |
| CheckCircleFilled  | `943:31004`   |                           |
| WarnCircleSolid    | `943:31105`   |                           |
| WarnCircleFilled   | `943:31106`   |                           |
| DangerCircleSolid  | `943:31107`   |                           |
| DangerCircleFilled | `943:31108`   |                           |
| More               | `949:32737`   |                           |
| Download           | `949:36120`   |                           |
| Copy               | `949:36161`   |                           |
| Check              | `966:37034`   |                           |
| Upload             | `966:37083`   |                           |
| Link               | `989:38513`   |                           |
| Empty              | `1006:64453`  |                           |
| i18n               | `1023:27867`  |                           |
| SelectArrow        | `1182:32187`  |                           |
| Search             | `1182:36341`  |                           |
| Add                | `1186:318093` |                           |

---

## Page: `Utils Component` (id `114:1136`) — 52 components

The MUI-aligned primitive library. Names prefixed with `<...>` mirror MUI component names. Prefer **`<Merak*>`** variants for new designs — they are the project's current button/pagination family.

### Buttons & Links

| Name              | Node ID     | Variants                                  |
| ----------------- | ----------- | ----------------------------------------- |
| `<Button>`        | `594:1489`  | SET (360)                                 |
| `<LoadingButton>` | `594:4472`  | SET (9)                                   |
| `<IconButton>`    | `594:4767`  | SET (135)                                 |
| `<Link>`          | `770:17666` | SET (1)                                   |
| `<MerakButton>`   | `2701:8763` | SET (162) — **preferred for new designs** |

### Inputs & Form fields

| Name                       | Node ID      | Variants                        |
| -------------------------- | ------------ | ------------------------------- |
| `<TextField>`              | `596:531`    | SET (61)                        |
| `<TextField> \| Multiline` | `596:1400`   | SET (21)                        |
| `<PinInput>`               | `709:23273`  | SET (2)                         |
| `<InputLabel>`             | `735:21712`  | SET (9)                         |
| `<FormLabel>`              | `763:21226`  | SET (9)                         |
| `<FormHelperText>`         | `763:21302`  | SET (3)                         |
| `<Select>`                 | `1182:31681` | SET (9)                         |
| LegacySelect               | `890:10926`  | SET (2) — avoid, use `<Select>` |

### Selection controls

| Name                    | Node ID     | Variants  |
| ----------------------- | ----------- | --------- |
| `<Checkbox>`            | `601:30205` | SET (246) |
| `<CheckboxFormControl>` | `601:31034` | SET (8)   |
| `<CheckboxGroup>`       | `917:10412` | SET (3)   |
| `<Radio>`               | `901:14217` | SET (14)  |
| `<RadioFormControl>`    | `914:14377` | SET (8)   |
| `<RadioGroup>`          | `915:10019` | SET (3)   |
| `<Switch>`              | `919:13562` | SET (14)  |
| `<SwitchFormControl>`   | `919:13680` | SET (4)   |

### Navigation & lists

| Name                    | Node ID     | Variants  |
| ----------------------- | ----------- | --------- |
| `<Navbar>`              | `801:28925` | SET (2)   |
| `<ListItem>`            | `801:29216` | SET (5)   |
| `<MenuList>`            | `889:10069` |           |
| `<Menu>`                | `890:10528` |           |
| `<MerakPagination>`     | `2938:1343` | SET (36)  |
| `<MerakPaginationItem>` | `2937:1262` | SET (288) |

### Dialog

| Name               | Node ID     | Variants |
| ------------------ | ----------- | -------- |
| `<Dialog>`         | `720:25652` | SET (5)  |
| `<DialogElements>` | `720:25378` |          |
| `<DialogActions>`  | `725:22068` | SET (3)  |
| `<DialogContent>`  | `727:21600` | SET (2)  |
| `<DialogTitle>`    | `720:25215` |          |
| Backdrop           | `922:16422` |          |

### Stepper

| Name               | Node ID     | Variants |
| ------------------ | ----------- | -------- |
| StepElements       | `768:10012` | SET (3)  |
| `<MobileStepper>`  | `768:7991`  | SET (3)  |
| `<DesktopStepper>` | `768:9719`  | SET (2)  |

### Table

| Name                | Node ID     | Variants |
| ------------------- | ----------- | -------- |
| `<Table>`           | `787:28359` | SET (3)  |
| `<TableHead>`       | `787:25555` |          |
| `<TableHeadRow>`    | `787:26007` | SET (3)  |
| `<TableCellAction>` | `790:5709`  |          |
| `<TableCellText>`   | `793:5790`  |          |
| `<TableCell>`       | `878:24214` | SET (2)  |
| `<TableRow>`        | `787:27912` | SET (3)  |
| `<TableBody>`       | `801:9862`  | SET (6)  |

### Surface, feedback, misc

| Name                | Node ID      | Variants |
| ------------------- | ------------ | -------- |
| `<Typography>`      | `769:2891`   | SET (13) |
| `<Tooltip>`         | `770:3159`   | SET (5)  |
| `<Paper>`           | `880:31398`  | SET (1)  |
| `<Chip>`            | `929:22513`  | SET (22) |
| `<Snackbar>`        | `1110:34425` |          |
| `<SnackbarContent>` | `1110:34207` |          |
| Empty               | `1006:64502` |          |
| Spinning            | `1010:79721` |          |

---

## Empty pages (no components)

`Wireframe` (`0:1`), `User Flow` (`1186:334575`), `--- UI Kit ---` (`1020:11959`), `Design Guideline` (`1020:18747`), `--- Features ---` (`1010:65406`), `Auth` (`1020:11288`), `Profile` (`1283:36616`), `--- WIP ---` (`1177:27467`), `Organization` (`1284:36943`).

These hold wireframes, flows, or are placeholder buckets — don't look for reusable components here.

---

## How to reuse a component

```js
// Inside use_figma — import by key, then create an instance
const comp = await figma.importComponentByKeyAsync(key); // or importComponentSetByKeyAsync
const instance = comp.createInstance();
parent.appendChild(instance);
```

To get the `key`, first look up the node by its ID from this table, then read `node.key`. Keys are stable across file edits; node IDs in this document are also stable but may shift if a component is deleted and recreated — when a lookup fails, re-discover via the inspection script in `figma-use` skill.
