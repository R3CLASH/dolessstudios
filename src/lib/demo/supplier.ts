/**
 * Fixture content for "The Supplier" demo — a fictional Ceylon tea exporter.
 * Not site copy: this is the stand-in business a prospect clicks around.
 * Nothing here is real, and the demo says so in its own banner.
 */
export const CEYLON = {
  name: "Ceylon Leaf Exports",
  legal: "Ceylon Leaf Exports (Pvt) Ltd",
  tagline: "Orthodox Ceylon tea, shipped from Colombo since 1994",
  phone: "+94 11 234 8800",
  phoneHref: "tel:+94112348800",
  whatsapp: "https://wa.me/94112348800",
  email: "sales@ceylonleafexports.lk",
  host: "ceylonleafexports.lk",
  address: "Unit 7, Export Processing Zone, Katunayake",
  hours: "Mon–Fri, 8.30am – 5pm Sri Lanka time (GMT+5:30)",
  established: "1994",
  stats: [
    { k: "31 years", v: "exporting without a broker" },
    { k: "42 countries", v: "shipped to" },
    { k: "1,800 MT", v: "annual capacity" },
  ],
};

export type Product = {
  slug: string;
  name: string;
  grade: string;
  line: string;
  origin: string;
  moq: string;
  packing: string[];
  specs: { k: string; v: string }[];
};

export const PRODUCTS: Product[] = [
  {
    slug: "bop",
    name: "Broken Orange Pekoe",
    grade: "BOP",
    line: "The workhorse grade. Strong, bright and consistent batch to batch, which is what blenders actually buy on.",
    origin: "Dimbula, 1,100–1,600 m",
    moq: "500 kg",
    packing: ["20 kg multiwall paper sacks", "40 kg jute", "Private label cartons"],
    specs: [
      { k: "Moisture", v: "max 6%" },
      { k: "Total ash", v: "4–8%" },
      { k: "Water extract", v: "min 32%" },
      { k: "Shelf life", v: "24 months" },
    ],
  },
  {
    slug: "bopf",
    name: "Broken Orange Pekoe Fannings",
    grade: "BOPF",
    line: "Faster brewing and a deeper colour. Our highest volume line, mostly going into blends and tea bags.",
    origin: "Dimbula & Uva",
    moq: "500 kg",
    packing: ["20 kg multiwall paper sacks", "Bulk PP bags", "Tea bag cut on request"],
    specs: [
      { k: "Moisture", v: "max 6%" },
      { k: "Total ash", v: "4–8%" },
      { k: "Water extract", v: "min 32%" },
      { k: "Shelf life", v: "24 months" },
    ],
  },
  {
    slug: "opa",
    name: "Orange Pekoe A",
    grade: "OPA",
    line: "Long, wiry leaf for buyers selling loose tea where the leaf has to look like something.",
    origin: "Nuwara Eliya, above 1,800 m",
    moq: "250 kg",
    packing: ["10 kg foil-lined cartons", "20 kg paper sacks", "Retail tins, private label"],
    specs: [
      { k: "Moisture", v: "max 6%" },
      { k: "Total ash", v: "4–7%" },
      { k: "Water extract", v: "min 32%" },
      { k: "Shelf life", v: "24 months" },
    ],
  },
  {
    slug: "silver-tips",
    name: "Silver Tips",
    grade: "Speciality",
    line: "Hand-picked unopened buds, dried in shade. Small volumes, long lead times, and priced accordingly.",
    origin: "Single estate, Ruhuna",
    moq: "25 kg",
    packing: ["1 kg foil pouches", "5 kg cartons", "Gift presentation boxes"],
    specs: [
      { k: "Moisture", v: "max 5%" },
      { k: "Total ash", v: "max 6%" },
      { k: "Handpicked", v: "100%" },
      { k: "Shelf life", v: "18 months" },
    ],
  },
  {
    slug: "organic-bop",
    name: "Organic BOP",
    grade: "BOP — certified organic",
    line: "From two estates under continuous organic management since 2011. Full traceability to the field.",
    origin: "Ruhuna, 300–600 m",
    moq: "500 kg",
    packing: ["20 kg paper sacks", "Certified organic liners only"],
    specs: [
      { k: "Moisture", v: "max 6%" },
      { k: "Certification", v: "EU & NOP" },
      { k: "Traceability", v: "To estate & field" },
      { k: "Shelf life", v: "24 months" },
    ],
  },
  {
    slug: "private-label",
    name: "Private label blending",
    grade: "To your spec",
    line: "You send the cup profile and the target price, we build the blend and ship it in your packaging.",
    origin: "Blended to order",
    moq: "1,000 kg",
    packing: ["Your artwork, our cartons", "Tea bags, 2 g or 2.5 g", "Retail pouches"],
    specs: [
      { k: "Sample turnaround", v: "10 days" },
      { k: "Blend approval", v: "2 rounds included" },
      { k: "Artwork", v: "Print-ready from us" },
      { k: "Lead time", v: "35–45 days" },
    ],
  },
];

