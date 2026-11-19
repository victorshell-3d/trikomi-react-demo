# Jewelry UI-only reskin, original feature checklist

Before implementation, checked the original app source at clean main 0db9bbd. The current user priority is this configurator, not further landing work. A configurator is not a substitute for the separate product landing required by Vijay; that project stage remains outstanding. No scene/SDK changes, new models, cart or new product features.

| Original control / behavior | Existing callback / state to preserve | UI placement |
| --- | --- | --- |
| Import GLB / glTF | file input, object URL, GLTFPlugin.loadModel, input reset | Shared-kit secondary button, top actions |
| Export | ExportPlugin.exportGLTF, existing missing-plugin feedback | Shared-kit primary button, top actions |
| Classic Solitaire / Halo Setting | handleRingChange, loading guard, selected ring, resets, orbit reset, diamond material reapply | Bottom model toolbar, both existing models |
| Previous / next model wrapping | modulo ring count, same handleRingChange | Bottom icon buttons |
| Every discovered material | original unique-material scan, active material by id, per-material state | Left scrollable panel |
| Per-material color | handleColorChange for that exact material, nested SDK color compatibility, needsUpdate | Labelled native color field per material |
| Diamond angle | 0–360, step 1, preview on change, final geometry update on release | Selected diamond's left controls |
| Diamond scale | 50–200%, step 1, preview/final commit | Selected diamond's left controls |
| Diamond height | -50–50, step 1, preview/final commit | Selected diamond's left controls |
| Complete diamond shape library | entire diamond_map.json, per-material shape selection, original geometry transform and plugin update | Right scrollable shape panel |
| Material/shape rescan on model load | existing effects, expanded material fallback | Unchanged logic |
| Loading indicator | viewerStore.isModelLoading | Existing overlay remains |
| 3D viewer / orbit / plugins / auth / camera / model assets | Playground.tsx | Unchanged |

Mobile controls may use an explicit panel toggle to preserve access while keeping the model visible. No feature is dropped behind permanently false flags. New UI states do not replace SDK state or change the 3D scene.

## Verified local results, November 19

Tested with Node 22.23.5, pnpm 12.21.0, local Chrome and software WebGPU. The root frozen install now includes apps/ui-kit; dependency directories are ordinary workspace installs, not temporary cross-project links. The normal tracked Vite configuration is used without dedupe overrides. The existing esbuild install script is allowed in pnpm-workspace.yaml. Shared kit tool/dependency ranges align with the root. SDK tarball, model assets, auth, initialization and scene logic remain unchanged. Playground has a UI-only change replacing its loading-overlay markup with shared LoadingOverlay.

- `pnpm install --frozen-lockfile`: passed from a clean dependency install.
- `pnpm run build:jewelry`: passed with the normal config.
- `pnpm --filter @trikomi/ui-kit build`: TypeScript and Vite passed.
- `pnpm --filter @trikomi/ui-kit lint`: passed.
- `pnpm run build`: full monorepo passed. Kit output now joins the shared root dist structure. Bundle-size warnings remain.
- Shared kit browser regression: 281 assertions passed at 390, 768 and 1440 pixels, no page errors or unexpected external requests. The documented 16 inherited contrast findings per width remain; this is not a clean accessibility audit.
- Jewelry controls: 11 checks passed with no page/network errors. Verified 53 original materials and 26 shapes; real metal and diamond mesh color updates; real shape geometry changes; angle/scale/height preview and final geometry updates; last shape reachable; mobile controls and no horizontal overflow; orbit drag; real GLB export with a valid version-2 header (2,975,280 bytes).
- Desktop and mobile screenshots were inspected. Mobile keeps the original camera framing, including side cropping of the large ring. Original Stats overlay can overlap the lower toolbar. These inherited presentation details were not silently removed through SDK edits.

## Repeated-switch rendering failure, isolated but not fixed

Halo selection, previous/next and reimport of the exported GLB update the expected real model state, preserve 53 imported meshes and reset the file input. However repeated model loads raise a native WebGPU error, `Instance dropped in popErrorScope`, and the final canvas can become blank. This is a failed rendering check, not a pass simply because the callbacks ran.

A separately built untouched original from the same repository base, with the same clean dependencies, normal Vite configuration, browser arguments and action sequence, reproduces the same native error and blank canvas. The failure is therefore not introduced by the UI replacement. Its precise SDK/browser/driver cause is not established. No SDK workaround, plugin removal, auth bypass or camera change is included. Hardware-WebGPU validation and/or an SDK fix remains outstanding before claiming reliable repeated-load rendering.

## Reproduce the checks

Run from repository root, after a standalone jewelry build. The full root builder relocates assets, so rebuild jewelry alone first for these tests:

```sh
pnpm run build:jewelry
CHROME_PATH=/path/to/chrome pnpm --filter @trikomi/ui-kit test:jewelry:controls
CHROME_PATH=/path/to/chrome pnpm --filter @trikomi/ui-kit test:jewelry:switches
```

The controls test writes screenshots, progress JSON and parity-export.glb to apps/ui-kit/test-results/jewelry by default. The switches test consumes that GLB, records the failure screenshot and exits nonzero on native render errors. TEST_OUTPUT changes the artifact directory. TEST_DIST can point to an independently built original, with ORIGINAL_UI=1 for its original selectors and TEST_IMPORT pointing to the exported test file. This is local verification, not a production feature.

## Component reuse boundary

All visible non-canvas overlay patterns now render through shared kit components: header/brand and actions, file input, panels/headings/badges, material/color rows, adjustment groups/value ranges, thumbnail grid, empty state, model picker/toolbar, mobile controls/panels and loading overlay. These are reusable SDK-free additions to the kit, not all pre-existing original-mockup components. Jewelry keeps product strings/items, state, callback bindings, conditional composition and viewport mounting. The SDK canvas and Stats overlay remain outside this boundary. No meaningful percentage applies to the entire application code; within the defined non-canvas overlay pattern boundary every audited pattern is now shared.

## Review status

Build success alone does not prove runtime parity. This is a local jewelry UI draft with shared overlay composition and a reproduced original rendering blocker. The abandoned landing draft is preserved separately and excluded from this PR. Vijay’s reviewed kit/landing/project sequence is not complete. This PR does not deploy the app or send a reviewer message.


## Extraction verification

Compared all logic before the top-level JSX return against the pre-extraction files for MaterialControls, FloatingActions and Playground: identical. Fresh desktop/mobile pixels inspected after extraction. The 11 real-model controls checks pass again with no page/network errors. No SDK behavior change was introduced to increase component reuse.
