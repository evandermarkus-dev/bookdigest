// Plausible custom event tracker
// Safe to call server-side (no-ops) and respects Plausible's script loading.
// Usage: track('Summary Generated', { style: 'executive' })

declare global {
  interface Window {
    plausible?: (
      event: string,
      options?: { props?: Record<string, string | number | boolean> }
    ) => void
  }
}

type Props = Record<string, string | number | boolean>

export function track(event: string, props?: Props) {
  if (typeof window === 'undefined') return
  window.plausible?.(event, props ? { props } : undefined)
}

// ─── Typed helpers for key BookDigest events ─────────────────────────────────

export const analytics = {
  pdfUploaded: () =>
    track('PDF Uploaded'),

  summaryGenerated: (style: 'executive' | 'study' | 'action' | 'research') =>
    track('Summary Generated', { style }),

  summaryExported: (format: 'markdown' | 'print') =>
    track('Summary Exported', { format }),

  audioPlayed: () =>
    track('Audio Played'),

  upgrade: (plan: 'reader' | 'pro') =>
    track('Upgrade Clicked', { plan }),
}
