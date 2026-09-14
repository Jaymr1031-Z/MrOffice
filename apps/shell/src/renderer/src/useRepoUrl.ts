import { useEffect, useState } from 'react'

/**
 * Resolves the configured public repo URL, or '' when none is wired up
 * (local-first builds have no remote repo). Components use this to hide
 * GitHub/CTAs entirely so they never render a dead, no-op button after the
 * remote links were removed.
 */
export function useRepoUrl(): string {
  const [url, setUrl] = useState('')
  useEffect(() => {
    let alive = true
    void window.aiOffice.githubRepoUrl?.().then((u) => {
      if (alive) setUrl(typeof u === 'string' ? u : '')
    })
    return () => {
      alive = false
    }
  }, [])
  return url
}
