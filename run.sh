#!/bin/sh
cd "$(dirname "$0")"
pnpm install && pnpm --filter @trikomi/app-jewelry-configurator build && pnpm --filter @trikomi/app-jewelry-configurator preview --port 4173 --host
