import Link from 'next/link'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Integritetspolicy – BookDigest',
  description: 'Hur BookDigest hanterar dina personuppgifter.',
}

export default function PrivacyPage() {
  return (
    <main style={{ minHeight: '100vh', background: 'var(--c-surface)', color: 'var(--c-text)' }}>
      <div style={{ maxWidth: 760, margin: '0 auto', padding: '4rem 1.5rem 6rem' }}>

        {/* Header */}
        <div style={{ marginBottom: '2.5rem' }}>
          <Link href="/" style={{ fontSize: '0.875rem', color: 'var(--c-muted)', textDecoration: 'none' }}>
            ← BookDigest
          </Link>
          <h1 style={{ fontFamily: 'var(--font-playfair), Georgia, serif', fontSize: '2rem', fontWeight: 700, marginTop: '1.5rem', marginBottom: '0.5rem' }}>
            Integritetspolicy
          </h1>
          <p style={{ fontSize: '0.875rem', color: 'var(--c-muted)' }}>
            Senast uppdaterad: 9 mars 2026
          </p>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem', lineHeight: 1.75, fontSize: '0.9375rem' }}>

          <section>
            <h2 style={h2Style}>1. Personuppgiftsansvarig</h2>
            <p>
              Personuppgiftsansvarig för dina uppgifter är:
            </p>
            <div style={{ marginTop: '0.75rem', padding: '1rem 1.25rem', background: 'var(--c-card)', border: '1px solid var(--c-border)', borderRadius: 8, fontSize: '0.9rem' }}>
              <strong>BookDigest</strong><br />
              Markus Evander, Sverige<br />
              E-post: <a href="mailto:hello@bookdigest.se" style={linkStyle}>hello@bookdigest.se</a>
            </div>
          </section>

          <section>
            <h2 style={h2Style}>2. Vilka uppgifter samlar vi in?</h2>
            <table style={tableStyle}>
              <thead>
                <tr>
                  <th style={thStyle}>Uppgift</th>
                  <th style={thStyle}>Källa</th>
                  <th style={thStyle}>Syfte</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td style={tdStyle}>E-postadress, namn, profilbild</td>
                  <td style={tdStyle}>Google OAuth vid inloggning</td>
                  <td style={tdStyle}>Kontoidentifiering, e-postutskick</td>
                </tr>
                <tr>
                  <td style={tdStyle}>Läspreferenser (mål, nivå, fokus)</td>
                  <td style={tdStyle}>Ifyllt av dig i appen</td>
                  <td style={tdStyle}>Personaliserade AI-sammanfattningar</td>
                </tr>
                <tr>
                  <td style={tdStyle}>Uppladdade PDF-filer</td>
                  <td style={tdStyle}>Uppladdade av dig</td>
                  <td style={tdStyle}>AI-bearbetning, sparas i Supabase Storage</td>
                </tr>
                <tr>
                  <td style={tdStyle}>AI-genererade sammanfattningar</td>
                  <td style={tdStyle}>Skapade av tjänsten</td>
                  <td style={tdStyle}>Visas för dig, kan delas av dig</td>
                </tr>
                <tr>
                  <td style={tdStyle}>Betalningsinformation</td>
                  <td style={tdStyle}>Stripe (betalningsleverantör)</td>
                  <td style={tdStyle}>Prenumerationshantering</td>
                </tr>
                <tr>
                  <td style={tdStyle}>Användningsdata (antal sammanfattningar)</td>
                  <td style={tdStyle}>Systemgenererat</td>
                  <td style={tdStyle}>Tillämpning av plangränser</td>
                </tr>
                <tr>
                  <td style={tdStyle}>Readwise- och Notion-tokens</td>
                  <td style={tdStyle}>Valfritt, angivet av dig</td>
                  <td style={tdStyle}>Export till tredjepartstjänster</td>
                </tr>
              </tbody>
            </table>
          </section>

          <section>
            <h2 style={h2Style}>3. Rättslig grund (GDPR)</h2>
            <ul style={ulStyle}>
              <li><strong>Avtal (Art. 6.1b):</strong> Bearbetning nödvändig för att leverera tjänsten du beställt.</li>
              <li><strong>Berättigat intresse (Art. 6.1f):</strong> Säkerhet, missbruksskydd och förbättring av tjänsten.</li>
              <li><strong>Rättslig förpliktelse (Art. 6.1c):</strong> Bokföringslagen kräver att vi sparar transaktionsdata.</li>
            </ul>
          </section>

          <section>
            <h2 style={h2Style}>4. Tredjepartsleverantörer</h2>
            <p>Vi delar data med följande leverantörer för att driva tjänsten:</p>
            <ul style={{ ...ulStyle, marginTop: '0.75rem' }}>
              <li><strong>Supabase</strong> (EU) — databas och fillagring</li>
              <li><strong>Anthropic</strong> (USA) — AI-bearbetning av PDF-text för sammanfattningar. Text skickas till Anthropics API och lagras inte av Anthropic enligt deras dataskyddspolicy.</li>
              <li><strong>OpenAI</strong> (USA) — text-till-tal för AI-ljudberättelse (Reader/Pro)</li>
              <li><strong>Stripe</strong> (USA/EU) — betalningsbearbetning</li>
              <li><strong>Google</strong> (USA/EU) — inloggning via OAuth</li>
              <li><strong>Resend</strong> (USA) — transaktionella e-postutskick</li>
              <li><strong>Vercel</strong> (USA/EU) — webbhosting</li>
            </ul>
            <p style={{ marginTop: '0.75rem', fontSize: '0.875rem', color: 'var(--c-muted)' }}>
              Överföringar till USA sker under EU:s standardavtalsklausuler (SCC) eller andra lämpliga skyddsåtgärder.
            </p>
          </section>

          <section>
            <h2 style={h2Style}>5. Lagringstid</h2>
            <ul style={ulStyle}>
              <li><strong>Kontouppgifter:</strong> Sparas så länge kontot är aktivt, raderas på begäran.</li>
              <li><strong>Uppladdade PDF-filer:</strong> Sparas tills du tar bort boken, eller tills kontot raderas.</li>
              <li><strong>Sammanfattningar:</strong> Sparas tills du tar bort dem, eller tills kontot raderas.</li>
              <li><strong>Betalningsdata:</strong> Sparas i 7 år enligt bokföringslagen.</li>
              <li><strong>Loggar:</strong> Raderas automatiskt efter 30 dagar.</li>
            </ul>
          </section>

          <section>
            <h2 style={h2Style}>6. Dina rättigheter (GDPR)</h2>
            <p>Du har rätt att:</p>
            <ul style={ulStyle}>
              <li><strong>Få tillgång</strong> till de uppgifter vi har om dig (Art. 15)</li>
              <li><strong>Rätta</strong> felaktiga uppgifter (Art. 16)</li>
              <li><strong>Radera</strong> dina uppgifter (&quot;rätten att bli glömd&quot;, Art. 17)</li>
              <li><strong>Invända</strong> mot viss bearbetning (Art. 21)</li>
              <li><strong>Dataportabilitet</strong> — få ut dina uppgifter i maskinläsbart format (Art. 20)</li>
              <li><strong>Begränsa</strong> bearbetning under utredning (Art. 18)</li>
            </ul>
            <p style={{ marginTop: '0.75rem' }}>
              För att utöva dina rättigheter, kontakta: <a href="mailto:hello@bookdigest.se" style={linkStyle}>hello@bookdigest.se</a>. Vi svarar inom 30 dagar.
            </p>
            <p style={{ marginTop: '0.75rem' }}>
              Du har även rätt att lämna klagomål till <a href="https://www.imy.se" target="_blank" rel="noopener noreferrer" style={linkStyle}>Integritetsskyddsmyndigheten (IMY)</a>.
            </p>
          </section>

          <section>
            <h2 style={h2Style}>7. Cookies och lokal lagring</h2>
            <p>
              Vi använder cookies enbart för autentisering (inloggningssession via Supabase). Vi använder inga marknadsföringscookies eller tredjepartsspårning. Webbläsarens localStorage används för att spara dina läspreferenser lokalt på din enhet.
            </p>
          </section>

          <section>
            <h2 style={h2Style}>8. Säkerhet</h2>
            <p>
              All datatransport sker krypterat via HTTPS. Databasen är skyddad med Row Level Security (RLS) — du kan bara se dina egna uppgifter. Betalningsinformation hanteras uteslutande av Stripe och når aldrig våra servrar.
            </p>
          </section>

          <section>
            <h2 style={h2Style}>9. Ändringar</h2>
            <p>
              Vi kan uppdatera denna policy. Vid väsentliga ändringar informerar vi dig via e-post med minst 14 dagars varsel.
            </p>
          </section>

          <section>
            <h2 style={h2Style}>10. Kontakt</h2>
            <p>
              Frågor om din integritet: <a href="mailto:hello@bookdigest.se" style={linkStyle}>hello@bookdigest.se</a>
            </p>
          </section>

        </div>

        <div style={{ marginTop: '3rem', paddingTop: '2rem', borderTop: '1px solid var(--c-border)', display: 'flex', gap: '1.5rem', fontSize: '0.875rem' }}>
          <Link href="/tos" style={linkStyle}>Användarvillkor</Link>
          <Link href="/" style={{ color: 'var(--c-muted)', textDecoration: 'none' }}>← Tillbaka till startsidan</Link>
        </div>

      </div>
    </main>
  )
}

const h2Style: React.CSSProperties = {
  fontFamily: 'var(--font-playfair), Georgia, serif',
  fontSize: '1.125rem',
  fontWeight: 700,
  marginBottom: '0.5rem',
  color: 'var(--c-text)',
}

const ulStyle: React.CSSProperties = {
  paddingLeft: '1.5rem',
  display: 'flex',
  flexDirection: 'column',
  gap: '0.25rem',
}

const tableStyle: React.CSSProperties = {
  width: '100%',
  borderCollapse: 'collapse',
  marginTop: '0.75rem',
  fontSize: '0.875rem',
}

const thStyle: React.CSSProperties = {
  textAlign: 'left',
  padding: '0.5rem 0.75rem',
  borderBottom: '2px solid var(--c-border)',
  color: 'var(--c-muted)',
  fontWeight: 600,
}

const tdStyle: React.CSSProperties = {
  padding: '0.5rem 0.75rem',
  borderBottom: '1px solid var(--c-border)',
  verticalAlign: 'top',
}

const linkStyle: React.CSSProperties = {
  color: 'var(--c-accent)',
  textDecoration: 'none',
}
