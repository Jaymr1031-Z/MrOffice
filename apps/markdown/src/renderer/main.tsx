import { createRoot } from 'react-dom/client'
import { htmlLang, type Lang } from '@mroffice/i18n'
import App from './App'
import { LocaleProvider } from './i18n/locale'
import type { UiTheme } from '../shared/ipc'
import '@mroffice/ui/tokens.css'
import '@mroffice/ui/screentip.css'
import '@mroffice/ui/dropdown.css'
import '@mroffice/ui/ribbon-collapse.css'
import '@mroffice/ui/markdown.css'
import 'katex/dist/katex.min.css'
import './styles.css'
import { installScreenTips } from '@mroffice/ui'

installScreenTips()

function applyTheme(theme: UiTheme): void {
 if (theme === 'system') document.documentElement.removeAttribute('data-theme')
 else document.documentElement.setAttribute('data-theme', theme)
}

void (async () => {
 const [lang, theme] = await Promise.all([
 window.markdownApi.getLanguage().catch(() => 'zh' as const),
 window.markdownApi.getTheme().catch(() => 'system' as const),
 ])
 document.documentElement.lang = htmlLang(lang as Lang)
 applyTheme(theme)
 window.markdownApi.onThemeChanged(applyTheme)
 createRoot(document.getElementById('root')!).render(
 <LocaleProvider initial={lang}>
 <App />
 </LocaleProvider>,
 )
})()
