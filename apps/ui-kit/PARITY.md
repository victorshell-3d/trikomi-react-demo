# Phase 1 review notes

## Scope and source

This is the React + TypeScript conversion of the original TRIK-30 dark UI kit, attachment 10063, inside apps/ui-kit in the existing demo repository. The gallery imports no SDK. The jewelry configurator now consumes this package’s shared controls and styles as a separate local draft; its SDK and scene remain unchanged. The abandoned landing draft is preserved separately in the local copy and excluded from this PR.

The original token values, five catalogue sections, purple schematic stage, header, rail, round actions, toolbar, chip filters, thumbnails and gallery layouts are retained. The original HTML/CSS was the visual reference, not the rejected jewelry redesign.

## Reusable source map

- src/components/controls.tsx: Button, IconButton, Icon, Field, TextField, Select, Range, Switch, SegmentedControl, Swatches, Dialog.
- src/components/ConfiguratorPreview.tsx: controlled Color/Material/Lighting Dropdown and ConfiguratorToolbar; composed schematic stage and demo overlays.
- src/components/ChipCarousel.tsx: controlled thumbnail selection, category filters and wrapping scroll arrows.
- src/components/IconSymbols.tsx: shared SVG symbols.
- src/styles/styles.css: original kit stylesheet, formatted for readability.
- src/styles/react.css: local font, native-dialog lifecycle support and React component adapters.
- src/index.ts: component exports. Import both stylesheets and mount IconSymbols once in a consuming React app.

The demo reuses exported toolbar, dropdown, carousel, switch, dialog and swatch components. Some catalogue examples remain direct JSX using the same shared CSS. Jewelry now composes its complete non-canvas overlay UI from shared SDK-free layout primitives exported by ConfiguratorLayout.tsx, in addition to the original Button/IconButton/Range/SegmentedControl and icons. The layout primitives and responsive CSS are new kit additions, not retroactively part of the original mockup. App-specific data, SDK handlers and viewport mounting remain in jewelry.

## Deliberate conversion differences

- React state and callbacks replace document mutation and vanilla listeners.
- Native modal dialogs trap focus, close on Escape and restore focus. The search opens as an accessible modal, rather than the original free-floating search overlay.
- Search keeps the original component-level catalogue, including button, dropdown, carousel and navigation terms.
- Export, AR, duplicate, rename and third-party share actions remain demo actions. Messages explain that no production export, camera or external share is connected. Copy uses the current preview URL rather than a stale hard-coded site.
- Save design applies only to the current page session. No backend or persistent project save is implied.
- The font is bundled locally. The gallery intro/footer identify the React conversion, and a collapsible API note is appended.

## Verification

At 390, 768 and 1440 pixels: five gallery sections, no horizontal overflow, filters and selection, modal focus containment in both tab directions, Escape close, safe search text, material/hue/glow updates, spin/hotspot switches, reset, save and reopen, and toast feedback.

Build includes strict TypeScript checking. ESLint passes. Browser tests report no browser errors and no external network requests. Test output is kept out of version control.

Accessibility caveat: the original --text-3 token (#7e6ba3) produces 16 automated color-contrast findings in gallery labels at each tested width, including a measured 4.28:1 against one panel background instead of the required 4.5:1. All other tested axe rules pass. The test preserves and reports these known findings; it does not claim a clean accessibility audit. A token change needs design review and is not silently included in this exact-kit phase.

## Review gate

Local-only review. This PR does not deploy the app or send a message to reviewers. Existing rejected work remains untouched. Anas reviewed the kit locally; Vijay approval of this new React conversion is not established. His written order remains kit review, reusable product landing, seven product landings, then app redesigns with full feature preservation. Anas currently prioritizes the jewelry app. That priority does not complete or cancel the missing landing stages.

Workspace integration now uses the root frozen pnpm lock, the normal Vite config, and root dist/ui-kit output compatible with the full monorepo builder. Range adds optional pointer/key-release onCommit without changing existing consumers. See README.md for commands and ../jewelry-configurator/UI-PARITY.md for runtime results.

## Configurator layout extraction review

Header/actions, file input, panels/headings/badges, material/color rows, adjustment sections/value ranges, shape grid, empty state, model bar, mobile panel controls and loading overlay are exported as shared presentation components. They accept data and callbacks and import no SDK. The existing layout appearance is preserved. Jewelry-specific CSS now only mounts the viewport/root; overlay styling lives in the kit. The only Playground edit is replacing its loading-overlay JSX with LoadingOverlay; all initialization, SDK calls, effects and canvas remain unchanged.