export const CERTIFICATIONS = [
  { name: "ISO 22000:2018", body: "Food safety management", note: "Katunayake facility. Audited annually, last renewed March 2026." },
  { name: "HACCP", body: "Hazard analysis", note: "Full plan covering intake, blending, packing and despatch." },
  { name: "Ozone-friendly / Lion Logo", body: "Sri Lanka Tea Board", note: "Registered exporter. Lion Logo approved for retail packs." },
  { name: "EU & NOP Organic", body: "Control Union", note: "Applies to the organic BOP line and its two source estates only." },
  { name: "Rainforest Alliance", body: "Chain of custody", note: "Certified for the estates named on the product page." },
  { name: "Halal", body: "Halal Accreditation Council", note: "Covers all packed lines from the Katunayake facility." },
];

export const PROCESS = [
  { n: "01", title: "Sample & quote", line: "You tell us the grade, volume and destination. Samples go out by courier inside five working days, with the price landed at your port." },
  { n: "02", title: "Approval", line: "You cup the samples and confirm the profile. For private label we do two rounds of blend adjustment inside the price." },
  { n: "03", title: "Production", line: "Blended and packed at Katunayake under ISO 22000. You get batch numbers and a pre-shipment sample from the actual lot." },
  { n: "04", title: "Documents & shipping", line: "Invoice, packing list, certificate of origin, phytosanitary and Tea Board certificate. FOB Colombo, or CIF to your port." },
];

export const CAPACITY = [
  { k: "Annual capacity", v: "1,800 MT" },
  { k: "Blending lines", v: "3" },
  { k: "Warehouse", v: "2,400 m², climate controlled" },
  { k: "Smallest order", v: "25 kg speciality, 500 kg standard" },
  { k: "Lead time", v: "21 days standard, 35–45 private label" },
  { k: "Terms", v: "LC at sight, or TT 30% advance" },
];

export const MARKETS = [
  "Germany", "Netherlands", "United Kingdom", "Poland", "UAE", "Saudi Arabia",
  "Japan", "Australia", "Canada", "Chile", "South Africa", "Russia",
];

export const FAQ = [
  {
    q: "What is your minimum order?",
    a: "500 kg for standard grades and 250 kg for OPA. Speciality teas start at 25 kg because the volumes simply do not exist above that. Private label blending starts at 1,000 kg.",
  },
  {
    q: "Can you ship under our own brand?",
    a: "Yes. We blend to your cup profile, pack in your artwork and ship it as yours. We are not on the carton unless you want us to be.",
  },
  {
    q: "What are your payment terms?",
    a: "Letter of credit at sight for new buyers, or 30 percent telegraphic transfer in advance with the balance against documents. After three shipments we will discuss open terms.",
  },
  {
    q: "Do you sell through a broker?",
    a: "No. We buy at the Colombo auction and through direct estate contracts, and we export ourselves. That is one margin out of the chain and it is usually the reason our price works.",
  },
  {
    q: "How long does a first order take?",
    a: "Samples in five working days, then 21 days from confirmed order to FOB Colombo for standard grades. Private label runs 35 to 45 days because of artwork and blend approval.",
  },
];

export const VOLUMES = ["Under 500 kg", "500 – 2,000 kg", "2 – 10 MT", "10 MT +", "Not sure yet"];

export const INCOTERMS = ["FOB Colombo", "CIF to our port", "Ex-works", "Advise us"];
