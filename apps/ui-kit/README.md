# Shared React UI kit and jewelry review

This package converts the original TRIK-30 dark UI kit (attachment 10063) to React and TypeScript inside the existing demo repository. Its five-section review gallery remains at `/`. The jewelry configurator imports its shared controls, icons and styles directly. The SDK and 3D scene are not part of this package.

## Install and build from the repository root

Verified with Node 22.23.5 and pnpm 12.21.0:

```sh
pnpm install --frozen-lockfile
pnpm --filter @trikomi/ui-kit build
pnpm run build:jewelry
pnpm run build
```

The root pnpm lock includes this package. Use the workspace install, not a separate npm install. The workspace allows the existing esbuild dependency's install script. No temporary Vite config, module dedupe override or dependency symlink is needed.

For the review gallery, run `pnpm --filter @trikomi/ui-kit dev` and open http://localhost:5180/. For the jewelry app, run `pnpm --filter @trikomi/app-jewelry-configurator dev` and use its reported URL (configured port 5178).

A kit-only build writes `dist/ui-kit` at the repository root. The full root build merges it into the existing shared `dist/assets` layout alongside the configurators. To run the kit regression after a full root build, first rebuild the kit alone because the full build moves its assets:

```sh
pnpm --filter @trikomi/ui-kit build
pnpm --filter @trikomi/ui-kit lint
CHROME_PATH=/path/to/chrome pnpm --filter @trikomi/ui-kit test:ui
```

## Shared components

Import from `src/index.ts`. Import `src/styles/styles.css`, `src/styles/react.css` and, for the configurator layout primitives, `src/styles/configurator.css` once and render `IconSymbols` once. Button and IconButton accept native button props. Controlled fields, switches, ranges, segmented controls, swatches, dropdowns and ChipCarousel receive values and callbacks. Range has an optional `onCommit` callback for pointer release and range-key release, used by jewelry's final diamond geometry update. Dialog manages modal lifecycle and keyboard focus.

The jewelry app now composes its overlay UI from shared BrandHeader, FileInput, ResponsivePanel, PanelHeading/Badge, ScrollList, SelectableColorRow/ColorField, AdjustmentGroup, ValueRange, ThumbnailGrid, EmptyPanel, MobilePanelControls, ModelPicker and LoadingOverlay. These are new SDK-free additions to the kit, not components that existed in the original mockup. Labels, item data, feature-specific state, callback bindings and viewport mounting remain in the app. The original canvas and SDK stats are deliberately outside this component boundary.

Gallery Export, AR and third-party share actions remain explicit demos. The jewelry application uses its original real SDK handlers, not those gallery demos. See `../jewelry-configurator/UI-PARITY.md` for application verification and its rendering caveat.

## Scope and review status

The React kit has been reviewed locally by Anas. This does not establish Vijay's approval. The next written project stages remain a reviewed reusable product landing, landings for seven products, and reviewed app redesigns. The current instruction prioritizes jewelry only; it does not satisfy those other stages.

The abandoned single-product landing draft is preserved separately in the local review copy and is excluded from this PR. There is no landing draft route in this PR. The configurator itself does not replace Vijay's separate product-details-to-demo landing requirement.

This PR does not deploy the app or send a reviewer message. Existing rejected work is preserved.
