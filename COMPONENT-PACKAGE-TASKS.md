# Component Package – Migration Task List

Components to move into your new **component package** project. These are the custom/composed components from `ecommerece-frontend/components` (excluding `components/ui/` primitives, which are typically shadcn/Radix and can stay in the app or be added to the package separately if you want).

---

## Root-level components (single-file)

- [ ] `theme-switch.tsx` – ThemeSwitch
- [ ] `theme-selector.tsx` – ThemeSelector
- [ ] `date-picker.tsx` – DatePicker
- [ ] `date-range-picker.tsx` – DateRangePicker
- [ ] `date-time-picker.tsx` – DateTimePicker
- [ ] `time-picker-input.tsx` – TimePickerInput
- [ ] `tag-input.tsx` – TagInput
- [ ] `skip-to-main.tsx` – SkipToMain
- [ ] `sign-out-dialog.tsx` – SignOutDialog
- [ ] `select-dropdown.tsx` – SelectDropdown
- [ ] `search.tsx` – Search
- [ ] `profile-dropdown.tsx` – ProfileDropdown
- [ ] `period-select.tsx` – PeriodSelect
- [ ] `password-input.tsx` – PasswordInput
- [ ] `navigation-progress.tsx` – NavigationProgress
- [ ] `long-text.tsx` – LongText
- [ ] `learn-more.tsx` – LearnMore
- [ ] `image-zoom.tsx` – ImageZoom (root-level; there is also `ui/image-zoom.tsx`)
- [ ] `font-selector.tsx` – FontSelector
- [ ] `example.tsx` – Example
- [ ] `confirm-dialog.tsx` – ConfirmDialog
- [ ] `config-drawer.tsx` – ConfigDrawer
- [ ] `component-example.tsx` – ComponentExample
- [ ] `command-menu.tsx` – CommandMenu
- [ ] `coming-soon.tsx` – ComingSoon
- [ ] `tree-view.tsx` – TreeView (+ types: TreeDataItem, TreeRenderItemParams, etc.)

---

## Layout (`components/layout/`)

- [ ] `layout/authenticated-layout.tsx`
- [ ] `layout/auth-layout.tsx`
- [ ] `layout/app-sidebar.tsx`
- [ ] `layout/app-title.tsx`
- [ ] `layout/header.tsx`
- [ ] `layout/main.tsx`
- [ ] `layout/nav-group.tsx`
- [ ] `layout/nav-user.tsx`
- [ ] `layout/team-switcher.tsx`
- [ ] `layout/top-nav.tsx`
- [ ] `layout/data/sidebar-data.tsx` (data/config; may stay app-specific or be made configurable)

---

## Data table (`components/data-table/`)

- [ ] `data-table/data-table-toolbar.tsx` – DataTableToolbar
- [ ] `data-table/data-table-view-options.tsx` – DataTableTableViewOptions
- [ ] `data-table/data-table-skeleton.tsx` – DataTableSkeleton
- [ ] `data-table/data-table-pagination.tsx` – DataTablePagination
- [ ] `data-table/data-table-faceted-filter.tsx` – DataTableFacetedFilter
- [ ] `data-table/data-table-expand-button.tsx` – DataTableExpandButton
- [ ] `data-table/data-table-empty-state.tsx` – DataTableEmptyState
- [ ] `data-table/data-table-column-header.tsx` – DataTableColumnHeader
- [ ] `data-table/data-table-bulk-actions.tsx` – DataTableBulkActions

---

## TipTap editor – UI (`components/tiptap-ui/`)

- [ ] `tiptap-ui/undo-redo-button/` – UndoRedoButton (+ use-undo-redo)
- [ ] `tiptap-ui/text-align-button/` – TextAlignButton
- [ ] `tiptap-ui/mark-button/` – MarkButton
- [ ] `tiptap-ui/list-dropdown-menu/` – ListDropdownMenu
- [ ] `tiptap-ui/list-button/` – ListButton
- [ ] `tiptap-ui/link-popover/` – LinkPopover, LinkButton, LinkContent
- [ ] `tiptap-ui/image-upload-button/` – ImageUploadButton
- [ ] `tiptap-ui/heading-dropdown-menu/` – HeadingDropdownMenu
- [ ] `tiptap-ui/heading-button/` – HeadingButton
- [ ] `tiptap-ui/color-highlight-popover/` – ColorHighlightPopover, ColorHighlightPopoverButton
- [ ] `tiptap-ui/color-highlight-button/` – ColorHighlightButton
- [ ] `tiptap-ui/code-block-button/` – CodeBlockButton
- [ ] `tiptap-ui/blockquote-button/` – BlockquoteButton

---

## TipTap primitives (`components/tiptap-ui-primitive/`)

- [ ] `tiptap-ui-primitive/tooltip/` – Tooltip, TooltipTrigger, TooltipContent
- [ ] `tiptap-ui-primitive/toolbar/` – Toolbar, ToolbarGroup, ToolbarSeparator
- [ ] `tiptap-ui-primitive/spacer/` – Spacer
- [ ] `tiptap-ui-primitive/separator/` – Separator
- [ ] `tiptap-ui-primitive/popover/` – Popover
- [ ] `tiptap-ui-primitive/input/` – Input
- [ ] `tiptap-ui-primitive/dropdown-menu/` – DropdownMenu
- [ ] `tiptap-ui-primitive/card/` – Card
- [ ] `tiptap-ui-primitive/button/` – Button, ButtonGroup, ShortcutDisplay
- [ ] `tiptap-ui-primitive/badge/` – Badge

---

## TipTap templates (`components/tiptap-templates/`)

- [ ] `tiptap-templates/simple/theme-toggle.tsx` – ThemeToggle
- [ ] `tiptap-templates/simple/simple-editor.tsx` – SimpleEditor

---

## TipTap node (`components/tiptap-node/`)

- [ ] `tiptap-node/image-upload-node/` – ImageUploadNode

---

## TipTap icons (`components/tiptap-icons/`)

- [ ] All icon components (e.g. `undo2-icon.tsx`, `underline-icon.tsx`, `bold-icon.tsx`, etc. – ~25 files)

---

## Optional: `components/ui/` primitives

If you want the package to be self-contained, you can also move selected primitives from `components/ui/`. These are usually shadcn-style (Radix + Tailwind). Only add the ones your custom components depend on, for example:

- Calendar, Popover, Button, Input, etc. (as needed by DatePicker, DateRangePicker, DataTable, etc.)

---

## Notes for the component package

1. **Dependencies** – Each component’s imports (e.g. `@/lib/utils`, `@/hooks/use-media-query`, `@/lib/providers/theme-provider`, `@/components/ui/*`) will need to become package deps or props (e.g. theme provider, `cn`, hooks).
2. **Paths** – Replace `@/components/*` and `@/lib/*` with package-relative imports or peer dependencies.
3. **Layout & sidebar** – `layout/data/sidebar-data.tsx` is app-specific; either keep it in the app and pass nav config as props, or make a generic sidebar that accepts config.
4. **Barrel exports** – In the package, add `index.ts` (or per-folder indexes) that re-export the components you move.

Use this list as a checklist while migrating components into the new **component package** project.
