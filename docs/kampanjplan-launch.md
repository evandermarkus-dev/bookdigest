# BookDigest — Kampanjplan: App Launch
**Mål:** 1 000 signups · **Tidsram:** 6 veckor · **Datum:** Mars–April 2026

---

## 1. Mål (SMART)

> Nå 1 000 registrerade användare på bookdigest.se inom 6 veckor från launch-dag, varav minst 50 konverterar till betald plan (Reader eller Pro).

**Delmål per fas:**
- Pre-launch (v1–2): 150 early access-signups via waitlist
- Launch week (v3): 400 signups från Product Hunt, Reddit och HN
- Amplification (v4–6): 450 signups via följdtrafik, communities och organisk spridning

---

## 2. Målgrupp

### Primär: Den ambitiöse läsaren
> Yrkesperson (25–45 år) med för många böcker på TBR-listan och för lite tid. Vill ta till sig kunskap från böcker men känner att de inte hinner läsa allt de köper. Troligen aktiv på Reddit (r/books, r/productivity), LinkedIn eller i bokklubbar.

**Pain point:** "Jag köper böcker men läser aldrig klart dem."
**Desired outcome:** Känslan av att ligga i framkant, att använda sin tid smart.

### Sekundär: Indie maker / tech-entusiast
> Utvecklare, produktmänniska eller startupgrundare som gillar AI-verktyg och är aktiv på Hacker News, Twitter/X och Product Hunt. Inte primärt bokälskare — men uppskatterar smarta AI-produkter och testpilotar gärna.

**Pain point:** Vill hålla sig uppdaterad på branschlitteratur utan att lägga 10 timmar per bok.
**Desired outcome:** Effektivitetsverktyg som faktiskt sparar tid.

---

## 3. Kärnbudskap

**Tagline:** *"Read Smarter, Not Longer."* (redan på sajten — behåll den, den är bra)

**Kärnmeddelandehierarki:**

1. **Varför ska jag bry mig?**
   Du hinner inte läsa alla böcker du vill. Nu slipper du välja.

2. **Vad är lösningen?**
   Ladda upp vilken PDF-bok som helst — få en personlig AI-sammanfattning på 2–3 minuter, skräddarsydd efter dina mål och hur du lär dig bäst.

3. **Varför BookDigest?**
   Tre sammanfattningsstilar (Executive, Study Guide, Action Plan) • Personaliserad via ett kort frågeformulär • Powered by Claude AI — inte ChatGPT

4. **Vad ska jag göra?**
   Testa gratis — 3 sammanfattningar, inget kreditkort krävs.

**Proof points:**
- 2–3 minuters generationstid (snabbhet)
- Tre distinkta stilar för olika användningsfall
- "Powered by Claude AI" — differentierar mot generiska ChatGPT-wrappers
- Gratis att börja, ingen kreditkortsinformation krävs

---

## 4. Kanalstrategi

Prioritering baserad på potential att nå 1 000 signups med liten befintlig publik.

### Kanal 1: Product Hunt 🚀 (beräknat bidrag: 250–400 signups)
**Varför:** Product Hunts launch-dag driver koncentrerad trafik från tidiga adoptörer och teknikentusiaster globalt. En stark dag-1-placering (topp 5) kan ge hundratals signups.

**Hur:**
- Skapa en Hunter-profil med bra aktivitetshistorik (upvota andra produkter dagligen från nu)
- Skriv en tydlig tagline: *"Upload any PDF book → get a personalized AI summary in 2 min"*
- Gör en 60-sekunders demo-GIF/video som visar hela flödet (upload → questionnaire → summary)
- Boka launch till en **tisdag eller onsdag** (högst trafik på PH)
- Rekrytera 20–30 vänner/bekanta att upvota och kommentera tidigt på morgonen (00:01 PST)
- Svara på varje kommentar under launch-dagen

**Asset som behövs:** Demo-video *(se `docs/demo-video-script.md` + `docs/demo-video-checklist.md`)*, PH-banner (1270×760px), tagline, beskrivning

---

### Kanal 2: Reddit 🟠 (beräknat bidrag: 200–300 signups)
**Varför:** Reddit-communities för böcker, produktivitet och AI är stora och engagerade. Rätt inlägg kan bli viralt.

**Subreddits att posta i (olika dagar, inte samma dag):**

| Subreddit | Storlek | Vinkel |
|-----------|---------|--------|
| r/books | 24M | "I built a tool that summarizes any book PDF in 2 min" |
| r/productivity | 2M | "How I stopped buying books I never finish" |
| r/ChatGPT / r/artificial | 6M | "Built a Claude-powered book summarizer" |
| r/selfimprovement | 2M | Fokus på action plans och kunskapstillämpning |
| r/sideprojects | 200K | "Launched my first SaaS — here's what I built" |
| r/learnprogramming | 4M | Teknisk build-in-public-post |

**Regler för Reddit:**
- Posta alltid en demo/screenshot — text utan visuellt engagemang fungerar sämre
- Var öppen och personlig ("jag byggde detta för att jag själv hade problemet")
- Svara på varje kommentar under de första 2 timmarna
- Posta inte samma länk i flera subreddits samma dag

