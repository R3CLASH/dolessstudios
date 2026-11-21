/**
 * Fixture content for the "The Stay" demo — a fictional boutique villa in Galle.
 * Not site copy: this is the stand-in business a prospect clicks around.
 * Nothing here is real, and the demo says so in its own banner.
 */
export const PALM = {
  name: "Palm House",
  place: "Galle",
  tagline: "A six-room house inside the Galle Fort walls",
  phone: "+94 77 480 2211",
  phoneHref: "tel:+94774802211",
  whatsapp: "https://wa.me/94774802211",
  email: "stay@palmhousegalle.lk",
  host: "palmhousegalle.lk",
  address: "18 Leyn Baan Street, Galle Fort",
  checkIn: "Check-in 2pm · check-out 11am",
  established: "2017",
  rating: { score: "9.4", count: 168 },
  promise: [
    { k: "Book direct", v: "and we keep the commission off your rate" },
    { k: "Six rooms", v: "so the house is never a crowd" },
    { k: "2 minutes", v: "to the ramparts on foot" },
  ],
};

export type Room = {
  slug: string;
  name: string;
  line: string;
  sleeps: string;
  size: string;
  rate: { low: string; high: string };
  features: string[];
};

export const ROOMS: Room[] = [
  {
    slug: "garden",
    name: "Garden Room",
    line: "Ground floor, opening onto the courtyard and the frangipani tree.",
    sleeps: "2 guests",
    size: "28 m²",
    rate: { low: "Rs 18,500", high: "Rs 26,000" },
    features: ["King bed", "Courtyard doors", "Rain shower", "Air conditioning"],
  },
  {
    slug: "rampart",
    name: "Rampart Room",
    line: "First floor, with the shutters that look straight out at the Fort wall.",
    sleeps: "2 guests",
    size: "32 m²",
    rate: { low: "Rs 22,000", high: "Rs 31,000" },
    features: ["King bed", "Fort wall view", "Writing desk", "Air conditioning"],
  },
  {
    slug: "veranda",
    name: "Veranda Suite",
    line: "The corner room, with its own veranda and two planter's chairs nobody wants to leave.",
    sleeps: "2 guests + 1 child",
    size: "44 m²",
    rate: { low: "Rs 29,500", high: "Rs 41,000" },
    features: ["King bed + daybed", "Private veranda", "Bathtub", "Air conditioning"],
  },
  {
    slug: "family",
    name: "Family Room",
    line: "Two connected rooms at the back of the house, quietest in the building.",
    sleeps: "4 guests",
    size: "52 m²",
    rate: { low: "Rs 34,000", high: "Rs 48,000" },
    features: ["King + twin beds", "Two bathrooms", "Reading nook", "Air conditioning"],
  },
];

export const SEASONS = [
  { name: "December – March", note: "High season. Minimum two nights, three over Christmas and New Year." },
  { name: "April – July", note: "Shoulder. The Fort is quieter and the sea is usually calm." },
  { name: "August – November", note: "Low season. Best rates, occasional afternoon rain." },
];

export const INCLUDED = [
  "Breakfast cooked to order, served until 10.30",
  "Airport pick-up arranged at a fixed fare",
  "Filtered drinking water in every room",
  "Laundry same day, if it's in before noon",
  "Bicycles, free, for as long as you want them",
  "Tea and curd on the veranda at four o'clock",
];

export const NEARBY = [
  { name: "Galle Fort ramparts", walk: "2 min walk", line: "Best an hour before sunset, when the light goes gold and the cricket starts." },
  { name: "Dutch Reformed Church", walk: "4 min walk", line: "1755, with gravestones set into the floor." },
  { name: "Galle Lighthouse", walk: "7 min walk", line: "The photograph everyone comes for. Go early." },
  { name: "Maritime Museum", walk: "6 min walk", line: "In the old Dutch warehouse. Cool inside at midday." },
  { name: "Unawatuna beach", walk: "12 min tuk-tuk", line: "Swimmable most of the year. We'll call a driver you can trust." },
  { name: "Handunugoda tea estate", walk: "45 min drive", line: "Virgin white tea, picked without being touched by hand." },
];

export const GETTING_HERE = [
  {
    mode: "From Colombo airport",
    time: "2 hr 30",
    line: "The Southern Expressway runs most of the way. We arrange a car at a fixed fare — no meter, no negotiating at 3am.",
  },
  {
    mode: "By train from Colombo",
    time: "2 hr 45",
    line: "The coast line, and worth doing once for the stretch where the track runs along the water. Second class is fine.",
  },
  {
    mode: "Once you're in the Fort",
    time: "On foot",
    line: "Cars can enter but can't park on Leyn Baan Street. Drop your bags at the door and we'll sort the rest.",
  },
];

export const REVIEWS = [
  {
    name: "Marieke V.",
    where: "Utrecht, Netherlands",
    stars: 5,
    body: "We booked direct after finding them on an agency site and the rate was noticeably better. The house is small in the best way — by the second morning the cook knew how we took our tea.",
  },
  {
    name: "Tom & Priya",
    where: "London, UK",
    stars: 5,
    body: "The veranda suite is worth the extra. We'd planned three nights and stayed six. They rearranged everything without making it a problem.",
  },
  {
    name: "Shanil R.",
    where: "Colombo",
    stars: 5,
    body: "Took my parents for their anniversary. Quiet, cool, and genuinely inside the Fort rather than fifteen minutes away like most places claim.",
  },
  {
    name: "Anja K.",
    where: "Berlin, Germany",
    stars: 4,
    body: "Beautiful house and lovely staff. Street noise in the morning from the school next door, but that is the Fort and not the hotel.",
  },
];

export const FAQ = [
  {
    q: "Is it cheaper to book direct?",
    a: "Yes, and that's the point of this page. Booking sites take 15 to 20 percent of the rate, so when you come to us directly we can give you a better price for the same room.",
  },
  {
    q: "Do you need a deposit?",
    a: "For high season we ask for one night up front to hold the room. Outside that, a confirmation by email is enough and you settle when you leave.",
  },
  {
    q: "Can you collect us from the airport?",
    a: "We arrange it at a fixed fare and tell you the number plate before you land, so there's no haggling at arrivals. It's about two and a half hours.",
  },
  {
    q: "Is the house suitable for children?",
    a: "The Family Room is built for it. The rest of the house has old stairs and a plunge pool with no fence, so we're honest that it suits couples better.",
  },
];

export const GUEST_COUNTS = ["1 guest", "2 guests", "3 guests", "4 guests", "5+ guests"];

export const TRIP_REASONS = ["Holiday", "Honeymoon", "Family trip", "Work", "A whole-house booking"];
