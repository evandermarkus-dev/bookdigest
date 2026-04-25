/**
 * Additional books — extends data.ts to reach 200 total.
 * Interfaces are duplicated here to avoid circular imports with data.ts.
 */

interface BookLocale {
  description: string
  teaserPoints: [string, string, string]
}

interface Book {
  slug: string
  title: string
  author: string
  year: number
  genre: string
  coverEmoji: string
  en: BookLocale
  sv: BookLocale
}

export const EXTRA_BOOKS: Book[] = [
  // ── Self-Help / Personal Development ──────────────────────────────────────
  {
    slug: 'the-subtle-art-of-not-giving-a-fck',
    title: 'The Subtle Art of Not Giving a F*ck',
    author: 'Mark Manson',
    year: 2016,
    genre: 'Self-Help',
    coverEmoji: '🤷',
    en: {
      description: 'Mark Manson argues that self-improvement comes not from seeking more positivity but from choosing what you care about — learning to give fewer, better f*cks about things that truly matter.',
      teaserPoints: [
        'The feedback loop from hell: trying to feel less negative about negative emotions only makes them worse',
        'You are not special — accepting this is the beginning of real growth and personal responsibility',
        'The backwards law: wanting positive experience is itself a negative experience; accepting negative is positive',
      ],
    },
    sv: {
      description: 'Mark Manson argumenterar för att självförbättring inte kommer från att söka mer positivitet utan från att välja vad du bryr dig om — att lära sig bry sig om färre men viktigare saker.',
      teaserPoints: [
        'Feedbackslingan från helvetet: att försöka känna sig mindre negativ om negativa känslor förvärrar dem',
        'Du är inte speciell — att acceptera detta är början på riktig tillväxt och personligt ansvar',
        'Den bakvända lagen: att vilja ha positiva upplevelser är i sig en negativ upplevelse; att acceptera det negativa är positivt',
      ],
    },
  },
  {
    slug: 'the-power-of-now',
    title: 'The Power of Now',
    author: 'Eckhart Tolle',
    year: 1997,
    genre: 'Self-Help',
    coverEmoji: '🌅',
    en: {
      description: 'Eckhart Tolle guides readers to recognize that the present moment is all we ever truly have — that the ego-driven mind keeps us trapped in past regrets and future anxieties when peace lives only in the Now.',
      teaserPoints: [
        'The voice in your head is not who you are — observing it without identifying with it is the path to peace',
        'Pain bodies: accumulated emotional pain that feeds off drama and negativity in a self-perpetuating cycle',
        'Presence, not achievement, is the portal to joy — and it is always accessible in this very moment',
      ],
    },
    sv: {
      description: 'Eckhart Tolle vägleder läsare att inse att nuets ögonblick är allt vi verkligen har — att det egodrivna sinnet håller oss fångade i dåtida ånger och framtida ångest när friden bara lever i Nu.',
      teaserPoints: [
        'Rösten i ditt huvud är inte du — att observera den utan att identifiera dig med den är vägen till fred',
        'Smärtkroppar: ackumulerad emotionell smärta som lever på drama och negativitet i en självförstärkande cykel',
        'Närvaro, inte prestation, är portalen till glädje — och den är alltid tillgänglig i detta ögonblick',
      ],
    },
  },
  {
    slug: 'grit',
    title: 'Grit: The Power of Passion and Perseverance',
    author: 'Angela Duckworth',
    year: 2016,
    genre: 'Psychology',
    coverEmoji: '💎',
    en: {
      description: 'Psychologist Angela Duckworth shows that the secret to outstanding achievement is not talent but a special blend of passion and perseverance she calls grit — and that it can be cultivated by anyone.',
      teaserPoints: [
        'Talent × effort = skill; skill × effort = achievement — effort counts twice as much as raw talent',
        'The grit scale: you can measure your passion and perseverance — then systematically develop both',
        'A growth culture — not just individual mindset — is what allows grit to flourish in teams and organizations',
      ],
    },
    sv: {
      description: 'Psykologen Angela Duckworth visar att hemligheten bakom enastående prestationer inte är talang utan en kombination av passion och uthållighet hon kallar grit — och att det kan odlas av vem som helst.',
      teaserPoints: [
        'Talang × ansträngning = färdighet; färdighet × ansträngning = prestation — ansträngning räknas dubbelt',
        'Grit-skalan: du kan mäta din passion och uthållighet — och sedan systematiskt utveckla båda',
        'En tillväxtkultur — inte bara individuellt tankesätt — är vad som låter grit blomstra i team och organisationer',
      ],
    },
  },
  {
    slug: 'the-war-of-art',
    title: 'The War of Art',
    author: 'Steven Pressfield',
    year: 2002,
    genre: 'Creativity',
    coverEmoji: '🎨',
    en: {
      description: 'Steven Pressfield identifies the greatest enemy of creative work — Resistance — and presents a battle plan for becoming a true professional who shows up every day regardless of mood or inspiration.',
      teaserPoints: [
        'Resistance is the enemy: the internal force that opposes every creative, entrepreneurial, or spiritual act',
        'Turning pro: amateurs wait for inspiration, professionals show up whether they feel like it or not',
        'The Muse only shows up after you do — committing to daily practice invites genuine creative breakthroughs',
      ],
    },
    sv: {
      description: 'Steven Pressfield identifierar det kreativa arbetets största fiende — Motståndet — och presenterar en stridsplan för att bli en sann professionell som dyker upp varje dag oavsett humör eller inspiration.',
      teaserPoints: [
        'Motståndet är fienden: den inre kraften som motarbetar varje kreativt, entreprenöriellt eller andligt handlande',
        'Att bli professionell: amatörer väntar på inspiration, professionella dyker upp oavsett hur de känner',
        'Musan dyker bara upp efter att du gjort det — att åta sig daglig praktik bjuder in kreativa genombrott',
      ],
    },
  },
  {
    slug: 'four-thousand-weeks',
    title: 'Four Thousand Weeks: Time Management for Mortals',
    author: 'Oliver Burkeman',
    year: 2021,
    genre: 'Philosophy',
    coverEmoji: '⌛',
    en: {
      description: 'Oliver Burkeman rejects productivity culture\'s promise of "getting it all done" and argues that the finitude of life — roughly 4,000 weeks — is not a problem to solve but a truth that can set you free.',
      teaserPoints: [
        'You will never get everything done — embracing this is the foundation of a meaningful, unhurried life',
        'Patience and strategic sacrifice: doing anything that matters requires willingness to not do everything else',
        'The attention economy preys on our fear of missing out — reclaiming time starts with choosing to miss things',
      ],
    },
    sv: {
      description: 'Oliver Burkeman avvisar produktivitetskulturens löfte om att "göra allt" och argumenterar för att livets ändlighet — ungefär 4 000 veckor — inte är ett problem att lösa utan en sanning som kan befria dig.',
      teaserPoints: [
        'Du kommer aldrig att göra allt — att omfamna detta är grunden för ett meningsfullt, ostressat liv',
        'Tålamod och strategisk uppoffring: att göra något som spelar roll kräver att du är villig att inte göra allt annat',
        'Uppmärksamhetsekonomin utnyttjar vår rädsla att missa — att återta tid börjar med att välja att missa saker',
      ],
    },
  },
  {
    slug: 'the-daily-stoic',
    title: 'The Daily Stoic',
    author: 'Ryan Holiday',
    year: 2016,
    genre: 'Philosophy',
    coverEmoji: '🏛️',
    en: {
      description: 'Ryan Holiday and Stephen Hanselman compile 366 daily meditations from Stoic philosophers Marcus Aurelius, Epictetus, and Seneca — practical ancient wisdom for modern life, one day at a time.',
      teaserPoints: [
        'The dichotomy of control: some things are in our power, others are not — wisdom begins with knowing the difference',
        'Memento mori: contemplating death daily sharpens your focus on what actually matters',
        'Amor fati — love of fate: embrace what happens, including obstacles, rather than wishing things were different',
      ],
    },
    sv: {
      description: 'Ryan Holiday och Stephen Hanselman sammanställer 366 dagliga meditationer från stoiska filosofer Marcus Aurelius, Epiktetos och Seneca — praktisk antik visdom för modernt liv, en dag i taget.',
      teaserPoints: [
        'Kontrollens dikotomi: vissa saker är i vår makt, andra inte — visdom börjar med att känna skillnaden',
        'Memento mori: att dagligen kontemplera döden skärper ditt fokus på vad som verkligen spelar roll',
        'Amor fati — kärlek till ödet: omfamna det som händer, inklusive hinder, istället för att önska att saker vore annorlunda',
      ],
    },
  },
  {
    slug: 'digital-minimalism',
    title: 'Digital Minimalism: Choosing a Focused Life in a Noisy World',
    author: 'Cal Newport',
    year: 2019,
    genre: 'Productivity',
    coverEmoji: '📵',
    en: {
      description: 'Cal Newport argues that compulsive phone use is not a personal failure but an engineered addiction — and presents a philosophy of using technology intentionally to support your values, not hijack your attention.',
      teaserPoints: [
        'The digital minimalism philosophy: be intentional about which tools you use and how — delete the rest',
        'The 30-day digital declutter: reset your relationship with technology before selectively reintroducing tools',
        'Solitude deprivation crisis: constant connectivity prevents the quiet reflection essential for mental health',
      ],
    },
    sv: {
      description: 'Cal Newport argumenterar för att tvångsmässig telefon­användning inte är ett personligt misslyckande utan ett konstruerat beroende — och presenterar en filosofi om att använda teknik avsiktligt.',
      teaserPoints: [
        'Digital minimalism-filosofin: var avsiktlig om vilka verktyg du använder och hur — radera resten',
        'Den 30-dagiga digitala utrensningen: återställ din relation till tekniken innan du selektivt återinför verktyg',
        'Ensamhetsbristkrisen: konstant uppkoppling förhindrar den tysta reflektion som är avgörande för mental hälsa',
      ],
    },
  },
  {
    slug: 'so-good-they-cant-ignore-you',
    title: "So Good They Can't Ignore You",
    author: 'Cal Newport',
    year: 2012,
    genre: 'Career',
    coverEmoji: '⭐',
    en: {
      description: 'Cal Newport challenges the "follow your passion" advice and argues that career satisfaction comes from developing rare and valuable skills — and then using that career capital to gain autonomy and purpose.',
      teaserPoints: [
        'Passion is an output, not an input: it grows as you develop mastery, not before',
        'Career capital theory: rare and valuable skills are the currency that buys you the career you want',
        'The craftsman mindset — focus on what you can offer the world, not what the world can offer you',
      ],
    },
    sv: {
      description: 'Cal Newport utmanar rådet att "följa din passion" och argumenterar för att karriärtillfredsställelse kommer från att utveckla sällsynta och värdefulla färdigheter — och sedan använda det kapitalet för att vinna autonomi.',
      teaserPoints: [
        'Passion är ett utflöde, inte ett inflöde: det växer när du utvecklar mästerskap, inte innan',
        'Karriärkapitalteorin: sällsynta och värdefulla färdigheter är valutan som köper dig den karriär du vill ha',
        'Hantverkartankesättet — fokusera på vad du kan erbjuda världen, inte vad världen kan erbjuda dig',
      ],
    },
  },
  {
    slug: 'the-one-thing',
    title: 'The ONE Thing',
    author: 'Gary Keller',
    year: 2013,
    genre: 'Productivity',
    coverEmoji: '1️⃣',
    en: {
      description: 'Gary Keller argues that extraordinary results come from narrowing your focus to a single most important thing at any given time — the domino principle applied to work, goals, and life.',
      teaserPoints: [
        'The focusing question: "What\'s the ONE thing I can do such that by doing it, everything else will be easier or unnecessary?"',
        'Multitasking is a lie: switching between tasks destroys depth and compounds errors',
        'Time blocking your ONE thing every morning, before everything else, is the foundation of elite performance',
      ],
    },
    sv: {
      description: 'Gary Keller argumenterar för att extraordinära resultat kommer från att smalna ner ditt fokus till en enda viktigaste sak vid varje givet tillfälle — dominoprincipen applicerad på arbete, mål och livet.',
      teaserPoints: [
        'Fokuseringsfrågan: "Vad är det ENa jag kan göra så att allt annat blir lättare eller onödigt?"',
        'Multitasking är en lögn: att byta mellan uppgifter förstör djup och multiplicerar misstag',
        'Att tidsblocka din ENa sak varje morgon, före allt annat, är grunden för elit­prestation',
      ],
    },
  },
  {
    slug: 'meditations',
    title: 'Meditations',
    author: 'Marcus Aurelius',
    year: 180,
    genre: 'Philosophy',
    coverEmoji: '📜',
    en: {
      description: 'The private journal of Roman Emperor Marcus Aurelius — written as reminders to himself — stands as one of history\'s greatest Stoic texts, full of practical wisdom on virtue, impermanence, and duty.',
      teaserPoints: [
        'You have power over your mind, not outside events — realize this and you will find strength',
        'Waste no more time arguing about what a good man should be — be one, starting now',
        'The obstacle is the way: what blocks action advances action when met with the right perception',
      ],
    },
    sv: {
      description: 'Den romerske kejsaren Marcus Aurelius privata dagbok — skriven som påminnelser till sig själv — är en av historiens största stoiska texter, full av praktisk visdom om dygd, förgänglighet och plikt.',
      teaserPoints: [
        'Du har makt över ditt sinne, inte yttre händelser — inse detta och du finner styrka',
        'Slösa inte mer tid på att argumentera om vad en god människa borde vara — var en, börja nu',
        'Hindret är vägen: det som blockerar handling för handlingen framåt när det möts med rätt uppfattning',
      ],
    },
  },
  {
    slug: 'the-happiness-advantage',
    title: 'The Happiness Advantage',
    author: 'Shawn Achor',
    year: 2010,
    genre: 'Psychology',
    coverEmoji: '😊',
    en: {
      description: 'Harvard researcher Shawn Achor shows that happiness is not a result of success but its precursor — that a positive brain is 31% more productive, and that happiness can be trained through simple daily practices.',
      teaserPoints: [
        'The happiness advantage: positive brains perform better at nearly every business outcome we can measure',
        'The Tetris effect: training your brain to scan for positives — rather than problems — rewires your worldview',
        'Social investment: the greatest predictor of success and happiness is strong social support networks',
      ],
    },
    sv: {
      description: 'Harvard-forskaren Shawn Achor visar att lycka inte är ett resultat av framgång utan dess föregångare — att en positiv hjärna är 31% mer produktiv, och att lycka kan tränas genom enkla dagliga rutiner.',
      teaserPoints: [
        'Lyckoadvantaget: positiva hjärnor presterar bättre på nästan varje affärsresultat vi kan mäta',
        'Tetris-effekten: att träna din hjärna att skanna efter positiva saker — snarare än problem — omkopplar din världsbild',
        'Social investering: den starkaste prediktorn för framgång och lycka är starka sociala stödnätverk',
      ],
    },
  },
  {
    slug: 'tiny-habits',
    title: 'Tiny Habits: The Small Changes That Change Everything',
    author: 'BJ Fogg',
    year: 2019,
    genre: 'Productivity',
    coverEmoji: '🌱',
    en: {
      description: 'Stanford behavior scientist BJ Fogg reveals that lasting change comes not from motivation or willpower but from making habits tiny, anchoring them to existing routines, and celebrating each small win.',
      teaserPoints: [
        'The Fogg Behavior Model: behavior happens when motivation, ability, and prompt converge at the same moment',
        'Shrink the change: make habits so small they require almost no motivation — then let them naturally grow',
        'Celebration creates habit: the feeling of success after a tiny action wires the brain to repeat it automatically',
      ],
    },
    sv: {
      description: 'Stanford-beteendevetaren BJ Fogg avslöjar att bestående förändring inte kommer från motivation eller viljestyrka utan från att göra vanor minimala, förankra dem till befintliga rutiner och fira varje litet framsteg.',
      teaserPoints: [
        'Fogg-beteendemodellen: beteende uppstår när motivation, förmåga och trigger sammanfaller vid samma ögonblick',
        'Krympa förändringen: gör vanor så liten att de kräver nästan ingen motivation — låt dem sedan växa naturligt',
        'Firande skapar vana: känslan av framgång efter en liten handling kopplar hjärnan till att upprepa den automatiskt',
      ],
    },
  },
  {
    slug: 'stillness-is-the-key',
    title: 'Stillness Is the Key',
    author: 'Ryan Holiday',
    year: 2019,
    genre: 'Philosophy',
    coverEmoji: '🕊️',
    en: {
      description: 'Ryan Holiday argues that stillness — the ability to step back, think clearly, and be present — is the secret weapon of history\'s greatest leaders, artists, and athletes, drawn from Stoic, Buddhist, and Epicurean thought.',
      teaserPoints: [
        'Limit inputs: the more information you consume, the harder it becomes to think clearly and originally',
        'Journaling as a clarity tool: writing your thoughts captures and processes what might otherwise stay tangled',
        'Leisure is not laziness — restoring yourself fully is essential for sustained high performance',
      ],
    },
    sv: {
      description: 'Ryan Holiday argumenterar för att stillhet — förmågan att kliva tillbaka, tänka klart och vara närvarande — är det hemliga vapnet hos historiens största ledare, konstnärer och idrottare.',
      teaserPoints: [
        'Begränsa inflöden: ju mer information du konsumerar, desto svårare blir det att tänka klart och originellt',
        'Journalföring som klarhetverktyg: att skriva dina tankar fångar och bearbetar det som annars kan förbli trassligt',
        'Fritid är inte lättja — att fullt ut återhämta sig är avgörande för bestående hög prestation',
      ],
    },
  },
  {
    slug: 'breath',
    title: 'Breath: The New Science of a Lost Art',
    author: 'James Nestor',
    year: 2020,
    genre: 'Health',
    coverEmoji: '🌬️',
    en: {
      description: 'James Nestor investigates the science of breathing and discovers that the way we breathe — mostly through the mouth, fast and shallow — is making us sick, and that ancient breathing techniques offer a powerful remedy.',
      teaserPoints: [
        'Nose breathing vs. mouth breathing: breathing through your nose is dramatically better for health and performance',
        'The perfect breath: 5.5 seconds in, 5.5 seconds out — a rhythm that optimizes heart rate variability',
        'Breath-hold training and CO2 tolerance underlie extreme endurance and can be trained by anyone',
      ],
    },
    sv: {
      description: 'James Nestor undersöker vetenskapen om andning och upptäcker att hur vi andas — mest genom munnen, snabbt och ytligt — gör oss sjuka, och att gamla andningstekniker erbjuder ett kraftfullt botemedel.',
      teaserPoints: [
        'Näsandning vs. munandning: att andas genom näsan är dramatiskt bättre för hälsa och prestation',
        'Den perfekta andningen: 5,5 sekunder in, 5,5 sekunder ut — en rytm som optimerar hjärtrytmvariabilitet',
        'Andningshållnings­träning och CO2-tolerans underbygger extrem uthållighet och kan tränas av vem som helst',
      ],
    },
  },
  {
    slug: 'feel-good-productivity',
    title: 'Feel-Good Productivity',
    author: 'Ali Abdaal',
    year: 2023,
    genre: 'Productivity',
    coverEmoji: '✨',
    en: {
      description: 'Dr. Ali Abdaal argues that the secret to sustainable productivity is not discipline and grind but feeling good — that positive emotions are the fuel for performance, creativity, and long-term output.',
      teaserPoints: [
        'The feel-good hypothesis: positive emotions broaden our thinking, increase creativity, and boost output',
        'Play, power, and people: the three energisers that make work feel effortless and sustaining',
        'Burnout prevention starts with adding positive experiences, not just removing negative ones',
      ],
    },
    sv: {
      description: 'Dr. Ali Abdaal argumenterar för att hemligheten bakom hållbar produktivitet inte är disciplin och slit utan att må bra — att positiva känslor är bränslet för prestation, kreativitet och långsiktig output.',
      teaserPoints: [
        'Må-bra-hypotesen: positiva känslor breddar vårt tänkande, ökar kreativiteten och boostar outputen',
        'Lek, makt och människor: de tre energigivarna som gör arbete känn­slomässigt lätt och hållbart',
        'Förebyggande av utbrändhet börjar med att lägga till positiva upplevelser, inte bara ta bort negativa',
      ],
    },
  },
  {
    slug: 'ikigai',
    title: 'Ikigai: The Japanese Secret to a Long and Happy Life',
    author: 'Héctor García & Francesc Miralles',
    year: 2016,
    genre: 'Philosophy',
    coverEmoji: '🌸',
    en: {
      description: 'Inspired by the world\'s longest-lived community in Okinawa, this book explores ikigai — the Japanese concept of your reason for being — and the daily practices that make life worth living.',
      teaserPoints: [
        'Ikigai is found at the intersection of what you love, what you\'re good at, what the world needs, and what you can be paid for',
        'Flow over goals: the longest-lived people focus on the process of daily activity, not on retirement or achievement',
        'Moai and community: belonging to a tight-knit social group may be the single greatest longevity factor',
      ],
    },
    sv: {
      description: 'Inspirerad av världens längst levande gemenskap på Okinawa utforskar den här boken ikigai — det japanska konceptet av din anledning att vara — och de dagliga praktikerna som gör livet värt att leva.',
      teaserPoints: [
        'Ikigai hittas i skärningspunkten mellan vad du älskar, vad du är bra på, vad världen behöver och vad du kan få betalt för',
        'Flow före mål: de längst levande fokuserar på processen av daglig aktivitet, inte på pension eller prestation',
        'Moai och gemenskap: att tillhöra en tight social grupp kan vara den enskilt starkaste faktorn för lång livslängd',
      ],
    },
  },
  {
    slug: 'think-again',
    title: 'Think Again: The Power of Knowing What You Don\'t Know',
    author: 'Adam Grant',
    year: 2021,
    genre: 'Psychology',
    coverEmoji: '🔄',
    en: {
      description: 'Organizational psychologist Adam Grant makes the case for rethinking and unlearning as the most underrated skills — arguing that our ability to question our own beliefs is what allows us to grow and adapt.',
      teaserPoints: [
        'Thinking like a scientist: treating your beliefs as hypotheses to test rather than identities to defend',
        'Confident humility: knowing what you don\'t know is a strength, not a weakness — and it predicts success',
        'Motivational interviewing: you can\'t force others to change their minds, but you can invite them to reconsider',
      ],
    },
    sv: {
      description: 'Organisationspsykologen Adam Grant pläderar för att omtänka och avlära som de mest underskattade färdigheterna — och argumenterar för att vår förmåga att ifrågasätta våra egna övertygelser är vad som låter oss växa.',
      teaserPoints: [
        'Att tänka som en vetenskapsman: behandla dina övertygelser som hypoteser att testa snarare än identiteter att försvara',
        'Säker ödmjukhet: att veta vad du inte vet är en styrka, inte en svaghet — och det förutsäger framgång',
        'Motiverande samtal: du kan inte tvinga andra att ändra uppfattning, men du kan bjuda in dem att ompröva',
      ],
    },
  },
  // ── Business / Entrepreneurship ───────────────────────────────────────────
  {
    slug: '100m-offers',
    title: '$100M Offers',
    author: 'Alex Hormozi',
    year: 2021,
    genre: 'Business',
    coverEmoji: '💰',
    en: {
      description: 'Alex Hormozi reveals how to craft offers so compelling that prospects feel stupid saying no — a step-by-step playbook for packaging your product or service to command premium prices.',
      teaserPoints: [
        'Grand slam offers: combine value, scarcity, urgency, bonuses, and guarantees to make price irrelevant',
        'The value equation: increase dream outcome and perceived likelihood; decrease time and effort required',
        'Pricing to the transformation, not the transaction: charge what the outcome is worth, not what the work costs',
      ],
    },
    sv: {
      description: 'Alex Hormozi avslöjar hur man skapar erbjudanden så övertygande att kunder känner sig dumma att säga nej — en steg-för-steg-spelbok för att paketera din produkt eller tjänst för premiumpris.',
      teaserPoints: [
        'Grand slam-erbjudanden: kombinera värde, brist, brådska, bonusar och garantier för att göra priset irrelevant',
        'Värdeekvationen: öka drömresultat och upplevd sannolikhet; minska tid och ansträngning som krävs',
        'Prissätt transformationen, inte transaktionen: ta betalt för vad resultatet är värt, inte vad arbetet kostar',
      ],
    },
  },
  {
    slug: 'traction',
    title: 'Traction: Get a Grip on Your Business',
    author: 'Gino Wickman',
    year: 2011,
    genre: 'Business',
    coverEmoji: '🚀',
    en: {
      description: 'Gino Wickman presents the Entrepreneurial Operating System (EOS) — a complete set of practical tools for getting every part of your business moving in the same direction with clarity and accountability.',
      teaserPoints: [
        'The six EOS components: vision, people, data, issues, process, traction — master all six to scale',
        'Rocks and accountability: 90-day priorities assigned to named owners eliminate "everyone\'s job is nobody\'s job"',
        'The Level 10 Meeting: a weekly cadence format that solves issues rather than just discussing them',
      ],
    },
    sv: {
      description: 'Gino Wickman presenterar Entrepreneurial Operating System (EOS) — en komplett uppsättning praktiska verktyg för att få varje del av ditt företag att röra sig i samma riktning med klarhet och ansvarsskyldighet.',
      teaserPoints: [
        'De sex EOS-komponenterna: vision, människor, data, problem, process, traktion — bemästra alla sex för att skala',
        'Stenar och ansvarsskyldighet: 90-dagars prioriteringar tilldelade namngivna ägare eliminerar "allas jobb är ingens jobb"',
        'Level 10-mötet: ett veckligt kadens­format som löser problem snarare än att bara diskutera dem',
      ],
    },
  },
  {
    slug: 'the-mom-test',
    title: 'The Mom Test',
    author: 'Rob Fitzpatrick',
    year: 2013,
    genre: 'Business',
    coverEmoji: '🧪',
    en: {
      description: 'Rob Fitzpatrick shows entrepreneurs how to have customer conversations that actually reveal the truth — because even your mom will lie to you if you ask the wrong questions about your business idea.',
      teaserPoints: [
        'Talk about their life, not your idea: ask about past behavior and real problems, not future hypotheticals',
        'The mom test: ask questions your mom couldn\'t lie to — rooted in specifics and measurable past experience',
        'Bad data comes from compliments, fluff, and "I would buy that" — learn to recognize and reject it',
      ],
    },
    sv: {
      description: 'Rob Fitzpatrick visar entreprenörer hur man för kundsamtal som faktiskt avslöjar sanningen — för även din mamma ljuger för dig om du ställer fel frågor om din affärsidé.',
      teaserPoints: [
        'Prata om deras liv, inte din idé: fråga om tidigare beteende och verkliga problem, inte framtida hypotetiska',
        'Mammatestet: ställ frågor som din mamma inte kan ljuga på — rotade i specifika och mätbara tidigare erfarenheter',
        'Dålig data kommer från komplimanger, flummighet och "jag skulle köpa det" — lär dig att känna igen och avvisa det',
      ],
    },
  },
  {
    slug: 'inspired',
    title: 'Inspired: How to Create Tech Products Customers Love',
    author: 'Marty Cagan',
    year: 2008,
    genre: 'Business',
    coverEmoji: '💡',
    en: {
      description: 'Silicon Valley product leader Marty Cagan reveals how the best tech companies discover products that customers love — contrasting the empowered product team model with the feature factory trap most companies fall into.',
      teaserPoints: [
        'The empowered product team: give teams problems to solve, not features to build — trust them with the how',
        'Product discovery vs. delivery: most teams spend all their time delivering and none discovering what\'s truly valuable',
        'The four big risks: value, usability, feasibility, and business viability — address all four before building',
      ],
    },
    sv: {
      description: 'Silicon Valley-produktledaren Marty Cagan avslöjar hur de bästa techföretagen hittar produkter som kunder älskar — och kontrasterar den bemyndigade produktteammodellen med funktionsfabriks­fällan.',
      teaserPoints: [
        'Det bemyndigade produktteamet: ge team problem att lösa, inte funktioner att bygga — lita på dem med hur',
        'Produktupptäckt vs. leverans: de flesta team spenderar all tid på leverans och inget på att upptäcka vad som är värdefullt',
        'De fyra stora riskerna: värde, användbarhet, genomförbarhet och affärsduglighet — adressera alla fyra innan du bygger',
      ],
    },
  },
  {
    slug: 'obviously-awesome',
    title: 'Obviously Awesome: How to Nail Product Positioning',
    author: 'April Dunford',
    year: 2019,
    genre: 'Business',
    coverEmoji: '🎯',
    en: {
      description: 'April Dunford reveals why most companies fail at positioning — and presents a step-by-step process for finding the frame of reference that makes your product\'s value immediately obvious to the right customers.',
      teaserPoints: [
        'Positioning is not your tagline — it is the mental framework customers use to evaluate your product',
        'The five components of positioning: competitive alternatives, attributes, value, target customers, and market category',
        'Best-fit customers: ruthlessly focusing on the segment where you win teaches you your true competitive advantage',
      ],
    },
    sv: {
      description: 'April Dunford avslöjar varför de flesta företag misslyckas med positionering — och presenterar en steg-för-steg-process för att hitta referensramen som gör din produkts värde omedelbart uppenbart.',
      teaserPoints: [
        'Positionering är inte din slogan — det är det mentala ramverket kunder använder för att utvärdera din produkt',
        'De fem komponenterna i positionering: konkurrensalternativ, attribut, värde, målkunder och marknadskategori',
        'Bäst-passande kunder: att hänsynslöst fokusera på det segment där du vinner lär dig ditt verkliga konkurrensfördelar',
      ],
    },
  },
  {
    slug: 'crossing-the-chasm',
    title: 'Crossing the Chasm',
    author: 'Geoffrey Moore',
    year: 1991,
    genre: 'Business',
    coverEmoji: '🌉',
    en: {
      description: 'Geoffrey Moore identifies the dangerous gap between early tech adopters and the mainstream market — the chasm — and shows why most startups die there and how to successfully cross it.',
      teaserPoints: [
        'The technology adoption lifecycle: innovators → early adopters → chasm → early majority → late majority',
        'Whole product concept: mainstream customers won\'t cross the chasm for a partial solution — you need the complete package',
        'Target the beachhead: dominate one niche completely before expanding — the bowling pin strategy',
      ],
    },
    sv: {
      description: 'Geoffrey Moore identifierar det farliga gapet mellan tidiga teknikadopters och den vanliga marknaden — klyftan — och visar varför de flesta startups dör där och hur man framgångsrikt tar sig över.',
      teaserPoints: [
        'Teknologiadoptionens livscykel: innovatörer → tidiga adopters → klyftan → tidig majoritet → sen majoritet',
        'Helproduktkonceptet: vanliga kunder tar sig inte över klyftan för en partiell lösning — du behöver hela paketet',
        'Rikta mot brohuvudet: dominera en nisch helt innan du expanderar — bowlingklotsstrategin',
      ],
    },
  },
  {
    slug: 'blue-ocean-strategy',
    title: 'Blue Ocean Strategy',
    author: 'W. Chan Kim & Renée Mauborgne',
    year: 2004,
    genre: 'Business',
    coverEmoji: '🌊',
    en: {
      description: 'Kim and Mauborgne argue that lasting success comes not from fighting in overcrowded red ocean markets but from creating uncontested blue ocean market space where competition becomes irrelevant.',
      teaserPoints: [
        'Value innovation: simultaneously pursue differentiation and low cost — break the value-cost trade-off',
        'The four actions framework: which factors to eliminate, reduce, raise, and create to shift the strategy canvas',
        'Blue oceans are created, not found: companies create uncontested space by questioning industry assumptions',
      ],
    },
    sv: {
      description: 'Kim och Mauborgne argumenterar för att bestående framgång inte kommer från att kämpa i överfulla röda havsmarknader utan från att skapa obestridd blå havs­marknadsrymd där konkurrens blir irrelevant.',
      teaserPoints: [
        'Värdeinnovation: sök simultaneously differentiering och låg kostnad — bryt värde-kostnad-avvägningen',
        'Ramverket med fyra åtgärder: vilka faktorer att eliminera, minska, öka och skapa för att skifta strategiduken',
        'Blå hav skapas, hittas inte: företag skapar obestridd rymd genom att ifrågasätta branschens antaganden',
      ],
    },
  },
  {
    slug: 'measure-what-matters',
    title: 'Measure What Matters',
    author: 'John Doerr',
    year: 2018,
    genre: 'Business',
    coverEmoji: '📊',
    en: {
      description: 'Legendary venture capitalist John Doerr champions OKRs — Objectives and Key Results — the goal-setting framework used by Google, Intel, and Bono to drive focus, alignment, and moonshot thinking.',
      teaserPoints: [
        'OKRs create focus: a company can only achieve a handful of things that matter — committing to a few drives performance',
        'Stretch goals: the best OKRs push beyond what seems achievable, unlocking initiative and innovation',
        'Transparency and alignment: when everyone can see everyone\'s OKRs, coordination replaces politics',
      ],
    },
    sv: {
      description: 'Den legendariske riskkapitalisten John Doerr förespråkar OKR — Objectives and Key Results — det målsättningsramverk som används av Google, Intel och Bono för att driva fokus, anpassning och månlandnings­tänkande.',
      teaserPoints: [
        'OKR skapar fokus: ett företag kan bara uppnå ett fåtal saker som spelar roll — att åta sig ett fåtal driver prestation',
        'Sträckmål: de bästa OKR:erna pushar bortom vad som verkar möjligt och frigör initiativ och innovation',
        'Transparens och anpassning: när alla kan se allas OKR:er ersätter koordination politiken',
      ],
    },
  },
  {
    slug: 'no-rules-rules',
    title: 'No Rules Rules: Netflix and the Culture of Reinvention',
    author: 'Reed Hastings & Erin Meyer',
    year: 2020,
    genre: 'Business',
    coverEmoji: '🎬',
    en: {
      description: 'Netflix CEO Reed Hastings reveals the radical management philosophy behind the world\'s most innovative streaming company — a culture of radical honesty, extreme talent density, and freedom with responsibility.',
      teaserPoints: [
        'Talent density: removing mediocre performers raises the performance level of everyone around them',
        'Lead with context, not control: when everyone understands the why, you don\'t need rules to govern the how',
        'The keeper test: would your manager fight to keep you? If not, they owe you a generous severance',
      ],
    },
    sv: {
      description: 'Netflix VD Reed Hastings avslöjar den radikala ledningsfilosofin bakom världens mest innovativa streamingbolag — en kultur av radikal ärlighet, extrem talangdensitet och frihet med ansvar.',
      teaserPoints: [
        'Talangdensitet: att ta bort mediokra medarbetare höjer prestationsnivån hos alla runt dem',
        'Led med kontext, inte kontroll: när alla förstår varför behöver du inga regler för att styra hur',
        'Bevarantestet: skulle din chef kämpa för att hålla kvar dig? Om inte är de skyldiga dig ett generöst avgångsvederlag',
      ],
    },
  },
  {
    slug: 'rework',
    title: 'ReWork: Change the Way You Work Forever',
    author: 'Jason Fried & David Heinemeier Hansson',
    year: 2010,
    genre: 'Business',
    coverEmoji: '🔨',
    en: {
      description: 'The founders of Basecamp challenge every conventional assumption about running a business — rejecting meetings, long hours, business plans, and growth for growth\'s sake in favor of calm, sustainable work.',
      teaserPoints: [
        'Ignore the real world: people always say "that won\'t work here" — the real world isn\'t a place, it\'s an excuse',
        'Meetings are toxic: they\'re usually about talking rather than deciding, and they steal time from everyone',
        'Scratch your own itch: the best businesses solve problems their founders personally face every day',
      ],
    },
    sv: {
      description: 'Grundarna av Basecamp utmanar varje konventionellt antagande om att driva ett företag — och förkastar möten, långa timmar, affärsplaner och tillväxt för tillväxtens skull till förmån för lugnt, hållbart arbete.',
      teaserPoints: [
        'Ignorera den verkliga världen: folk säger alltid "det fungerar inte här" — den verkliga världen är inte en plats, det är en ursäkt',
        'Möten är giftiga: de handlar vanligtvis om att prata snarare än att besluta, och de stjäl tid från alla',
        'Klia din egen klåda: de bästa företagen löser problem som deras grundare personligen möter varje dag',
      ],
    },
  },
  {
    slug: 'the-almanack-of-naval-ravikant',
    title: 'The Almanack of Naval Ravikant',
    author: 'Eric Jorgenson',
    year: 2020,
    genre: 'Business',
    coverEmoji: '⚓',
    en: {
      description: 'A curated collection of Naval Ravikant\'s wisdom on wealth and happiness — distilling the AngelList founder\'s most profound insights on building leverage, achieving freedom, and living well.',
      teaserPoints: [
        'Seek wealth, not money: create businesses and assets that earn while you sleep through scalable leverage',
        'Specific knowledge: find the intersection of your unique skills and the market — it can\'t be trained or outsourced',
        'Happiness is a choice and a skill: you can learn to default to happiness as your baseline state',
      ],
    },
    sv: {
      description: 'En kurerad samling av Naval Ravikants visdom om rikedom och lycka — destillerar AngelList-grundarens mest djupgående insikter om att bygga hävstång, uppnå frihet och leva väl.',
      teaserPoints: [
        'Sök rikedom, inte pengar: skapa företag och tillgångar som tjänar medan du sover genom skalbar hävstång',
        'Specifik kunskap: hitta skärningspunkten mellan dina unika färdigheter och marknaden — den kan inte tränas eller outsourcas',
        'Lycka är ett val och en färdighet: du kan lära dig att ha lycka som ditt grundläggande tillstånd',
      ],
    },
  },
  {
    slug: 'built-to-last',
    title: 'Built to Last: Successful Habits of Visionary Companies',
    author: 'Jim Collins & Jerry Porras',
    year: 1994,
    genre: 'Business',
    coverEmoji: '🏛️',
    en: {
      description: 'Collins and Porras studied 18 extraordinary long-lasting companies to identify what set them apart — revealing that truly great companies are built on core ideology and relentless self-improvement, not charismatic leaders or great products.',
      teaserPoints: [
        'Preserve the core, stimulate progress: the best companies never compromise their values but constantly evolve their methods',
        'The BHAG — Big Hairy Audacious Goal — drives companies to achieve what seems impossible',
        'Built to last companies are clock-builders, not time-tellers: they build organizations that outlive any single leader',
      ],
    },
    sv: {
      description: 'Collins och Porras studerade 18 extraordinärt långlivade företag för att identifiera vad som skiljde dem åt — och avslöjar att verkligt stora företag byggs på kärn­ideologi och obeveklig självförbättring.',
      teaserPoints: [
        'Bevara kärnan, stimulera framsteg: de bästa företagen kompromissar aldrig med sina värderingar men förändrar ständigt sina metoder',
        'BHAG — Big Hairy Audacious Goal — driver företag att uppnå det som verkar omöjligt',
        'Byggda för att bestå-företag bygger klockor, inte visar tid: de bygger organisationer som överlever varje enskild ledare',
      ],
    },
  },
  {
    slug: 'good-strategy-bad-strategy',
    title: 'Good Strategy Bad Strategy',
    author: 'Richard Rumelt',
    year: 2011,
    genre: 'Business',
    coverEmoji: '♟️',
    en: {
      description: 'Richard Rumelt reveals that most "strategy" is actually just wishful thinking — and shows what genuine strategy looks like: a coherent set of actions that address the kernel of challenge with focused resources.',
      teaserPoints: [
        'Bad strategy is not the absence of strategy — it is fluff, failure to face hard choices, and mistaking goals for plans',
        'The kernel of good strategy: diagnosis, guiding policy, and coherent actions aligned around a specific challenge',
        'Leverage comes from identifying the pivotal factor — the constraint whose removal unlocks disproportionate results',
      ],
    },
    sv: {
      description: 'Richard Rumelt avslöjar att det mesta av "strategi" egentligen bara är önsketänkande — och visar hur genuin strategi ser ut: en sammanhängande uppsättning åtgärder som adresserar kärnans utmaning med fokuserade resurser.',
      teaserPoints: [
        'Dålig strategi är inte frånvaron av strategi — det är flum, misslyckande att möta svåra val och att förväxla mål med planer',
        'Kärnan i god strategi: diagnos, vägledande policy och sammanhängande åtgärder kring en specifik utmaning',
        'Hävstång kommer från att identifiera den avgörande faktorn — den begränsning vars borttagande frigör oproportionerliga resultat',
      ],
    },
  },
  {
    slug: 'the-ride-of-a-lifetime',
    title: 'The Ride of a Lifetime',
    author: 'Bob Iger',
    year: 2019,
    genre: 'Business',
    coverEmoji: '🎢',
    en: {
      description: 'Disney\'s CEO Bob Iger shares the leadership principles behind transforming Disney into the world\'s greatest entertainment company — including the acquisitions of Pixar, Marvel, and Lucasfilm.',
      teaserPoints: [
        'Optimism as a leadership requirement: a pessimistic leader drains the energy from every room they enter',
        'Being direct is a kindness: vague feedback helps no one — clarity with compassion is a gift',
        'The willingness to take big, calculated bets — Pixar, Marvel, Star Wars — transforms good companies into great ones',
      ],
    },
    sv: {
      description: 'Disneys VD Bob Iger delar ledarskaps­principerna bakom att förvandla Disney till världens största underhållningsföretag — inklusive förvärven av Pixar, Marvel och Lucasfilm.',
      teaserPoints: [
        'Optimism som ledarskapskrav: en pessimistisk ledare tömmer energin ur varje rum de befinner sig i',
        'Att vara direkt är en vänlighet: otydlig feedback hjälper ingen — klarhet med medkänsla är en gåva',
        'Viljan att ta stora, beräknade satsningar — Pixar, Marvel, Star Wars — förvandlar bra företag till stora',
      ],
    },
  },
  {
    slug: 'build',
    title: 'Build: An Unorthodox Guide to Making Things Worth Making',
    author: 'Tony Fadell',
    year: 2022,
    genre: 'Business',
    coverEmoji: '🔧',
    en: {
      description: 'The creator of the iPod and founder of Nest, Tony Fadell shares everything he wishes he\'d known about building world-changing products and companies — from first job to CEO.',
      teaserPoints: [
        'Be a mission-driven missionary, not a mercenary — the best products come from people who genuinely care',
        'Prototype the critical path: build the riskiest, hardest part first to discover what you don\'t know you don\'t know',
        'The adulthood of a startup: scaling means building processes that work without you — that\'s the hardest transition',
      ],
    },
    sv: {
      description: 'Skaparen av iPod och grundaren av Nest, Tony Fadell, delar allt han önskar att han hade vetat om att bygga världsförändrande produkter och företag — från första jobbet till VD.',
      teaserPoints: [
        'Var en uppdragsdriven missionär, inte en legosoldat — de bästa produkterna kommer från människor som verkligen bryr sig',
        'Prototesta den kritiska vägen: bygg den riskablaste, svåraste delen först för att upptäcka vad du inte vet att du inte vet',
        'En startups vuxenblivande: att skala innebär att bygga processer som fungerar utan dig — det är den svåraste övergången',
      ],
    },
  },
  {
    slug: 'creativity-inc',
    title: 'Creativity, Inc.',
    author: 'Ed Catmull',
    year: 2014,
    genre: 'Business',
    coverEmoji: '🎬',
    en: {
      description: 'Pixar co-founder Ed Catmull reveals the management philosophy behind the world\'s most creatively successful studio — and how to build organizations where creativity can truly flourish.',
      teaserPoints: [
        'The Braintrust: a safe space for radical candor about creative work, with no authority to mandate changes',
        'Protect the new: early ideas are fragile — shield them from judgment until they develop enough to defend themselves',
        'Fear and failure: the best creative cultures reward bold attempts and treat failure as information, not shame',
      ],
    },
    sv: {
      description: 'Pixar-medgrundaren Ed Catmull avslöjar lednings­filosofin bakom världens mest kreativt framgångsrika studio — och hur man bygger organisationer där kreativitet verkligen kan blomstra.',
      teaserPoints: [
        'Braintrusten: ett tryggt utrymme för radikal ärlighet om kreativt arbete, utan befogenhet att mandat­era förändringar',
        'Skydda det nya: tidiga idéer är sköra — skärma dem från bedömning tills de utvecklats tillräckligt för att försvara sig',
        'Rädsla och misslyckande: de bästa kreativa kulturerna belönar djärva försök och behandlar misslyckande som information',
      ],
    },
  },
  {
    slug: 'hooked',
    title: 'Hooked: How to Build Habit-Forming Products',
    author: 'Nir Eyal',
    year: 2014,
    genre: 'Business',
    coverEmoji: '📱',
    en: {
      description: 'Nir Eyal presents the Hook Model — trigger, action, variable reward, investment — the four-step process that the most addictive products use to wire user behavior into automatic habits.',
      teaserPoints: [
        'The Hook Model: external trigger → action → variable reward → investment → repeat',
        'Variable rewards are more powerful than predictable ones — unpredictability drives compulsive engagement',
        'The investment phase loads the next trigger: every tweet, like, or upload makes users more likely to return',
      ],
    },
    sv: {
      description: 'Nir Eyal presenterar Hook-modellen — trigger, handling, variabel belöning, investering — den fyra­stegsprocess som de mest beroendeframkallande produkterna använder för att koppla användarbeteende till automatiska vanor.',
      teaserPoints: [
        'Hook-modellen: extern trigger → handling → variabel belöning → investering → upprepa',
        'Variabla belöningar är kraftfullare än förutsägbara — oförutsägbarhet driver tvångsmässigt engagemang',
        'Investeringsfasen laddar nästa trigger: varje tweet, gilla-markering eller uppladdning gör användare mer benägna att återvända',
      ],
    },
  },
  {
    slug: 'sprint',
    title: 'Sprint: How to Solve Big Problems and Test New Ideas in Just Five Days',
    author: 'Jake Knapp',
    year: 2016,
    genre: 'Business',
    coverEmoji: '⚡',
    en: {
      description: 'Google Ventures designer Jake Knapp presents the five-day design sprint — a battle-tested method for rapidly prototyping and testing ideas with real users before committing resources to build them.',
      teaserPoints: [
        'Five days, one solution: map the problem Monday, sketch solutions Tuesday, decide Wednesday, prototype Thursday, test Friday',
        'Testing with five users reveals most critical problems — more users give diminishing returns on insight',
        'The sprint forces commitment: getting the right people in a room together for five days creates alignment that months of meetings cannot',
      ],
    },
    sv: {
      description: 'Google Ventures-designer Jake Knapp presenterar den femdagars design-sprint — en stridstestad metod för att snabbt prototypa och testa idéer med riktiga användare innan du åtar dig resurser.',
      teaserPoints: [
        'Fem dagar, en lösning: kartlägg problemet måndag, skissa lösningar tisdag, besluta onsdag, prototyp torsdag, testa fredag',
        'Testning med fem användare avslöjar de flesta kritiska problemen — fler användare ger avtagande insikter',
        'Sprinten tvingar fram åtagande: att ha rätt personer i ett rum i fem dagar skapar anpassning som månader av möten inte kan',
      ],
    },
  },
  {
    slug: 'competing-against-luck',
    title: 'Competing Against Luck',
    author: 'Clayton Christensen',
    year: 2016,
    genre: 'Business',
    coverEmoji: '🎲',
    en: {
      description: 'Clayton Christensen presents Jobs to Be Done theory — the insight that customers don\'t buy products, they hire them to do a job in their lives. This reframes innovation around human progress, not demographics.',
      teaserPoints: [
        'Jobs to Be Done: customers hire products to make progress in specific circumstances — understand the job, win the market',
        'The functional, emotional, and social dimensions of every job — solutions must address all three to truly satisfy',
        'Nonconsumption is your biggest competitor: people often settle for incomplete solutions or do nothing at all',
      ],
    },
    sv: {
      description: 'Clayton Christensen presenterar Jobs to Be Done-teorin — insikten om att kunder inte köper produkter, de anställer dem för att utföra ett jobb i sina liv. Detta omramar innovation kring mänskliga framsteg.',
      teaserPoints: [
        'Jobs to Be Done: kunder anställer produkter för att göra framsteg i specifika omständigheter — förstå jobbet, vinn marknaden',
        'De funktionella, emotionella och sociala dimensionerna av varje jobb — lösningar måste adressera alla tre för att verkligen tillfredsställa',
        'Icke-konsumtion är din största konkurrent: folk nöjer sig ofta med ofullständiga lösningar eller gör ingenting alls',
      ],
    },
  },
  {
    slug: 'the-score-takes-care-of-itself',
    title: 'The Score Takes Care of Itself',
    author: 'Bill Walsh',
    year: 2009,
    genre: 'Leadership',
    coverEmoji: '🏈',
    en: {
      description: 'NFL coaching legend Bill Walsh reveals the Standard of Performance he instilled at the San Francisco 49ers — the idea that if you focus obsessively on doing the small things right, winning takes care of itself.',
      teaserPoints: [
        'The Standard of Performance: define precisely how you want your organization to behave — not just what to achieve',
        'Losing is not failure — failing to prepare, work hard, and maintain standards is the only real failure',
        'Leaders must teach: spending time on the details of others\' development is not a distraction from leadership — it is leadership',
      ],
    },
    sv: {
      description: 'NFL-träningslegenden Bill Walsh avslöjar Standard of Performance som han ingjöt i San Francisco 49ers — idén om att om du fokuserar besatt på att göra de små sakerna rätt, tar vinnandet hand om sig självt.',
      teaserPoints: [
        'Standard of Performance: definiera exakt hur du vill att din organisation ska bete sig — inte bara vad som ska uppnås',
        'Att förlora är inte ett misslyckande — att misslyckas med att förbereda, arbeta hårt och upprätthålla standarder är det enda verkliga misslyckandet',
        'Ledare måste undervisa: att spendera tid på detaljerna i andras utveckling är inte en distraktion från ledarskap — det är ledarskap',
      ],
    },
  },
  {
    slug: 'blitzscaling',
    title: 'Blitzscaling: The Lightning-Fast Path to Building Massively Valuable Businesses',
    author: 'Reid Hoffman & Chris Yeh',
    year: 2018,
    genre: 'Business',
    coverEmoji: '⚡',
    en: {
      description: 'LinkedIn co-founder Reid Hoffman argues that in winner-take-all markets, speed of growth matters more than efficiency — and presents the playbook for scaling businesses faster than competitors can respond.',
      teaserPoints: [
        'Blitzscaling is prioritizing speed over efficiency even when facing uncertainty — accepting chaos to reach scale first',
        'The five stages of blitzscaling: from family to tribe, village, city, nation — each requires completely different management',
        'Network effects and market size determine whether blitzscaling is the right strategy — not every market rewards it',
      ],
    },
    sv: {
      description: 'LinkedIn-medgrundaren Reid Hoffman argumenterar för att i marknaderna som tar allt spelar tillväxthastigheten större roll än effektivitet — och presenterar spelboken för att skala företag snabbare än konkurrenterna kan svara.',
      teaserPoints: [
        'Blitzscaling prioriterar hastighet framför effektivitet även inför osäkerhet — acceptera kaos för att nå skala först',
        'De fem stadierna av blitzscaling: från familj till stam, by, stad, nation — var och en kräver helt annat ledarskap',
        'Nätverkseffekter och marknadsstorlek avgör om blitzscaling är rätt strategi — inte varje marknad belönar det',
      ],
    },
  },
  {
    slug: 'delivering-happiness',
    title: 'Delivering Happiness',
    author: 'Tony Hsieh',
    year: 2010,
    genre: 'Business',
    coverEmoji: '👟',
    en: {
      description: 'Zappos CEO Tony Hsieh tells the story of building a billion-dollar shoe company on a foundation of company culture and customer service — arguing that happiness for employees and customers is the ultimate business strategy.',
      teaserPoints: [
        'Core values as a hiring and firing filter: if someone doesn\'t embody the values, they don\'t belong — regardless of skills',
        'WOW customer service: go above and beyond so consistently that customers tell the story for you',
        'Company culture is your brand: what customers experience is the direct output of how your team feels every day',
      ],
    },
    sv: {
      description: 'Zappos VD Tony Hsieh berättar historien om att bygga ett miljardkroners skoföretag på en grund av företagskultur och kundservice — och argumenterar för att lycka för anställda och kunder är den ultimata affärsstrategin.',
      teaserPoints: [
        'Kärnvärden som filter för anställning och avsked: om någon inte förkroppsligar värdena hör de inte hemma — oavsett färdigheter',
        'WOW-kundservice: gå utöver förväntningarna så konsekvent att kunder berättar historien för dig',
        'Företagskulturen är ditt varumärke: vad kunder upplever är det direkta resultatet av hur ditt team mår varje dag',
      ],
    },
  },
  // ── Leadership / Management ───────────────────────────────────────────────
  {
    slug: 'leaders-eat-last',
    title: 'Leaders Eat Last',
    author: 'Simon Sinek',
    year: 2014,
    genre: 'Leadership',
    coverEmoji: '🤲',
    en: {
      description: 'Simon Sinek examines why some teams thrive while others fail — and finds that the best leaders sacrifice their own comfort for the well-being of those in their care, creating a circle of safety that unleashes collaboration.',
      teaserPoints: [
        'The circle of safety: when people feel safe inside the group, they stop fighting each other and face external threats together',
        'The chemicals of leadership: dopamine (achievement), serotonin (status), oxytocin (trust), and endorphins drive team behavior',
        'Abstraction kills empathy: the larger an organization grows, the harder it becomes for leaders to connect with impact',
      ],
    },
    sv: {
      description: 'Simon Sinek undersöker varför vissa team blomstrar medan andra misslyckas — och finner att de bästa ledarna offrar sin egen komfort för välbefinnandet hos dem de tar hand om, och skapar en trygghetscirkel.',
      teaserPoints: [
        'Trygghetscirkeln: när folk känner sig trygga inom gruppen slutar de kämpa mot varandra och möter externa hot tillsammans',
        'Ledarskaps­kemikalierna: dopamin (prestation), serotonin (status), oxytocin (förtroende) och endorfiner styr teambeteende',
        'Abstraktion dödar empati: ju större en organisation växer, desto svårare blir det för ledare att koppla samman med konsekvenser',
      ],
    },
  },
  {
    slug: 'the-culture-code',
    title: 'The Culture Code: The Secrets of Highly Successful Groups',
    author: 'Daniel Coyle',
    year: 2018,
    genre: 'Leadership',
    coverEmoji: '🏆',
    en: {
      description: 'Daniel Coyle investigates the world\'s most successful teams — from Navy SEALs to Pixar to the San Antonio Spurs — and identifies the three skills that create belonging, share vulnerability, and establish purpose.',
      teaserPoints: [
        'Safety signals: great cultures send constant small cues that say "you belong here and your contribution matters"',
        'Sharing vulnerability creates trust: leaders who admit mistakes and ask for help unlock honest collaboration',
        'Purpose-driven cultures over-communicate their stories and values — repetition is not redundancy, it\'s culture',
      ],
    },
    sv: {
      description: 'Daniel Coyle undersöker världens mest framgångsrika team — från Navy SEALs till Pixar till San Antonio Spurs — och identifierar de tre färdigheter som skapar tillhörighet, delar sårbarhet och etablerar syfte.',
      teaserPoints: [
        'Trygghetssignaler: stora kulturer sänder ständiga små ledtrådar som säger "du hör hemma här och ditt bidrag spelar roll"',
        'Att dela sårbarhet skapar förtroende: ledare som erkänner misstag och ber om hjälp frigör ärligt samarbete',
        'Syftesdrivna kulturer överkommunicerar sina berättelser och värderingar — upprepning är inte redundans, det är kultur',
      ],
    },
  },
  {
    slug: 'dare-to-lead',
    title: 'Dare to Lead: Brave Work. Tough Conversations. Whole Hearts.',
    author: 'Brené Brown',
    year: 2018,
    genre: 'Leadership',
    coverEmoji: '🦁',
    en: {
      description: 'Research professor Brené Brown translates her vulnerability and courage research into actionable leadership skills — showing that true leadership requires daring greatly, having hard conversations, and staying curious.',
      teaserPoints: [
        'Daring leadership: clarity is kindness — vague feedback and avoiding hard conversations are acts of unkindness',
        'Armored leadership vs. daring leadership: protecting yourself with cynicism and distance disconnects you from your team',
        'Values-based leadership: identify your two core values, then use them as anchors in every difficult decision',
      ],
    },
    sv: {
      description: 'Forskningsprofessorn Brené Brown översätter sin forskning om sårbarhet och mod till handlingsbara ledarskaps­färdigheter — och visar att sant ledarskap kräver att man vågar, har svåra samtal och förblir nyfiken.',
      teaserPoints: [
        'Modigt ledarskap: klarhet är vänlighet — vag feedback och att undvika svåra samtal är ovänskapliga handlingar',
        'Pansrat vs. modigt ledarskap: att skydda sig med cynism och distans kopplar bort dig från ditt team',
        'Värdebaserat ledarskap: identifiera dina två kärnvärden och använd dem som ankare i varje svårt beslut',
      ],
    },
  },
  {
    slug: 'the-five-dysfunctions-of-a-team',
    title: 'The Five Dysfunctions of a Team',
    author: 'Patrick Lencioni',
    year: 2002,
    genre: 'Leadership',
    coverEmoji: '🧩',
    en: {
      description: 'Patrick Lencioni reveals why most teams fail through a compelling fable — and identifies the five dysfunctions that undermine teamwork: absence of trust, fear of conflict, lack of commitment, avoidance of accountability, and inattention to results.',
      teaserPoints: [
        'Trust is the foundation: without vulnerability-based trust, teams can\'t engage in productive conflict or true commitment',
        'Healthy conflict is not hostility — it is passionate debate about ideas that leads to better decisions',
        'Accountability to peers, not just leaders, is what separates high-performing teams from mediocre ones',
      ],
    },
    sv: {
      description: 'Patrick Lencioni avslöjar varför de flesta team misslyckas genom en övertygande fabel — och identifierar de fem dysfunktionerna som undergräver teamarbete: avsaknad av förtroende, konfliktskräck, brist på åtagande, ansvarsskyldighets­undvikande och ignorering av resultat.',
      teaserPoints: [
        'Förtroende är grunden: utan sårbarhetbaserat förtroende kan team inte engagera sig i produktiv konflikt eller sant åtagande',
        'Hälsosam konflikt är inte fientlighet — det är passionerad debatt om idéer som leder till bättre beslut',
        'Ansvarsskyldighet mot kollegor, inte bara ledare, är vad som skiljer högpresterande team från medelmåttiga',
      ],
    },
  },
  {
    slug: 'radical-candor',
    title: 'Radical Candor: Be a Kick-Ass Boss Without Losing Your Humanity',
    author: 'Kim Scott',
    year: 2017,
    genre: 'Leadership',
    coverEmoji: '💬',
    en: {
      description: 'Former Google and Apple executive Kim Scott presents Radical Candor — the management philosophy of caring personally while challenging directly — and shows why it produces better results than either ruinous empathy or obnoxious aggression.',
      teaserPoints: [
        'Care personally + challenge directly = Radical Candor: the sweet spot that drives growth and trust simultaneously',
        'Ruinous empathy is the most common management failure: not telling the truth because you don\'t want to upset someone',
        'Praise should be specific and public; criticism should be specific and private — both in service of growth',
      ],
    },
    sv: {
      description: 'Före detta Google- och Apple-chefen Kim Scott presenterar Radikal ärlighet — lednings­filosofin att bry sig personligt medan man utmanar direkt — och visar varför det ger bättre resultat än destruktiv empati.',
      teaserPoints: [
        'Bry dig personligt + utmana direkt = Radikal ärlighet: den söta punkten som driver tillväxt och förtroende simultant',
        'Destruktiv empati är det vanligaste ledningsfel: att inte berätta sanningen för att man inte vill störa någon',
        'Beröm bör vara specifikt och offentligt; kritik bör vara specifik och privat — båda i tillväxtens tjänst',
      ],
    },
  },
  {
    slug: 'turn-the-ship-around',
    title: 'Turn the Ship Around!',
    author: 'L. David Marquet',
    year: 2013,
    genre: 'Leadership',
    coverEmoji: '⚓',
    en: {
      description: 'Former US Navy submarine commander David Marquet tells the story of transforming the worst-rated submarine in the fleet into the best — by giving control to the crew rather than taking it as the leader.',
      teaserPoints: [
        'Leader-leader vs. leader-follower: giving control to others builds engagement, capability, and resilience',
        'Intent-based language: "I intend to..." replaces "request permission to..." — shifting ownership to the person doing the work',
        'Eliminate posture: get rid of behaviors that signal you\'re more interested in looking good than doing good work',
      ],
    },
    sv: {
      description: 'Före detta USA:s marinubåts­befälhavare David Marquet berättar historien om att förvandla flottans sämst rankade ubåt till den bästa — genom att ge kontrollen till besättningen snarare än att ta den som ledare.',
      teaserPoints: [
        'Ledare-ledare vs. ledare-följare: att ge kontroll till andra bygger engagemang, kapacitet och motståndskraft',
        'Intentionsbaserat språk: "Jag tänker..." ersätter "begär tillstånd att..." — skiftar ägarskap till den som utför arbetet',
        'Eliminera fasader: bli av med beteenden som signalerar att du är mer intresserad av att se bra ut än att göra bra arbete',
      ],
    },
  },
  {
    slug: 'trillion-dollar-coach',
    title: 'Trillion Dollar Coach',
    author: 'Eric Schmidt, Jonathan Rosenberg & Alan Eagle',
    year: 2019,
    genre: 'Leadership',
    coverEmoji: '🏅',
    en: {
      description: 'The leadership lessons of Bill Campbell, the Silicon Valley coach who mentored Steve Jobs, Larry Page, and Eric Schmidt — revealing how he helped build over a trillion dollars of market value through unconventional coaching.',
      teaserPoints: [
        'People are the foundation of everything: invest in your team\'s success before any strategic initiative',
        'The team first principle: Campbell focused on team dynamics before solving any business problem',
        'Courage is the most important quality in a leader: be willing to say the hard thing, make the unpopular call, act with conviction',
      ],
    },
    sv: {
      description: 'Ledarskapslektionerna av Bill Campbell, Silicon Valleys coach som mentorerade Steve Jobs, Larry Page och Eric Schmidt — avslöjar hur han hjälpte till att bygga över ett billion dollar i marknadsvärde.',
      teaserPoints: [
        'Människor är grunden för allt: investera i ditt teams framgång före varje strategiskt initiativ',
        'Team-först-principen: Campbell fokuserade på teamdynamik innan han löste något affärsproblem',
        'Mod är den viktigaste egenskapen hos en ledare: var villig att säga det svåra, fatta det impopulära beslutet, agera med övertygelse',
      ],
    },
  },
  {
    slug: 'the-effective-executive',
    title: 'The Effective Executive',
    author: 'Peter Drucker',
    year: 1967,
    genre: 'Leadership',
    coverEmoji: '📋',
    en: {
      description: 'Management pioneer Peter Drucker defines effectiveness as a discipline that can be learned — and presents five practices that separate the effective executive from the merely busy one.',
      teaserPoints: [
        'Know where your time goes: track it first, manage it second — time is the scarcest resource',
        'Focus on contribution: ask "What can I contribute that will significantly affect the performance of my organization?"',
        'Strengthen strengths: make your organization\'s top performers even stronger rather than fixing weaknesses',
      ],
    },
    sv: {
      description: 'Ledningspionjären Peter Drucker definierar effektivitet som en disciplin som kan läras — och presenterar fem praktiker som skiljer den effektive chefen från den bara sysselsatte.',
      teaserPoints: [
        'Vet var din tid tar vägen: spåra den först, hantera den sedan — tid är den knappaste resursen',
        'Fokusera på bidrag: fråga "Vad kan jag bidra med som väsentligt påverkar min organisations prestation?"',
        'Stärk styrkor: gör din organisations topprestare ännu starkare snarare än att fixa svagheter',
      ],
    },
  },
  // ── Psychology / Behavior ─────────────────────────────────────────────────
  {
    slug: 'pre-suasion',
    title: 'Pre-Suasion: A Revolutionary Way to Influence and Persuade',
    author: 'Robert Cialdini',
    year: 2016,
    genre: 'Psychology',
    coverEmoji: '🎭',
    en: {
      description: 'Robert Cialdini reveals the art of pre-suasion — the practice of creating the right state of mind in your audience before delivering your message so that they are most receptive to it.',
      teaserPoints: [
        'The privileged moment: capturing attention first determines what information people engage with most deeply',
        'Unity — shared identity — is the seventh principle of influence: we say yes to those we see as "us"',
        'Environmental priming: subtle cues in your environment shape behavior without conscious awareness',
      ],
    },
    sv: {
      description: 'Robert Cialdini avslöjar konsten att för-övertala — praktiken att skapa rätt sinnestillstånd hos din publik innan du levererar ditt budskap så att de är mest mottagliga för det.',
      teaserPoints: [
        'Det privilegierade ögonblicket: att fånga uppmärksamheten först avgör vilken information folk engagerar sig djupast i',
        'Enhet — delad identitet — är den sjunde påverkansprincipen: vi säger ja till dem vi ser som "vi"',
        'Miljöpriming: subtila ledtrådar i din omgivning formar beteende utan medveten medvetenhet',
      ],
    },
  },
  {
    slug: 'emotional-intelligence',
    title: 'Emotional Intelligence: Why It Can Matter More Than IQ',
    author: 'Daniel Goleman',
    year: 1995,
    genre: 'Psychology',
    coverEmoji: '❤️',
    en: {
      description: 'Daniel Goleman argues that emotional intelligence — the ability to identify, understand, and manage emotions — is a better predictor of success than IQ, and that it can be developed at any age.',
      teaserPoints: [
        'The five domains of EQ: self-awareness, self-regulation, motivation, empathy, and social skills',
        'Neural hijacking: the amygdala can override rational thinking — understanding this is the key to emotional mastery',
        'EQ is more malleable than IQ: with practice and intention, emotional competence can be substantially improved',
      ],
    },
    sv: {
      description: 'Daniel Goleman argumenterar för att emotionell intelligens — förmågan att identifiera, förstå och hantera känslor — är en bättre prediktor för framgång än IQ, och att den kan utvecklas i alla åldrar.',
      teaserPoints: [
        'De fem domänerna av EQ: självmedvetenhet, självreglering, motivation, empati och sociala färdigheter',
        'Neural kapning: amygdalan kan åsidosätta rationellt tänkande — att förstå detta är nyckeln till emotionellt mästerskap',
        'EQ är mer formbar än IQ: med övning och avsikt kan emotionell kompetens förbättras avsevärt',
      ],
    },
  },
  {
    slug: 'predictably-irrational',
    title: 'Predictably Irrational',
    author: 'Dan Ariely',
    year: 2008,
    genre: 'Psychology',
    coverEmoji: '🎡',
    en: {
      description: 'Behavioral economist Dan Ariely reveals that human irrationality is not random — it is systematic and predictable. Understanding these patterns gives you power over your own decisions and those of others.',
      teaserPoints: [
        'The power of FREE: zero cost is not just a discount, it triggers a completely different decision framework',
        'Anchoring shapes every price negotiation: the first number heard becomes the reference point for all that follows',
        'The Ikea effect: we overvalue things we help create — even when the result is objectively worse',
      ],
    },
    sv: {
      description: 'Beteendeekonomen Dan Ariely avslöjar att mänsklig irrationalitet inte är slumpmässig — den är systematisk och förutsägbar. Att förstå dessa mönster ger dig makt över dina egna beslut och andras.',
      teaserPoints: [
        'Kraften av GRATIS: noll kostnad är inte bara en rabatt, det utlöser ett helt annat besluts­ramverk',
        'Ankring formar varje prisförhandling: det första hörda numret blir referenspunkten för allt som följer',
        'Ikea-effekten: vi överskattar saker vi hjälpt till att skapa — även när resultatet är objektivt sämre',
      ],
    },
  },
  {
    slug: 'nudge',
    title: 'Nudge: Improving Decisions About Health, Wealth, and Happiness',
    author: 'Richard Thaler & Cass Sunstein',
    year: 2008,
    genre: 'Psychology',
    coverEmoji: '👉',
    en: {
      description: 'Nobel laureate Richard Thaler and Cass Sunstein argue that small, low-cost changes to how choices are presented — nudges — can dramatically improve the decisions people make about health, finance, and the environment.',
      teaserPoints: [
        'Choice architecture: how options are structured has a profound effect on which ones people choose',
        'Defaults are decisions: making saving automatic vs. opt-in produces dramatically different retirement outcomes',
        'Libertarian paternalism: nudges preserve free choice while steering people toward better outcomes for themselves',
      ],
    },
    sv: {
      description: 'Nobelpristagaren Richard Thaler och Cass Sunstein argumenterar för att små, billiga förändringar i hur val presenteras — knuffar — dramatiskt kan förbättra de beslut människor fattar om hälsa, ekonomi och miljö.',
      teaserPoints: [
        'Valsarkitektur: hur alternativ struktureras har en djupgående effekt på vilka folk väljer',
        'Standardval är beslut: att göra sparande automatiskt vs. opt-in ger dramatiskt olika pensionsresultat',
        'Libertariansk paternalism: knuffar bevarar fritt val medan de styr folk mot bättre resultat för dem själva',
      ],
    },
  },
  {
    slug: 'stumbling-on-happiness',
    title: 'Stumbling on Happiness',
    author: 'Daniel Gilbert',
    year: 2006,
    genre: 'Psychology',
    coverEmoji: '🍀',
    en: {
      description: 'Harvard psychologist Daniel Gilbert reveals that humans are consistently wrong about what will make them happy — and that our brain\'s simulation of future emotional states is riddled with predictable errors.',
      teaserPoints: [
        'Impact bias: we consistently overestimate how good or bad future events will make us feel and for how long',
        'Synthetic happiness: we are surprisingly good at being satisfied with what we have — but only when we can\'t change it',
        'The replication problem: "surrogates" who already have what you want are the most accurate happiness predictors',
      ],
    },
    sv: {
      description: 'Harvard-psykologen Daniel Gilbert avslöjar att människor konsekvent har fel om vad som kommer att göra dem lyckliga — och att hjärnans simulering av framtida emotionella tillstånd är full av förutsägbara fel.',
      teaserPoints: [
        'Effektbias: vi överskattar konsekvent hur bra eller dåligt framtida händelser kommer att få oss att känna oss och hur länge',
        'Syntetisk lycka: vi är förvånansvärt bra på att vara nöjda med vad vi har — men bara när vi inte kan ändra det',
        'Surrogatproblemet: "surrogat" som redan har det du vill ha är de mest exakta lycko­förutsägarna',
      ],
    },
  },
  {
    slug: 'switch',
    title: 'Switch: How to Change Things When Change Is Hard',
    author: 'Chip Heath & Dan Heath',
    year: 2010,
    genre: 'Psychology',
    coverEmoji: '🔀',
    en: {
      description: 'The Heath brothers present a framework for change using the Rider (rational mind), the Elephant (emotional mind), and the Path (environment) — arguing that successful change requires directing all three simultaneously.',
      teaserPoints: [
        'Direct the Rider: give clear, concrete direction — vague goals create analysis paralysis',
        'Motivate the Elephant: appeal to emotion first — people need to feel the change before they commit to it',
        'Shape the Path: change the environment and behavior follows — situation beats willpower every time',
      ],
    },
    sv: {
      description: 'Heath-bröderna presenterar ett förändrings­ramverk med Ryttaren (rationellt sinne), Elefanten (emotionellt sinne) och Vägen (miljö) — och argumenterar för att framgångsrik förändring kräver att alla tre riktas simultant.',
      teaserPoints: [
        'Rikta Ryttaren: ge tydlig, konkret riktning — vaga mål skapar analysförlamning',
        'Motivera Elefanten: appellera till känslan först — folk behöver känna förändringen innan de åtar sig den',
        'Forma Vägen: förändra miljön och beteendet följer — situation slår viljestyrka varje gång',
      ],
    },
  },
  {
    slug: 'made-to-stick',
    title: 'Made to Stick: Why Some Ideas Survive and Others Die',
    author: 'Chip Heath & Dan Heath',
    year: 2007,
    genre: 'Communication',
    coverEmoji: '🪝',
    en: {
      description: 'The Heath brothers decode why some ideas spread virally while others are forgotten — and present the SUCCESs framework for making any idea stick: Simple, Unexpected, Concrete, Credible, Emotional, Story.',
      teaserPoints: [
        'The curse of knowledge: once you know something, it\'s nearly impossible to imagine not knowing it — the communicator\'s biggest enemy',
        'Unexpected ideas grab attention; concrete ideas are understood and remembered; emotional ideas motivate action',
        'Stories are the most powerful communication tool — they simulate experience and transfer understanding',
      ],
    },
    sv: {
      description: 'Heath-bröderna avkodar varför vissa idéer sprids viralt medan andra glöms — och presenterar SUCCESs-ramverket för att göra vilken idé som helst minnesvärdig: Enkel, Oväntad, Konkret, Trovärdig, Emotionell, Berättelse.',
      teaserPoints: [
        'Kunskapens förbannelse: när du väl vet något är det nästan omöjligt att föreställa sig att inte veta det — kommunikatörens största fiende',
        'Oväntade idéer fångar uppmärksamheten; konkreta idéer förstås och minns; emotionella idéer motiverar handling',
        'Berättelser är det kraftfullaste kommunikationsverktyget — de simulerar upplevelse och överför förståelse',
      ],
    },
  },
  {
    slug: 'the-courage-to-be-disliked',
    title: 'The Courage to Be Disliked',
    author: 'Ichiro Kishimi & Fumitake Koga',
    year: 2013,
    genre: 'Philosophy',
    coverEmoji: '🦋',
    en: {
      description: 'In a Socratic dialogue between a philosopher and a young man, this bestseller introduces Adlerian psychology — the radical idea that all problems are interpersonal, freedom comes from accepting dislike, and happiness is a choice.',
      teaserPoints: [
        'All problems are interpersonal: every psychological challenge we face is about our relationships with others',
        'Separation of tasks: you are only responsible for your own choices — other people\'s reactions are their task, not yours',
        'Living in the present: Adler\'s teleological view says the past does not determine the future — the now does',
      ],
    },
    sv: {
      description: 'I en sokratisk dialog mellan en filosof och en ung man introducerar denna bästsäljare Adlersk psykologi — den radikala idén om att alla problem är interpersonella, frihet kommer från att acceptera att bli ogillade.',
      teaserPoints: [
        'Alla problem är interpersonella: varje psykologisk utmaning vi möter handlar om våra relationer med andra',
        'Separation av uppgifter: du är bara ansvarig för dina egna val — andra människors reaktioner är deras uppgift, inte din',
        'Att leva i nuet: Adlers teleologiska syn säger att det förflutna inte bestämmer framtiden — nuet gör det',
      ],
    },
  },
  {
    slug: 'behave',
    title: 'Behave: The Biology of Humans at Our Best and Worst',
    author: 'Robert Sapolsky',
    year: 2017,
    genre: 'Science',
    coverEmoji: '🧬',
    en: {
      description: 'Stanford neurobiologist Robert Sapolsky examines the biology behind human behavior — from the neurons that fire a second before action to the evolution of culture — showing that human conduct is far more complex than simple free will.',
      teaserPoints: [
        'Behavior is the end of a chain: genetics, hormones, childhood environment, and culture all shape any single act',
        'The amygdala-prefrontal axis: emotion and reason are always in dialogue, and context determines which wins',
        'In-group vs. out-group biology: our tendency to divide "us" from "them" is ancient, automatic, and can be deliberately countered',
      ],
    },
    sv: {
      description: 'Stanford-neurobiologen Robert Sapolsky undersöker biologin bakom mänskligt beteende — från de neuroner som aktiveras en sekund innan handling till kulturens evolution — och visar att mänskligt beteende är långt mer komplext.',
      teaserPoints: [
        'Beteende är slutet av en kedja: genetik, hormoner, barndomsmiljö och kultur formar alla ett enda handlande',
        'Amygdala-prefrontal-axeln: emotion och förnuft är alltid i dialog, och kontexten avgör vad som vinner',
        'In-grupp vs. ut-grupp biologi: vår tendens att dela "vi" från "dem" är forntida, automatisk och kan medvetet motverkas',
      ],
    },
  },
  {
    slug: 'the-paradox-of-choice',
    title: 'The Paradox of Choice: Why More Is Less',
    author: 'Barry Schwartz',
    year: 2004,
    genre: 'Psychology',
    coverEmoji: '🤯',
    en: {
      description: 'Barry Schwartz challenges the assumption that more choice means more freedom and happiness — showing that an overabundance of options leads to anxiety, decision paralysis, and chronic dissatisfaction.',
      teaserPoints: [
        'Maximizers vs. satisficers: people who seek the best option suffer more than those who seek "good enough"',
        'Opportunity cost of choice: every option considered makes the chosen option feel worse by comparison',
        'Choice overload causes regret: when we have more options, we feel more personally responsible for bad outcomes',
      ],
    },
    sv: {
      description: 'Barry Schwartz utmanar antagandet att fler val betyder mer frihet och lycka — och visar att ett överskott av alternativ leder till ångest, besluts­förlamning och kronisk missnöje.',
      teaserPoints: [
        'Maximalister vs. tillräcklighetssökare: folk som söker det bästa alternativet lider mer än de som söker "gott nog"',
        'Alternativkostnaden av val: varje alternativ som beaktas gör det valda alternativet sämre i jämförelse',
        'Valsöverbelastning orsakar ånger: när vi har fler alternativ känner vi oss mer personligt ansvariga för dåliga resultat',
      ],
    },
  },
  // ── Finance / Investing ───────────────────────────────────────────────────
  {
    slug: 'the-intelligent-investor',
    title: 'The Intelligent Investor',
    author: 'Benjamin Graham',
    year: 1949,
    genre: 'Finance',
    coverEmoji: '📈',
    en: {
      description: 'The definitive guide to value investing, first published in 1949 — Warren Buffett calls it "the best book on investing ever written." Graham\'s principles of margin of safety and Mr. Market are timeless.',
      teaserPoints: [
        'Mr. Market: treat the stock market like a moody business partner whose irrational offers you can accept or ignore',
        'Margin of safety: only invest when the price is significantly below your calculated intrinsic value',
        'The difference between investment and speculation: investment requires thorough analysis and safety of principal',
      ],
    },
    sv: {
      description: 'Den definitiva guiden till värdeinvestering, publicerad 1949 — Warren Buffett kallar den "den bästa investeringsboken som någonsin skrivits." Grahams principer om säkerhetsmarginal och Herr Marknaden är tidlösa.',
      teaserPoints: [
        'Herr Marknaden: behandla aktiemarknaden som en humörfylld affärspartner vars irrationella erbjudanden du kan acceptera eller ignorera',
        'Säkerhetsmarginal: investera bara när priset är väsentligt under ditt beräknade inneboende värde',
        'Skillnaden mellan investering och spekulation: investering kräver grundlig analys och kapitalskydd',
      ],
    },
  },

  {
    slug: 'a-random-walk-down-wall-street',
    title: 'A Random Walk Down Wall Street',
    author: 'Burton G. Malkiel',
    year: 1973,
    genre: 'Finance',
    coverEmoji: '🎲',
    en: {
      description: 'The definitive investing guide arguing that stock prices are largely unpredictable and that low-cost index funds consistently beat active management over time.',
      teaserPoints: [
        'Markets are efficient — prices reflect all known information, making consistent market-beating nearly impossible',
        'Index funds outperform the vast majority of actively managed funds after fees over the long run',
        'A buy-and-hold strategy with diversified low-cost index funds is the winning approach for most investors',
      ],
    },
    sv: {
      description: 'Den definitiva investeringsguiden som hävdar att aktiekurser i stort sett är oförutsägbara och att lågkostnadsindexfonder konsekvent slår aktiv förvaltning.',
      teaserPoints: [
        'Marknader är effektiva — priser speglar all känd information, vilket gör det nästan omöjligt att konsekvent slå marknaden',
        'Indexfonder överträffar de flesta aktivt förvaltade fonder efter avgifter på lång sikt',
        'En köp-och-håll-strategi med diversifierade lågkostnadsindexfonder är det vinnande tillvägagångssättet',
      ],
    },
  },
  {
    slug: 'i-will-teach-you-to-be-rich',
    title: 'I Will Teach You to Be Rich',
    author: 'Ramit Sethi',
    year: 2009,
    genre: 'Finance',
    coverEmoji: '💰',
    en: {
      description: 'A no-nonsense personal finance system for young adults covering automating savings, optimizing credit cards, and investing consistently in index funds.',
      teaserPoints: [
        'Automate your finances so saving and investing happen without thinking — set up automatic transfers on payday',
        'Use credit cards strategically for rewards while always paying the full balance to avoid interest charges',
        'Focus on big wins like negotiating salary rather than skipping small luxuries — the math favors the big moves',
      ],
    },
    sv: {
      description: 'Ett rakt-på-sak personligt finanssystem för unga vuxna som täcker automatisering av sparande och konsekvent investering i indexfonder.',
      teaserPoints: [
        'Automatisera din ekonomi så att sparande sker utan att du behöver tänka på det — sätt upp automatiska överföringar på lönedagen',
        'Använd kreditkort strategiskt för belöningar men betala alltid hela saldot för att undvika ränta',
        'Fokusera på stora vinster som löneförhandling snarare än att skippa små lyxer',
      ],
    },
  },
  {
    slug: 'your-money-or-your-life',
    title: 'Your Money or Your Life',
    author: 'Vicki Robin',
    year: 1992,
    genre: 'Finance',
    coverEmoji: '⏳',
    en: {
      description: 'A transformative guide to changing your relationship with money by understanding the true cost of everything in terms of your life energy.',
      teaserPoints: [
        'Money is life energy — every purchase costs hours of your life, not just dollars, reframing every spending decision',
        'Track every dollar you earn and spend to achieve full clarity on where your life energy is actually going',
        'Financial independence means investment income covers all expenses, permanently freeing you from wage labor',
      ],
    },
    sv: {
      description: 'En transformerande guide till att förändra din relation till pengar genom att förstå den verkliga kostnaden för allt i termer av din livsenergi.',
      teaserPoints: [
        'Pengar är livsenergi — varje köp kostar timmar av ditt liv, inte bara kronor, vilket omramar varje utgiftsbeslut',
        'Spåra varje krona du tjänar och spenderar för att få full klarhet om vart din livsenergi tar vägen',
        'Ekonomisk frihet innebär att investeringsinkomsten täcker alla utgifter och befriar dig permanent från lönearbete',
      ],
    },
  },
  {
    slug: 'the-simple-path-to-wealth',
    title: 'The Simple Path to Wealth',
    author: 'JL Collins',
    year: 2016,
    genre: 'Finance',
    coverEmoji: '🛤️',
    en: {
      description: 'A straightforward guide to financial independence through index fund investing, written as letters from a father to his daughter about money and freedom.',
      teaserPoints: [
        'Avoid debt like the plague — it is a prison that eliminates your options and steals your future freedom',
        'Invest in low-cost total market index funds and never attempt to pick individual stocks or time the market',
        'Save at a high rate and invest consistently — time in the market always beats trying to time the market',
      ],
    },
    sv: {
      description: 'En rättfram guide till ekonomisk frihet genom indexfondinvestering, skriven som brev från en far till sin dotter om pengar och frihet.',
      teaserPoints: [
        'Undvik skulder som pesten — de är ett fängelse som eliminerar dina valmöjligheter och stjäl din framtida frihet',
        'Investera i lågkostnads totalmarknadsindexfonder och försök aldrig plocka enskilda aktier eller tajma marknaden',
        'Spara i hög takt och investera konsekvent — tid på marknaden slår alltid att försöka tajma den',
      ],
    },
  },
  {
    slug: 'the-millionaire-next-door',
    title: 'The Millionaire Next Door',
    author: 'Thomas J. Stanley',
    year: 1996,
    genre: 'Finance',
    coverEmoji: '🏘️',
    en: {
      description: 'Research revealing that most American millionaires live frugally, drive ordinary cars, and built wealth through disciplined saving — not high income or inheritance.',
      teaserPoints: [
        'Most millionaires live well below their means — modest cars, normal neighborhoods, and zero tolerance for status spending',
        'Wealth is what you accumulate, not what you spend — high income without saving creates only an illusion of wealth',
        'First-generation wealth builders invest early and consistently rather than succumbing to lifestyle inflation',
      ],
    },
    sv: {
      description: 'Forskning som avslöjar att de flesta amerikanska miljonärer lever sparsamt och byggde rikedom genom disciplinerat sparande — inte hög inkomst eller arv.',
      teaserPoints: [
        'De flesta miljonärer lever långt under sina tillgångar — blygsamma bilar, vanliga grannskaper och noll tolerans för statusspenderande',
        'Rikedom är vad du ackumulerar, inte vad du spenderar — hög inkomst utan sparande skapar bara en illusion av välstånd',
        'Förstgenerations förmögenhetsbyggare investerar tidigt och konsekvent snarare än att ge efter för livsstilsinflation',
      ],
    },
  },
  {
    slug: 'die-with-zero',
    title: 'Die with Zero',
    author: 'Bill Perkins',
    year: 2020,
    genre: 'Finance',
    coverEmoji: '0️⃣',
    en: {
      description: 'A provocative guide arguing that the goal is to maximize life experiences, not accumulate money — and most people die having saved far more than they ever spent.',
      teaserPoints: [
        'Optimize for life experiences, not net worth — over-saving trades precious moments for money you will never spend',
        'Invest in experiences while young and healthy enough to enjoy them; health, time, and money must all align',
        'Give generously to children and causes while you are alive to witness the impact — not as inheritance after death',
      ],
    },
    sv: {
      description: 'En provokativ guide som argumenterar för att målet är att maximera livsupplevelser, inte ackumulera pengar — de flesta dör med långt mer sparat än de någonsin spenderat.',
      teaserPoints: [
        'Optimera för livsupplevelser, inte förmögenhet — överdrivet sparande byter dyrbara ögonblick mot pengar du aldrig spenderar',
        'Investera i upplevelser medan du är ung och frisk nog att njuta av dem; hälsa, tid och pengar måste stämma överens',
        'Ge generöst till barn och ändamål medan du lever för att bevittna effekten — inte som arv efter döden',
      ],
    },
  },

  {
    slug: 'a-brief-history-of-time',
    title: 'A Brief History of Time',
    author: 'Stephen Hawking',
    year: 1988,
    genre: 'Science',
    coverEmoji: '🌌',
    en: {
      description: 'A landmark exploration of cosmology — from the Big Bang to black holes — written for general readers by one of the greatest scientific minds of the 20th century.',
      teaserPoints: [
        'Space and time are not absolute but woven together into a flexible fabric that can be warped by mass and energy',
        'Black holes are regions where gravity is so extreme that nothing, not even light, can escape their pull',
        'The universe had a definite beginning and may have a definite end, raising profound questions about time itself',
      ],
    },
    sv: {
      description: 'En banbrytande utforskning av kosmologi — från Big Bang till svarta hål — skriven för allmänna läsare av ett av 1900-talets största vetenskapliga sinnen.',
      teaserPoints: [
        'Rum och tid är inte absoluta utan sammanvävda i ett flexibelt tyg som kan böjas av massa och energi',
        'Svarta hål är regioner där gravitationen är så extrem att ingenting, inte ens ljus, kan fly deras dragningskraft',
        'Universum hade en definitiv början och kan ha ett definitiv slut, vilket väcker djupgående frågor om tid',
      ],
    },
  },
  {
    slug: 'the-selfish-gene',
    title: 'The Selfish Gene',
    author: 'Richard Dawkins',
    year: 1976,
    genre: 'Science',
    coverEmoji: '🧬',
    en: {
      description: 'A revolutionary view of evolution arguing that genes, not individuals or species, are the true unit of natural selection — and that we are their survival machines.',
      teaserPoints: [
        'Genes are the primary unit of evolution — organisms are merely vessels that genes use to replicate themselves',
        'Altruistic behavior in nature can be explained by genetic relatedness — we sacrifice for those who share our genes',
        'Dawkins introduces the concept of memes — cultural units that spread and evolve much like biological genes',
      ],
    },
    sv: {
      description: 'En revolutionerande syn på evolution som hävdar att gener, inte individer eller arter, är den verkliga enheten för naturligt urval.',
      teaserPoints: [
        'Gener är evolutionens primära enhet — organismer är bara behållare som gener använder för att replikera sig',
        'Altruistiskt beteende i naturen kan förklaras av genetisk släktskap — vi offrar oss för dem som delar våra gener',
        'Dawkins introducerar begreppet mem — kulturella enheter som sprids och utvecklas ungefär som biologiska gener',
      ],
    },
  },
  {
    slug: 'astrophysics-for-people-in-a-hurry',
    title: 'Astrophysics for People in a Hurry',
    author: 'Neil deGrasse Tyson',
    year: 2017,
    genre: 'Science',
    coverEmoji: '🔭',
    en: {
      description: 'A compact tour of the greatest ideas in astrophysics — from dark matter and dark energy to the cosmic microwave background — written for curious, time-pressed readers.',
      teaserPoints: [
        'Ordinary matter makes up only 5% of the universe — the rest is dark matter and dark energy we still cannot explain',
        'The elements that make up your body were forged in the cores of ancient stars — you are literally made of stardust',
        'The cosmic microwave background is the afterglow of the Big Bang, a snapshot of the universe just 380,000 years old',
      ],
    },
    sv: {
      description: 'En kompakt rundtur av de största idéerna inom astrofysik — från mörk materia till kosmisk mikrovågsbakgrund — skriven för nyfikna, tidspressade läsare.',
      teaserPoints: [
        'Vanlig materia utgör bara 5% av universum — resten är mörk materia och mörk energi som vi fortfarande inte kan förklara',
        'Elementen som utgör din kropp smiddes i kärnorna av urgamla stjärnor — du är bokstavligen gjord av stjärnstoft',
        'Den kosmiska mikrovågsbakgrunden är efterglödet av Big Bang, en ögonblicksbild av universum när det bara var 380 000 år gammalt',
      ],
    },
  },
  {
    slug: 'the-order-of-time',
    title: 'The Order of Time',
    author: 'Carlo Rovelli',
    year: 2018,
    genre: 'Science',
    coverEmoji: '⏰',
    en: {
      description: 'A poetic and mind-bending exploration of what time really is — and the startling conclusion that our commonsense understanding of time is deeply, profoundly wrong.',
      teaserPoints: [
        'Time does not flow at the same rate everywhere — clocks tick slower near heavy masses like Earth\'s surface',
        'The difference between past and future may not be fundamental to physics but emergent from thermodynamics',
        'The present moment does not exist universally — simultaneity is relative to the observer\'s location and velocity',
      ],
    },
    sv: {
      description: 'En poetisk och häpnadsväckande utforskning av vad tid egentligen är — och den häpnadsväckande slutsatsen att vår vardagsförståelse av tid är djupt felaktig.',
      teaserPoints: [
        'Tid flödar inte i samma takt överallt — klockor tickar långsammare nära tunga massor som jordens yta',
        'Skillnaden mellan dåtid och framtid kanske inte är grundläggande för fysiken utan emergerar från termodynamik',
        'Det aktuella ögonblicket existerar inte universellt — simultaneitet är relativ till observatörens position och hastighet',
      ],
    },
  },
  {
    slug: 'the-gene',
    title: 'The Gene: An Intimate History',
    author: 'Siddhartha Mukherjee',
    year: 2016,
    genre: 'Science',
    coverEmoji: '🔬',
    en: {
      description: 'A sweeping history of the gene — from Mendel\'s peas to CRISPR — exploring how our understanding of heredity transformed medicine, society, and what it means to be human.',
      teaserPoints: [
        'Genes are not destiny — environment, chance, and gene expression mean identical DNA can produce vastly different outcomes',
        'The history of genetics is entangled with eugenics, a dark chapter where science was weaponized against humanity',
        'CRISPR gene editing is a profound turning point — for the first time we can rewrite the human genome with precision',
      ],
    },
    sv: {
      description: 'En genomgripande historia om genen — från Mendels ärtor till CRISPR — som utforskar hur vår förståelse av ärftlighet förändrade medicinen och vad det innebär att vara människa.',
      teaserPoints: [
        'Gener är inte öde — miljö, slump och genuttryck innebär att identisk DNA kan producera vitt skilda resultat',
        'Genetikens historia är sammanvävd med eugenik, ett mörkt kapitel där vetenskap vapenanvändes mot mänskligheten',
        'CRISPR-geneditoring är en djupgående vändpunkt — för första gången kan vi skriva om det mänskliga genomet med precision',
      ],
    },
  },
  {
    slug: 'superforecasting',
    title: 'Superforecasting: The Art and Science of Prediction',
    author: 'Philip E. Tetlock',
    year: 2015,
    genre: 'Science',
    coverEmoji: '🎯',
    en: {
      description: 'Based on a decade-long research tournament, this book reveals that some people can predict world events with remarkable accuracy — and shows how to become one of them.',
      teaserPoints: [
        'Superforecasters update their beliefs incrementally with new evidence rather than sticking to initial gut instincts',
        'Think in probabilities, not certainties — expressing confidence as percentages forces more honest self-assessment',
        'Break big questions into smaller, more tractable sub-questions and aggregate the answers systematically',
      ],
    },
    sv: {
      description: 'Baserat på ett decenglångt forskningsturnering avslöjar denna bok att vissa människor kan förutsäga världshändelser med anmärkningsvärd noggrannhet.',
      teaserPoints: [
        'Superprognosmakare uppdaterar sina övertygelser stegvis med nya bevis snarare än att hålla fast vid initiala magkänslor',
        'Tänk i sannolikheter, inte säkerheter — att uttrycka förtroende i procent tvingar till mer ärlig självbedömning',
        'Bryt stora frågor i mindre, mer hanterbara delfrågor och aggregera svaren systematiskt',
      ],
    },
  },
  {
    slug: 'the-hidden-life-of-trees',
    title: 'The Hidden Life of Trees',
    author: 'Peter Wohlleben',
    year: 2016,
    genre: 'Science',
    coverEmoji: '🌳',
    en: {
      description: 'A forester\'s revelation that trees are social beings that communicate through underground fungal networks, share nutrients, and care for their offspring and neighbors.',
      teaserPoints: [
        'Trees communicate via underground fungal networks — the "wood wide web" — sharing nutrients and warning signals',
        'Parent trees nurse their offspring in the shade, providing sugar through roots until seedlings can photosynthesize',
        'Trees experience something like pain and pleasure, responding to injury and thriving in stable forest communities',
      ],
    },
    sv: {
      description: 'En skogsförvaltares uppenbarelse om att träd är sociala varelser som kommunicerar via underjordiska svampnätverk och tar hand om sina avkommor och grannar.',
      teaserPoints: [
        'Träd kommunicerar via underjordiska svampnätverk — "skogens internet" — och delar näringsämnen och varningssignaler',
        'Moderträd vårdar sina avkommor i skuggan och ger socker via rötter tills plantor kan fotosyntetisera',
        'Träd upplever något som liknar smärta och välbehag, reagerar på skador och trivs i stabila skogsgemenskaper',
      ],
    },
  },

  {
    slug: 'seven-brief-lessons-on-physics',
    title: 'Seven Brief Lessons on Physics',
    author: 'Carlo Rovelli',
    year: 2014,
    genre: 'Science',
    coverEmoji: '⚛️',
    en: {
      description: 'Seven elegant essays on the most beautiful ideas in modern physics — from Einstein\'s relativity to quantum mechanics — written with the clarity of poetry.',
      teaserPoints: [
        'General relativity reveals that gravity is the curvature of spacetime, not a force acting at a distance',
        'Quantum mechanics describes a world of probabilities and uncertainties that defies all classical intuition',
        'The nature of time, the heat of black holes, and the granularity of space all point to a deeper unified theory',
      ],
    },
    sv: {
      description: 'Sju eleganta essäer om de vackraste idéerna inom modern fysik — från Einsteins relativitetsteori till kvantmekanik — skrivna med poesins klarhet.',
      teaserPoints: [
        'Allmän relativitetsteori avslöjar att gravitation är krökningen av rumtid, inte en kraft som verkar på avstånd',
        'Kvantmekanik beskriver en värld av sannolikheter och osäkerheter som utmanar all klassisk intuition',
        'Tidens natur, svarta håls värme och rummets granularitet pekar alla mot en djupare enhetlig teori',
      ],
    },
  },
  {
    slug: 'the-body-bill-bryson',
    title: 'The Body: A Guide for Occupants',
    author: 'Bill Bryson',
    year: 2019,
    genre: 'Science',
    coverEmoji: '🫀',
    en: {
      description: 'A delightful and astounding tour of the human body — how it works, how it heals, and just how remarkable it is that it keeps us alive at all.',
      teaserPoints: [
        'Your body produces 25 million new cells per second and your skin is completely replaced every few weeks',
        'The brain is the most complex structure in the known universe, with 86 billion neurons and 100 trillion connections',
        'Most of the microbes living in and on your body are beneficial — your gut microbiome is essentially a second brain',
      ],
    },
    sv: {
      description: 'En härlig och häpnadsväckande rundtur i den mänskliga kroppen — hur den fungerar, hur den läker och hur anmärkningsvärt det är att den håller oss vid liv alls.',
      teaserPoints: [
        'Din kropp producerar 25 miljoner nya celler per sekund och din hud byts ut helt var femte vecka',
        'Hjärnan är den mest komplexa strukturen i det kända universum med 86 miljarder neuroner och 100 biljoner kopplingar',
        'De flesta mikrober som lever i och på din kropp är fördelaktiga — tarmens mikrobiom är i princip en andra hjärna',
      ],
    },
  },
  {
    slug: 'the-elegant-universe',
    title: 'The Elegant Universe',
    author: 'Brian Greene',
    year: 1999,
    genre: 'Science',
    coverEmoji: '🎻',
    en: {
      description: 'A brilliant and accessible account of string theory — the ambitious attempt to unify all of physics into a single elegant framework of vibrating strings.',
      teaserPoints: [
        'String theory proposes that the fundamental constituents of reality are not particles but tiny vibrating strings of energy',
        'Extra dimensions beyond the four we perceive may be curled up at scales too small for current experiments to detect',
        'A complete theory of quantum gravity would reconcile Einstein\'s general relativity with quantum mechanics',
      ],
    },
    sv: {
      description: 'En lysande och tillgänglig redogörelse för strängteori — det ambitiösa försöket att förena all fysik i ett enda elegant ramverk av vibrerande strängar.',
      teaserPoints: [
        'Strängteori föreslår att verklighetens grundläggande beståndsdelar inte är partiklar utan tiny vibrerande strängar av energi',
        'Extra dimensioner bortom de fyra vi uppfattar kan vara hoprullade vid skalor för små för nuvarande experiment att detektera',
        'En fullständig teori om kvantgravitation skulle förena Einsteins allmänna relativitetsteori med kvantmekanik',
      ],
    },
  },
  {
    slug: 'shoe-dog',
    title: 'Shoe Dog',
    author: 'Phil Knight',
    year: 2016,
    genre: 'Memoir',
    coverEmoji: '👟',
    en: {
      description: 'The raw and riveting memoir of Nike\'s founder — from a $50 loan from his father to building one of the most iconic brands in the world through near-constant crisis.',
      teaserPoints: [
        'Nike nearly went bankrupt multiple times in its early years — survival required relentless improvisation and sheer will',
        'Passion for your product and mission can carry a company through cash crises, legal battles, and manufacturing disasters',
        'Build a team of misfits and believers who care about the mission more than the money — that culture becomes the brand',
      ],
    },
    sv: {
      description: 'Den råa och fängslande memoaren av Nikes grundare — från ett 50-dollars lån från hans far till att bygga ett av världens mest ikoniska varumärken.',
      teaserPoints: [
        'Nike var nära konkurs flera gånger under sina tidiga år — överlevnad krävde obeveklig improvisation och ren viljestyrka',
        'Passion för din produkt och mission kan bära ett företag genom likviditetskriser, juridiska strider och tillverkningskatastrofer',
        'Bygg ett team av udda fåglar och troende som bryr sig om uppdraget mer än pengarna — den kulturen blir varumärket',
      ],
    },
  },
  {
    slug: 'educated',
    title: 'Educated',
    author: 'Tara Westover',
    year: 2018,
    genre: 'Memoir',
    coverEmoji: '📚',
    en: {
      description: 'A breathtaking memoir about a woman who grew up in a survivalist family in the Idaho mountains — never attending school — and educated herself into Cambridge and Harvard.',
      teaserPoints: [
        'Education is not just about knowledge but about gaining a new perspective from which to see and interrogate your past',
        'Family loyalty and self-determination can be brutally incompatible — choosing yourself can mean losing your family',
        'The self is malleable — who we are is shaped by the stories we are told and the stories we dare to tell ourselves',
      ],
    },
    sv: {
      description: 'En häpnadsväckande memoar om en kvinna som växte upp i en survivalistfamilj i Idahos berg — utan att gå i skola — och utbildade sig till Cambridge och Harvard.',
      teaserPoints: [
        'Utbildning handlar inte bara om kunskap utan om att få ett nytt perspektiv från vilket man kan se och ifrågasätta sitt förflutna',
        'Familjelojalitet och självbestämmande kan vara brutalt oförenliga — att välja sig själv kan innebära att förlora sin familj',
        'Jaget är formbart — vilka vi är formas av de berättelser vi berättas och de berättelser vi vågar berätta för oss själva',
      ],
    },
  },
  {
    slug: 'becoming',
    title: 'Becoming',
    author: 'Michelle Obama',
    year: 2018,
    genre: 'Memoir',
    coverEmoji: '🌹',
    en: {
      description: 'The intimate, powerful memoir of former US First Lady Michelle Obama — her childhood on Chicago\'s South Side, her path to Princeton and Harvard Law, and her years in the White House.',
      teaserPoints: [
        'Becoming is a lifelong process, not a destination — identity evolves through every relationship, setback, and reinvention',
        'Imposter syndrome is universal — even at the pinnacle of power, the voice asking "am I enough?" never fully disappears',
        'Community, mentorship, and giving back are not luxuries but necessities for a meaningful and grounded life',
      ],
    },
    sv: {
      description: 'Den intima, kraftfulla memoaren av f.d. USA:s First Lady Michelle Obama — hennes uppväxt på Chicagos South Side, vägen till Princeton och Harvard Law och åren i Vita huset.',
      teaserPoints: [
        'Att bli är en livslång process, inte ett mål — identitet utvecklas genom varje relation, bakslag och förnyelse',
        'Imposter syndrome är universellt — även vid maktens topp försvinner aldrig rösten som frågar "är jag tillräcklig?"',
        'Gemenskap, mentorskap och att ge tillbaka är inte lyxer utan nödvändigheter för ett meningsfullt och jordat liv',
      ],
    },
  },
  {
    slug: 'born-a-crime',
    title: 'Born a Crime',
    author: 'Trevor Noah',
    year: 2016,
    genre: 'Memoir',
    coverEmoji: '🌍',
    en: {
      description: 'The hilarious and heartbreaking memoir of comedian Trevor Noah — born to a black mother and white father in apartheid South Africa, where his very existence was illegal.',
      teaserPoints: [
        'Language is a tool of connection and power — speaking someone\'s language signals belonging and disarms prejudice',
        'Poverty is not just a lack of money but a lack of options — crime often emerges when all legal paths are closed',
        'A mother\'s love, faith, and sheer stubbornness can protect a child from circumstances that should make survival impossible',
      ],
    },
    sv: {
      description: 'Den hilariska och hjärtskärande memoaren av komikern Trevor Noah — född av en svart mor och vit far i apartheidtidens Sydafrika, där hans existens var olaglig.',
      teaserPoints: [
        'Språk är ett verktyg för koppling och makt — att tala någons språk signalerar tillhörighet och avväpnar fördomar',
        'Fattigdom är inte bara brist på pengar utan brist på alternativ — brott uppstår ofta när alla lagliga vägar är stängda',
        'En moders kärlek, tro och ren envishet kan skydda ett barn från omständigheter som borde göra överlevnad omöjlig',
      ],
    },
  },

  {
    slug: 'when-breath-becomes-air',
    title: 'When Breath Becomes Air',
    author: 'Paul Kalanithi',
    year: 2016,
    genre: 'Memoir',
    coverEmoji: '🫁',
    en: {
      description: 'A neurosurgeon diagnosed with terminal lung cancer at 36 writes a meditation on mortality, meaning, and what makes a life worth living.',
      teaserPoints: [
        'Confronting death forces a reckoning with what truly matters — stripping away the noise to find what is irreducible',
        'Medicine at its finest is not about curing but about shepherding patients and families through suffering with grace',
        'A life need not be long to be complete — depth of meaning matters more than breadth of years',
      ],
    },
    sv: {
      description: 'En neurokirurg diagnostiserad med terminal lungcancer vid 36 skriver en meditation om dödlighet, mening och vad som gör ett liv värt att leva.',
      teaserPoints: [
        'Att konfrontera döden tvingar till ett uppgörande med vad som verkligen spelar roll — att skala bort bruset för att hitta det oumbärliga',
        'Medicin på sin bästa är inte att bota utan att ledsaga patienter och familjer genom lidande med nåd',
        'Ett liv behöver inte vara långt för att vara fullständigt — djup av mening spelar större roll än bredd av år',
      ],
    },
  },
  {
    slug: 'unbroken',
    title: 'Unbroken',
    author: 'Laura Hillenbrand',
    year: 2010,
    genre: 'Memoir',
    coverEmoji: '✈️',
    en: {
      description: 'The extraordinary true story of Louie Zamperini — Olympic runner turned WWII bombardier — who survived 47 days on a raft after a plane crash and years in Japanese POW camps.',
      teaserPoints: [
        'Human resilience under extreme duress can exceed all rational expectation — the will to live is a physical force',
        'Dignity preserved under dehumanizing conditions is itself a form of defiance and an act of profound courage',
        'Forgiveness, ultimately, is not for the perpetrator but for the survivor — a liberation from a self-imposed prison',
      ],
    },
    sv: {
      description: 'Den extraordinära sanna historien om Louie Zamperini — olympisk löpare som blev bombkastare under andra världskriget — som överlevde 47 dagar på en flotte och år i japanska krigsfångläger.',
      teaserPoints: [
        'Mänsklig motståndskraft under extremt lidande kan överstiga alla rationella förväntningar — viljan att leva är en fysisk kraft',
        'Värdighet bevarad under avhumaniserande förhållanden är i sig en form av trots och en djupgående modig handling',
        'Förlåtelse är i slutändan inte för förövaren utan för den överlevande — en befrielse från ett självpåfört fängelse',
      ],
    },
  },
  {
    slug: 'the-innovators',
    title: 'The Innovators',
    author: 'Walter Isaacson',
    year: 2014,
    genre: 'History',
    coverEmoji: '💡',
    en: {
      description: 'The definitive history of the digital revolution — from Ada Lovelace to the internet — and the collaborative teams of dreamers and engineers who built our modern world.',
      teaserPoints: [
        'Innovation is almost never the work of a lone genius — breakthroughs emerge from collaborative teams with diverse perspectives',
        'Ada Lovelace wrote the first computer algorithm in 1843, a century before the first working computer was built',
        'The internet was designed to be decentralized and resilient — its open architecture enabled an explosion of creativity',
      ],
    },
    sv: {
      description: 'Den definitiva historien om den digitala revolutionen — från Ada Lovelace till internet — och de samarbetande team av drömmare och ingenjörer som byggde vår moderna värld.',
      teaserPoints: [
        'Innovation är nästan aldrig verk av ett ensamt geni — genombrott uppstår från samarbetande team med olika perspektiv',
        'Ada Lovelace skrev den första datoralgoritmen 1843, ett sekel innan den första fungerande datorn byggdes',
        'Internet designades för att vara decentraliserat och motståndskraftigt — dess öppna arkitektur möjliggjorde en kreativitetsexplosion',
      ],
    },
  },
  {
    slug: 'american-prometheus',
    title: 'American Prometheus',
    author: 'Kai Bird & Martin J. Sherwin',
    year: 2005,
    genre: 'History',
    coverEmoji: '☢️',
    en: {
      description: 'The Pulitzer Prize-winning biography of J. Robert Oppenheimer — father of the atomic bomb — exploring the tension between scientific genius and moral responsibility.',
      teaserPoints: [
        'Oppenheimer embodied the tragic archetype of the creator undone by his creation — triumph and catastrophe intertwined',
        'Scientific achievement divorced from ethical reflection can produce tools of unimaginable destruction and regret',
        'The McCarthy era destroyed a great man through security hearings driven by political jealousy, not genuine threat',
      ],
    },
    sv: {
      description: 'Den Pulitzerprisbelönta biografin om J. Robert Oppenheimer — atombombens fader — som utforskar spänningen mellan vetenskapligt geni och moraliskt ansvar.',
      teaserPoints: [
        'Oppenheimer förkroppsligade den tragiska arketypen av skaparen som förstörs av sin skapelse — triumf och katastrof sammanflätade',
        'Vetenskapliga prestationer skilda från etisk reflektion kan producera verktyg med otänkbar förstörelsekraft och ånger',
        'McCarthyeran förstörde en stor man genom säkerhetshöranden drivna av politisk avundsjuka, inte genuint hot',
      ],
    },
  },
  {
    slug: 'the-wright-brothers',
    title: 'The Wright Brothers',
    author: 'David McCullough',
    year: 2015,
    genre: 'History',
    coverEmoji: '🛩️',
    en: {
      description: 'The inspiring story of Wilbur and Orville Wright — two self-taught bicycle mechanics from Ohio — who solved the problem of powered human flight through sheer persistence.',
      teaserPoints: [
        'The Wrights succeeded where well-funded rivals failed through methodical experimentation and willingness to be wrong',
        'No college education, no government funding — just curiosity, mechanical intuition, and thousands of failed experiments',
        'The gap between the first 12-second flight and crossing the Atlantic in a passenger jet took less than 70 years',
      ],
    },
    sv: {
      description: 'Den inspirerande historien om Wilbur och Orville Wright — två självlärda cykelmekanikers från Ohio — som löste problemet med bemannad motordrivna flygning genom envishet.',
      teaserPoints: [
        'Bröderna Wright lyckades där välfinansierade konkurrenter misslyckades genom metodisk experimentering och villighet att ha fel',
        'Ingen högskoleutbildning, inget statligt stöd — bara nyfikenhet, mekanisk intuition och tusentals misslyckade experiment',
        'Gapet mellan den första 12-sekunders flygningen och att korsa Atlanten i ett passagerarflygplan tog mindre än 70 år',
      ],
    },
  },
  {
    slug: 'einstein-his-life-and-universe',
    title: 'Einstein: His Life and Universe',
    author: 'Walter Isaacson',
    year: 2007,
    genre: 'History',
    coverEmoji: '🧠',
    en: {
      description: 'The definitive biography of Albert Einstein — tracing how a rebellious patent clerk who questioned authority revolutionized our understanding of space, time, and matter.',
      teaserPoints: [
        'Einstein\'s breakthroughs came from his willingness to question the most fundamental assumptions everyone else accepted',
        'Imagination and thought experiments were his primary tools — he visualized riding alongside a beam of light at age 16',
        'Einstein\'s personal life was complicated and often contradicted his humanist public image — genius is no guarantee of virtue',
      ],
    },
    sv: {
      description: 'Den definitiva biografin om Albert Einstein — som spårar hur en rebellisk patentkontorist som ifrågasatte auktoriteter revolutionerade vår förståelse av rum, tid och materia.',
      teaserPoints: [
        'Einsteins genombrott kom från hans villighet att ifrågasätta de mest grundläggande antaganden som alla andra accepterade',
        'Fantasi och tankeexperiment var hans primära verktyg — han visualiserade att rida bredvid en ljusstråle vid 16 års ålder',
        'Einsteins privatliv var komplicerat och motsäger ofta hans humanistiska offentliga bild — geni garanterar inte dygd',
      ],
    },
  },

  {
    slug: '12-rules-for-life',
    title: '12 Rules for Life',
    author: 'Jordan B. Peterson',
    year: 2018,
    genre: 'Philosophy',
    coverEmoji: '🦞',
    en: {
      description: 'A provocative guide to living a meaningful life — drawing on evolutionary biology, mythology, and philosophy to offer practical rules for bearing the chaos of existence.',
      teaserPoints: [
        'Stand up straight with your shoulders back — posture signals confidence to yourself and to the world around you',
        'Compare yourself to who you were yesterday, not to who someone else is today — personal growth is the only valid metric',
        'Pursue what is meaningful, not what is expedient — meaning provides the antidote to the suffering inherent in life',
      ],
    },
    sv: {
      description: 'En provokativ guide till ett meningsfullt liv — baserad på evolutionsbiologi, mytologi och filosofi för att erbjuda praktiska regler för att bära tillvarons kaos.',
      teaserPoints: [
        'Stå rak med axlarna bakåt — hållning signalerar självförtroende till dig själv och till världen runt dig',
        'Jämför dig med den du var igår, inte med vem någon annan är idag — personlig tillväxt är det enda giltiga måttet',
        'Sträva efter det meningsfulla, inte det bekväma — mening ger motgiftet mot det lidande som är inneboende i livet',
      ],
    },
  },
  {
    slug: 'a-guide-to-the-good-life',
    title: 'A Guide to the Good Life',
    author: 'William B. Irvine',
    year: 2008,
    genre: 'Philosophy',
    coverEmoji: '🏛️',
    en: {
      description: 'A practical introduction to Stoic philosophy — showing how ancient techniques for dealing with anxiety, loss, and desire remain strikingly relevant for modern life.',
      teaserPoints: [
        'Negative visualization — imagining losing what you have — cultivates gratitude and shields against hedonic adaptation',
        'The dichotomy of control: focus energy only on what you can influence; accept everything else with equanimity',
        'Voluntary discomfort trains resilience and reveals that most of what you fear is far less dreadful than imagined',
      ],
    },
    sv: {
      description: 'En praktisk introduktion till stoisk filosofi — som visar hur forntida tekniker för att hantera ångest, förlust och begär förblir slående relevanta för det moderna livet.',
      teaserPoints: [
        'Negativ visualisering — att föreställa sig att förlora det man har — odlar tacksamhet och skyddar mot hedonisk anpassning',
        'Kontrollens dikotomi: fokusera energi bara på vad du kan påverka; acceptera allt annat med jämnmod',
        'Frivilligt obehag tränar motståndskraft och avslöjar att det mesta du fruktar är långt mindre skrämmande än föreställt',
      ],
    },
  },
  {
    slug: 'letters-from-a-stoic',
    title: 'Letters from a Stoic',
    author: 'Seneca',
    year: 65,
    genre: 'Philosophy',
    coverEmoji: '📜',
    en: {
      description: 'Seneca\'s collected letters to a friend — written two thousand years ago — offer timeless wisdom on friendship, death, wealth, time, and the art of living well.',
      teaserPoints: [
        'Guard your time fiercely — it is your most non-renewable resource, and most people squander it without realizing',
        'The fear of death poisons life — learn to accept it as natural and the anxiety dissolves, leaving only the present',
        'Wealth and pleasure are not bad, but depending on them for happiness enslaves you to forces outside your control',
      ],
    },
    sv: {
      description: 'Senecas insamlade brev till en vän — skrivna för två tusen år sedan — erbjuder tidlös visdom om vänskap, död, rikedom, tid och konsten att leva väl.',
      teaserPoints: [
        'Vaka svartsjukt över din tid — det är din mest oförnyelsebara resurs och de flesta slösar bort den utan att inse det',
        'Rädslan för döden förgiftar livet — lär dig att acceptera den som naturlig och ångesten löses upp, och kvar finns bara nuet',
        'Rikedom och nöje är inte dåliga, men att bero på dem för lycka förslavas dig till krafter utanför din kontroll',
      ],
    },
  },
  {
    slug: 'the-alchemist',
    title: 'The Alchemist',
    author: 'Paulo Coelho',
    year: 1988,
    genre: 'Philosophy',
    coverEmoji: '✨',
    en: {
      description: 'A beloved allegorical novel about a young shepherd\'s journey to find treasure — and the universal lesson that following your Personal Legend transforms the world around you.',
      teaserPoints: [
        'When you want something with all your heart, the universe conspires to help you achieve it — pursue your Personal Legend',
        'The treasure you seek is rarely where you think it is — the journey itself transforms you into someone worthy of finding it',
        'Fear of failure is the greatest obstacle between a person and their dreams — most people abandon the journey too soon',
      ],
    },
    sv: {
      description: 'En älskad allegorisk roman om en ung herdes resa för att hitta skatt — och den universella läxan att följa din Personliga Legend förändrar världen runt dig.',
      teaserPoints: [
        'När du vill något av hela ditt hjärta sammansvär sig universum för att hjälpa dig uppnå det — följ din Personliga Legend',
        'Skatten du söker är sällan där du tror den finns — resan i sig förvandlar dig till någon värdig att hitta den',
        'Rädsla för misslyckande är det största hindret mellan en person och deras drömmar — de flesta ger upp resan för tidigt',
      ],
    },
  },
  {
    slug: 'the-road-less-traveled',
    title: 'The Road Less Traveled',
    author: 'M. Scott Peck',
    year: 1978,
    genre: 'Philosophy',
    coverEmoji: '🛤️',
    en: {
      description: 'A groundbreaking work on personal growth and spiritual development that opens with four words: "Life is difficult." Acceptance of this truth is where growth begins.',
      teaserPoints: [
        'Discipline — delaying gratification, accepting responsibility, being honest — is the cornerstone of all mental health',
        'Love is not a feeling but an act of will: the choice to extend yourself for another\'s spiritual growth',
        'Grace — the gift of growth beyond what you have earned — moves through life when we remain open and humble enough to receive it',
      ],
    },
    sv: {
      description: 'Ett banbrytande verk om personlig tillväxt och andlig utveckling som öppnar med fyra ord: "Livet är svårt." Acceptansen av denna sanning är där tillväxt börjar.',
      teaserPoints: [
        'Disciplin — att skjuta upp belöning, acceptera ansvar, vara ärlig — är hörnstenen i all mental hälsa',
        'Kärlek är inte en känsla utan en viljakt: valet att sträcka ut sig för en annans andliga tillväxt',
        'Nåd — gåvan av tillväxt bortom vad du förtjänat — rör sig genom livet när vi förblir tillräckligt öppna och ödmjuka för att ta emot den',
      ],
    },
  },
  {
    slug: 'antifragile',
    title: 'Antifragile',
    author: 'Nassim Nicholas Taleb',
    year: 2012,
    genre: 'Philosophy',
    coverEmoji: '🦾',
    en: {
      description: 'An original and iconoclastic work introducing the concept of antifragility — systems that not only survive shocks but grow stronger because of them.',
      teaserPoints: [
        'Antifragile things gain from disorder — unlike resilient things that merely withstand it, they actively improve under stress',
        'Modern society over-protects systems from volatility, which makes them fragile — small stressors are essential for robustness',
        'The barbell strategy: be extremely conservative in some areas and extremely aggressive in others — avoid the mediocre middle',
      ],
    },
    sv: {
      description: 'Ett originellt och ikonoklastiskt verk som introducerar begreppet antifragilitet — system som inte bara överlever chocker utan växer sig starkare av dem.',
      teaserPoints: [
        'Antifragila saker vinner på oordning — till skillnad från motståndskraftiga saker som bara uthärdar det förbättras de aktivt under stress',
        'Det moderna samhället överprotekterar system från volatilitet, vilket gör dem sköra — små stressorer är avgörande för robusthet',
        'Skivstångsstrategin: var extremt konservativ inom vissa områden och extremt aggressiv inom andra — undvik det mediokra mitten',
      ],
    },
  },
  {
    slug: 'the-monk-who-sold-his-ferrari',
    title: 'The Monk Who Sold His Ferrari',
    author: 'Robin Sharma',
    year: 1997,
    genre: 'Philosophy',
    coverEmoji: '🧘',
    en: {
      description: 'A fable about a high-powered lawyer who has a heart attack, sells everything, and journeys to India — returning with timeless wisdom about purpose, discipline, and joy.',
      teaserPoints: [
        'Master your mind or it will master you — most suffering comes not from events but from the stories we tell about them',
        'Have a clear, written life purpose and return to it daily — clarity of intent is the foundation of extraordinary results',
        'Rise early, exercise, meditate, and plan daily — small rituals practiced consistently create transformative change',
      ],
    },
    sv: {
      description: 'En fabel om en framgångsrik advokat som drabbas av hjärtattack, säljer allt och reser till Indien — och återvänder med tidlös visdom om syfte, disciplin och glädje.',
      teaserPoints: [
        'Bemästra ditt sinne eller det kommer att bemästra dig — de flesta lidanden kommer inte från händelser utan från berättelserna vi berättar om dem',
        'Ha ett tydligt, nedskrivet livssyfte och återvänd till det dagligen — klarhet i avsikt är grunden för extraordinära resultat',
        'Stiga upp tidigt, träna, meditera och planera dagligen — små ritualer praktiserade konsekvent skapar transformerande förändring',
      ],
    },
  },

  {
    slug: 'the-body-keeps-the-score',
    title: 'The Body Keeps the Score',
    author: 'Bessel van der Kolk',
    year: 2014,
    genre: 'Psychology',
    coverEmoji: '🧠',
    en: {
      description: 'A landmark study of trauma and its effects on mind and body — and how innovative therapies can help survivors reconnect with themselves and reclaim their lives.',
      teaserPoints: [
        'Trauma is not just a mental event — it is physically stored in the body and must be addressed through somatic approaches',
        'The brain\'s survival circuits can become chronically activated by trauma, keeping sufferers in a permanent state of threat',
        'Yoga, EMDR, theater, and neurofeedback can all rewire traumatized nervous systems when talk therapy alone cannot',
      ],
    },
    sv: {
      description: 'En banbrytande studie av trauma och dess effekter på sinne och kropp — och hur innovativa terapier kan hjälpa överlevande att återansluta med sig själva och återta sina liv.',
      teaserPoints: [
        'Trauma är inte bara en mental händelse — det lagras fysiskt i kroppen och måste åtgärdas genom somatiska metoder',
        'Hjärnans överlevnadskretsar kan kroniskt aktiveras av trauma och hålla drabbade i ett permanent tillstånd av hot',
        'Yoga, EMDR, teater och neurofeedback kan alla koppla om traumatiserade nervsystem när samtalsterapi ensam inte räcker',
      ],
    },
  },
  {
    slug: 'outlive',
    title: 'Outlive: The Science and Art of Longevity',
    author: 'Peter Attia',
    year: 2023,
    genre: 'Health',
    coverEmoji: '💪',
    en: {
      description: 'A physician\'s comprehensive guide to living longer and better — focusing on preventing the four chronic diseases that kill most people and optimizing healthspan, not just lifespan.',
      teaserPoints: [
        'The four horsemen of chronic disease — cancer, heart disease, diabetes, and neurodegeneration — are largely preventable',
        'Exercise is the single most powerful longevity intervention: strength training and Zone 2 cardio are non-negotiable',
        'Healthspan matters as much as lifespan — the goal is to be physically and cognitively vital in your final decade',
      ],
    },
    sv: {
      description: 'En läkares omfattande guide till att leva längre och bättre — med fokus på att förebygga de fyra kroniska sjukdomarna som dödar de flesta och att optimera hälsospann, inte bara livslängd.',
      teaserPoints: [
        'De fyra kroniska sjukdomarna — cancer, hjärtsjukdom, diabetes och neurodegeneration — är till stor del förebyggbara',
        'Motion är den enskilt kraftfullaste livslängdsinterventionen: styrketräning och Zon 2-kondition är icke-förhandlingsbara',
        'Hälsospann spelar lika stor roll som livsspann — målet är att vara fysiskt och kognitivt vital i sitt sista decennium',
      ],
    },
  },
  {
    slug: 'lifespan',
    title: 'Lifespan: Why We Age — and Why We Don\'t Have To',
    author: 'David A. Sinclair',
    year: 2019,
    genre: 'Health',
    coverEmoji: '🔬',
    en: {
      description: 'A Harvard geneticist argues that aging is a disease — not an inevitability — and that we are on the verge of therapies that could dramatically extend healthy human lifespan.',
      teaserPoints: [
        'Aging is caused by loss of epigenetic information — the instruction manual for gene expression gets corrupted over time',
        'Sirtuins, NAD+, and mTOR are key longevity pathways activated by caloric restriction, exercise, and cold exposure',
        'Drugs like metformin and resveratrol, combined with fasting and lifestyle changes, may slow aging at the cellular level',
      ],
    },
    sv: {
      description: 'En genetiker från Harvard hävdar att åldrande är en sjukdom — inte en oundviklighet — och att vi är på randen till terapier som dramatiskt kan förlänga det sunda mänskliga livet.',
      teaserPoints: [
        'Åldrande orsakas av förlust av epigenetisk information — instruktionsmanualen för genuttryck korrumperas med tiden',
        'Sirtuiner, NAD+ och mTOR är viktiga livslängdsvägar aktiverade av kaloribegränsning, träning och köldexponering',
        'Läkemedel som metformin och resveratrol kombinerat med fasta och livsstilsförändringar kan bromsa åldrande på cellnivå',
      ],
    },
  },
  {
    slug: 'in-defense-of-food',
    title: 'In Defense of Food',
    author: 'Michael Pollan',
    year: 2008,
    genre: 'Health',
    coverEmoji: '🥦',
    en: {
      description: 'A journalist\'s elegant manifesto on eating well — distilled to seven words: "Eat food. Not too much. Mostly plants." — and an argument against nutritionism and processed food.',
      teaserPoints: [
        'Nutritionism is a reductive ideology that mistakes nutrients for food — whole foods contain interactions science has not mapped',
        'Processed foods engineered for bliss points and long shelf-life are not real food — shop the perimeter of the grocery store',
        'Traditional food cultures — the Mediterranean, Japanese, and others — deliver health that no supplement can replicate',
      ],
    },
    sv: {
      description: 'En journalists eleganta manifest om att äta väl — destillerat till sju ord: "Ät mat. Inte för mycket. Mest växter." — och ett argument mot nutritionism och processad mat.',
      teaserPoints: [
        'Nutritionism är en reduktiv ideologi som förväxlar näringsämnen med mat — hela livsmedel innehåller interaktioner som vetenskapen inte kartlagt',
        'Processade livsmedel konstruerade för beroendeframkallande smak och lång hållbarhet är inte riktig mat — handla längs kanterna i affären',
        'Traditionella matkulturer — medelhavet, japanska och andra — levererar hälsa som inget kosttillskott kan replikera',
      ],
    },
  },
  {
    slug: 'how-not-to-die',
    title: 'How Not to Die',
    author: 'Michael Greger',
    year: 2015,
    genre: 'Health',
    coverEmoji: '🥕',
    en: {
      description: 'A physician examines the top causes of premature death and presents the evidence for how a whole-food, plant-based diet can prevent and even reverse many of them.',
      teaserPoints: [
        'The leading causes of death — heart disease, cancer, diabetes — are largely driven by diet and are largely preventable',
        'A whole-food, plant-based diet is the most evidence-backed approach for preventing chronic disease and extending life',
        'Daily consumption of greens, berries, legumes, nuts, and cruciferous vegetables provides compounding protective benefits',
      ],
    },
    sv: {
      description: 'En läkare undersöker de vanligaste orsakerna till för tidig död och presenterar bevis för hur en hel-mat, växtbaserad kost kan förebygga och till och med vända många av dem.',
      teaserPoints: [
        'De vanligaste dödsorsakerna — hjärtsjukdom, cancer, diabetes — drivs till stor del av kost och är i stor utsträckning förebyggbara',
        'En hel-mat, växtbaserad kost är det mest evidensbaserade tillvägagångssättet för att förebygga kronisk sjukdom och förlänga livet',
        'Daglig konsumtion av grönsaker, bär, baljväxter, nötter och korsblomstriga grönsaker ger sammansatta skyddseffekter',
      ],
    },
  },
  {
    slug: 'why-we-sleep',
    title: 'Why We Sleep',
    author: 'Matthew Walker',
    year: 2017,
    genre: 'Health',
    coverEmoji: '😴',
    en: {
      description: 'A neuroscientist reveals the astonishing science of sleep — and how our chronic sleep deprivation is quietly wrecking our health, performance, and longevity.',
      teaserPoints: [
        'Every major body system is damaged by insufficient sleep — heart disease, obesity, cancer, and dementia risks all rise dramatically',
        'Sleep is the time when the brain consolidates memories and flushes toxic proteins linked to Alzheimer\'s disease',
        'Caffeine, alcohol, and artificial light all suppress the sleep systems that evolution spent millions of years building',
      ],
    },
    sv: {
      description: 'En neurovetare avslöjar den häpnadsväckande vetenskapen om sömn — och hur vår kroniska sömnbrist tyst förstör vår hälsa, prestanda och livslängd.',
      teaserPoints: [
        'Varje kroppssystem skadas av otillräcklig sömn — hjärtsjukdom, fetma, cancer och demensrisk ökar alla dramatiskt',
        'Sömn är den tid då hjärnan konsoliderar minnen och spolar ut toxiska proteiner kopplade till Alzheimers sjukdom',
        'Koffein, alkohol och artificiellt ljus hämmar alla sömnssystem som evolutionen spenderade miljoner år på att bygga',
      ],
    },
  },
  {
    slug: 'the-longevity-paradox',
    title: 'The Longevity Paradox',
    author: 'Steven R. Gundry',
    year: 2019,
    genre: 'Health',
    coverEmoji: '🌱',
    en: {
      description: 'A cardiac surgeon\'s guide to living to 100 — arguing that gut health is the master key to longevity and that many "healthy" foods actually sabotage your gut microbiome.',
      teaserPoints: [
        'A diverse, healthy gut microbiome is the foundation of longevity — feed your gut bacteria with prebiotic-rich foods',
        'Many plant foods contain lectins that disrupt the gut barrier — preparation methods like pressure cooking neutralize them',
        'Caloric restriction through time-restricted eating activates ancient survival pathways that slow cellular aging',
      ],
    },
    sv: {
      description: 'En hjärtkirurgs guide till att leva till 100 — som hävdar att tarmhälsa är huvudnyckeln till livslängd och att många "hälsosamma" livsmedel faktiskt saboterar din tarmmikrobiom.',
      teaserPoints: [
        'En mångsidig, frisk tarmmikrobiom är grunden för livslängd — mata dina tarmbakterier med prebiotiska livsmedel',
        'Många växtlivsmedel innehåller lektiner som stör tarmbarriären — tillagningsmetoder som tryckkokare neutraliserar dem',
        'Kaloribegränsning genom tidsbegränsat ätande aktiverar urgamla överlevnadsvägar som bromsar cellulär åldrande',
      ],
    },
  },

  {
    slug: 'the-creative-act',
    title: 'The Creative Act: A Way of Being',
    author: 'Rick Rubin',
    year: 2023,
    genre: 'Creativity',
    coverEmoji: '🎨',
    en: {
      description: 'The legendary music producer shares his philosophy of creativity — not as a skill to master but as a way of perceiving the world and staying connected to your inner source.',
      teaserPoints: [
        'Creativity is not a talent reserved for artists — it is a fundamental human capacity available to everyone who pays attention',
        'The goal is not to make great art but to be deeply connected to the work — quality follows presence, not effort',
        'Rules and techniques are training wheels; mastery means knowing when to follow them and when to break them entirely',
      ],
    },
    sv: {
      description: 'Den legendariske musikproducenten delar sin filosofi om kreativitet — inte som en färdighet att bemästra utan som ett sätt att uppfatta världen och förbli ansluten till din inre källa.',
      teaserPoints: [
        'Kreativitet är inte ett talent reserverat för konstnärer — det är en grundläggande mänsklig kapacitet tillgänglig för alla som uppmärksammar',
        'Målet är inte att skapa stor konst utan att vara djupt ansluten till verket — kvalitet följer närvaro, inte ansträngning',
        'Regler och tekniker är stödhjul; mästerskap innebär att veta när man ska följa dem och när man ska bryta dem helt',
      ],
    },
  },
  {
    slug: 'steal-like-an-artist',
    title: 'Steal Like an Artist',
    author: 'Austin Kleon',
    year: 2012,
    genre: 'Creativity',
    coverEmoji: '✂️',
    en: {
      description: 'A manifesto for the digital age — ten practical principles for unlocking creativity, building a creative practice, and sharing your work with the world.',
      teaserPoints: [
        'All creative work builds on what came before — "stealing" means deeply studying your influences and making them your own',
        'Start copying the work you love, then copy many sources — where different influences combine, your unique style emerges',
        'Creative constraints are gifts — the limits of your tools, time, and medium force unexpected and original solutions',
      ],
    },
    sv: {
      description: 'Ett manifest för den digitala tidsåldern — tio praktiska principer för att låsa upp kreativitet, bygga en kreativ praktik och dela ditt arbete med världen.',
      teaserPoints: [
        'Allt kreativt arbete bygger på vad som kom före — "stjäla" betyder att djupt studera dina influenser och göra dem till dina egna',
        'Börja kopiera det arbete du älskar, kopiera sedan många källor — där olika influenser möts uppstår din unika stil',
        'Kreativa begränsningar är gåvor — gränserna för dina verktyg, tid och medium tvingar fram oväntade och originella lösningar',
      ],
    },
  },
  {
    slug: 'big-magic',
    title: 'Big Magic: Creative Living Beyond Fear',
    author: 'Elizabeth Gilbert',
    year: 2015,
    genre: 'Creativity',
    coverEmoji: '🪄',
    en: {
      description: 'An inspirational guide to living a creatively driven life — arguing that curiosity, not passion, is the more sustainable and accessible fuel for creative work.',
      teaserPoints: [
        'Ideas are alive and seeking a human partner — if you ignore them, they move on to someone else who will act on them',
        'Create for the love of creating, not for success or approval — making outcomes the goal kills the creative joy',
        'Curiosity is more reliable than passion — follow even the faintest interest and see where it leads without pressure',
      ],
    },
    sv: {
      description: 'En inspirerande guide till ett kreativt drivet liv — som hävdar att nyfikenhet, inte passion, är det mer hållbara och tillgängliga bränslet för kreativt arbete.',
      teaserPoints: [
        'Idéer är levande och söker en mänsklig partner — om du ignorerar dem, rör de sig vidare till någon annan som agerar på dem',
        'Skapa för kärleken till att skapa, inte för framgång eller godkännande — att göra utfall till målet dödar den kreativa glädjen',
        'Nyfikenhet är mer pålitlig än passion — följ även det svagaste intresset och se vart det leder utan press',
      ],
    },
  },
  {
    slug: 'the-artists-way',
    title: 'The Artist\'s Way',
    author: 'Julia Cameron',
    year: 1992,
    genre: 'Creativity',
    coverEmoji: '🖌️',
    en: {
      description: 'A twelve-week program for recovering your creativity — with daily Morning Pages and weekly Artist\'s Dates as the core tools for unblocking creative expression.',
      teaserPoints: [
        'Morning Pages — three handwritten stream-of-consciousness pages every morning — drain the mental noise that blocks creativity',
        'Creativity blocks are usually spiritual wounds: old criticism, perfectionism, and fear that must be gently excavated and healed',
        'Artist\'s Dates — solo adventures to feed your creative well — are as essential as output to sustaining creative life',
      ],
    },
    sv: {
      description: 'Ett tolv-veckorsprogram för att återhämta din kreativitet — med dagliga Morgonsidor och veckovisa Konstnärsdatum som kärnverktyg för att avblockera kreativt uttryck.',
      teaserPoints: [
        'Morgonsidor — tre handskrivna medvetandeflödessidor varje morgon — tömmer det mentala brus som blockerar kreativitet',
        'Kreativitetsblock är vanligtvis andliga sår: gammal kritik, perfektionism och rädsla som måste grävas fram och läkas varsamt',
        'Konstnärsdatum — soloäventyr för att mata din kreativa brunn — är lika avgörande som produktion för att upprätthålla kreativt liv',
      ],
    },
  },
  {
    slug: 'show-your-work',
    title: 'Show Your Work!',
    author: 'Austin Kleon',
    year: 2014,
    genre: 'Creativity',
    coverEmoji: '📣',
    en: {
      description: 'A guide to sharing your creative process — arguing that consistently showing your work online attracts collaborators, audiences, and opportunities that staying hidden never will.',
      teaserPoints: [
        'Share the process, not just the finished product — people connect with the journey and the thinking behind the work',
        'Find your community by sharing generously — put out what you would want to receive and the right people will find you',
        'Document everything and share small daily updates — consistent small shares compound into a substantial body of work',
      ],
    },
    sv: {
      description: 'En guide till att dela din kreativa process — som hävdar att konsekvent visa ditt arbete online attraherar samarbetspartners, publik och möjligheter som att förbli dold aldrig gör.',
      teaserPoints: [
        'Dela processen, inte bara den färdiga produkten — människor ansluter till resan och tänkandet bakom verket',
        'Hitta din gemenskap genom att dela generöst — sätt ut vad du vill ta emot och rätt personer hittar dig',
        'Dokumentera allt och dela små dagliga uppdateringar — konsekventa små delningar ackumuleras till ett substantiellt arbete',
      ],
    },
  },
  {
    slug: 'a-whole-new-mind',
    title: 'A Whole New Mind',
    author: 'Daniel H. Pink',
    year: 2005,
    genre: 'Creativity',
    coverEmoji: '🎭',
    en: {
      description: 'A visionary argument that the future belongs to right-brain thinkers — designers, storytellers, and empaths — as left-brain analytic skills become automated and commoditized.',
      teaserPoints: [
        'Six right-brain aptitudes — design, story, symphony, empathy, play, and meaning — will be crucial in the Conceptual Age',
        'As routine analytical work is automated, the ability to create, synthesize, and empathize becomes the primary economic value',
        'The most valuable workers will integrate both left-brain precision and right-brain creative thinking simultaneously',
      ],
    },
    sv: {
      description: 'Ett visionärt argument att framtiden tillhör högerhjärnetänkare — designers, berättare och empatiker — när vänsterhjärnans analytiska färdigheter automatiseras och standardiseras.',
      teaserPoints: [
        'Sex högerhjärneförmågor — design, berättelse, symfoni, empati, lek och mening — kommer att vara avgörande i Konceptuell Ålder',
        'När rutinanalytiskt arbete automatiseras blir förmågan att skapa, syntetisera och empatisera det primära ekonomiska värdet',
        'De mest värdefulla arbetstagarna integrerar både vänsterhjärnans precision och högerhjärnans kreativa tänkande samtidigt',
      ],
    },
  },
  {
    slug: 'nonviolent-communication',
    title: 'Nonviolent Communication',
    author: 'Marshall B. Rosenberg',
    year: 2003,
    genre: 'Communication',
    coverEmoji: '🕊️',
    en: {
      description: 'A compassionate communication framework that transforms conflict by focusing on universal human needs and feelings rather than blame, judgment, and demands.',
      teaserPoints: [
        'Observe without evaluating — describe what you see factually without adding judgments or labels that trigger defensiveness',
        'All human behavior is an attempt to meet universal needs — understanding the need behind an action dissolves conflict',
        'Make requests, not demands — a true request leaves the other person genuinely free to say no without consequence',
      ],
    },
    sv: {
      description: 'Ett empatiskt kommunikationsramverk som omvandlar konflikter genom att fokusera på universella mänskliga behov och känslor snarare än skuld, domar och krav.',
      teaserPoints: [
        'Observera utan att utvärdera — beskriv vad du ser faktamässigt utan att lägga till domar eller etiketter som utlöser försvarsberedskap',
        'Allt mänskligt beteende är ett försök att tillgodose universella behov — att förstå behovet bakom en handling löser upp konflikter',
        'Gör önskemål, inte krav — ett äkta önskemål lämnar den andre genuint fri att säga nej utan konsekvenser',
      ],
    },
  },

  {
    slug: 'crucial-conversations',
    title: 'Crucial Conversations',
    author: 'Kerry Patterson',
    year: 2002,
    genre: 'Communication',
    coverEmoji: '💬',
    en: {
      description: 'A guide to mastering high-stakes conversations — the moments when emotions run strong, opinions differ, and the outcome matters deeply to everyone involved.',
      teaserPoints: [
        'When conversations turn crucial, most people go silent or violent — both responses kill the flow of honest dialogue',
        'Create psychological safety first: others only share their true views when they feel respected and that the intent is mutual success',
        'STATE your path: Share facts, Tell your story, Ask for their path, Talk tentatively, Encourage testing — a framework for honesty',
      ],
    },
    sv: {
      description: 'En guide till att bemästra högrisk-samtal — de ögonblick när känslorna är starka, åsikterna skiljer sig och resultatet spelar stor roll för alla inblandade.',
      teaserPoints: [
        'När samtal blir avgörande väljer de flesta tystnad eller våld — båda reaktionerna dödar flödet av ärlig dialog',
        'Skapa psykologisk trygghet först: andra delar bara sina sanna åsikter när de känner sig respekterade och att avsikten är gemensam framgång',
        'Formulera din väg: dela fakta, berätta din historia, fråga om deras väg, tala tentativt, uppmuntra testning',
      ],
    },
  },
  {
    slug: 'how-to-talk-to-anyone',
    title: 'How to Talk to Anyone',
    author: 'Leil Lowndes',
    year: 1999,
    genre: 'Communication',
    coverEmoji: '🗣️',
    en: {
      description: 'Ninety-two practical techniques for communication success — from first impressions and small talk to projecting charisma and handling difficult conversations.',
      teaserPoints: [
        'The Flooding Smile — a slow, warm smile that spreads across your face — signals genuine pleasure to anyone you meet',
        'Immediately use a person\'s name after being introduced — it signals that they matter and embeds the name in memory',
        'Be a "word detective" — listen for their favorite words and phrases and mirror them back to build instant rapport',
      ],
    },
    sv: {
      description: 'Nittiotvå praktiska tekniker för kommunikationsframgång — från första intryck och småprat till att projicera karisma och hantera svåra samtal.',
      teaserPoints: [
        'Det översvämmande leendet — ett långsamt, varmt leende som sprider sig över ditt ansikte — signalerar äkta glädje till alla du möter',
        'Använd omedelbart en persons namn efter presentation — det signalerar att de spelar roll och bäddar in namnet i minnet',
        'Var en "orddetektiv" — lyssna efter deras favoritord och fraser och spegla dem tillbaka för att bygga omedelbar kontakt',
      ],
    },
  },
  {
    slug: 'the-charisma-myth',
    title: 'The Charisma Myth',
    author: 'Olivia Fox Cabane',
    year: 2012,
    genre: 'Communication',
    coverEmoji: '🌟',
    en: {
      description: 'A science-based guide proving that charisma is not a born trait but a set of learnable behaviors and mental states that anyone can practice and master.',
      teaserPoints: [
        'Charisma rests on three pillars: presence (full attention), power (perceived ability to affect the world), and warmth',
        'Internal state drives external behavior — manage your mind with visualization and reframing before high-stakes interactions',
        'Uncomfortable body language, not insincerity, is the main charisma killer — physical discomfort must be addressed first',
      ],
    },
    sv: {
      description: 'En vetenskapsbaserad guide som bevisar att karisma inte är en medfödd egenskap utan en uppsättning inlärbara beteenden och mentala tillstånd som vem som helst kan öva och bemästra.',
      teaserPoints: [
        'Karisma vilar på tre pelare: närvaro (full uppmärksamhet), makt (uppfattad förmåga att påverka världen) och värme',
        'Internt tillstånd driver externt beteende — hantera ditt sinne med visualisering och ominramning inför högrisk-interaktioner',
        'Obekvämt kroppsspråk, inte oärlighet, är den huvudsakliga karismakillen — fysiskt obehag måste åtgärdas först',
      ],
    },
  },
  {
    slug: 'you-are-a-badass',
    title: 'You Are a Badass',
    author: 'Jen Sincero',
    year: 2013,
    genre: 'Self-Help',
    coverEmoji: '⚡',
    en: {
      description: 'A no-BS guide to stopping self-sabotage and creating the life you want — with humor, blunt honesty, and practical exercises for upgrading your mindset.',
      teaserPoints: [
        'Your subconscious beliefs about money, worthiness, and success were programmed in childhood and are running your life now',
        'The moment you decide to stop apologizing for wanting more and start taking action is the moment everything can change',
        'Surround yourself with people who have what you want — environment is more powerful than willpower for changing behavior',
      ],
    },
    sv: {
      description: 'En rak-på-sak guide till att sluta sabotera sig själv och skapa det liv du vill ha — med humor, ärlig rak text och praktiska övningar för att uppgradera ditt tänkesätt.',
      teaserPoints: [
        'Dina undermedvetna övertygelser om pengar, värdighet och framgång programmerades i barndomen och styr ditt liv nu',
        'Det ögonblick du bestämmer dig för att sluta be om ursäkt för att vilja ha mer och börja agera är det ögonblick allt kan förändras',
        'Omge dig med människor som har vad du vill ha — miljö är kraftfullare än viljestyrka för att förändra beteende',
      ],
    },
  },
  {
    slug: 'attached',
    title: 'Attached',
    author: 'Amir Levine & Rachel Heller',
    year: 2010,
    genre: 'Communication',
    coverEmoji: '💑',
    en: {
      description: 'A guide to adult attachment theory — explaining how three attachment styles (secure, anxious, avoidant) determine relationship patterns and how to build more secure bonds.',
      teaserPoints: [
        'Your attachment style — secure, anxious, or avoidant — was formed in childhood and drives most of your relationship behavior',
        'Anxious and avoidant partners create a destructive cycle: the more one pursues, the more the other withdraws',
        'Secure attachment is learnable — choosing a securely attached partner and practicing honest communication builds security',
      ],
    },
    sv: {
      description: 'En guide till vuxen anknytningsteori — som förklarar hur tre anknytningsmönster (trygg, orolig, undvikande) bestämmer relationsmönster och hur man bygger tryggare band.',
      teaserPoints: [
        'Din anknytningsstil — trygg, orolig eller undvikande — formades i barndomen och driver de flesta av dina relationsbeteenden',
        'Oroliga och undvikande partners skapar en destruktiv cykel: ju mer en söker, desto mer drar den andra sig tillbaka',
        'Trygg anknytning är inlärbar — att välja en tryggt anknuten partner och öva ärlig kommunikation bygger trygghet',
      ],
    },
  },
  {
    slug: 'the-like-switch',
    title: 'The Like Switch',
    author: 'Jack Schafer',
    year: 2015,
    genre: 'Communication',
    coverEmoji: '🤝',
    en: {
      description: 'An ex-FBI behavioral analyst shares the science of instant likability — the nonverbal signals, conversational techniques, and psychological principles used to win over anyone.',
      teaserPoints: [
        'The Golden Rule of Friendship: make people feel good about themselves and they will like you — it is almost automatic',
        'Eyebrow flashes and head tilts are universal "friend signals" that lower defenses and signal you are safe to approach',
        'Listening is more powerful than talking — people who feel truly heard bond deeply and remember the listener fondly',
      ],
    },
    sv: {
      description: 'En fd FBI-beteendeanalytiker delar vetenskapen om omedelbar tillgänglighet — de icke-verbala signalerna, samtalsmetoderna och psykologiska principerna som används för att vinna över vem som helst.',
      teaserPoints: [
        'Vänskaps Gyllene Regel: få människor att må bra om sig själva och de kommer att gilla dig — det är nästan automatiskt',
        'Ögonbrynshöjning och huvudlutning är universella "vänfignaler" som sänker försvaret och signalerar att du är trygg att närma sig',
        'Att lyssna är kraftfullare än att tala — människor som känner sig verkligt hörda knyter an djupt och minns lyssnaren väl',
      ],
    },
  },
  {
    slug: 'just-listen',
    title: 'Just Listen',
    author: 'Mark Goulston',
    year: 2009,
    genre: 'Communication',
    coverEmoji: '👂',
    en: {
      description: 'A psychiatrist\'s guide to reaching anyone — even difficult, irrational, or hostile people — using the science of listening to defuse tension and build instant trust.',
      teaserPoints: [
        'Most people feel chronically unheard — the fastest path to trust is to stop talking, ask questions, and truly listen',
        'The Persuasion Cycle: move people from resistant to listening to considering to willing to acting — meet them at their current state',
        'Use "fill-in-the-blank" questions to get people to open up — "It sounds like you\'re feeling ___ because ___"',
      ],
    },
    sv: {
      description: 'En psykiatrikers guide till att nå vem som helst — till och med svåra, irrationella eller fientliga människor — med hjälp av lyssningsveten för att avspänna spänningar och bygga omedelbar förtroende.',
      teaserPoints: [
        'De flesta känner sig kroniskt ohörda — den snabbaste vägen till förtroende är att sluta prata, ställa frågor och verkligen lyssna',
        'Övertygningscykeln: flytta människor från motsträviga till lyssnande till övervägande till villiga till handlande — möt dem i deras nuvarande tillstånd',
        'Använd "fyll-i-tomrummet"-frågor för att få människor att öppna sig — "Det låter som att du känner ___ för ___"',
      ],
    },
  },

  {
    slug: 'this-is-marketing',
    title: 'This Is Marketing',
    author: 'Seth Godin',
    year: 2018,
    genre: 'Marketing',
    coverEmoji: '📢',
    en: {
      description: 'Seth Godin redefines marketing as finding the smallest viable audience and serving them so well that they choose to spread your message to others like them.',
      teaserPoints: [
        'The goal is not to reach everyone — find the smallest viable audience and serve them with such specificity they become evangelists',
        'Marketing is not advertising — it is making change happen by creating genuine value for people who want what you make',
        'People do not buy products — they buy better versions of themselves; marketing must speak to that internal transformation',
      ],
    },
    sv: {
      description: 'Seth Godin omdefinerar marknadsföring som att hitta den minsta livskraftiga publiken och tjäna dem så väl att de väljer att sprida ditt budskap till andra som dem.',
      teaserPoints: [
        'Målet är inte att nå alla — hitta den minsta livskraftiga publiken och tjäna dem med sådan specificitet att de blir evangelister',
        'Marknadsföring är inte reklam — det är att skapa förändring genom att generera genuint värde för människor som vill ha det du gör',
        'Människor köper inte produkter — de köper bättre versioner av sig själva; marknadsföring måste tala till den inre transformationen',
      ],
    },
  },
  {
    slug: 'contagious',
    title: 'Contagious: Why Things Catch On',
    author: 'Jonah Berger',
    year: 2013,
    genre: 'Marketing',
    coverEmoji: '🦠',
    en: {
      description: 'A professor reveals the six principles behind why some products, ideas, and behaviors go viral — and how to deliberately engineer content that people want to share.',
      teaserPoints: [
        'STEPPS framework: Social Currency, Triggers, Emotion, Public, Practical Value, Stories — the six drivers of shareability',
        'Triggers matter more than the message — tie ideas to cues people encounter daily and they will think of you automatically',
        'High-arousal emotions (awe, anxiety, excitement) drive sharing; low-arousal emotions (sadness, contentment) do not',
      ],
    },
    sv: {
      description: 'En professor avslöjar de sex principerna bakom varför vissa produkter, idéer och beteenden blir virala — och hur man avsiktligt konstruerar innehåll som folk vill dela.',
      teaserPoints: [
        'STEPPS-ramverk: Social Valuta, Utlösare, Känslor, Offentlighet, Praktiskt Värde, Berättelser — de sex drivkrafterna för delbarhet',
        'Utlösare spelar större roll än budskapet — koppla idéer till signaler som folk möter dagligen så tänker de automatiskt på dig',
        'Högarousalemotioner (vördnad, ångest, spänning) driver delning; lågarousalemotioner (sorg, belåtenhet) gör det inte',
      ],
    },
  },
  {
    slug: 'building-a-storybrand',
    title: 'Building a StoryBrand',
    author: 'Donald Miller',
    year: 2017,
    genre: 'Marketing',
    coverEmoji: '📖',
    en: {
      description: 'A seven-part framework using the structure of great stories to clarify brand messaging — positioning the customer as the hero and your brand as the guide who helps them win.',
      teaserPoints: [
        'Your customer is the hero, not your brand — brands that make themselves the hero lose customers who want to be the protagonist',
        'Every story needs a villain — identify the external problem your customer faces, then show the internal and philosophical stakes',
        'The SB7 Framework: character, problem, guide, plan, call to action, failure, success — use it to rewrite all marketing copy',
      ],
    },
    sv: {
      description: 'Ett sjudelat ramverk som använder strukturen från bra berättelser för att klargöra varumärkesbudskapet — med kunden som hjälten och ditt varumärke som guiden som hjälper dem att vinna.',
      teaserPoints: [
        'Din kund är hjälten, inte ditt varumärke — varumärken som gör sig till hjälten förlorar kunder som vill vara protagonisten',
        'Varje berättelse behöver en skurk — identifiera det externa problem din kund möter och visa sedan de interna och filosofiska insatserna',
        'SB7-ramverket: karaktär, problem, guide, plan, uppmaning till handling, misslyckande, framgång — använd det för att skriva om all marknadsföringskopia',
      ],
    },
  },
  {
    slug: 'positioning',
    title: 'Positioning: The Battle for Your Mind',
    author: 'Al Ries & Jack Trout',
    year: 1981,
    genre: 'Marketing',
    coverEmoji: '🎯',
    en: {
      description: 'The classic that introduced the concept of positioning — the idea that marketing is not about the product but about the perception you create in the prospect\'s mind.',
      teaserPoints: [
        'The mind is finite — to succeed you must own a single word or concept in the prospect\'s mind, not try to mean everything',
        'It is easier to win a position that is unoccupied than to unseat a competitor already entrenched in consumers\' minds',
        'Repositioning competitors by changing how prospects perceive them can be more effective than building a new position from scratch',
      ],
    },
    sv: {
      description: 'Klassikern som introducerade konceptet positionering — idén att marknadsföring inte handlar om produkten utan om den uppfattning du skapar i potentiella kunders sinne.',
      teaserPoints: [
        'Sinnet är ändligt — för att lyckas måste du äga ett enda ord eller koncept i kundens sinne, inte försöka betyda allt',
        'Det är lättare att vinna en position som är ledig än att slå ut en konkurrent som redan är förankrad i konsumenternas sinnen',
        'Att ompositonera konkurrenter genom att förändra hur prospects uppfattar dem kan vara mer effektivt än att bygga en ny position från grunden',
      ],
    },
  },
  {
    slug: 'permission-marketing',
    title: 'Permission Marketing',
    author: 'Seth Godin',
    year: 1999,
    genre: 'Marketing',
    coverEmoji: '✉️',
    en: {
      description: 'The book that predicted the future of marketing — arguing that interruption-based advertising is dying and the future belongs to earning permission before delivering messages.',
      teaserPoints: [
        'Interruption marketing is a selfish act — permission marketing earns the right to communicate by offering value first',
        'Anticipated, personal, and relevant messages vastly outperform spray-and-pray advertising across every metric',
        'Build a permission asset — an email list or subscriber base — as the foundation of sustainable marketing growth',
      ],
    },
    sv: {
      description: 'Boken som förutsade marknadsföringens framtid — som hävdade att avbrottsbaserad reklam dör och att framtiden tillhör dem som förtjänar tillstånd innan de levererar budskap.',
      teaserPoints: [
        'Avbrottsmarknadsföring är en självisk handling — tillståndsmarknadsföring förtjänar rätten att kommunicera genom att erbjuda värde först',
        'Förväntade, personliga och relevanta budskap presterar vida bättre än spray-and-pray-reklam på alla mätvärden',
        'Bygg en tillståndstillgång — en e-postlista eller abonnentbas — som grunden för hållbar marknadsföringstillväxt',
      ],
    },
  },
  {
    slug: 'the-22-immutable-laws-of-marketing',
    title: 'The 22 Immutable Laws of Marketing',
    author: 'Al Ries & Jack Trout',
    year: 1993,
    genre: 'Marketing',
    coverEmoji: '📋',
    en: {
      description: 'Twenty-two fundamental principles that govern how brands succeed or fail in the marketplace — contrarian, clear, and validated by decades of business history.',
      teaserPoints: [
        'The Law of Leadership: it is better to be first than to be better — the pioneer has an enormous and lasting advantage',
        'The Law of the Category: if you cannot be first in an existing category, create a new category where you can be first',
        'The Law of Focus: the most powerful concept in marketing is owning a word in the prospect\'s mind — one word, one benefit',
      ],
    },
    sv: {
      description: 'Tjugotvå grundläggande principer som styr hur varumärken lyckas eller misslyckas på marknaden — kontrarianska, tydliga och validerade av decennier av affärshistoria.',
      teaserPoints: [
        'Ledarskapslagen: det är bättre att vara först än att vara bäst — pionjären har en enorm och varaktig fördel',
        'Kategorilagen: om du inte kan vara först i en befintlig kategori, skapa en ny kategori där du kan vara först',
        'Fokuslagen: det kraftfullaste konceptet i marknadsföring är att äga ett ord i kundens sinne — ett ord, en fördel',
      ],
    },
  },
  {
    slug: 'expert-secrets',
    title: 'Expert Secrets',
    author: 'Russell Brunson',
    year: 2017,
    genre: 'Marketing',
    coverEmoji: '🎙️',
    en: {
      description: 'A guide to turning your knowledge and expertise into an online business — using storytelling, community building, and funnel-based marketing to create a mass movement.',
      teaserPoints: [
        'Expert businesses are built on a charismatic leader, a future-based cause, and a new opportunity — not just a better solution',
        'Your backstory matters more than your credentials — share the journey of your own transformation to attract true believers',
        'Create a movement, not just a customer base — people buy into a mission; the product is just the vehicle for the transformation',
      ],
    },
    sv: {
      description: 'En guide till att förvandla din kunskap och expertis till ett onlineföretag — med storytelling, community-byggande och tratt-baserad marknadsföring för att skapa en massrörelse.',
      teaserPoints: [
        'Expertföretag byggs på en karismatisk ledare, ett framtidsbaserat syfte och en ny möjlighet — inte bara en bättre lösning',
        'Din backstory spelar större roll än dina meriter — dela resan av din egen transformation för att attrahera äkta troende',
        'Skapa en rörelse, inte bara en kundbas — människor köper in sig i ett uppdrag; produkten är bara fordonet för transformationen',
      ],
    },
  },

  {
    slug: 'the-checklist-manifesto',
    title: 'The Checklist Manifesto',
    author: 'Atul Gawande',
    year: 2009,
    genre: 'Productivity',
    coverEmoji: '✅',
    en: {
      description: 'A surgeon\'s argument that checklists — simple, humble lists — are one of the most powerful tools available for reducing failure in complex, high-stakes environments.',
      teaserPoints: [
        'Human error in complex systems is rarely stupidity — it is the inevitable result of the limits of memory and attention',
        'Checklists pause the expert long enough to catch routine omissions that expertise and habit make invisible',
        'Aviation, surgery, and construction all show that checklists reduce errors not by limiting professionals but by empowering them',
      ],
    },
    sv: {
      description: 'En kirurgs argument för att checklistor — enkla, ödmjuka listor — är ett av de kraftfullaste verktygen för att minska misslyckanden i komplexa, högrisksmiljöer.',
      teaserPoints: [
        'Mänskliga fel i komplexa system är sällan dumhet — det är det oundvikliga resultatet av minnets och uppmärksamhetens begränsningar',
        'Checklistor pausar experten tillräckligt länge för att fånga rutinmässiga utelämnanden som expertis och vana gör osynliga',
        'Flyget, kirurgi och byggande visar alla att checklistor minskar fel inte genom att begränsa yrkespersoner utan genom att stärka dem',
      ],
    },
  },
  {
    slug: 'indistractable',
    title: 'Indistractable',
    author: 'Nir Eyal',
    year: 2019,
    genre: 'Productivity',
    coverEmoji: '🎯',
    en: {
      description: 'A guide to becoming indistractable — understanding that distraction is never about external triggers but about managing the internal discomfort we are trying to escape.',
      teaserPoints: [
        'All distraction is an attempt to escape discomfort — manage the internal triggers (boredom, anxiety, uncertainty) first',
        'Timeboxing is more powerful than to-do lists — schedule every hour of your day with values-aligned activities in advance',
        'Make internal pacts, effort pacts, and price pacts with yourself and others to create friction around distracting behaviors',
      ],
    },
    sv: {
      description: 'En guide till att bli ostörbar — att förstå att distraktion aldrig handlar om externa utlösare utan om att hantera det interna obehag vi försöker fly.',
      teaserPoints: [
        'All distraktion är ett försök att fly obehag — hantera de interna utlösarna (tristess, ångest, osäkerhet) först',
        'Tidsboxning är kraftfullare än att-göra-listor — schemalägg varje timme av din dag med värdebaserade aktiviteter i förväg',
        'Gör interna pakter, ansträngningspakter och prispakter med dig själv och andra för att skapa friktion kring distraherande beteenden',
      ],
    },
  },
  {
    slug: 'eat-that-frog',
    title: 'Eat That Frog!',
    author: 'Brian Tracy',
    year: 2001,
    genre: 'Productivity',
    coverEmoji: '🐸',
    en: {
      description: 'Twenty-one practical techniques for overcoming procrastination — built around the principle that the most important task of the day should be done first, without exception.',
      teaserPoints: [
        'Your "frog" is your biggest, most important task — eat it first thing in the morning before anything else gets in the way',
        'The 80/20 rule for time: 20% of tasks produce 80% of results — ruthlessly identify and prioritize those high-value activities',
        'Single-handling — starting and completing one task without switching — dramatically outperforms multitasking in all contexts',
      ],
    },
    sv: {
      description: 'Tjugoett praktiska tekniker för att övervinna prokrastinering — byggt kring principen att dagens viktigaste uppgift ska göras först, utan undantag.',
      teaserPoints: [
        'Din "groda" är din största, viktigaste uppgift — ät den direkt på morgonen innan något annat kommer i vägen',
        '80/20-regeln för tid: 20% av uppgifterna producerar 80% av resultaten — identifiera och prioritera dessa högt värderade aktiviteter hänsynslöst',
        'Enkel hantering — att starta och slutföra en uppgift utan att byta — presterar dramatiskt bättre än multitasking i alla sammanhang',
      ],
    },
  },
  {
    slug: 'the-miracle-morning',
    title: 'The Miracle Morning',
    author: 'Hal Elrod',
    year: 2012,
    genre: 'Productivity',
    coverEmoji: '🌅',
    en: {
      description: 'A morning routine system built on six Life S.A.V.E.R.S. practices — Silence, Affirmations, Visualization, Exercise, Reading, Scribing — completed before 8am each day.',
      teaserPoints: [
        'How you start your morning sets the trajectory for everything that follows — winning the morning wins the day',
        'SAVERS: Silence (meditation), Affirmations, Visualization, Exercise, Reading, Scribing — six practices in 60 minutes',
        'The 5-Second Rule for mornings: count down 5-4-3-2-1 and physically move before the snooze reflex takes hold',
      ],
    },
    sv: {
      description: 'Ett morgonrutinsystem byggt på sex Life S.A.V.E.R.S.-praktiker — Tystnad, Affirmationer, Visualisering, Motion, Läsning, Skrivning — avklarade före kl 8 varje dag.',
      teaserPoints: [
        'Hur du startar din morgon sätter trajektorin för allt som följer — att vinna morgonen vinner dagen',
        'SAVERS: Tystnad (meditation), Affirmationer, Visualisering, Motion, Läsning, Skrivning — sex praktiker på 60 minuter',
        '5-sekund-regeln för morgnar: räkna ner 5-4-3-2-1 och rör dig fysiskt innan snooze-reflexen tar över',
      ],
    },
  },
  {
    slug: 'buy-back-your-time',
    title: 'Buy Back Your Time',
    author: 'Dan Martell',
    year: 2023,
    genre: 'Productivity',
    coverEmoji: '⌚',
    en: {
      description: 'A framework for entrepreneurs to reclaim their time by delegating effectively — calculating your buyback rate and hiring to eliminate low-value tasks that drain your energy.',
      teaserPoints: [
        'Calculate your buyback rate: your target hourly value divided by 4 — delegate any task you can hire out for less than that',
        'The DRIP Matrix maps tasks by energy level and dollar-per-hour value — delegate the bottom quadrants without guilt',
        'Hiring is not an expense but a multiplier — the right hire in the right seat returns 10x in freed time and mental bandwidth',
      ],
    },
    sv: {
      description: 'Ett ramverk för entreprenörer att återta sin tid genom att delegera effektivt — beräkna din återköpskurs och anställa för att eliminera lågvärdesuppgifter som tömmer din energi.',
      teaserPoints: [
        'Beräkna din återköpskurs: ditt målvärde per timme delat med 4 — delegera uppgifter du kan hyra ut för mindre än det',
        'DRIP-matrisen kartlägger uppgifter efter energinivå och krona-per-timme-värde — delegera bottenkvadranterna utan skuld',
        'Anställning är inte en kostnad utan en multiplikator — rätt anställning på rätt plats ger 10x i frigjord tid och mental kapacitet',
      ],
    },
  },
  {
    slug: 'the-12-week-year',
    title: 'The 12 Week Year',
    author: 'Brian P. Moran',
    year: 2013,
    genre: 'Productivity',
    coverEmoji: '📅',
    en: {
      description: 'A planning system that treats each 12-week period as its own year — creating the urgency and focus of year-end pressure throughout the entire cycle, not just December.',
      teaserPoints: [
        'Annualized thinking kills urgency — a 12-week year creates the deadline pressure that drives peak performance year-round',
        'Most people miss their annual goals in the first quarter then coast — 12-week cycles expose and fix this drift immediately',
        'Weekly scoring against your 12-week plan gives the leading indicator data needed to adjust before it is too late to recover',
      ],
    },
    sv: {
      description: 'Ett planeringssystem som behandlar varje 12-veckorsperiod som ett eget år — skapar den brådska och fokus som årsslutets press normalt ger, under hela cykeln.',
      teaserPoints: [
        'Årsbaserat tänkande dödar brådska — ett 12-veckors år skapar den deadlinespress som driver toppprestanda året runt',
        'De flesta missar sina årliga mål under första kvartalet och sedan seglar de — 12-veckors cykler avslöjar och åtgärdar denna drift omedelbart',
        'Veckopoängsättning mot din 12-veckorsplan ger de ledande indikatordata som behövs för att justera innan det är för sent att återhämta sig',
      ],
    },
  },
  {
    slug: 'a-world-without-email',
    title: 'A World Without Email',
    author: 'Cal Newport',
    year: 2021,
    genre: 'Productivity',
    coverEmoji: '📵',
    en: {
      description: 'Cal Newport argues that the hyperactive hive mind workflow — constant email and chat — is destroying productivity and knowledge work, and offers a structured alternative.',
      teaserPoints: [
        'The hyperactive hive mind — responding to messages as they arrive — fragments attention and makes deep work nearly impossible',
        'Attention capital theory: the greatest returns come from deploying human brains in states of uninterrupted concentration',
        'Structured workflow processes — regular check-ins, project boards, asynchronous protocols — can replace the email tsunami',
      ],
    },
    sv: {
      description: 'Cal Newport hävdar att det hyperaktiva binalsinnesarbetsflödet — konstant e-post och chatt — förstör produktivitet och kunskapsarbete, och erbjuder ett strukturerat alternativ.',
      teaserPoints: [
        'Det hyperaktiva binalsinnet — att svara på meddelanden när de anländer — fragmenterar uppmärksamheten och gör djupt arbete nästan omöjligt',
        'Uppmärksamhetskapitalteori: de största avkastningarna kommer från att använda mänskliga hjärnor i tillstånd av oavbruten koncentration',
        'Strukturerade arbetsflödesprocesser — regelbundna incheckningar, projektbräden, asynkrona protokoll — kan ersätta e-posttsunamin',
      ],
    },
  },

  {
    slug: 'mindset',
    title: 'Mindset: The New Psychology of Success',
    author: 'Carol S. Dweck',
    year: 2006,
    genre: 'Psychology',
    coverEmoji: '🌱',
    en: {
      description: 'Stanford psychologist Carol Dweck reveals that one idea — the belief that abilities can be developed — unlocks achievement, resilience, and deeper satisfaction in every domain.',
      teaserPoints: [
        'Fixed mindset sees abilities as carved in stone; growth mindset sees them as developable through effort and strategy',
        'Praising effort and process, not talent, builds growth mindset in children — "you worked so hard" beats "you are so smart"',
        'Failure is information in the growth mindset: a signal to try harder, try differently, or seek better strategies',
      ],
    },
    sv: {
      description: 'Stanfordpsykologen Carol Dweck avslöjar att en idé — tron att förmågor kan utvecklas — låser upp prestation, motståndskraft och djupare tillfredsställelse inom alla områden.',
      teaserPoints: [
        'Fixerat tänkesätt ser förmågor som huggna i sten; tillväxttänkesätt ser dem som utvecklingsbara genom ansträngning och strategi',
        'Att berömma ansträngning och process, inte talang, bygger tillväxttänkesätt hos barn — "du jobbade så hårt" slår "du är så smart"',
        'Misslyckande är information i tillväxttänkesättet: en signal att försöka hårdare, försöka annorlunda eller söka bättre strategier',
      ],
    },
  },
  {
    slug: 'zero-to-one',
    title: 'Zero to One',
    author: 'Peter Thiel',
    year: 2014,
    genre: 'Business',
    coverEmoji: '🚀',
    en: {
      description: 'Peter Thiel argues that true innovation creates something genuinely new — going from zero to one — rather than copying what works, which only adds more of the same.',
      teaserPoints: [
        'Competition is for losers — monopoly is the goal; great businesses carve out a unique space where they face no direct rivals',
        'Going from 0 to 1 (creating something new) is harder and more valuable than going from 1 to n (scaling what exists)',
        'The founding team\'s culture and the ability to ask contrarian questions — "what important truth do very few people agree with?" — define startup success',
      ],
    },
    sv: {
      description: 'Peter Thiel hävdar att sann innovation skapar något genuint nytt — att gå från noll till ett — snarare än att kopiera det som fungerar, vilket bara lägger till mer av samma sak.',
      teaserPoints: [
        'Konkurrens är för förlorare — monopol är målet; bra företag skapar ett unikt utrymme där de inte möter direkta rivaler',
        'Att gå från 0 till 1 (skapa något nytt) är svårare och mer värdefullt än att gå från 1 till n (skala det som finns)',
        'Grundarteamets kultur och förmågan att ställa kontrarianska frågor — "vilken viktig sanning är det väldigt få som håller med om?" — definierar startup-framgång',
      ],
    },
  },
  {
    slug: 'range',
    title: 'Range: Why Generalists Triumph in a Specialized World',
    author: 'David Epstein',
    year: 2019,
    genre: 'Self-Help',
    coverEmoji: '🌐',
    en: {
      description: 'A counter-intuitive argument that in most complex fields, breadth of experience — sampling widely before specializing — produces more creativity and adaptability than early specialization.',
      teaserPoints: [
        'In "wicked" domains where rules are unclear and feedback is delayed, generalists outperform early specialists',
        'Late specialization leads to greater career success on average — breadth of experience builds pattern recognition across domains',
        'The best innovators have wide peripheral knowledge that lets them connect ideas across fields that specialists never see',
      ],
    },
    sv: {
      description: 'Ett kontraintuitivt argument att i de flesta komplexa områden producerar bredd av erfarenhet — att prova brett innan specialisering — mer kreativitet och anpassningsförmåga än tidig specialisering.',
      teaserPoints: [
        'I "elaka" domäner där reglerna är oklara och feedback är försenad, presterar generalister bättre än tidiga specialister',
        'Sen specialisering leder i genomsnitt till större karriärframgång — bredd av erfarenhet bygger mönsterigenkänning över domäner',
        'De bästa innovatörerna har bred perifer kunskap som låter dem koppla samman idéer över fält som specialister aldrig ser',
      ],
    },
  },
  {
    slug: 'algorithms-to-live-by',
    title: 'Algorithms to Live By',
    author: 'Brian Christian & Tom Griffiths',
    year: 2016,
    genre: 'Science',
    coverEmoji: '💻',
    en: {
      description: 'Computer science algorithms applied to everyday human decision-making — from when to stop searching for an apartment to how to organize your closet or manage your to-do list.',
      teaserPoints: [
        'The 37% Rule: explore options for 37% of your decision window, then commit to the best option seen after that point',
        'Sorting is expensive — sometimes a "good enough" messy system is more efficient than a perfectly organized one',
        'Caching, scheduling, and randomization from computer science offer provably optimal strategies for human life decisions',
      ],
    },
    sv: {
      description: 'Datorvetenskapliga algoritmer tillämpade på vardagliga mänskliga beslut — från när man ska sluta söka efter en lägenhet till hur man organiserar sin garderob.',
      teaserPoints: [
        '37%-regeln: utforska alternativ under 37% av ditt beslutsfönster, bind dig sedan till det bästa alternativet du sett efter den punkten',
        'Sortering är dyrt — ibland är ett "bra nog" rörigt system mer effektivt än ett perfekt organiserat',
        'Caching, schemaläggning och randomisering från datavetenskap erbjuder bevisbart optimala strategier för mänskliga livsbeslut',
      ],
    },
  },
  {
    slug: 'the-design-of-everyday-things',
    title: 'The Design of Everyday Things',
    author: 'Don Norman',
    year: 1988,
    genre: 'Science',
    coverEmoji: '🚪',
    en: {
      description: 'The classic that revealed why bad design makes us feel stupid — and the principles of human-centered design that make objects, interfaces, and systems intuitive to use.',
      teaserPoints: [
        'When you cannot figure out how to use something, it is the design\'s fault — good design makes affordances obvious without instructions',
        'The two gulfs of design: the Gulf of Execution (can I do what I intend?) and the Gulf of Evaluation (did the device do it?)',
        'Forcing functions, feedback, and constraints are design tools that prevent error and guide users toward correct action',
      ],
    },
    sv: {
      description: 'Klassikern som avslöjade varför dålig design får oss att känna oss dumma — och principerna för mänsklig-centrerad design som gör objekt, gränssnitt och system intuitiva att använda.',
      teaserPoints: [
        'När du inte kan lista ut hur man använder något är det designens fel — bra design gör möjligheter uppenbara utan instruktioner',
        'Designens två klyftor: Exekveringens klyfta (kan jag göra vad jag avser?) och Utvärderingens klyfta (gjorde enheten det?)',
        'Tvångsfunktioner, feedback och begränsningar är designverktyg som förhindrar fel och vägleder användare mot korrekt handling',
      ],
    },
  },
  {
    slug: 'stolen-focus',
    title: 'Stolen Focus',
    author: 'Johann Hari',
    year: 2022,
    genre: 'Self-Help',
    coverEmoji: '🔍',
    en: {
      description: 'A journalist investigates why humanity\'s ability to pay attention is collapsing — interviewing scientists, psychologists, and tech insiders to find systemic causes and solutions.',
      teaserPoints: [
        'Attention collapse is not a personal failing — it is being engineered by business models designed to maximize engagement at all costs',
        'Pre-reading, mind wandering, and boredom are not problems to solve but necessary conditions for deep thought and creativity',
        'Systemic solutions — regulating tech, restructuring schools, and redesigning work — are needed alongside individual strategies',
      ],
    },
    sv: {
      description: 'En journalist undersöker varför mänsklighetens förmåga att uppmärksamma kollapsar — intervjuar forskare, psykologer och tech-insiders för att hitta systemiska orsaker och lösningar.',
      teaserPoints: [
        'Uppmärksamhetskollaps är inte ett personligt misslyckande — det konstrueras av affärsmodeller designade för att maximera engagemang till varje pris',
        'Förläsning, sinnesvandrande och tristess är inte problem att lösa utan nödvändiga förutsättningar för djupt tänkande och kreativitet',
        'Systemlösningar — reglering av tech, omstrukturering av skolor och omdesign av arbete — behövs vid sidan av individuella strategier',
      ],
    },
  },
  {
    slug: 'essentialism',
    title: 'Essentialism: The Disciplined Pursuit of Less',
    author: 'Greg McKeown',
    year: 2014,
    genre: 'Productivity',
    coverEmoji: '🎯',
    en: {
      description: 'A philosophy of focusing only on the essential — less but better — and the disciplined practice of eliminating everything that does not contribute to your highest point of contribution.',
      teaserPoints: [
        'The essentialist makes only a few deliberate choices but executes them superbly — breadth without depth is noise',
        'If it isn\'t a clear "Hell Yes!", it\'s a "No" — anything short of total enthusiasm is a drain on your most precious resource: focus',
        'The paradox of success: the options and obligations that success creates are the very things that prevent future success',
      ],
    },
    sv: {
      description: 'En filosofi om att fokusera bara på det väsentliga — mindre men bättre — och den disciplinerade praktiken att eliminera allt som inte bidrar till din högsta bidragspunkt.',
      teaserPoints: [
        'Essentialisten gör bara ett fåtal avsiktliga val men genomför dem suveränt — bredd utan djup är brus',
        'Om det inte är ett tydligt "Helvetes ja!", är det ett "Nej" — allt kortare än total entusiasm är ett dränerande av din mest dyrbara resurs: fokus',
        'Framgångens paradox: de möjligheter och skyldigheter som framgång skapar är precis det som hindrar framtida framgång',
      ],
    },
  },

  {
    slug: 'thinking-in-systems',
    title: 'Thinking in Systems',
    author: 'Donella H. Meadows',
    year: 2008,
    genre: 'Science',
    coverEmoji: '🔄',
    en: {
      description: 'A primer on systems thinking — the discipline of seeing the structures, feedback loops, and delays that drive complex behavior in organizations, ecosystems, and economies.',
      teaserPoints: [
        'Systems are made of stocks, flows, and feedback loops — understanding these three elements explains most complex behavior',
        'Counterintuitive behavior arises in systems because causes and effects are often separated in time and space',
        'Leverage points in systems — places where small shifts produce large changes — are usually counter-intuitive and non-obvious',
      ],
    },
    sv: {
      description: 'En primer om systemtänkande — disciplinen att se strukturerna, återkopplingsslingorna och fördröjningarna som driver komplext beteende i organisationer, ekosystem och ekonomier.',
      teaserPoints: [
        'System består av lager, flöden och återkopplingsslingor — att förstå dessa tre element förklarar de flesta komplexa beteenden',
        'Kontraintuitivt beteende uppstår i system eftersom orsaker och effekter ofta är åtskilda i tid och rum',
        'Hävstångspunkter i system — ställen där små förändringar producerar stora förändringar — är vanligtvis kontraintuitiva och icke-uppenbara',
      ],
    },
  },
  {
    slug: 'factfulness',
    title: 'Factfulness',
    author: 'Hans Rosling',
    year: 2018,
    genre: 'Science',
    coverEmoji: '📊',
    en: {
      description: 'An urgently optimistic book showing — with data — that the world is in far better shape than our instincts and the media suggest, and teaching ten habits of factful thinking.',
      teaserPoints: [
        'Almost everyone is wrong about global progress — child mortality, extreme poverty, and literacy have all improved dramatically',
        'The world divides not into "developed" and "developing" but into four income levels — most people live in the middle',
        'Ten instinct-driven biases (gap, negativity, straight-line) consistently cause us to misread the world — learn to override them',
      ],
    },
    sv: {
      description: 'En brådskande optimistisk bok som visar — med data — att världen befinner sig i mycket bättre form än våra instinkter och media föreslår, och lär ut tio vanor av faktabaserat tänkande.',
      teaserPoints: [
        'Nästan alla har fel om globala framsteg — barnadödlighet, extrem fattigdom och läskunnighet har alla förbättrats dramatiskt',
        'Världen delas inte i "utvecklad" och "utvecklingsland" utan i fyra inkomstnivåer — de flesta lever i mitten',
        'Tio instinktdrivna fördomar (klyfta, negativitet, rät linje) får oss konsekvent att misstolka världen — lär dig att åsidosätta dem',
      ],
    },
  },
  {
    slug: 'good-to-great',
    title: 'Good to Great',
    author: 'Jim Collins',
    year: 2001,
    genre: 'Business',
    coverEmoji: '🏆',
    en: {
      description: 'A five-year research study identifying what separates truly great companies from merely good ones — uncovering timeless principles of disciplined people, thought, and action.',
      teaserPoints: [
        'Level 5 Leadership: the greatest leaders combine fierce professional will with deep personal humility — ego is the enemy',
        'First who, then what: get the right people on the bus before deciding direction — great companies hire character before skill',
        'The Flywheel Effect: greatness comes not from one defining moment but from consistent effort that builds unstoppable momentum',
      ],
    },
    sv: {
      description: 'En femårig forskningsstudie som identifierar vad som skiljer verkligt bra företag från bara bra — och avslöjar tidlösa principer för disciplinerade människor, tanke och handling.',
      teaserPoints: [
        'Nivå 5 Ledarskap: de största ledarna kombinerar hård professionell vilja med djup personlig ödmjukhet — ego är fienden',
        'Först vem, sedan vad: få rätt människor på bussen innan du bestämmer riktning — bra företag anställer karaktär före färdighet',
        'Svänghulseffekten: storhet kommer inte från ett avgörande ögonblick utan från konsekvent ansträngning som bygger oemotståndlig fart',
      ],
    },
  },
  {
    slug: 'the-hard-thing-about-hard-things',
    title: 'The Hard Thing About Hard Things',
    author: 'Ben Horowitz',
    year: 2014,
    genre: 'Business',
    coverEmoji: '⚔️',
    en: {
      description: 'Unvarnished advice for startup CEOs about the hardest parts of leadership — from laying off employees and managing your own psychology to competing and making impossible decisions.',
      teaserPoints: [
        'There are no silver bullets — only lead bullets; when facing hard problems, execution and persistence beat clever strategy',
        'Managing your own psychology is the CEO\'s most difficult and most important job — the company cannot see you panicking',
        'Peacetime and wartime CEOs require completely different leadership styles — the skills that build may not be the skills that survive',
      ],
    },
    sv: {
      description: 'Ohöljda råd för startup-VD:ar om de svåraste delarna av ledarskap — från att säga upp anställda och hantera sin egen psykologi till att konkurrera och fatta omöjliga beslut.',
      teaserPoints: [
        'Det finns inga silverkutsar — bara blykutsar; när man möter svåra problem slår genomförande och envishet klyftig strategi',
        'Att hantera sin egen psykologi är VD:ns svåraste och viktigaste jobb — företaget kan inte se dig panikslagna',
        'Fredstids- och krigstids-VD:ar kräver helt olika ledarskapstilar — de färdigheter som bygger kanske inte är de som överlever',
      ],
    },
  },
  {
    slug: 'fooled-by-randomness',
    title: 'Fooled by Randomness',
    author: 'Nassim Nicholas Taleb',
    year: 2001,
    genre: 'Psychology',
    coverEmoji: '🎰',
    en: {
      description: 'Taleb\'s exploration of how we systematically underestimate the role of luck and randomness in our lives — mistaking noise for signal and lucky fools for skilled masters.',
      teaserPoints: [
        'Survivorship bias: we see only winners and infer skill, but we cannot see the vast cemetery of identical strategies that failed',
        'Our brains are wired to find patterns and narratives — we construct stories of causation where only correlation or chance existed',
        'Rare, high-impact events (Black Swans) dominate outcomes far more than the normal day-to-day variation we obsess over',
      ],
    },
    sv: {
      description: 'Talebs utforskning av hur vi systematiskt underskattar slumpens och turen roll i våra liv — förväxlar brus med signal och lyckliga dårar med skickliga mästare.',
      teaserPoints: [
        'Överlevnadsbias: vi ser bara vinnare och slutleder skicklighet, men vi kan inte se den enorma begravningsplatsen av identiska strategier som misslyckades',
        'Våra hjärnor är kopplade för att hitta mönster och berättelser — vi konstruerar orsakssamband där bara korrelation eller slump existerade',
        'Sällsynta, högeffekthändelser (Svarta Svanar) dominerar utfall långt mer än den normala dag-till-dag-variationen vi är besatta av',
      ],
    },
  },
  {
    slug: 'poor-economics',
    title: 'Poor Economics',
    author: 'Abhijit Banerjee & Esther Duflo',
    year: 2011,
    genre: 'Science',
    coverEmoji: '🌍',
    en: {
      description: 'Nobel Prize-winning economists use randomized controlled trials to reveal what actually works in fighting global poverty — replacing ideology with evidence.',
      teaserPoints: [
        'The poor face rational economic constraints, not irrational choices — understanding their context reveals why they behave as they do',
        'Small nudges like free bed nets or subsidized fertilizer can break poverty traps more effectively than large aid programs',
        'Evidence from randomized trials beats both the "aid is useless" and "pour in more money" camps with actual data',
      ],
    },
    sv: {
      description: 'Nobelprisbelönta ekonomer använder randomiserade kontrollerade experiment för att avslöja vad som faktiskt fungerar i kampen mot global fattigdom — ersätter ideologi med bevis.',
      teaserPoints: [
        'De fattiga möter rationella ekonomiska begränsningar, inte irrationella val — att förstå deras sammanhang avslöjar varför de beter sig som de gör',
        'Små knuffar som gratis sängnät eller subventionerat gödningsmedel kan bryta fattigdomsfällor mer effektivt än stora biståndspaket',
        'Bevis från randomiserade försök slår både "bistånd är värdelöst"- och "häll in mer pengar"-lägren med faktiska data',
      ],
    },
  },

  {
    slug: 'the-four-hour-workweek',
    title: 'The 4-Hour Workweek',
    author: 'Timothy Ferriss',
    year: 2007,
    genre: 'Self-Help',
    coverEmoji: '🏖️',
    en: {
      description: 'A manifesto for escaping the 9-to-5 grind through outsourcing, automation, and geographic arbitrage — redefining retirement as distributed mini-retirements throughout life.',
      teaserPoints: [
        'The New Rich are not those with the most money but those with the most time and freedom — lifestyle design beats deferred living',
        'The 80/20 rule for work: identify the 20% of tasks that produce 80% of results and ruthlessly eliminate the rest',
        'Outsourcing personal and business tasks to virtual assistants creates leverage that multiplies your effective hourly output',
      ],
    },
    sv: {
      description: 'Ett manifest för att fly 9-till-5-treadmillen genom outsourcing, automatisering och geografisk arbitrage — omdefinierar pension som distribuerade minipensionerringar genom livet.',
      teaserPoints: [
        'De Nya Rika är inte de med mest pengar utan de med mest tid och frihet — livsstilsdesign slår uppskjutet levande',
        '80/20-regeln för arbete: identifiera de 20% av uppgifter som producerar 80% av resultaten och eliminera resten hänsynslöst',
        'Outsourcing av personliga och affärsmässiga uppgifter till virtuella assistenter skapar hävstång som multiplicerar din effektiva timproduktion',
      ],
    },
  },
  {
    slug: 'the-status-game',
    title: 'The Status Game',
    author: 'Will Storr',
    year: 2021,
    genre: 'Psychology',
    coverEmoji: '👑',
    en: {
      description: 'An exploration of how status-seeking is hardwired into the human brain — and how our obsessive pursuit of standing within groups shapes politics, culture, and conflict.',
      teaserPoints: [
        'Humans are status-seeking animals — the drive for relative standing within groups is one of our most powerful motivators',
        'There are three routes to status: dominance (coercion), virtue (moral reputation), and success (competence and achievement)',
        'Moral outrage is often status competition in disguise — attacking others elevates the attacker\'s relative standing in their group',
      ],
    },
    sv: {
      description: 'En utforskning av hur statussökande är hårdkodat i den mänskliga hjärnan — och hur vår besatta jakt på ställning inom grupper formar politik, kultur och konflikter.',
      teaserPoints: [
        'Människor är statussökande djur — drivkraften för relativ ställning inom grupper är en av våra kraftfullaste motivatorer',
        'Det finns tre vägar till status: dominans (tvång), dygd (moraliskt rykte) och framgång (kompetens och prestation)',
        'Moralisk indignation är ofta statuskonkurrens i förklädnad — att attackera andra höjer angreparens relativa ställning i gruppen',
      ],
    },
  },
  {
    slug: 'the-expectation-effect',
    title: 'The Expectation Effect',
    author: 'David Robson',
    year: 2022,
    genre: 'Psychology',
    coverEmoji: '🔮',
    en: {
      description: 'How the science of expectation reveals that our beliefs about stress, aging, exercise, and medicine profoundly shape our physical and mental outcomes.',
      teaserPoints: [
        'The placebo effect is not a trick — expectations trigger real physiological changes in pain, immune function, and performance',
        'Believing stress is enhancing rather than debilitating changes your cortisol response and improves cognitive performance',
        'Age stereotypes become self-fulfilling prophecies — people who hold positive views of aging live an average of 7.5 years longer',
      ],
    },
    sv: {
      description: 'Hur förväntningarnas vetenskap avslöjar att våra övertygelser om stress, åldrande, träning och medicin djupt formar våra fysiska och mentala utfall.',
      teaserPoints: [
        'Placeboeffekten är inte ett trick — förväntningar utlöser verkliga fysiologiska förändringar i smärta, immunfunktion och prestation',
        'Att tro att stress är stärkande snarare än försvagande förändrar ditt kortisolsvar och förbättrar kognitiv prestation',
        'Åldersstereotyper blir självuppfyllande profetior — människor som har positiva syn på åldrande lever i genomsnitt 7,5 år längre',
      ],
    },
  },
  {
    slug: 'the-personal-mba',
    title: 'The Personal MBA',
    author: 'Josh Kaufman',
    year: 2010,
    genre: 'Business',
    coverEmoji: '🎓',
    en: {
      description: 'A comprehensive guide to core business concepts — arguing that a $250,000 MBA can be replaced with $250 worth of self-directed reading and deliberate practice.',
      teaserPoints: [
        'Every business creates and delivers value, attracts customers, exchanges that value for money, and produces enough profit to continue',
        'Mental models from psychology, economics, and systems thinking matter far more for business success than specialized MBA knowledge',
        'Prototyping and iteration — building quickly, learning fast, and improving relentlessly — beats extensive upfront planning',
      ],
    },
    sv: {
      description: 'En omfattande guide till centrala affärskoncept — som hävdar att en MBA-utbildning till 3 miljoner kronor kan ersättas med 2 500 kronors självdirigerat läsande och avsiktlig övning.',
      teaserPoints: [
        'Varje företag skapar och levererar värde, attraherar kunder, utbyter det värdet mot pengar och producerar tillräcklig vinst för att fortsätta',
        'Mentala modeller från psykologi, ekonomi och systemtänkande spelar mycket större roll för affärsframgång än specialiserad MBA-kunskap',
        'Prototypning och iteration — snabbt bygga, lära fort och förbättra obevekligt — slår extensiv förhandsplanering',
      ],
    },
  },
  {
    slug: 'the-coddling-of-the-american-mind',
    title: 'The Coddling of the American Mind',
    author: 'Greg Lukianoff & Jonathan Haidt',
    year: 2018,
    genre: 'Psychology',
    coverEmoji: '🫧',
    en: {
      description: 'An examination of how three bad ideas — "what doesn\'t kill you makes you weaker," "always trust your feelings," and "life is a battle between good and evil people" — are damaging a generation.',
      teaserPoints: [
        'Safetyism and overprotection prevent children from developing the resilience and cognitive skills they need to thrive as adults',
        'Cognitive behavioral therapy\'s core insight: thoughts are not facts — learning to challenge distorted thoughts builds mental robustness',
        'Antifragile children need adversity, unsupervised play, and the experience of working through discomfort to develop healthily',
      ],
    },
    sv: {
      description: 'En granskning av hur tre dåliga idéer — "det som inte dödar dig gör dig svagare," "lita alltid på dina känslor," och "livet är en kamp mellan goda och onda människor" — skadar en generation.',
      teaserPoints: [
        'Säkerhetsism och överskydd hindrar barn från att utveckla den motståndskraft och de kognitiva färdigheter de behöver för att trivas som vuxna',
        'KBT:s centrala insikt: tankar är inte fakta — att lära sig utmana distorderade tankar bygger mental robusthet',
        'Antifragila barn behöver motgångar, oövervakat lek och erfarenheten av att arbeta sig igenom obehag för att utvecklas hälsosamt',
      ],
    },
  },
  {
    slug: 'flow',
    title: 'Flow: The Psychology of Optimal Experience',
    author: 'Mihaly Csikszentmihalyi',
    year: 1990,
    genre: 'Psychology',
    coverEmoji: '🌊',
    en: {
      description: 'The landmark study of the optimal experience called "flow" — the state of complete absorption in a challenging activity — and how to structure life to create more of it.',
      teaserPoints: [
        'Flow occurs at the intersection of high challenge and high skill — tasks too easy bring boredom, too hard bring anxiety',
        'Happiness is not found in relaxation but in the full engagement of your capacities toward a meaningful, difficult goal',
        'You can design your work and leisure toward flow by seeking activities with clear goals, immediate feedback, and appropriate challenge',
      ],
    },
    sv: {
      description: 'Den banbrytande studien av den optimala upplevelsen kallad "flow" — tillståndet av fullständig absorption i en utmanande aktivitet — och hur man strukturerar livet för att skapa mer av det.',
      teaserPoints: [
        'Flow uppstår i skärningspunkten mellan hög utmaning och hög färdighet — uppgifter som är för lätta ger tristess, för svåra ger ångest',
        'Lycka finns inte i avkoppling utan i fullständigt engagemang av dina kapaciteter mot ett meningsfullt, svårt mål',
        'Du kan designa ditt arbete och din fritid mot flow genom att söka aktiviteter med tydliga mål, omedelbar feedback och lämplig utmaning',
      ],
    },
  },
]