---

### Kanal 3: Hacker News — Show HN 🔶 (beräknat bidrag: 100–250 signups)
**Varför:** HN:s "Show HN" är perfekt för indie-byggare och lockar tekniskt kunniga tidiga adoptörer som gärna delar vidare. En stark Show HN kan ge enorm räckvidd.

**Titel:** `Show HN: BookDigest – Upload any PDF book, get a personalized AI summary in 2 min`

**Tips:**
- Posta på vardagar 08–10 EST (högt trafikfönster)
- Inledningskommentaren ska vara personlig: varför du byggde det, tekniska val (Next.js, Claude, Supabase), vad du är osäker på
- Lyft fram det tekniskt intressanta: DOMMatrix-polyfill, pdfjs-dist, Claude-integrationen
- Var beredd på kritiska frågor om integritet (du har "private by design" — använd det)

---

### Kanal 4: LinkedIn 💼 (beräknat bidrag: 80–150 signups)
**Varför:** Även med liten publik kan LinkedIn-algoritmen ge organisk räckvidd till rätt yrkesroller om innehållet engagerar.

**Innehållsstrategi — 6 inlägg under 6 veckor:**

| Vecka | Inlägg | Format |
|-------|--------|--------|
| V1 | "Jag byggde något jag behövde själv..." — backstory | Text + hero-bild |
| V2 | Demo-video (30 sek: upload → summary) | Video (native upload) |
| V3 (launch) | "Vi är live på Product Hunt — testa gratis" | Text + länk |
| V4 | Use case: en specifik bok, tre stilar, vad du lärde dig | Karusellinlägg |
| V5 | "Lärdomar från att bygga en AI-produkt med Claude" | Text (build in public) |
| V6 | Milstolpe-inlägg: "X användare på Y dagar" | Text + stats |

**Nyckel:** Native video och karusellformat prioriteras av LinkedIn-algoritmen. Undvik externa länkar i inläggstexten — lägg länken i kommentaren istället.

---

### Kanal 5: Twitter / X 🐦 (beräknat bidrag: 50–100 signups)
**Varför:** #buildinpublic-communityt på X är aktivt och delar gärna indie-projekt. Även med liten publik kan ett bra thread bli repostat.

**Contentstrategi:**
- Posta ett build-in-public thread: "I spent 3 months building a book AI. Here's what I learned." (teknisk resa, demo, lansering)
- Tagga relevanta konton: @AnthropicAI (Claude), indie maker-profiler
- Använd hashtags: #buildinpublic #indiehackers #SaaS #AI

---

### Kanal 6: Bokcommunityn & Discord 📚 (beräknat bidrag: 50–100 signups)
**Varför:** Nischade bokcommunityn har låg räckvidd men hög relevans — och konverterar bättre än breda kanaler.

**Var:**
- Goodreads Groups (specifikt: "Books About Books", produktivitets-grupper)
- Discord-servrar för bokälskare och AI-entusiaster
- Svenska Facebook-grupper för boknördar
- Indie Hackers community (indiehackers.com)

**Approach:** Bygg relation innan du pitchar. Kommentera i diskussioner, dela värde — sedan introducer verktyget naturligt.

---

## 5. Innehållskalender (6 veckor)

### Fas 1: Pre-launch (Vecka 1–2)
Mål: Bygga buzz, skapa social proof, rekrytera tidiga testare

| Dag | Aktivitet | Kanal | Output |
|-----|-----------|-------|--------|
| V1 Mån | Skapa demo-video (30–60 sek) | — | Screen recording av hela flödet |
| V1 Ons | "Jag bygger något..." teaser-inlägg | LinkedIn | Inlägg med hero-bild |
| V1 Fre | Aktivera Product Hunt-profil, börja upvota | Product Hunt | Aktiv profil |
| V2 Mån | Soft-launch post: "early access öppet" | Reddit (r/sideprojects) | Trafik till sajten |
| V2 Tis | Demo-video | LinkedIn + X | Native video upload |
| V2 Tor | Gå med i 3 relevanta Discord/Reddit-communities | — | Etablera närvaro |
| V2 Fre | Förbered alla launch-assets (PH-banner, texter) | — | Klart inför launch |

**Waitlist-mål: 150 signups före launch-dagen**

---

### Fas 2: Launch Week (Vecka 3)
Mål: Maximera exponering under ett 48-timmarsfönster

| Dag | Aktivitet | Kanal |
|-----|-----------|-------|
| **Måndag** | Publicera Show HN | Hacker News |
| **Tisdag 00:01 PST** | **PRODUCT HUNT LAUNCH** | Product Hunt |
| **Tisdag morgon** | Launch-inlägg med PH-länk | LinkedIn |
| **Tisdag förmiddag** | "We're live" thread | Twitter/X |
| **Tisdag eftermiddag** | Reddit-post (r/books eller r/productivity) | Reddit |
| **Onsdag** | Reddit-post i annat subreddit | Reddit |
| **Torsdag** | Uppdatering: "X signups på 48h" | LinkedIn + X |
| **Fredag** | Reddit-post (r/sideprojects — resultat-inlägg) | Reddit |

