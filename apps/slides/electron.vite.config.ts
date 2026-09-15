import { dirname, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'
import react from '@vitejs/plugin-react'
import { defineConfig, externalizeDepsPlugin } from 'electron-vite'

const here = dirname(fileURLToPath(import.meta.url))

// Pin resolution to this repo's workspace sources (matches tsconfig paths;
// avoids bundling stale implementations when node_modules links point elsewhere)
const workspaceAlias = {
 // Subpath before the bare name: string aliases are prefix replacements
 '@mroffice/pptx-engine/table-grid': resolve(
 here,
 '../../packages/pptx-engine/src/table-grid.ts',
 ),
 '@mroffice/pptx-engine/identity': resolve(here, '../../packages/pptx-engine/src/identity.ts'),
 '@mroffice/pptx-engine/custgeom': resolve(here, '../../packages/pptx-engine/src/custgeom.ts'),
 '@mroffice/pptx-engine/background-promote': resolve(
 here,
 '../../packages/pptx-engine/src/background-promote.ts',
 ),
 '@mroffice/pptx-engine': resolve(here, '../../packages/pptx-engine/src/index.ts'),
 '@mroffice/pptx-render/preset-geometry': resolve(
 here,
 '../../packages/pptx-render/src/preset-geometry.ts',
 ),
 '@mroffice/pptx-render': resolve(here, '../../packages/pptx-render/src/index.ts'),
 // Metafile (EMF/WMF) rasterizer shared with the docs engine (renderer-only: needs canvas)
 '@mroffice/docx-engine/metafile': resolve(here, '../../packages/docx-engine/src/metafile.ts'),
}

export default defineConfig({
 // Main process/preload must bundle @mroffice/* sources (they are pulled in as TS
 // source with extensionless relative imports; externalizing them under Node
 // yields ERR_MODULE_NOT_FOUND).
 main: {
 resolve: { alias: workspaceAlias },
 // Bundle opentype.js too (the packaged app ships only out/**, so external deps are unresolvable at runtime)
 plugins: [
 externalizeDepsPlugin({
 exclude: [
 '@mroffice/pptx-engine',
 '@mroffice/pptx-render',
 '@mroffice/ai-search',
 '@mroffice/file-parse',
 '@mroffice/electron-utils',
 'opentype.js',
 ],
 }),
 ],
 },
 preload: {
 // electron-utils ships raw TS source — must be bundled, not left external
 plugins: [externalizeDepsPlugin({ exclude: ['@mroffice/electron-utils'] })],
 },
 renderer: {
 resolve: { alias: workspaceAlias },
 plugins: [react()],
 server: {
 port: Number(process.env.SLIDES_DEV_PORT) || 5175,
 strictPort: Boolean(process.env.SLIDES_DEV_PORT),
 },
 },
})
