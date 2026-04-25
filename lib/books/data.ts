/**
 * Static book data for programmatic SEO pages.
 * Each entry generates /books/[slug] (EN) and /sv/books/[slug] (SV).
 */

import { EXTRA_BOOKS } from './data-extra'

export interface BookLocale {
  description: string
  teaserPoints: [string, string, string]
}

export interface Book {
  slug: string
  title: string
  author: string
  year: number
  genre: string
  coverEmoji: string
  en: BookLocale
  sv: BookLocale
}

const BOOKS_CORE: Book[] = [
  {
    slug: 'atomic-habits',
    title: 'Atomic Habits',
    author: 'James Clear',
    year: 2018,
    genre: 'Productivity',
    coverEmoji: '⚡',
    en: {
      description: 'A practical guide to building good habits and breaking bad ones through small, 1% improvements that compound into remarkable results over time.',
      teaserPoints: [
        'The 1% rule: tiny daily improvements compound into extraordinary results over months',
        'Habit stacking — link new behaviors to existing routines for effortless adoption',
        'Environment design matters more than willpower: shape your space, shape your habits',
      ],
    },
    sv: {
      description: 'En praktisk guide till att bygga goda vanor och bryta dåliga genom små, 1%-förbättringar som med tiden skapar enastående resultat.',
      teaserPoints: [
        '1%-regeln: dagliga mikroförbättringar förstärks exponentiellt över tid',
        'Vanekedja — koppla nya beteenden till befintliga rutiner för friktionsfri förändring',
        'Miljödesign slår viljestyrka: forma din omgivning och dina vanor formar sig själva',
      ],
    },
  },
  {
    slug: 'thinking-fast-and-slow',
    title: 'Thinking, Fast and Slow',
    author: 'Daniel Kahneman',
    year: 2011,
    genre: 'Psychology',
    coverEmoji: '🧠',
    en: {
      description: 'Nobel laureate Daniel Kahneman explores the two systems that drive the way we think — fast, intuitive System 1 and slow, deliberate System 2 — and how biases shape our decisions.',
      teaserPoints: [
        'System 1 vs System 2: understanding which mode of thinking is controlling you right now',
        'Cognitive biases like anchoring and availability heuristic distort every judgment you make',
        'Loss aversion makes losses feel twice as powerful as equivalent gains — and how to counter it',
      ],
    },
    sv: {
      description: 'Nobelpristagaren Daniel Kahneman utforskar de två system som styr vårt tänkande — det snabba, intuitiva System 1 och det långsamma, analytiska System 2 — och hur kognitiva bias formar våra beslut.',
      teaserPoints: [
        'System 1 vs System 2: förstå vilket tankesätt som styr dig just nu',
        'Kognitiva bias som ankringseffekten förvrider varje bedömning du gör',
        'Förlustaversion gör förluster dubbelt så kännbara som vinster — och hur du motverkar det',
      ],
    },
  },
  {
    slug: 'deep-work',
    title: 'Deep Work',
    author: 'Cal Newport',
    year: 2016,
    genre: 'Productivity',
    coverEmoji: '🎯',
    en: {
      description: 'Cal Newport argues that the ability to focus without distraction on cognitively demanding tasks is the superpower of the 21st century — and shows you how to cultivate it.',
      teaserPoints: [
        'Deep work is rare and valuable: most knowledge workers have lost the ability to truly concentrate',
        'Four philosophies of deep work scheduling — find the one that fits your life',
        'Digital minimalism and attention management as competitive advantages in the modern economy',
      ],
    },
    sv: {
      description: 'Cal Newport argumenterar för att förmågan att fokusera djupt på kognitivt krävande arbete är 2000-talets superkraft — och visar hur du odlar den.',
      teaserPoints: [
        'Djupt arbete är sällsynt och värdefullt: de flesta kunskapsarbetare har tappat förmågan att verkligen koncentrera sig',
        'Fyra filosofier för djupt arbetsschema — hitta den som passar ditt liv',
        'Digital minimalism och uppmärksamhetshantering som konkurrensfördelar i den moderna ekonomin',
      ],
    },
  },
  {
    slug: 'the-lean-startup',
    title: 'The Lean Startup',
    author: 'Eric Ries',
    year: 2011,
    genre: 'Business',
    coverEmoji: '🚀',
    en: {
      description: 'Eric Ries introduces the Build-Measure-Learn feedback loop and validated learning as the foundation for building startups that actually survive and grow in conditions of extreme uncertainty.',
      teaserPoints: [
        'Build-Measure-Learn: the scientific method applied to startup product development',
        'The MVP mindset: test your riskiest assumptions with the least amount of work',
        'Pivot vs. persevere: how to make the most critical startup decision with data, not gut feeling',
      ],
    },
    sv: {
      description: 'Eric Ries introducerar Bygg-Mät-Lär-återkopplingsslingan och validerat lärande som grund för att bygga startups som faktiskt överlever och växer under extrem osäkerhet.',
      teaserPoints: [
        'Bygg-Mät-Lär: den vetenskapliga metoden applicerad på produktutveckling i startups',
        'MVP-tankesättet: testa dina riskablaste antaganden med minsta möjliga arbete',
        'Pivotera eller håll kurs: hur du fattar startupens viktigaste beslut med data, inte magkänsla',
      ],
    },
  },
  {
    slug: 'zero-to-one',
    title: 'Zero to One',
    author: 'Peter Thiel',
    year: 2014,
    genre: 'Business',
    coverEmoji: '1️⃣',
    en: {
      description: 'Peter Thiel challenges entrepreneurs to create something genuinely new rather than copying existing models. True innovation means going from zero to one — creating a monopoly in a new market.',
      teaserPoints: [
        'Competition is for losers: the best businesses are monopolies that create entirely new categories',
        'Secrets still exist — the most valuable companies are built on insights others have missed',
        'The power law of venture capital: one investment will outperform all others combined',
      ],
    },
    sv: {
      description: 'Peter Thiel utmanar entreprenörer att skapa något genuint nytt snarare än att kopiera befintliga modeller. Sann innovation innebär att gå från noll till ett — att skapa ett monopol på en ny marknad.',
      teaserPoints: [
        'Konkurrens är för förlorare: de bästa företagen är monopol som skapar helt nya kategorier',
        'Hemligheter finns fortfarande — de mest värdefulla företagen byggs på insikter andra missat',
        'Riskkapitalets potenslagsdistribution: en investering överpresterar alla andra tillsammans',
      ],
    },
  },
  {
    slug: 'the-psychology-of-money',
    title: 'The Psychology of Money',
    author: 'Morgan Housel',
    year: 2020,
    genre: 'Finance',
    coverEmoji: '💰',
    en: {
      description: 'Morgan Housel shows that financial success has less to do with intelligence or math and more to do with behavior — how you think about money, risk, and time.',
      teaserPoints: [
        'Getting wealthy and staying wealthy require two completely different skill sets',
        'Compounding is the most powerful force in finance — but requires patience most people lack',
        'Your personal experience with money shapes your financial worldview more than any textbook',
      ],
    },
    sv: {
      description: 'Morgan Housel visar att ekonomisk framgång har mindre med intelligens eller matematik att göra och mer med beteende — hur du tänker om pengar, risk och tid.',
      teaserPoints: [
        'Att bli rik och att förbli rik kräver två helt olika färdigheter',
        'Ränta-på-ränta är finansernas kraftfullaste kraft — men kräver tålamod som de flesta saknar',
        'Dina personliga erfarenheter av pengar formar din finansiella världsbild mer än någon lärobok',
      ],
    },
  },
  {
    slug: 'start-with-why',
    title: 'Start with Why',
    author: 'Simon Sinek',
    year: 2009,
    genre: 'Leadership',
    coverEmoji: '❓',
    en: {
      description: 'Simon Sinek reveals the Golden Circle — Why, How, What — and explains why the most inspiring leaders and organizations communicate from the inside out, starting with purpose.',
      teaserPoints: [
        'The Golden Circle: Why → How → What. Most organizations communicate backwards',
        'People don\'t buy what you do, they buy why you do it — and this applies to teams too',
        'Finding your WHY is the foundation for authentic leadership and lasting loyalty',
      ],
    },
    sv: {
      description: 'Simon Sinek avslöjar den Gyllene Cirkeln — Varför, Hur, Vad — och förklarar varför de mest inspirerande ledarna och organisationerna kommunicerar inifrån och ut, med syfte som utgångspunkt.',
      teaserPoints: [
        'Den Gyllene Cirkeln: Varför → Hur → Vad. De flesta organisationer kommunicerar bakvänt',
        'Människor köper inte vad du gör, de köper varför du gör det — gäller även team',
        'Att hitta ditt VARFÖR är grunden för autentiskt ledarskap och varaktig lojalitet',
      ],
    },
  },
  {
    slug: 'never-split-the-difference',
    title: 'Never Split the Difference',
    author: 'Chris Voss',
    year: 2016,
    genre: 'Negotiation',
    coverEmoji: '🤝',
    en: {
      description: 'Former FBI hostage negotiator Chris Voss reveals field-tested negotiation tactics you can use in business and everyday life — tactical empathy, calibrated questions, and mirroring.',
      teaserPoints: [
        'Tactical empathy: making the other side feel understood is the fastest path to agreement',
        'Calibrated questions starting with "How" and "What" reveal information while keeping control',
        'The power of "No": getting a no is often the beginning of a real negotiation, not the end',
      ],
    },
    sv: {
      description: 'Tidigare FBI-gisslanförhandlare Chris Voss avslöjar fältbeprövade förhandlingstaktiker som du kan använda i affärslivet och vardagen — taktisk empati, kalibrerade frågor och spegling.',
      teaserPoints: [
        'Taktisk empati: att få motparten att känna sig förstådd är den snabbaste vägen till överenskommelse',
        'Kalibrerade frågor som börjar med "Hur" och "Vad" avslöjar information och behåller kontrollen',
        'Kraften i "Nej": ett nej är ofta starten på en riktig förhandling, inte slutet',
      ],
    },
  },
  {
    slug: 'sapiens',
    title: 'Sapiens: A Brief History of Humankind',
    author: 'Yuval Noah Harari',
    year: 2011,
    genre: 'History',
    coverEmoji: '🌍',
    en: {
      description: 'Yuval Noah Harari traces the history of our species from the Cognitive Revolution 70,000 years ago through the Agricultural and Scientific Revolutions to the present day.',
      teaserPoints: [
        'The Cognitive Revolution: why Homo sapiens outcompeted all other human species',
        'Shared myths — money, nations, corporations — are what allow millions of strangers to cooperate',
        'The Agricultural Revolution may have been history\'s greatest fraud: harder lives for individuals, more power for the species',
      ],
    },
    sv: {
      description: 'Yuval Noah Harari spårar vår arts historia från den kognitiva revolutionen för 70 000 år sedan genom jordbruks- och vetenskapliga revolutionerna till nutid.',
      teaserPoints: [
        'Den kognitiva revolutionen: varför Homo sapiens överträffade alla andra mänskliga arter',
        'Delade myter — pengar, nationer, företag — är det som tillåter miljoner främlingar att samarbeta',
        'Jordbruksrevolutionen kan ha varit historiens största bedrägeri: svårare liv för individer, mer makt för arten',
      ],
    },
  },
  {
    slug: 'the-power-of-habit',
    title: 'The Power of Habit',
    author: 'Charles Duhigg',
    year: 2012,
    genre: 'Psychology',
    coverEmoji: '🔄',
    en: {
      description: 'Charles Duhigg explores the science behind habit formation — the habit loop of cue, routine, and reward — and how understanding it can transform individuals, organizations, and societies.',
      teaserPoints: [
        'The habit loop: cue → routine → reward. Change the routine while keeping the cue and reward',
        'Keystone habits: some habits trigger cascades of positive change throughout your entire life',
        'Willpower is a muscle that can be strengthened — and it depletes under stress and decision fatigue',
      ],
    },
    sv: {
      description: 'Charles Duhigg utforskar vetenskapen bakom vanornas bildande — vaneslingan av signal, rutin och belöning — och hur förståelse av den kan förändra individer, organisationer och samhällen.',
      teaserPoints: [
        'Vaneslingan: signal → rutin → belöning. Byt rutin men behåll signal och belöning',
        'Nyckelvanor: vissa vanor utlöser kaskader av positiv förändring i hela ditt liv',
        'Viljestyrka är en muskel som kan stärkas — och töms under stress och beslutströtthet',
      ],
    },
  },
  {
    slug: 'influence',
    title: 'Influence: The Psychology of Persuasion',
    author: 'Robert Cialdini',
    year: 1984,
    genre: 'Psychology',
    coverEmoji: '🎭',
    en: {
      description: 'Robert Cialdini identifies six universal principles of persuasion — reciprocity, commitment, social proof, authority, liking, and scarcity — and how they\'re used to influence behavior.',
      teaserPoints: [
        'Six weapons of influence: once you know them, you\'ll see them used on you every single day',
        'Social proof: we look to others\' behavior especially in uncertain situations — a double-edged sword',
        'The contrast principle: perception is relative, and savvy influencers exploit this relentlessly',
      ],
    },
    sv: {
      description: 'Robert Cialdini identifierar sex universella principer för övertygelse — ömsesidighet, åtagande, socialt bevis, auktoritet, sympati och knapphet — och hur de används för att påverka beteende.',
      teaserPoints: [
        'Sex påverkansvapen: när du väl känner till dem ser du dem användas mot dig varje dag',
        'Socialt bevis: vi tittar på andras beteende särskilt i osäkra situationer — ett tveeggat svärd',
        'Kontrastprincipen: uppfattning är relativ, och skickliga påverkare utnyttjar detta hänsynslöst',
      ],
    },
  },
  {
    slug: 'good-to-great',
    title: 'Good to Great',
    author: 'Jim Collins',
    year: 2001,
    genre: 'Business',
    coverEmoji: '📈',
    en: {
      description: 'Jim Collins and his team studied 1,435 companies to identify what made a select few leap from good to great results that lasted at least 15 years — and the surprising commonalities they found.',
      teaserPoints: [
        'Level 5 Leadership: the most effective leaders combine fierce professional will with personal humility',
        'First who, then what: get the right people on the bus before deciding where to drive',
        'The Hedgehog Concept: where passion, best-in-world potential, and economic engine overlap',
      ],
    },
    sv: {
      description: 'Jim Collins och hans team studerade 1 435 företag för att identifiera vad som gjorde ett fåtal av dem till lysande framgångar som varade i minst 15 år — och de överraskande gemensamma dragen de fann.',
      teaserPoints: [
        'Nivå 5-ledarskap: de mest effektiva ledarna kombinerar intensiv professionell vilja med personlig ödmjukhet',
        'Först vem, sedan vad: sätt rätt personer på bussen innan du bestämmer vart du ska köra',
        'Igelkottsprincipen: där passion, världsbästa potential och ekonomisk motor sammanfaller',
      ],
    },
  },
  {
    slug: 'principles',
    title: 'Principles: Life and Work',
    author: 'Ray Dalio',
    year: 2017,
    genre: 'Business',
    coverEmoji: '📐',
    en: {
      description: 'Billionaire investor Ray Dalio shares the unconventional principles that helped him build Bridgewater Associates into the world\'s largest hedge fund and live an extraordinary life.',
      teaserPoints: [
        'Radical transparency and radical open-mindedness as organizational superpowers',
        'Pain + Reflection = Progress: your most painful moments are your greatest learning opportunities',
        'Decision-making algorithms: reduce costly emotional decision-making by systematizing choices',
      ],
    },
    sv: {
      description: 'Miljardärsinvesteraren Ray Dalio delar de okonventionella principer som hjälpte honom bygga Bridgewater Associates till världens största hedgefond och leva ett extraordinärt liv.',
      teaserPoints: [
        'Radikal transparens och radikal öppenhet som organisatoriska superkrafter',
        'Smärta + Reflektion = Framsteg: dina mest smärtsamma ögonblick är dina största lärtillfällen',
        'Beslutsalgoritmer: minska kostsamt emotionellt beslutsfattande genom att systematisera val',
      ],
    },
  },
  {
    slug: 'drive',
    title: 'Drive: The Surprising Truth About What Motivates Us',
    author: 'Daniel Pink',
    year: 2009,
    genre: 'Psychology',
    coverEmoji: '🏎️',
    en: {
      description: 'Daniel Pink challenges the carrot-and-stick model of motivation and argues that for 21st-century knowledge work, intrinsic motivation — autonomy, mastery, and purpose — outperforms rewards and punishments.',
      teaserPoints: [
        'Extrinsic rewards can crush intrinsic motivation for creative work — the overjustification effect',
        'Autonomy, mastery, and purpose are the three elements of genuine motivation in knowledge work',
        'The Goldilocks principle for flow: tasks just challenging enough to keep you engaged but not overwhelmed',
      ],
    },
    sv: {
      description: 'Daniel Pink utmanar morot-och-piska-modellen för motivation och argumenterar för att inre motivation — autonomi, mästerskap och syfte — överträffar belöningar och straff för 2000-talets kunskapsarbete.',
      teaserPoints: [
        'Yttre belöningar kan krossa inre motivation för kreativt arbete — överjustifieringseffekten',
        'Autonomi, mästerskap och syfte är de tre elementen i genuin motivation i kunskapsarbete',
        'Guldlockar-principen för flow: uppgifter tillräckligt utmanande för att hålla dig engagerad men inte överväldigad',
      ],
    },
  },
  {
    slug: 'mans-search-for-meaning',
    title: "Man's Search for Meaning",
    author: 'Viktor Frankl',
    year: 1946,
    genre: 'Philosophy',
    coverEmoji: '🕯️',
    en: {
      description: 'Holocaust survivor Viktor Frankl recounts his experiences in Nazi concentration camps and introduces logotherapy — the idea that the primary human drive is the search for meaning, not pleasure.',
      teaserPoints: [
        'Between stimulus and response there is a space — in that space lies our freedom and power to choose',
        'Logotherapy: meaning can be found even in suffering, and this meaning sustains life',
        'The last of human freedoms is the ability to choose one\'s attitude in any given set of circumstances',
      ],
    },
    sv: {
      description: 'Förintelsens överlevare Viktor Frankl berättar om sina erfarenheter i nazistiska koncentrationsläger och introducerar logoterapi — idén att det primära mänskliga drivkraften är sökandet efter mening, inte njutning.',
      teaserPoints: [
        'Mellan stimulus och respons finns ett utrymme — i det utrymmet ligger vår frihet och makt att välja',
        'Logoterapi: mening kan hittas även i lidande, och denna mening upprätthåller livet',
        'Den sista mänskliga friheten är förmågan att välja sin inställning under vilka omständigheter som helst',
      ],
    },
  },
  {
    slug: 'outliers',
    title: 'Outliers: The Story of Success',
    author: 'Malcolm Gladwell',
    year: 2008,
    genre: 'Psychology',
    coverEmoji: '🌟',
    en: {
      description: 'Malcolm Gladwell examines the factors that contribute to high levels of success, revealing that talent and ambition alone are not enough — opportunity, culture, and timing matter enormously.',
      teaserPoints: [
        'The 10,000-Hour Rule: world-class expertise requires roughly 10,000 hours of deliberate practice',
        'The Matthew Effect: small advantages in early life compound into massive differences in outcomes',
        'Cultural legacy shapes behavior in ways invisible to those inside it — including success patterns',
      ],
    },
    sv: {
      description: 'Malcolm Gladwell undersöker de faktorer som bidrar till höga framgångsnivåer och avslöjar att talang och ambition ensamt inte räcker — möjligheter, kultur och timing spelar enorm roll.',
      teaserPoints: [
        '10 000-timmarsregeln: expertis i världsklass kräver ungefär 10 000 timmar av avsiktlig träning',
        'Matteus-effekten: små fördelar tidigt i livet förstärks till enorma skillnader i utfall',
        'Kulturellt arv formar beteende på sätt som är osynliga för dem som lever inuti det — inklusive framgångsmönster',
      ],
    },
  },
  {
    slug: 'mindset',
    title: 'Mindset: The New Psychology of Success',
    author: 'Carol Dweck',
    year: 2006,
    genre: 'Psychology',
    coverEmoji: '🌱',
    en: {
      description: 'Stanford psychologist Carol Dweck presents her research on fixed vs. growth mindsets — and shows that believing your abilities can be developed is the foundation of almost all human achievement.',
      teaserPoints: [
        'Fixed vs. growth mindset: one belief about ability changes everything about how you live and learn',
        'Praising effort rather than intelligence creates resilience and a love of challenges in children',
        'The growth mindset can be learned at any age — but requires catching and changing your fixed-mindset triggers',
      ],
    },
    sv: {
      description: 'Stanfordpsykologen Carol Dweck presenterar sin forskning om statiskt kontra dynamiskt tankesätt — och visar att tron på att ens förmågor kan utvecklas är grunden för nästan alla mänskliga prestationer.',
      teaserPoints: [
        'Statiskt vs. dynamiskt tankesätt: en tro om förmåga förändrar allt om hur du lever och lär dig',
        'Att berömma ansträngning snarare än intelligens skapar motståndskraft och kärlek till utmaningar hos barn',
        'Det dynamiska tankesättet kan läras in i alla åldrar — men kräver att du identifierar och förändrar dina statiska triggers',
      ],
    },
  },
  {
    slug: 'why-we-sleep',
    title: 'Why We Sleep',
    author: 'Matthew Walker',
    year: 2017,
    genre: 'Science',
    coverEmoji: '😴',
    en: {
      description: 'Neuroscientist Matthew Walker reveals the science of sleep and its profound impact on every aspect of your mental and physical health, performance, and longevity.',
      teaserPoints: [
        'Sleep deprivation is catastrophic: just one night of six hours impairs cognition as much as 24 hours awake',
        'REM sleep consolidates emotional memories and enables creative problem-solving and insight',
        'Caffeine, alcohol, and screens all sabotage sleep architecture in ways most people don\'t realize',
      ],
    },
    sv: {
      description: 'Neurovetaren Matthew Walker avslöjar sömnvetenskapen och dess djupgående påverkan på alla aspekter av din mentala och fysiska hälsa, prestation och livslängd.',
      teaserPoints: [
        'Sömnbrist är katastrofalt: bara en natt med sex timmars sömn försämrar kognition lika mycket som 24 timmars vakenhet',
        'REM-sömn konsoliderar emotionella minnen och möjliggör kreativ problemlösning och insikt',
        'Koffein, alkohol och skärmar saboterar sömnarkitekturen på sätt de flesta inte inser',
      ],
    },
  },
  {
    slug: 'the-obstacle-is-the-way',
    title: 'The Obstacle Is the Way',
    author: 'Ryan Holiday',
    year: 2014,
    genre: 'Philosophy',
    coverEmoji: '🪨',
    en: {
      description: 'Ryan Holiday draws on Stoic philosophy and historical examples to show that every obstacle contains an opportunity — and that our perception, action, and will determine how we respond to adversity.',
      teaserPoints: [
        'Perception is the first problem: change how you see the obstacle and you change everything',
        'Action is the response: iterate, persist, and find the way forward through — not around — the obstacle',
        'Will is the inner citadel: what happens to you matters far less than how you respond to it',
      ],
    },
    sv: {
      description: 'Ryan Holiday hämtar från stoisk filosofi och historiska exempel för att visa att varje hinder innehåller en möjlighet — och att vår uppfattning, handling och vilja avgör hur vi svarar på motgångar.',
      teaserPoints: [
        'Uppfattning är det första problemet: ändra hur du ser på hindret och du ändrar allt',
        'Handling är svaret: iterera, uthärda och hitta vägen framåt genom — inte runt — hindret',
        'Vilja är den inre citadellet: vad som händer dig spelar mycket mindre roll än hur du svarar på det',
      ],
    },
  },
  {
    slug: 'the-4-hour-workweek',
    title: 'The 4-Hour Workweek',
    author: 'Tim Ferriss',
    year: 2007,
    genre: 'Lifestyle',
    coverEmoji: '🏖️',
    en: {
      description: 'Tim Ferriss challenges the "deferred life plan" and presents DEAL — Definition, Elimination, Automation, Liberation — as the framework for escaping the 9-to-5 grind and designing your ideal lifestyle.',
      teaserPoints: [
        'The 80/20 principle applied ruthlessly: 20% of work produces 80% of results — cut the rest',
        'Outsourcing and automation free you from tasks that don\'t require your unique skills',
        'Mini-retirements spread throughout life beat saving everything for a retirement you may not enjoy',
      ],
    },
    sv: {
      description: 'Tim Ferriss utmanar den "uppskjutna livsplanen" och presenterar DEAL — Definition, Eliminering, Automatisering, Befrielse — som ramverk för att fly 9-till-5-grinden och designa ditt idealiska liv.',
      teaserPoints: [
        '80/20-principen applicerad hänsynslöst: 20% av arbetet producerar 80% av resultaten — skär bort resten',
        'Outsourcing och automatisering befriar dig från uppgifter som inte kräver dina unika färdigheter',
        'Mini-pensioneringar spridda genom livet är bättre än att spara allt till en pension du kanske inte njuter av',
      ],
    },
  },
  {
    slug: 'how-to-win-friends-and-influence-people',
    title: 'How to Win Friends and Influence People',
    author: 'Dale Carnegie',
    year: 1936,
    genre: 'Communication',
    coverEmoji: '🤗',
    en: {
      description: 'Dale Carnegie\'s timeless classic on human relations reveals that success depends more on your ability to connect with people than on technical knowledge — and gives you the principles to do it.',
      teaserPoints: [
        'Never criticize, condemn, or complain: these approaches never work and always damage relationships',
        'Become genuinely interested in other people — it\'s the single most important social skill',
        'Remember names, listen actively, and make others feel important — these are superpowers in disguise',
      ],
    },
    sv: {
      description: 'Dale Carnegies tidlösa klassiker om mänskliga relationer avslöjar att framgång beror mer på din förmåga att skapa kontakt med människor än på teknisk kunskap — och ger dig principerna för att göra det.',
      teaserPoints: [
        'Kritisera, döm eller klaga aldrig: dessa metoder fungerar aldrig och skadar alltid relationer',
        'Bli genuint intresserad av andra människor — det är den viktigaste sociala färdigheten',
        'Kom ihåg namn, lyssna aktivt och få andra att känna sig viktiga — dolda superkrafter',
      ],
    },
  },
  {
    slug: 'quiet',
    title: 'Quiet: The Power of Introverts in a World That Can\'t Stop Talking',
    author: 'Susan Cain',
    year: 2012,
    genre: 'Psychology',
    coverEmoji: '🤫',
    en: {
      description: 'Susan Cain challenges the Extrovert Ideal that dominates Western culture and makes a powerful case for the undervalued strengths of introverts — in leadership, creativity, and relationships.',
      teaserPoints: [
        'One third to one half of people are introverts — yet most schools and offices are designed for extroverts',
        'The New Groupthink myth: brainstorming and open offices actually reduce individual creative output',
        'Introverts often make the best leaders precisely because they listen before they speak',
      ],
    },
    sv: {
      description: 'Susan Cain utmanar det extroverta ideal som dominerar västerländsk kultur och pläderar kraftfullt för de undervärderade styrkorna hos introverta — i ledarskap, kreativitet och relationer.',
      teaserPoints: [
        'En tredjedel till hälften av alla människor är introverta — ändå är de flesta skolor och kontor designade för extroverta',
        'Det nya grupptänkmyten: brainstorming och öppna kontorslandskap minskar faktiskt individuell kreativ output',
        'Introverta är ofta de bästa ledarna just för att de lyssnar innan de pratar',
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
      description: 'Psychologist Mihaly Csikszentmihalyi describes the state of "flow" — complete absorption in a challenging activity — and how to design your work and life to experience more of it.',
      teaserPoints: [
        'Flow occurs when challenge and skill are in balance: too easy creates boredom, too hard creates anxiety',
        'Autotelic activities — done for their own sake — are the greatest sources of sustainable happiness',
        'Attention is a finite resource: how you direct it is how you construct the quality of your experience',
      ],
    },
    sv: {
      description: 'Psykologen Mihaly Csikszentmihalyi beskriver tillståndet av "flow" — fullständig absorption i en utmanande aktivitet — och hur du designar ditt arbete och liv för att uppleva mer av det.',
      teaserPoints: [
        'Flow uppstår när utmaning och färdighet är i balans: för lätt skapar tristess, för svårt skapar ångest',
        'Autoteliska aktiviteter — gjorda för sin egen skull — är de största källorna till hållbar lycka',
        'Uppmärksamhet är en ändlig resurs: hur du riktar den är hur du konstruerar kvaliteten på din upplevelse',
      ],
    },
  },
  {
    slug: 'the-checklist-manifesto',
    title: 'The Checklist Manifesto',
    author: 'Atul Gawande',
    year: 2009,
    genre:'Science',
    coverEmoji: '✅',
    en: {
      description: 'Surgeon Atul Gawande shows that simple checklists — used by pilots, surgeons, and engineers — are one of the most powerful tools for reducing error and improving performance in complex environments.',
      teaserPoints: [
        'Even experts make avoidable errors: checklists save lives in medicine, aviation, and finance',
        'Two types of problems — those you can solve with training, and those that require communication and coordination',
        'The art of designing a good checklist: short enough to use, precise enough to catch critical errors',
      ],
    },
    sv: {
      description: 'Kirurgen Atul Gawande visar att enkla checklistor — som används av piloter, kirurger och ingenjörer — är ett av de kraftfullaste verktygen för att minska fel och förbättra prestation i komplexa miljöer.',
      teaserPoints: [
        'Även experter gör undvikbara misstag: checklistor räddar liv inom medicin, luftfart och finans',
        'Två typer av problem — de du kan lösa med träning, och de som kräver kommunikation och koordination',
        'Konsten att designa en bra checklista: kort nog att använda, exakt nog att fånga kritiska fel',
      ],
    },
  },
  {
    slug: 'thinking-in-systems',
    title: 'Thinking in Systems',
    author: 'Donella Meadows',
    year: 2008,
    genre: 'Science',
    coverEmoji: '⚙️',
    en: {
      description: 'Systems thinker Donella Meadows provides a powerful primer on systems thinking — feedback loops, stocks and flows, and leverage points — to help you understand and change complex systems.',
      teaserPoints: [
        'Stocks and flows: the basic building blocks of every system, from economies to ecosystems',
        'Feedback loops — reinforcing and balancing — explain why systems behave in counterintuitive ways',
        'Leverage points: where a small change can produce big shifts in system behavior — and why they\'re often counterintuitive',
      ],
    },
    sv: {
      description: 'Systemtänkaren Donella Meadows ger en kraftfull introduktion till systemtänkande — återkopplingsslingor, lager och flöden och hävstångspunkter — för att hjälpa dig förstå och förändra komplexa system.',
      teaserPoints: [
        'Lager och flöden: grundläggande byggstenar i varje system, från ekonomier till ekosystem',
        'Återkopplingsslingor — förstärkande och balanserande — förklarar varför system beter sig på kontraintuitiva sätt',
        'Hävstångspunkter: där en liten förändring kan producera stora skiften i systembeteende — och varför de ofta är kontraintuitiva',
      ],
    },
  },
  {
    slug: 'daring-greatly',
    title: 'Daring Greatly',
    author: 'Brené Brown',
    year: 2012,
    genre: 'Self-Help',
    coverEmoji: '💪',
    en: {
      description: 'Research professor Brené Brown argues that vulnerability — the willingness to show up and be seen when there are no guarantees — is not weakness but the birthplace of courage, creativity, and connection.',
      teaserPoints: [
        'Vulnerability is not weakness — it is the most accurate measure of courage',
        'Shame resilience: learning to recognize shame, name it, and share your story with trusted others',
        'Wholehearted living: cultivating worthiness and belonging rather than striving for perfect and fitting in',
      ],
    },
    sv: {
      description: 'Forskningsprofessorn Brené Brown argumenterar för att sårbarhet — viljan att dyka upp och synas utan garantier — inte är svaghet utan födelseplatsen för mod, kreativitet och kontakt.',
      teaserPoints: [
        'Sårbarhet är inte svaghet — det är det mest exakta måttet på mod',
        'Skamresiliens: lära sig känna igen skam, namnge den och dela din historia med betrodda andra',
        'Helhjärtat levande: odla värdighet och tillhörighet snarare än att sträva efter perfekt och passa in',
      ],
    },
  },
  {
    slug: 'range',
    title: 'Range: Why Generalists Triumph in a Specialized World',
    author: 'David Epstein',
    year: 2019,
    genre: 'Science',
    coverEmoji: '🎨',
    en: {
      description: 'David Epstein challenges the "10,000 hours" narrative and makes the case that generalists — people with wide experience across multiple domains — are actually better suited for our complex, unpredictable world.',
      teaserPoints: [
        'Kind vs. wicked learning environments: deliberate practice works for chess, not for most of life',
        'Late specialization often produces better long-term outcomes than early specialization — sampling is valuable',
        'Analogical thinking across domains is the hallmark of creative breakthroughs in science and business',
      ],
    },
    sv: {
      description: 'David Epstein utmanar "10 000 timmar"-narrativet och pläderar för att generalister — människor med bred erfarenhet över flera domäner — faktiskt är bättre lämpade för vår komplexa, oförutsägbara värld.',
      teaserPoints: [
        'Snälla vs. elaka lärandemiljöer: avsiktlig träning fungerar för schack, inte för de flesta saker i livet',
        'Sen specialisering ger ofta bättre långsiktiga resultat än tidig specialisering — provandet är värdefullt',
        'Analogiskt tänkande över domäner är kännetecknet för kreativa genombrott inom vetenskap och affärsliv',
      ],
    },
  },
  {
    slug: 'the-hard-thing-about-hard-things',
    title: 'The Hard Thing About Hard Things',
    author: 'Ben Horowitz',
    year: 2014,
    genre: 'Business',
    coverEmoji: '😤',
    en: {
      description: 'Venture capitalist Ben Horowitz shares raw, unfiltered advice on the toughest challenges of running a startup — layoffs, demotions, board fights, and the psychological toll of leadership.',
      teaserPoints: [
        'There is no formula for running a company — the hard things are hard precisely because no one has figured them out',
        'Taking care of the people, the products, and the profits — in that order — is the only way to build something lasting',
        'The Struggle is real: every CEO faces psychological suffering that no business book prepared them for',
      ],
    },
    sv: {
      description: 'Riskkapitalisten Ben Horowitz delar rå, ofiltrerad rådgivning om de tuffaste utmaningarna med att driva en startup — varsel, degraderingar, styrelsekonflikter och den psykologiska avgiften för ledarskap.',
      teaserPoints: [
        'Det finns ingen formel för att driva ett företag — de svåra sakerna är svåra just för att ingen har löst dem',
        'Ta hand om människorna, produkterna och vinsterna — i den ordningen — är det enda sättet att bygga något bestående',
        'Kampen är verklig: varje VD möter psykologiskt lidande som ingen affärsbok förberedde dem för',
      ],
    },
  },
  {
    slug: 'shoe-dog',
    title: 'Shoe Dog',
    author: 'Phil Knight',
    year: 2016,
    genre: 'Business',
    coverEmoji: '👟',
    en: {
      description: 'Nike founder Phil Knight\'s memoir of building one of the world\'s most iconic brands from a $50 loan and a crazy idea — a remarkably honest account of failure, obsession, and eventual triumph.',
      teaserPoints: [
        'The early Nike years were a constant survival story: cash flow crises, banking battles, near-death experiences',
        'Passion and obsession can carry you through obstacles that pure logic would stop you from attempting',
        'Building a team of true believers who share your mission is worth more than any individual genius',
      ],
    },
    sv: {
      description: 'Nike-grundaren Phil Knights memoarer om att bygga ett av världens mest ikoniska varumärken från ett lån på 50 dollar och en tokig idé — ett anmärkningsvärt ärligt konto om misslyckande, besatthet och slutlig triumf.',
      teaserPoints: [
        'De tidiga Nike-åren var en ständig överlevnadsberättelse: kassaflödeskris, bankkrig, nära-döden-upplevelser',
        'Passion och besatthet kan bära dig genom hinder som ren logik skulle stoppa dig från att ens försöka',
        'Att bygga ett team av sanna troende som delar ditt uppdrag är värt mer än vilket individuellt geni som helst',
      ],
    },
  },
  {
    slug: 'the-innovators-dilemma',
    title: "The Innovator's Dilemma",
    author: 'Clayton Christensen',
    year: 1997,
    genre: 'Business',
    coverEmoji: '💡',
    en: {
      description: 'Clayton Christensen reveals why great companies fail — not because of bad management, but because good management listens to customers and ignores disruptive innovations that reshape entire industries.',
      teaserPoints: [
        'Disruptive innovation starts at the low end of the market, where incumbents choose not to compete',
        'Listening to your best customers is sometimes the worst strategic move you can make',
        'Incumbent companies need separate units to pursue disruptions — existing structures will kill them',
      ],
    },
    sv: {
      description: 'Clayton Christensen avslöjar varför stora företag misslyckas — inte på grund av dålig ledning, utan för att god ledning lyssnar på kunder och ignorerar disruptiva innovationer som omformar hela branscher.',
      teaserPoints: [
        'Disruptiv innovation börjar i den låga änden av marknaden, där etablerade aktörer väljer att inte konkurrera',
        'Att lyssna på dina bästa kunder är ibland det sämsta strategiska drag du kan göra',
        'Etablerade företag behöver separata enheter för att driva disruptioner — befintliga strukturer kommer att döda dem',
      ],
    },
  },
  {
    slug: 'high-output-management',
    title: 'High Output Management',
    author: 'Andrew Grove',
    year: 1983,
    genre: 'Leadership',
    coverEmoji: '🏭',
    en: {
      description: 'Intel\'s legendary CEO Andy Grove presents a systematic approach to management — measuring output, running effective meetings, performance reviews, and the role of a manager in a high-performance organization.',
      teaserPoints: [
        'A manager\'s output = the output of their organization plus the output of neighboring organizations they influence',
        'One-on-ones are the single most important managerial tool — and most managers do them wrong',
        'The art of the meeting: every meeting needs an owner, a clear purpose, and a decision or action outcome',
      ],
    },
    sv: {
      description: 'Intels legendariske VD Andy Grove presenterar ett systematiskt tillvägagångssätt för ledarskap — mäta output, köra effektiva möten, prestationsutvärderingar och chefens roll i en högpresterande organisation.',
      teaserPoints: [
        'En chefs output = output från deras organisation plus output från angränsande organisationer de påverkar',
        'One-on-ones är det viktigaste verktyget för chefer — och de flesta chefer gör dem fel',
        'Konstens möte: varje möte behöver en ägare, ett tydligt syfte och ett beslut eller handlingsresultat',
      ],
    },
  },
  {
    slug: 'getting-things-done',
    title: 'Getting Things Done',
    author: 'David Allen',
    year: 2001,
    genre: 'Productivity',
    coverEmoji: '📋',
    en: {
      description: 'David Allen\'s GTD methodology — capture everything, clarify what it means, organize it, reflect regularly, and engage with it — offers a complete system for stress-free productivity.',
      teaserPoints: [
        'Your mind is for having ideas, not holding them: capture everything in a trusted external system',
        'The two-minute rule: if a task takes less than two minutes, do it immediately — never defer it',
        'Weekly review is the secret engine of GTD: without it, the system collapses within weeks',
      ],
    },
    sv: {
      description: 'David Allens GTD-metodik — fånga allt, förtydliga vad det betyder, organisera det, reflektera regelbundet och engagera dig i det — erbjuder ett komplett system för stressfri produktivitet.',
      teaserPoints: [
        'Ditt sinne är för att ha idéer, inte hålla dem: fånga allt i ett pålitligt externt system',
        'Tvåminutersregeln: om en uppgift tar mindre än två minuter, gör den omedelbart — skjut aldrig upp den',
        'Veckoöversyn är GTD:s hemliga motor: utan den kollapsar systemet inom veckor',
      ],
    },
  },
  {
    slug: 'the-e-myth-revisited',
    title: 'The E-Myth Revisited',
    author: 'Michael Gerber',
    year: 1995,
    genre: 'Business',
    coverEmoji: '🔧',
    en: {
      description: 'Michael Gerber explains why most small businesses fail — the entrepreneurial myth — and shows how to build a business that works as a system rather than depending on the owner\'s constant presence.',
      teaserPoints: [
        'The fatal assumption: if you understand the technical work, you can run a business that does it',
        'Work ON the business, not just IN it: building systems is what separates entrepreneurs from technicians',
        'The franchise prototype model: design your business as if you\'re going to replicate it 5,000 times',
      ],
    },
    sv: {
      description: 'Michael Gerber förklarar varför de flesta småföretag misslyckas — det entreprenöriella mytet — och visar hur man bygger ett företag som fungerar som ett system snarare än att bero på ägarens ständiga närvaro.',
      teaserPoints: [
        'Det dödliga antagandet: om du förstår det tekniska arbetet kan du driva ett företag som utför det',
        'Arbeta PÅ företaget, inte bara I det: att bygga system är vad som skiljer entreprenörer från tekniker',
        'Franchiseprototypmodellen: designa ditt företag som om du ska replikera det 5 000 gånger',
      ],
    },
  },
  {
    slug: 'ego-is-the-enemy',
    title: 'Ego Is the Enemy',
    author: 'Ryan Holiday',
    year: 2016,
    genre: 'Philosophy',
    coverEmoji: '🪞',
    en: {
      description: 'Ryan Holiday argues that ego — the unhealthy belief in our own importance — is the enemy of what we want to do, what we are doing, and what we have done. Stoic wisdom meets modern ambition.',
      teaserPoints: [
        'Ego prevents learning: "knowing" too much stops you from absorbing what you actually need',
        'The canvas strategy: make other people look good, support their work, and your time will come',
        'Managing success is harder than achieving it — ego is most dangerous at the peak, not the valley',
      ],
    },
    sv: {
      description: 'Ryan Holiday argumenterar för att egot — den ohälsosamma tron på vår egen betydelse — är fienden till vad vi vill göra, vad vi gör och vad vi har gjort. Stoisk visdom möter modern ambition.',
      teaserPoints: [
        'Egot förhindrar lärande: att "veta" för mycket stoppar dig från att absorbera vad du faktiskt behöver',
        'Dukastrategin: få andra att se bra ut, stöd deras arbete, och din tid kommer',
        'Att hantera framgång är svårare än att uppnå den — egot är farligast på toppen, inte i dalen',
      ],
    },
  },
  {
    slug: 'stolen-focus',
    title: 'Stolen Focus',
    author: 'Johann Hari',
    year: 2022,
    genre: 'Science',
    coverEmoji: '📵',
    en: {
      description: 'Johann Hari investigates why our ability to pay attention is collapsing — and makes the case that the attention crisis is not a personal failing but a systemic problem driven by tech companies, pollution, and ultra-processed food.',
      teaserPoints: [
        'Your attention didn\'t fail — it was stolen: tech platforms are engineered to hijack your focus for profit',
        'Sleep deprivation, ultra-processed food, and constant switching destroy our capacity for deep attention',
        'Mind-wandering and boredom are not failures of attention — they\'re essential for creativity and insight',
      ],
    },
    sv: {
      description: 'Johann Hari undersöker varför vår förmåga att uppmärksamma kollapsar — och argumenterar för att uppmärksamhetskrisen inte är ett personligt misslyckande utan ett systemiskt problem drivet av techföretag, föroreningar och ultraprocessad mat.',
      teaserPoints: [
        'Din uppmärksamhet misslyckades inte — den stals: techplattformar är konstruerade för att kapa ditt fokus för vinst',
        'Sömnbrist, ultraprocessad mat och konstant byte förstör vår kapacitet för djup uppmärksamhet',
        'Tankevandrande och tristess är inte misslyckanden av uppmärksamhet — de är väsentliga för kreativitet och insikt',
      ],
    },
  },
  {
    slug: 'the-body-keeps-the-score',
    title: 'The Body Keeps the Score',
    author: 'Bessel van der Kolk',
    year: 2014,
    genre: 'Science',
    coverEmoji: '🫀',
    en: {
      description: 'Psychiatrist Bessel van der Kolk shows how trauma literally reshapes the brain and body — and presents a range of therapies beyond talk therapy that can help people recover and reclaim their lives.',
      teaserPoints: [
        'Trauma is stored in the body, not just the mind: it manifests as physical sensations and automatic responses',
        'Traditional talk therapy alone is often insufficient for trauma — the body must be addressed directly',
        'EMDR, yoga, theater, and neurofeedback can reach parts of the brain that words cannot access',
      ],
    },
    sv: {
      description: 'Psykiatern Bessel van der Kolk visar hur trauma bokstavligen omformar hjärnan och kroppen — och presenterar en rad terapier bortom samtalsterapi som kan hjälpa människor att återhämta sig och återta sina liv.',
      teaserPoints: [
        'Trauma lagras i kroppen, inte bara sinnet: det manifesteras som fysiska förnimmelser och automatiska reaktioner',
        'Traditionell samtalsterapi ensam är ofta otillräcklig för trauma — kroppen måste adresseras direkt',
        'EMDR, yoga, teater och neurofeedback kan nå delar av hjärnan som ord inte kan nå',
      ],
    },
  },
  {
    slug: 'rich-dad-poor-dad',
    title: 'Rich Dad Poor Dad',
    author: 'Robert Kiyosaki',
    year: 1997,
    genre: 'Finance',
    coverEmoji: '💎',
    en: {
      description: 'Robert Kiyosaki contrasts the financial philosophies of his educated but financially struggling "poor dad" with the self-made wealth strategies of his friend\'s entrepreneurial "rich dad."',
      teaserPoints: [
        'Assets vs. liabilities: the rich buy assets, the poor and middle class buy liabilities they think are assets',
        'Financial education is the most important education missing from our school system',
        'Your house is not an asset — it takes money out of your pocket rather than putting it in',
      ],
    },
    sv: {
      description: 'Robert Kiyosaki kontrasterar de finansiella filosofierna hos sin utbildade men ekonomiskt kämpande "fattiga pappa" med den självgjorda rikedomsstrategin hos sin väns entreprenöriella "rika pappa".',
      teaserPoints: [
        'Tillgångar vs. skulder: de rika köper tillgångar, fattiga och medelklass köper skulder de tror är tillgångar',
        'Finansiell utbildning är den viktigaste utbildning som saknas i vårt skolsystem',
        'Ditt hus är inte en tillgång — det tar pengar ur din ficka snarare än att lägga dem där',
      ],
    },
  },
  {
    slug: 'the-7-habits-of-highly-effective-people',
    title: 'The 7 Habits of Highly Effective People',
    author: 'Stephen Covey',
    year: 1989,
    genre: 'Self-Help',
    coverEmoji: '🎓',
    en: {
      description: 'Stephen Covey presents a principle-centered approach to personal and professional effectiveness — seven habits that move you from dependence through independence to interdependence.',
      teaserPoints: [
        'Be proactive: you are responsible for your own life and responses — stimulus and response have a gap',
        'Begin with the end in mind: define your mission and vision before you act, not after',
        'Think win-win: abundance mentality creates better outcomes than zero-sum competition',
      ],
    },
    sv: {
      description: 'Stephen Covey presenterar ett principcentrerat tillvägagångssätt för personlig och professionell effektivitet — sju vanor som för dig från beroende genom oberoende till ömsesidigt beroende.',
      teaserPoints: [
        'Var proaktiv: du är ansvarig för ditt eget liv och dina svar — stimulus och respons har ett mellanrum',
        'Börja med slutet i åtanke: definiera ditt uppdrag och din vision innan du agerar, inte efter',
        'Tänk vinn-vinn: överflödstänkande skapar bättre resultat än nollsummespel-konkurrens',
      ],
    },
  },
  {
    slug: 'the-48-laws-of-power',
    title: 'The 48 Laws of Power',
    author: 'Robert Greene',
    year: 1998,
    genre: 'Strategy',
    coverEmoji: '♟️',
    en: {
      description: 'Robert Greene distills 3,000 years of history into 48 laws of power — amoral, Machiavellian, and ruthlessly pragmatic. Essential reading for understanding how power actually operates.',
      teaserPoints: [
        'Power operates by its own rules, independent of morality — understanding these rules is self-defense',
        'Law 1: Never outshine the master — always make those above you feel superior',
        'The most dangerous mistake is appearing threatening to those with power over you',
      ],
    },
    sv: {
      description: 'Robert Greene destillerar 3 000 år av historia till 48 maktlagar — amoraliska, machiavelliska och hänsynslöst pragmatiska. Nödvändig läsning för att förstå hur makt faktiskt fungerar.',
      teaserPoints: [
        'Makt fungerar enligt sina egna regler, oberoende av moral — att förstå dessa regler är självförsvar',
        'Lag 1: Överträffa aldrig mästaren — få alltid dem ovanför dig att känna sig överlägsna',
        'Det farligaste misstaget är att verka hotfullt mot de som har makt över dig',
      ],
    },
  },
  {
    slug: 'same-as-ever',
    title: 'Same as Ever',
    author: 'Morgan Housel',
    year: 2023,
    genre: 'Finance',
    coverEmoji: '⏳',
    en: {
      description: 'Morgan Housel explores the timeless behaviors and mindsets that remain constant across history — the unchanging human truths that matter more than any prediction of what comes next.',
      teaserPoints: [
        'Predicting the future is less useful than understanding the things that never change',
        'Risk is what remains when you think you\'ve thought of everything — the unknown unknowns always win',
        'Calm is not the same as complacency: the best investors and decisions-makers maintain equanimity',
      ],
    },
    sv: {
      description: 'Morgan Housel utforskar de tidlösa beteendena och tankesätten som förblir konstanta genom historien — de oföränderliga mänskliga sanningarna som är viktigare än någon förutsägelse om vad som kommer härnäst.',
      teaserPoints: [
        'Att förutsäga framtiden är mindre användbart än att förstå de saker som aldrig förändras',
        'Risk är vad som återstår när du tror att du har tänkt på allt — de okända okänderna vinner alltid',
        'Lugn är inte detsamma som självbelåtenhet: de bästa investerarna och beslutsfattarna upprätthåller jämvikt',
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
      description: 'Tara Westover\'s extraordinary memoir of growing up in a survivalist family in rural Idaho, never attending school, and eventually earning a PhD from Cambridge through sheer determination.',
      teaserPoints: [
        'Education is not just about information — it is about gaining new perspectives on yourself and the world',
        'Family and self-preservation can be in direct conflict — choosing yourself is not betrayal',
        'The willingness to question your own origin story is the hardest and most important form of learning',
      ],
    },
    sv: {
      description: 'Tara Westovers extraordinära memoarer om att växa upp i en överlevarfamilj i lantliga Idaho, aldrig gå i skola, och till slut ta en doktorsexamen från Cambridge genom ren beslutsamhet.',
      teaserPoints: [
        'Utbildning handlar inte bara om information — det handlar om att få nya perspektiv på sig själv och världen',
        'Familj och självbevarelse kan vara i direkt konflikt — att välja sig själv är inte förräderi',
        'Viljan att ifrågasätta sin egen ursprungsberättelse är den svåraste och viktigaste formen av lärande',
      ],
    },
  },
  {
    slug: 'can-t-hurt-me',
    title: "Can't Hurt Me",
    author: 'David Goggins',
    year: 2018,
    genre: 'Self-Help',
    coverEmoji: '🦾',
    en: {
      description: 'David Goggins shares his story of transforming from an abused, overweight young man into a Navy SEAL and ultramarathon runner — and the mental tools he used to push past every physical and mental limit.',
      teaserPoints: [
        'The 40% rule: when your mind says you\'re done, you\'ve typically only used 40% of your real capacity',
        'Accountability mirror: face the truth about yourself without excuses before you can change anything',
        'Callusing the mind: systematically exposing yourself to discomfort builds mental hardness you can\'t fake',
      ],
    },
    sv: {
      description: 'David Goggins delar sin historia om att förvandlas från en misshandlad, överviktig ung man till en Navy SEAL och ultramaratonlöpare — och de mentala verktyg han använde för att driva förbi varje fysisk och mental gräns.',
      teaserPoints: [
        '40%-regeln: när ditt sinne säger att du är klar, har du vanligtvis bara använt 40% av din verkliga kapacitet',
        'Ansvarspegelns: möt sanningen om dig själv utan ursäkter innan du kan förändra något',
        'Härda sinnet: systematisk exponering för obehag bygger mental hårdhet du inte kan fejka',
      ],
    },
  },
  {
    slug: 'die-with-zero',
    title: 'Die with Zero',
    author: 'Bill Perkins',
    year: 2020,
    genre: 'Finance',
    coverEmoji: '⚰️',
    en: {
      description: 'Bill Perkins argues that we save too much and spend too little of our wealth on meaningful experiences while we\'re still healthy enough to enjoy them — and presents a framework for maximizing life energy.',
      teaserPoints: [
        'The goal is to die with zero — not to accumulate the most, but to spend it all on your best life',
        'Memory dividends: experiences pay returns long after they happen through the memories they generate',
        'Timing matters: $1,000 at 30 is worth far more in life-energy than $1,000 at 70',
      ],
    },
    sv: {
      description: 'Bill Perkins argumenterar för att vi sparar för mycket och spenderar för lite av vår förmögenhet på meningsfulla upplevelser medan vi fortfarande är friska nog att njuta av dem — och presenterar ett ramverk för att maximera livsenergi.',
      teaserPoints: [
        'Målet är att dö med noll — inte att samla mest, utan att spendera allt på ditt bästa liv',
        'Minnesdividender: upplevelser ger avkastning länge efter att de hänt genom de minnen de genererar',
        'Timing spelar roll: 1 000 kronor vid 30 är värt mycket mer i livsenergi än 1 000 kronor vid 70',
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
      description: 'Stephen Hawking takes readers on a journey through space and time — from the Big Bang to black holes, from quarks to the search for a unified theory of everything.',
      teaserPoints: [
        'Space and time are not fixed — they curve, warp, and intertwine in ways that defy everyday intuition',
        'Black holes are not empty voids but objects with enormous gravity that can radiate energy (Hawking radiation)',
        'The search for a single unified theory of physics is the greatest intellectual quest in human history',
      ],
    },
    sv: {
      description: 'Stephen Hawking tar läsare på en resa genom rum och tid — från Big Bang till svarta hål, från kvarkar till sökandet efter en enhetlig teori om allt.',
      teaserPoints: [
        'Rum och tid är inte fasta — de kröker, vrider och sammanflätas på sätt som trotsar vardagsintuitionen',
        'Svarta hål är inte tomma tomrum utan objekt med enorm gravitation som kan utstråla energi (Hawkingstrålning)',
        'Sökandet efter en enda enhetlig teori om fysik är det största intellektuella uppdraget i mänsklighetens historia',
      ],
    },
  },
  {
    slug: 'the-millionaire-next-door',
    title: 'The Millionaire Next Door',
    author: 'Thomas Stanley',
    year: 1996,
    genre: 'Finance',
    coverEmoji: '🏠',
    en: {
      description: 'Thomas Stanley\'s research reveals that most American millionaires are not who you\'d expect — they live modestly, drive used cars, and built their wealth through decades of frugality and discipline, not inheritance.',
      teaserPoints: [
        'Wealth is what you accumulate, not what you spend: high income does not equal wealth',
        'Prodigious accumulators of wealth live below their means — consistently, for decades',
        'The UAW vs. PAW distinction: Under Accumulators of Wealth spend everything, Prodigious ones don\'t',
      ],
    },
    sv: {
      description: 'Thomas Stanleys forskning avslöjar att de flesta amerikanska miljonärer inte är vad du förväntar dig — de lever anspråkslöst, kör begagnade bilar och byggde sin förmögenhet genom decennier av sparsamhet och disciplin, inte arv.',
      teaserPoints: [
        'Rikedom är vad du samlar, inte vad du spenderar: hög inkomst är inte detsamma som förmögenhet',
        'Flitiga förmögenhetsackumulatorer lever under sina tillgångar — konsekvent, i decennier',
        'UAW vs. PAW-distinktionen: underackumulatorer spenderar allt, flitiga ackumulatorer gör det inte',
      ],
    },
  },
  {
    slug: 'to-sell-is-human',
    title: 'To Sell Is Human',
    author: 'Daniel Pink',
    year: 2012,
    genre: 'Business',
    coverEmoji: '🏷️',
    en: {
      description: 'Daniel Pink argues that we\'re all in sales now — even if we never think of ourselves as salespeople. One in nine Americans works in sales, but the other eight are spending their days moving others too.',
      teaserPoints: [
        'Moving others is a fundamental part of being human — not just selling products but persuading, influencing, and inspiring',
        'The new ABCs of selling: Attunement, Buoyancy, and Clarity replace the old Always Be Closing',
        'In the information age, helping others solve problems is more valuable than pushing solutions',
      ],
    },
    sv: {
      description: 'Daniel Pink argumenterar för att vi alla är i försäljning nu — även om vi aldrig tänker på oss själva som säljare. En av nio amerikaner arbetar i försäljning, men de andra åtta spenderar sina dagar med att påverka andra också.',
      teaserPoints: [
        'Att påverka andra är en grundläggande del av att vara människa — inte bara sälja produkter utan övertala, influera och inspirera',
        'De nya ABC:erna i försäljning: Inpassning, Flöde och Klarhet ersätter det gamla Alltid Avsluta',
        'I informationsåldern är det mer värdefullt att hjälpa andra lösa problem än att pusha lösningar',
      ],
    },
  },
  {
    slug: 'the-pathless-path',
    title: 'The Pathless Path',
    author: 'Paul Millerd',
    year: 2022,
    genre: 'Lifestyle',
    coverEmoji: '🛤️',
    en: {
      description: 'Paul Millerd shares his journey of leaving a prestigious consulting career to build a life on his own terms — a manifesto for questioning the default path and designing a more meaningful existence.',
      teaserPoints: [
        'The default path is a script society wrote for you — the pathless path is writing your own',
        'Self-employment and portfolio careers are increasingly viable alternatives to traditional employment',
        'Enough is a state of mind: redefining success around sufficiency rather than maximum accumulation',
      ],
    },
    sv: {
      description: 'Paul Millerd delar sin resa att lämna en prestigefylld konsultkarriär för att bygga ett liv på egna villkor — ett manifest för att ifrågasätta standardvägen och designa en mer meningsfull tillvaro.',
      teaserPoints: [
        'Standardvägen är ett manus samhället skrev åt dig — den väglösa vägen är att skriva ditt eget',
        'Egenföretagande och portföljkarriärer är alltmer livskraftiga alternativ till traditionell anställning',
        'Tillräckligt är ett sinnestillstånd: att omdefiniera framgång kring tillräcklighet snarare än maximal ackumulering',
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
      description: 'Greg Lukianoff and Jonathan Haidt argue that three "Great Untruths" — about fragility, emotional reasoning, and us-vs-them thinking — are making young people less resilient and universities less capable of free inquiry.',
      teaserPoints: [
        'The three Great Untruths: what doesn\'t kill you makes you weaker; always trust your feelings; life is a battle between good and evil',
        'Safetyism on campuses is making students less prepared for the discomfort of real adult life',
        'Cognitive behavioral therapy principles can reverse the cognitive distortions being taught as virtues',
      ],
    },
    sv: {
      description: 'Greg Lukianoff och Jonathan Haidt argumenterar för att tre "Stora Osanningar" — om skörhet, emotionellt resonerande och vi-mot-dem-tänkande — gör unga människor mindre motståndskraftiga och universitet mindre kapabla till fri utredning.',
      teaserPoints: [
        'De tre stora osanningarna: det som inte dödar dig gör dig svagare; lita alltid på dina känslor; livet är en kamp mellan gott och ont',
        'Säkerhetism på campus gör studenter mindre förberedda på obehaget i det verkliga vuxenlivet',
        'Kognitiv beteendeterapis principer kan vända de kognitiva snedvridningar som lärs ut som dygder',
      ],
    },
  },
  {
    slug: 'born-to-run',
    title: 'Born to Run',
    author: 'Christopher McDougall',
    year: 2009,
    genre: 'Science',
    coverEmoji: '🏃',
    en: {
      description: 'Christopher McDougall investigates the Tarahumara — Mexico\'s legendary long-distance runners — and the science of why humans are built to run extraordinary distances in bare feet.',
      teaserPoints: [
        'Humans are persistence hunters: we evolved to run for hours, not sprint — our biology is built for endurance',
        'Modern running shoes may cause more injuries than they prevent by altering natural gait mechanics',
        'Ultra-running connects us to an ancient human experience of movement, community, and play',
      ],
    },
    sv: {
      description: 'Christopher McDougall undersöker Tarahumara — Mexikos legendariska långdistanslöpare — och vetenskapen om varför människor är byggda för att springa extraordinära sträckor barfota.',
      teaserPoints: [
        'Människor är uthållighetsjägare: vi har evolverat för att springa i timmar, inte sprinta — vår biologi är byggd för uthållighet',
        'Moderna löparskor kan orsaka fler skador än de förhindrar genom att förändra naturlig gångmekanik',
        'Ultralöpning kopplar oss till en forntida mänsklig erfarenhet av rörelse, gemenskap och lek',
      ],
    },
  },
  {
    slug: 'the-art-of-war',
    title: 'The Art of War',
    author: 'Sun Tzu',
    year: -500,
    genre: 'Strategy',
    coverEmoji: '⚔️',
    en: {
      description: 'Sun Tzu\'s 2,500-year-old military treatise remains the ultimate guide to strategy — in war, business, and life. Its principles of adaptation, intelligence, and indirect approach are as relevant as ever.',
      teaserPoints: [
        'Know your enemy and know yourself: in a hundred battles you will never be defeated',
        'Supreme excellence consists in breaking the enemy\'s resistance without fighting',
        'All warfare is based on deception — appear weak when strong, strong when weak',
      ],
    },
    sv: {
      description: 'Sun Tzus 2 500 år gamla militärfördrag förblir den ultimata guiden till strategi — i krig, affärslivet och livet. Dess principer om anpassning, intelligens och indirekt tillvägagångssätt är lika relevanta som någonsin.',
      teaserPoints: [
        'Känn din fiende och känn dig själv: i hundra slag kommer du aldrig att besegras',
        'Yttersta excellens består i att bryta fiendens motstånd utan strid',
        'All krigföring bygger på bedrägeri — verka svag när stark, stark när svag',
      ],
    },
  },
  {
    slug: 'the-lean-product-playbook',
    title: 'The Lean Product Playbook',
    author: 'Dan Olsen',
    year: 2015,
    genre: 'Business',
    coverEmoji: '🗂️',
    en: {
      description: 'Dan Olsen provides a practical playbook for achieving product-market fit — from identifying target customers and underserved needs to building and testing MVPs with rigorous feedback loops.',
      teaserPoints: [
        'The Product-Market Fit Pyramid: market, underserved needs, value proposition, feature set, UX — build bottom up',
        'Hypothesis-driven product development: every feature is an experiment, not a certainty',
        'The importance of distinguishing between "must-haves," "performance benefits," and "delighters" in user research',
      ],
    },
    sv: {
      description: 'Dan Olsen ger en praktisk spelbok för att uppnå produkt-marknadsmatchning — från att identifiera målkunder och otillgodosedda behov till att bygga och testa MVP:er med rigorösa återkopplingsslingor.',
      teaserPoints: [
        'Produkt-marknadsmatchningspyramiden: marknad, otillgodosedda behov, värdeerbjudande, funktionsuppsättning, UX — bygg nedifrån och upp',
        'Hypotesdriven produktutveckling: varje funktion är ett experiment, inte en säkerhet',
        'Vikten av att skilja mellan "måste ha", "prestandafördelar" och "glädjegivare" i användarforskning',
      ],
    },
  },
  {
    slug: 'anti-fragile',
    title: 'Antifragile',
    author: 'Nassim Nicholas Taleb',
    year: 2012,
    genre: 'Philosophy',
    coverEmoji: '💪',
    en: {
      description: 'Nassim Taleb introduces the concept of antifragility — systems that gain from disorder, volatility, and stress rather than merely surviving it — and shows how to build antifragile systems in your life and work.',
      teaserPoints: [
        'Fragile breaks under stress, robust survives it, antifragile gets stronger because of it',
        'Via negativa: often the best improvements come from removing harm rather than adding interventions',
        'The barbell strategy: combine very safe bets with high-variance opportunities — avoid the middle ground',
      ],
    },
    sv: {
      description: 'Nassim Taleb introducerar konceptet antifragilitet — system som tjänar på oordning, volatilitet och stress snarare än att bara överleva den — och visar hur man bygger antifragila system i sitt liv och arbete.',
      teaserPoints: [
        'Skört bryts under stress, robust överlever det, antifragilt blir starkare på grund av det',
        'Via negativa: ofta kommer de bästa förbättringarna från att ta bort skada snarare än att lägga till interventioner',
        'Skivstångsstrategin: kombinera mycket säkra satsningar med hög-varians-möjligheter — undvik mittvägen',
      ],
    },
  },
  {
    slug: 'the-black-swan',
    title: 'The Black Swan',
    author: 'Nassim Nicholas Taleb',
    year: 2007,
    genre: 'Philosophy',
    coverEmoji: '🦢',
    en: {
      description: 'Nassim Taleb explores the outsized role of rare, unpredictable events — Black Swans — in history, finance, and life, and argues that we should build robustness against them rather than trying to predict them.',
      teaserPoints: [
        'Most of history is shaped by Black Swans — rare events nobody predicted — not by the predictable',
        'We are fooled by randomness into thinking we understand cause and effect far better than we do',
        'Prepare for the unknown by building optionality and limiting downside rather than trying to forecast',
      ],
    },
    sv: {
      description: 'Nassim Taleb utforskar den överdimensionerade rollen av sällsynta, oförutsägbara händelser — Svarta svanar — i historia, finans och livet, och argumenterar för att vi bör bygga robusthet mot dem snarare än att försöka förutsäga dem.',
      teaserPoints: [
        'Det mesta av historien formas av Svarta svanar — sällsynta händelser ingen förutsåg — inte av det förutsägbara',
        'Vi luras av slumpen att tro att vi förstår orsak och verkan mycket bättre än vi faktiskt gör',
        'Förbered dig för det okända genom att bygga optionalitet och begränsa nedsidan snarare än att prognostisera',
      ],
    },
  },
  {
    slug: 'the-lean-analytics',
    title: 'Lean Analytics',
    author: 'Alistair Croll & Benjamin Yoskovitz',
    year: 2013,
    genre: 'Business',
    coverEmoji: '📊',
    en: {
      description: 'Croll and Yoskovitz provide a practical framework for using data to build a better startup faster — identifying the One Metric That Matters at each stage and knowing when to pivot or persist.',
      teaserPoints: [
        'The One Metric That Matters: focus your entire team on a single number that best reflects your core value',
        'Vanity metrics vs. actionable metrics: page views and sign-ups feel good but rarely drive real decisions',
        'The stages of a startup correspond to specific metrics — retention, revenue, and referral come in sequence',
      ],
    },
    sv: {
      description: 'Croll och Yoskovitz ger ett praktiskt ramverk för att använda data för att bygga en bättre startup snabbare — identifiera det enda mätvärde som spelar roll i varje fas och veta när man ska pivotera eller hålla kurs.',
      teaserPoints: [
        'Det enda mätvärde som spelar roll: fokusera hela ditt team på ett enda nummer som bäst speglar ditt kärnvärde',
        'Vanitetsmätvärden vs. handlingsbara mätvärden: sidvisningar och registreringar känns bra men driver sällan riktiga beslut',
        'Startupens faser motsvarar specifika mätvärden — retention, intäkter och remiss kommer i sekvens',
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
      description: 'Greg McKeown argues for the disciplined pursuit of less but better — doing only what is absolutely essential and eliminating everything else to create maximum contribution to what matters most.',
      teaserPoints: [
        'The essentialist asks "What is essential?" — and eliminates everything that isn\'t without guilt',
        'If you don\'t prioritize your life, someone else will — and they will prioritize their agenda, not yours',
        'The paradox of success: the more successful you become, the more options you have — and the less focused you are',
      ],
    },
    sv: {
      description: 'Greg McKeown argumenterar för det disciplinerade strävan efter mindre men bättre — att bara göra det som är absolut nödvändigt och eliminera allt annat för att skapa maximalt bidrag till det som spelar roll mest.',
      teaserPoints: [
        'Essentialisten frågar "Vad är väsentligt?" — och eliminerar allt som inte är det utan skuldkänslor',
        'Om du inte prioriterar ditt liv, kommer någon annan att göra det — och de kommer att prioritera deras agenda, inte din',
        'Framgångens paradox: ju mer framgångsrik du blir, desto fler alternativ har du — och desto mindre fokuserad är du',
      ],
    },
  },
]

/** Merged catalogue: 55 curated + 145 additional = 200 total books */
export const BOOKS: Book[] = [...BOOKS_CORE, ...EXTRA_BOOKS]

/** O(1) slug lookup — avoids scanning the array on every request */
export const BOOKS_BY_SLUG: Record<string, Book> = Object.fromEntries(
  BOOKS.map(b => [b.slug, b])
)