**Launch-veckans mål: 400 signups**

---

### Fas 3: Amplification (Vecka 4–6)
Mål: Konvertera intresse till signups och betalande användare

| Vecka | Aktivitet |
|-------|-----------|
| V4 | Use-case-innehåll: "Jag sammanfattade X böcker — här är vad jag lärde mig". Reddit (r/selfimprovement, r/ChatGPT). |
| V4 | Kontakta 5–10 bokbloggare / bookstagrammers: erbjud Reader-plan gratis i utbyte mot ärlig recension |
| V5 | LinkedIn-karusellinlägg: "3 sammanfattningsstilar, en bok — vilket passar dig?" |
| V5 | Svara aktivt på alla kommentarer och recensioner som börjar komma in |
| V6 | Milstolpe-content: publicera resultat och lärdomar (social proof för nya besökare) |
| V6 | Identifiera vilken kanal som konverterat bäst — dubbla ned på den |

---

## 6. Nyckelbudget

*(Solo-founder, minimalt budget — fokus på organisk trafik)*

| Post | Estimat | Kommentar |
|------|---------|-----------|
| Product Hunt promoted post | Valfritt, 0–500 kr | Inte nödvändigt om organisk launch är stark |
| Grafik/design (Canva Pro etc.) | ~150 kr/mån | Demo-GIF, PH-banner |
| Screen recording-verktyg (Loom, etc.) | 0 kr | Loom gratis-tier räcker |
| Betald LinkedIn-boost | 0 kr i fas 1–2, ev. 300–500 kr i v3 | Boost launch-inlägget om budget finns |
| **Total** | **0–1 000 kr** | |

---

## 7. Framgångsmätning

### KPI:er

| Metrik | Mål | Mätpunkt |
|--------|-----|----------|
| Totala signups | 1 000 | Supabase user_profiles |
| Product Hunt upvotes | 200+ | PH dashboard |
| Betalande användare | 50 (Reader/Pro) | Stripe dashboard |
| Konverteringsgrad free→paid | ≥5% | Stripe / Supabase |
| Bouncegrad på landningssidan | <65% | Google Analytics / Vercel Analytics |
| Viktigaste trafikkälla | — | Vercel Analytics / UTM-taggar |

### UTM-taggning
Sätt UTM-parametrar på alla externa länkdelningar för att spåra vilken kanal som konverterar:

```
?utm_source=producthunt&utm_medium=launch&utm_campaign=launch2026
?utm_source=reddit&utm_medium=post&utm_campaign=launch2026
?utm_source=linkedin&utm_medium=organic&utm_campaign=launch2026
?utm_source=hackernews&utm_medium=showhn&utm_campaign=launch2026
```

### Veckovisa check-ins
- **Måndag varje vecka:** Hur många signups den gångna veckan? Vilken kanal drev mest?
- **Justering:** Om en kanal underpresterar → skala ned. Om en kanal överperforerar → dubbla ned omedelbart.

---

## 8. Kritiska framgångsfaktorer

**Det som avgör om du når 1 000:**

1. **Demo-videon** — Visa produkten i rörelse. Ord räcker inte. En 30-sekunders skärminspelning av "upload PDF → se summary dyka upp" är det enskilt kraftfullaste du kan göra. *(Script + checklista klar: `docs/demo-video-script.md`, `docs/demo-video-checklist.md`)*

2. **Product Hunt-timing** — Koordinera dina första 20–30 upvotes att komma inom de första 2 timmarna. Algoritmen prioriterar produkter med stark initial fart.

3. **Reddit-äkthet** — Redditors luktar marknadsföring på mils avstånd. Var genuint personlig ("jag byggde det för att jag själv inte hann läsa alla böcker jag köpte") och svara på varje kommentar.

4. **Gratis-tröskeln är din superpower** — "3 summaries free, no credit card" är en extremt låg friktionsbarriär. Lyft den i allt du postar.

5. **Show HN + Product Hunt samma vecka** — Gör dem med 1–2 dagars mellanrum. Inte samma dag.

---

## 9. Snabbstartsplan — de närmaste 7 dagarna

- [ ] Spela in demo-video — script + checklista klar i `docs/demo-video-script.md` och `docs/demo-video-checklist.md` *(lång version 2–3 min + kort version 60–90s)*
- [ ] Skapa Product Hunt-sida (draft, publicera ej än)
- [ ] Bestäm exakt launch-datum (förslag: tisdag 24 mars eller tisdag 31 mars)
- [ ] Skriv en lista på 25 personer du kan be upvota på PH-dagen
- [ ] Posta ett "jag bygger något"-inlägg på LinkedIn för att värma upp algoritmen
- [ ] Skapa UTM-länkar för alla kanaler
- [ ] Gå med i 2–3 relevanta Reddit-communities och börja kommentera (inte posta än)
