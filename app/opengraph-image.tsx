import { ImageResponse } from 'next/og'

export const runtime = 'edge'
export const alt = 'BookDigest — AI-powered book summaries'
export const size = { width: 1200, height: 630 }
export const contentType = 'image/png'

export default function OgImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          background: '#faf8f4',
          fontFamily: 'Georgia, serif',
        }}
      >
        {/* Gold accent bar */}
        <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: 6, background: '#c9963a' }} />

        {/* Book emoji */}
        <div style={{ fontSize: 96, marginBottom: 32 }}>📚</div>

        {/* Product name */}
        <div style={{ fontSize: 72, fontWeight: 700, color: '#1a1714', letterSpacing: '-2px', marginBottom: 20 }}>
          BookDigest
        </div>

        {/* Tagline */}
        <div style={{ fontSize: 30, color: '#6b5e4e', maxWidth: 680, textAlign: 'center', lineHeight: 1.4 }}>
          Turn any PDF book into a personalized AI summary — executive, study, or action-plan style.
        </div>

        {/* Bottom badge */}
        <div
          style={{
            position: 'absolute',
            bottom: 48,
            display: 'flex',
            alignItems: 'center',
            gap: 10,
            background: 'rgba(201,150,58,0.12)',
            border: '1px solid rgba(201,150,58,0.4)',
            borderRadius: 999,
            padding: '10px 24px',
          }}
        >
          <div style={{ width: 8, height: 8, borderRadius: '50%', background: '#c9963a' }} />
          <div style={{ fontSize: 20, color: '#8a6820', fontFamily: 'sans-serif' }}>
            Powered by Claude AI
          </div>
        </div>
      </div>
    ),
    { ...size },
  )
}
