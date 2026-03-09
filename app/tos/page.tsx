import Link from 'next/link'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Användarvillkor – BookDigest',
  description: 'Användarvillkor för BookDigest.',
}

export default function TermsPage() {
  return (
    <main style={{ minHeight: '100vh', background: 'var(--c-surface)', color: 'var(--c-text)' }}>
      <div style={{ maxWidth: 760, margin: '0 auto', padding: '4rem 1.5rem 6rem' }}>

        {/* Header */}
        <div style={{ marginBottom: '2.5rem' }}>
          <Link href="/" style={{ fontSize: '0.875rem', color: 'var(--c-muted)', textDecoration: 'none' }}>
            ← BookDigest
          </Link>
          <h1 style={{ fontFamily: 'var(--font-playfair), Georgia, serif', fontSize: '2rem', fontWeight: 700, marginTop: '1.5rem', marginBottom: '0.5rem' }}>
            Användarvillkor
          </h1>
          <p style={{ fontSize: '0.875rem', color: 'var(--c-muted)' }}>
            Senast uppdaterad: 9 mars 2026
          </p>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem', lineHeight: 1.75, fontSize: '0.9375rem' }}>

          <section>
            <h2 style={h2Style}>1. Tjänsten</h2>
            <p>
              BookDigest (&quot;vi&quot;, &quot;oss&quot;, &quot;tjänsten&quot;) är en AI-driven tjänst som genererar sammanfattningar av böcker och dokument som du laddar upp. Tjänsten drivs av Markus Evander, Sverige.
            </p>
            <p style={{ marginTop: '0.75rem' }}>
              Genom att använda BookDigest accepterar du dessa villkor i sin helhet. Om du inte accepterar villkoren får du inte använda tjänsten.
            </p>
          </section>

          <section>
            <h2 style={h2Style}>2. Upphovsrätt och uppladdningar</h2>
            <p>
              <strong>Du ansvarar fullt ut för de filer du laddar upp.</strong> Genom att ladda upp en fil intygar du att:
            </p>
            <ul style={ulStyle}>
              <li>Du äger filen eller har uttrycklig rätt att bearbeta den med AI-verktyg.</li>
              <li>Din uppladdning inte bryter mot upphovsrätt, licensavtal eller annan tillämplig lag.</li>
              <li>Du inte laddar upp material du inte har rätt att använda.</li>
            </ul>
            <p style={{ marginTop: '0.75rem' }}>
              BookDigest genererar AI-baserade sammanfattningar. Dessa sammanfattningar är transformativa verk och ersätter inte originalverket. Vi lagrar inte den uppladdade PDF-filen längre än nödvändigt för att generera sammanfattningen. Textinnehållet bearbetas av Anthropic Claude AI via deras API.
            </p>
          </section>

          <section>
            <h2 style={h2Style}>3. Delning av sammanfattningar</h2>
            <p>
              Tjänsten erbjuder möjlighet att skapa publika delade länkar till sammanfattningar. Genom att dela en sammanfattning bekräftar du att:
            </p>
            <ul style={ulStyle}>
              <li>Du har rätt att dela det delade innehållet.</li>
              <li>Delning inte sker i syfte att kringgå eller ersätta originalverket.</li>
              <li>Du tar fullt ansvar för det delade innehållets laglighet.</li>
            </ul>
            <p style={{ marginTop: '0.75rem' }}>
              Vi förbehåller oss rätten att ta bort delade sammanfattningar som rapporteras som upphovsrättsintrång. Rättighetshavare kan kontakta oss på <a href="mailto:hello@bookdigest.se" style={linkStyle}>hello@bookdigest.se</a>.
            </p>
          </section>

          <section>
            <h2 style={h2Style}>4. Konton och prenumerationer</h2>
            <p>
              Du registrerar dig via Google OAuth. Du ansvarar för att hålla ditt konto säkert och för all aktivitet under ditt konto.
            </p>
            <p style={{ marginTop: '0.75rem' }}>
              <strong>Betalplaner</strong> debiteras månadsvis via Stripe. Du kan avsluta din prenumeration när som helst via <em>Inställningar → Hantera prenumeration</em>. Avslut träder i kraft vid slutet av innevarande faktureringsperiod — ingen återbetalning ges för påbörjad period.
            </p>
            <p style={{ marginTop: '0.75rem' }}>
              Vi förbehåller oss rätten att ändra priser med 30 dagars förvarning via e-post.
            </p>
          </section>

          <section>
            <h2 style={h2Style}>5. Otillåten användning</h2>
            <p>Du får inte använda BookDigest för att:</p>
            <ul style={ulStyle}>
              <li>Ladda upp material som bryter mot upphovsrätt utan rättighetshavarens tillstånd.</li>
              <li>Systematiskt extrahera och distribuera copyrightskyddat innehåll.</li>
              <li>Kringgå tekniska begränsningar i tjänsten.</li>
              <li>Använda tjänsten för automatiserade massbearbetningar utan skriftligt tillstånd.</li>
              <li>Ladda upp olagligt material, skadlig kod eller material som kränker tredje parts rättigheter.</li>
            </ul>
          </section>

          <section>
            <h2 style={h2Style}>6. AI-genererat innehåll</h2>
            <p>
              Sammanfattningar genereras av Claude AI (Anthropic). Vi garanterar inte att sammanfattningarna är fullständiga, korrekta eller fria från fel. AI-genererat innehåll ska inte ersätta din egen läsning eller professionell rådgivning.
            </p>
          </section>

          <section>
            <h2 style={h2Style}>7. Tillgänglighet och tjänsteavbrott</h2>
            <p>
              Vi strävar efter hög tillgänglighet men garanterar inte oavbruten drift. Vi förbehåller oss rätten att tillfälligt stänga ned tjänsten för underhåll.
            </p>
          </section>

          <section>
            <h2 style={h2Style}>8. Ansvarsbegränsning</h2>
            <p>
              BookDigest tillhandahålls &quot;i befintligt skick&quot;. Vi ansvarar inte för indirekta skador, förlorad data eller förluster till följd av din användning av tjänsten. Vårt maximala ansvar gentemot dig överstiger aldrig det belopp du betalat för tjänsten under de senaste 12 månaderna.
            </p>
          </section>

          <section>
            <h2 style={h2Style}>9. Uppsägning</h2>
            <p>
              Vi förbehåller oss rätten att stänga av konton som bryter mot dessa villkor, utan förvarning och utan återbetalning.
            </p>
            <p style={{ marginTop: '0.75rem' }}>
              Du kan när som helst begära att ditt konto raderas genom att kontakta <a href="mailto:hello@bookdigest.se" style={linkStyle}>hello@bookdigest.se</a>.
            </p>
          </section>

          <section>
            <h2 style={h2Style}>10. Tillämplig lag</h2>
            <p>
              Dessa villkor lyder under svensk lag. Tvister avgörs i svensk domstol.
            </p>
          </section>

          <section>
            <h2 style={h2Style}>11. Kontakt</h2>
            <p>
              Frågor om dessa villkor: <a href="mailto:hello@bookdigest.se" style={linkStyle}>hello@bookdigest.se</a>
            </p>
          </section>

        </div>

        <div style={{ marginTop: '3rem', paddingTop: '2rem', borderTop: '1px solid var(--c-border)', display: 'flex', gap: '1.5rem', fontSize: '0.875rem' }}>
          <Link href="/privacy" style={linkStyle}>Integritetspolicy</Link>
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
  marginTop: '0.5rem',
  display: 'flex',
  flexDirection: 'column',
  gap: '0.25rem',
}

const linkStyle: React.CSSProperties = {
  color: 'var(--c-accent)',
  textDecoration: 'none',
}
