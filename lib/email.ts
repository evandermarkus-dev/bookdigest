import { Resend } from 'resend'

const FROM = process.env.EMAIL_FROM ?? 'BookDigest <noreply@bookdigest.com>'
const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? 'http://localhost:3001'

// Silently skip if no API key configured
function canSend() {
  return !!process.env.RESEND_API_KEY
}

export async function sendWelcomeEmail(to: string) {
  if (!canSend()) return
  const resend = new Resend(process.env.RESEND_API_KEY)
  try {
    await resend.emails.send({
      from: FROM,
      to,
      subject: 'Welcome to BookDigest 📚',
      html: welcomeHtml(),
    })
  } catch (err) {
    console.error('[email] Welcome send failed:', err)
  }
}

export async function sendSummaryReadyEmail(to: string, bookTitle: string, style: string, summaryUrl: string) {
  if (!canSend()) return
  const resend = new Resend(process.env.RESEND_API_KEY)
  try {
    const styleLabels: Record<string, string> = {
      executive: 'Executive Summary',
      study: 'Study Guide',
      action: 'Action Plan',
    }
    const styleLabel = styleLabels[style] ?? style
    await resend.emails.send({
      from: FROM,
      to,
      subject: `Your "${bookTitle}" summary is ready 📚`,
      html: summaryReadyHtml(bookTitle, styleLabel, summaryUrl),
    })
  } catch (err) {
    console.error('[email] Summary ready send failed:', err)
  }
}

// ─── Templates ───────────────────────────────────────────────────────────────

function base(content: string) {
  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1" />
</head>
<body style="margin:0;padding:0;background:#f5f4f0;font-family:Georgia,serif;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background:#f5f4f0;padding:40px 16px;">
    <tr><td align="center">
      <table width="100%" cellpadding="0" cellspacing="0" style="max-width:560px;background:#fff;border-radius:16px;overflow:hidden;box-shadow:0 2px 16px rgba(0,0,0,0.06);">
        <!-- Header -->
        <tr>
          <td style="padding:28px 36px 24px;border-bottom:1px solid #f0ede6;">
            <span style="font-size:20px;font-weight:700;letter-spacing:-0.02em;color:#111;">Book<span style="color:#4f46e5;">Digest</span></span>
          </td>
        </tr>
        <!-- Body -->
        <tr><td style="padding:32px 36px;">${content}</td></tr>
        <!-- Footer -->
        <tr>
          <td style="padding:20px 36px;border-top:1px solid #f0ede6;background:#faf9f7;">
            <p style="margin:0;font-size:12px;color:#aaa;font-family:system-ui,sans-serif;">
              You're receiving this because you signed up for BookDigest.
              <br/>© ${new Date().getFullYear()} BookDigest
            </p>
          </td>
        </tr>
      </table>
    </td></tr>
  </table>
</body>
</html>`
}

function btn(href: string, label: string) {
  return `<a href="${href}" style="display:inline-block;background:#4f46e5;color:#fff;font-weight:700;padding:13px 28px;border-radius:10px;text-decoration:none;font-size:15px;font-family:system-ui,sans-serif;">${label}</a>`
}

function welcomeHtml() {
  return base(`
    <h1 style="margin:0 0 12px;font-size:28px;font-weight:900;line-height:1.15;color:#111;">
      Read smarter, starting now.
    </h1>
    <p style="margin:0 0 20px;font-size:16px;line-height:1.7;color:#555;font-family:system-ui,sans-serif;">
      Your BookDigest account is ready. Upload any PDF book and get a personalized AI summary in minutes — tailored to your goals and experience level.
    </p>
    <p style="margin:0 0 8px;font-size:15px;font-weight:600;color:#111;font-family:system-ui,sans-serif;">How it works:</p>
    <table cellpadding="0" cellspacing="0" style="margin-bottom:28px;">
      ${['Upload a PDF book', 'Answer 3 quick questions about your goals', 'Get your summary in Executive, Study, or Action style'].map((s, i) => `
      <tr>
        <td style="padding:4px 12px 4px 0;vertical-align:top;">
          <span style="display:inline-block;width:22px;height:22px;border-radius:50%;background:#eef2ff;color:#4f46e5;font-size:12px;font-weight:700;text-align:center;line-height:22px;font-family:system-ui,sans-serif;">${i + 1}</span>
        </td>
        <td style="padding:4px 0;font-size:15px;color:#555;font-family:system-ui,sans-serif;">${s}</td>
      </tr>`).join('')}
    </table>
    ${btn(`${SITE_URL}/dashboard`, 'Go to your dashboard →')}
    <p style="margin:24px 0 0;font-size:13px;color:#aaa;font-family:system-ui,sans-serif;">
      You have <strong style="color:#555;">10 free summaries</strong> per month. No credit card required.
    </p>
  `)
}

function summaryReadyHtml(bookTitle: string, styleLabel: string, summaryUrl: string) {
  return base(`
    <p style="margin:0 0 8px;font-size:13px;font-weight:600;color:#4f46e5;letter-spacing:0.06em;text-transform:uppercase;font-family:system-ui,sans-serif;">
      Your summary is ready
    </p>
    <h1 style="margin:0 0 16px;font-size:26px;font-weight:900;line-height:1.2;color:#111;">
      ${escapeHtml(bookTitle)}
    </h1>
    <p style="margin:0 0 24px;font-size:15px;line-height:1.7;color:#555;font-family:system-ui,sans-serif;">
      Your <strong>${styleLabel}</strong> has been generated and is ready to read. Open your dashboard to view insights, export to Markdown, or generate the other two styles.
    </p>
    ${btn(summaryUrl, 'Read your summary →')}
    <p style="margin:24px 0 0;font-size:13px;color:#aaa;font-family:system-ui,sans-serif;">
      You can also generate the <strong style="color:#555;">Study Guide</strong> and <strong style="color:#555;">Action Plan</strong> styles from the same book — no re-upload needed.
    </p>
  `)
}

function escapeHtml(str: string) {
  return str.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;')
}
