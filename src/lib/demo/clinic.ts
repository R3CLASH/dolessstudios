/**
 * Fixture content for the "The Practice" demo — a fictional dental practice.
 * Not site copy: this is the stand-in business a prospect clicks around.
 * The clinical claims here are placeholder text, not medical advice.
 */
export const PRACTICE = {
  name: "Serendib Dental",
  tagline: "Unhurried dentistry in Colombo 07",
  phone: "+94 11 765 4321",
  phoneHref: "tel:+94117654321",
  whatsapp: "https://wa.me/94117654321",
  email: "reception@serendibdental.lk",
  host: "serendibdental.lk",
  address: "22 Horton Place, Colombo 07",
  established: "2009",
  rating: { score: "4.9", count: 341 },
  hours: "Mon–Fri 8:30–18:00 · Sat 9:00–13:00",
};

export type Treatment = {
  slug: string;
  title: string;
  line: string;
  body: string;
  from: string;
  duration: string;
};

export const TREATMENTS: Treatment[] = [
  {
    slug: "check-up",
    title: "Check-up & clean",
    line: "The appointment everything else starts with.",
    body: "A full examination, scale and polish, and a written note of anything we think is worth watching. We'll tell you if nothing needs doing — that happens more often than people expect.",
    from: "Rs 6,500",
    duration: "40 minutes",
  },
  {
    slug: "fillings",
    title: "Fillings & restorations",
    line: "Tooth-coloured composite, matched to the tooth beside it.",
    body: "Most fillings are done in one visit under local anaesthetic. We'll show you the x-ray and explain what we're seeing before anything starts.",
    from: "Rs 9,500",
    duration: "45–60 minutes",
  },
  {
    slug: "root-canal",
    title: "Root canal treatment",
    line: "For when the nerve is involved and the tooth is worth saving.",
    body: "Usually two visits. Uncomfortable to think about, far less uncomfortable than people expect in the chair. We allow extra time so nothing is rushed.",
    from: "Rs 32,000",
    duration: "2 visits",
  },
  {
    slug: "crowns",
    title: "Crowns & bridges",
    line: "Rebuilding a tooth that's cracked, worn or heavily filled.",
    body: "We take a digital scan rather than a mouthful of putty. The lab work takes about two weeks, and you leave with a temporary that looks like the real thing.",
    from: "Rs 58,000",
    duration: "2–3 visits",
  },
  {
    slug: "whitening",
    title: "Whitening",
    line: "Supervised, with trays made from a scan of your own teeth.",
    body: "We check the gums and any existing work first, because whitening won't change the colour of a crown or a filling. Results in about two weeks of nightly wear.",
    from: "Rs 45,000",
    duration: "2 visits + home",
  },
  {
    slug: "children",
    title: "Children's dentistry",
    line: "First visits that don't put them off for life.",
    body: "The first appointment is a look around, a ride in the chair and a sticker. Nothing clinical unless there's a reason. Under-5s are seen free alongside a parent's check-up.",
    from: "Free under 5",
    duration: "20–30 minutes",
  },
];

export const TEAM = [
  {
    name: "Dr Anusha Perera",
    role: "Principal dentist",
    reg: "SLMC 14882",
    bio: "Twenty years in general and restorative dentistry, fifteen of them here. Particularly interested in treating nervous patients.",
  },
  {
    name: "Dr Hasith Jayawardena",
    role: "Dentist",
    reg: "SLMC 21904",
    bio: "Endodontics and crown work. Trained in Colombo and Melbourne, and the person you'll see for a root canal.",
  },
  {
    name: "Nadeesha Silva",
    role: "Dental hygienist",
    reg: "DCSL 3310",
    bio: "Gum health and prevention. Will show you, kindly but definitely, where you are not flossing.",
  },
  {
    name: "Priyanka Fernando",
    role: "Practice manager",
    reg: "",
    bio: "Runs reception, appointments and insurance paperwork. The voice on the phone.",
  },
];

export const INSURERS = ["Ceylinco Healthcare", "AIA Insurance", "Allianz Lanka", "Union Assurance", "Softlogic Life"];

export const FAQ = [
  {
    q: "I haven't been to a dentist in years.",
    a: "That's a lot of our new patients, and nobody here will make you feel bad about it. The first visit is a look and a conversation — we agree a plan together and go at your pace.",
  },
  {
    q: "Do you take my insurance?",
    a: "We work with the main local insurers and can bill several of them directly. Bring your card to the first appointment and reception will check before any treatment starts.",
  },
  {
    q: "What does it cost?",
    a: "Our standard fees are on this page, and you get a written estimate before any treatment begins. If a plan changes mid-way, we stop and talk to you first.",
  },
  {
    q: "Do you see emergencies?",
    a: "We keep slots free each morning for pain. Call as early as you can and we'll fit you in the same day wherever possible.",
  },
];

export const REASONS = [
  "A check-up and clean",
  "Pain or a broken tooth",
  "Something cosmetic",
  "A second opinion",
  "My child's first visit",
  "Not sure — I just need a look",
];

export const TIMES = ["Weekday morning", "Weekday afternoon", "Weekday evening", "Saturday morning", "As soon as possible"];
