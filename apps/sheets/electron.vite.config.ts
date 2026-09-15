import react from '@vitejs/plugin-react'
import { defineConfig, externalizeDepsPlugin } from 'electron-vite'

export default defineConfig({
 main: {
 // @mroffice/* workspace packages ship TS source (no build step, no
 // compiled entry point) — externalizing them makes Node's ESM loader try
 // to resolve their relative imports at runtime and fail. Bundle those;
 // externalize everything else (Electron, zod, node builtins).
 plugins: [
 externalizeDepsPlugin({
 exclude: [
 '@mroffice/ai-provider',
 '@mroffice/agent-core',
 '@mroffice/ai-search',
 '@mroffice/docx-engine',
 '@mroffice/file-parse',
 '@mroffice/electron-utils',
 '@mroffice/i18n',
 ],
 }),
 ],
 },
 preload: {
 // Sandboxed preload scripts cannot require arbitrary npm packages at
 // runtime, so the drop-open bridge must be bundled, not externalized.
 plugins: [externalizeDepsPlugin({ exclude: ['@mroffice/electron-utils'] })],
 },
 renderer: {
 plugins: [react()],
 },
})
