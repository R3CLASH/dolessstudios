/**
 * Fixture content for the "The Callout" demo — a fictional electrician.
 * Not site copy: this is the stand-in business a prospect clicks around.
 * Nothing here is real, and the demo says so in its own banner.
 */
export const VOLT = {
  name: "Volt Electric",
  tagline: "Colombo electricians who turn up when they say they will",
  phone: "+94 77 123 4567",
  phoneHref: "tel:+94771234567",
  whatsapp: "https://wa.me/94771234567",
  email: "hello@voltelectric.lk",
  host: "voltelectric.lk",
  hours: "Mon–Sat, 8am – 6pm · emergency callouts 24/7",
  established: "2014",
  rating: { score: "4.9", count: 213 },
  promise: [
    { k: "Same-day", v: "callouts across Colombo" },
    { k: "Fixed quotes", v: "before we start the work" },
    { k: "10 years", v: "licensed and insured" },
  ],
};

export type TradeService = { slug: string; title: string; line: string; from: string; bullets: string[] };

export const SERVICES: TradeService[] = [
  {
    slug: "faults",
    title: "Fault finding & repairs",
    line: "Breakers tripping, half the house dark, a socket that sparks. We find it and fix it.",
    from: "Rs 4,500 callout",
    bullets: ["Tripping breakers and RCDs", "Dead sockets and circuits", "Burning smells and hot switches"],
  },
  {
    slug: "rewiring",
    title: "Rewiring & upgrades",
    line: "Old wiring brought up to standard, room by room or whole house, with a certificate at the end.",
    from: "Quoted per room",
    bullets: ["Full and partial rewires", "Distribution board upgrades", "Earthing and bonding"],
  },
  {
    slug: "solar",
    title: "Solar & inverters",
    line: "Panels, inverters and battery backup wired properly, so the house stays on when the grid doesn't.",
    from: "Free site visit",
    bullets: ["Rooftop solar installs", "Inverter and battery backup", "Net metering paperwork"],
  },
  {
    slug: "install",
    title: "Lights, fans & sockets",
    line: "The small jobs that have been on the list for months. Usually done in one visit.",
    from: "Rs 3,000",
    bullets: ["Lighting and dimmers", "Ceiling and exhaust fans", "Extra sockets and USB points"],
  },
  {
    slug: "aircon",
    title: "AC power points",
    line: "Dedicated circuits sized for the unit, so your AC isn't sharing with the fridge.",
    from: "Rs 7,500",
    bullets: ["Dedicated AC circuits", "Isolators and breakers", "Outdoor unit supply"],
  },
  {
    slug: "safety",
    title: "Safety checks & certificates",
    line: "The inspection your landlord, insurer or buyer is asking for, with the paperwork to prove it.",
    from: "Rs 9,000",
    bullets: ["Landlord safety reports", "Pre-purchase inspections", "Insurance certificates"],
  },
];

export const AREAS = [
  { name: "Colombo 1–7", note: "Same day, usually within 3 hours" },
  { name: "Colombo 8–15", note: "Same day" },
  { name: "Dehiwala & Mount Lavinia", note: "Same day" },
  { name: "Nugegoda & Kohuwala", note: "Same or next day" },
  { name: "Rajagiriya & Battaramulla", note: "Same or next day" },
  { name: "Maharagama & Kottawa", note: "Next day" },
  { name: "Moratuwa & Panadura", note: "Next day" },
  { name: "Negombo & Ja-Ela", note: "Scheduled visits, 2–3 days" },
  { name: "Kandy", note: "Larger jobs only, by arrangement" },
];

export const REVIEWS = [
  {
    name: "Shanika W.",
    where: "Colombo 5",
    stars: 5,
    body: "Half our ground floor lost power on a Sunday. Called at 9am, someone was here by 11, fixed by noon. Told me the price before he started.",
  },
  {
    name: "Rizwan M.",
    where: "Dehiwala",
    stars: 5,
    body: "Rewired the upstairs of a 1970s house. Tidy work, no surprises on the bill, and they sorted the certificate for the insurance.",
  },
  {
    name: "Dinesh P.",
    where: "Rajagiriya",
    stars: 5,
    body: "Solar and battery install. They actually explained how it works instead of just handing me a remote. Backup kicked in during the first outage.",
  },
  {
    name: "Ayesha F.",
    where: "Nugegoda",
    stars: 4,
    body: "Good work on the AC points. Arrived an hour later than booked but called ahead to say so, which I appreciated.",
  },
];

export const WORK = [
  { title: "Distribution board, Colombo 7", line: "Thirty-year-old board with no RCD, replaced and labelled in a day." },
  { title: "Rooftop solar, Battaramulla", line: "5.5kW with battery backup. Runs the fridge, fans and router through an outage." },
  { title: "Restaurant kitchen, Colombo 3", line: "Three-phase supply for new equipment, done overnight so service wasn't affected." },
];

export const FAQ = [
  {
    q: "How fast can you come out?",
    a: "For Colombo 1–7 it's usually within three hours of the call. Everywhere else in our area is same or next day, and genuine emergencies — burning smells, sparking, water near wiring — jump the queue.",
  },
  {
    q: "Do you charge for a quote?",
    a: "No. We give a fixed price before starting, and it's the price you pay. For solar and rewires we come out and look first, which is also free.",
  },
  {
    q: "Are you licensed and insured?",
    a: "Yes, and we'll send the certificates with the quote if you'd like to see them. We've been doing this since 2014.",
  },
  {
    q: "Can you work weekends?",
    a: "Saturdays are normal working days for us. Sundays and nights are emergency callouts, at a higher rate we tell you about up front.",
  },
];

export const JOB_TYPES = [
  "Something's stopped working",
  "Rewiring or a board upgrade",
  "Solar or battery backup",
  "Lights, fans or sockets",
  "AC power point",
  "Safety check or certificate",
  "Something else",
];

export const URGENCY = ["It's an emergency", "Today if possible", "This week", "Just getting a price"];
