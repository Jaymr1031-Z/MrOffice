/**
 * Launch the Electron shell in dev mode pointing at the five renderer Vite
 * dev servers.
 *
 * The root `dev` script used to inline the renderer URLs as a POSIX env-var
 * prefix (`DOCS_RENDERER_URL=... npm run dev -w @genoffice/shell`). cmd.exe
 * has no such syntax, so on Windows the shell process never started and no
 * window appeared. Setting the variables here keeps `npm run dev` working on
 * Windows, macOS, and Linux alike (no cross-env dependency needed).
 */
import { spawn } from 'node:child_process'

const RENDERER_URLS = {
  DOCS_RENDERER_URL: 'http://localhost:5173',
  SHEETS_RENDERER_URL: 'http://localhost:5174',
  SLIDES_RENDERER_URL: 'http://localhost:5175',
  PDF_RENDERER_URL: 'http://localhost:5176',
  MARKDOWN_RENDERER_URL: 'http://localhost:5177',
}

const env = { ...process.env }
for (const [key, value] of Object.entries(RENDERER_URLS)) {
  // an explicit override from the caller always wins
  if (!env[key]) env[key] = value
}

const child = spawn('npm', ['run', 'dev', '-w', '@genoffice/shell'], {
  stdio: 'inherit',
  shell: true,
  env,
})

child.on('exit', (code, signal) => {
  if (signal) process.kill(process.pid, signal)
  else process.exit(code ?? 0)
})
