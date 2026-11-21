/**
 * Fixture content for the "The Table" demo — a fictional Colombo restaurant.
 * Not site copy: this is the stand-in business a prospect clicks around.
 */
export const TABLE = {
  name: "Kolamba Kitchen",
  tagline: "Sri Lankan home cooking, three streets from the sea",
  phone: "+94 11 234 5678",
  phoneHref: "tel:+94112345678",
  whatsapp: "https://wa.me/94112345678",
  email: "hello@kolambakitchen.lk",
  host: "kolambakitchen.lk",
  address: "48 Rampart Road, Colombo 03",
  established: "2017",
  rating: { score: "4.7", count: 486 },
};

/** Opening hours, 0 = Sunday, matching Date#getDay. */
export const HOURS = [
  { day: "Sunday", open: "11:00", close: "22:00" },
  { day: "Monday", open: null, close: null },
  { day: "Tuesday", open: "11:30", close: "22:00" },
  { day: "Wednesday", open: "11:30", close: "22:00" },
  { day: "Thursday", open: "11:30", close: "22:00" },
  { day: "Friday", open: "11:30", close: "23:00" },
  { day: "Saturday", open: "11:00", close: "23:00" },
];

export type Dish = { name: string; line: string; price: string; tags?: string[] };
export type MenuSection = { id: string; title: string; note?: string; dishes: Dish[] };

export const MENU: MenuSection[] = [
  {
    id: "short-eats",
    title: "Short eats",
    note: "Served all day",
    dishes: [
      { name: "Fish cutlets", line: "Four, with seeni sambol and lime", price: "Rs 750" },
      { name: "Mutton rolls", line: "Crumbed and fried to order", price: "Rs 850" },
      { name: "Isso vadai", line: "Prawn fritters, Galle Face style", price: "Rs 900", tags: ["Spicy"] },
      { name: "Ulundu vadai", line: "With coconut sambol", price: "Rs 600", tags: ["Vegan"] },
    ],
  },
  {
    id: "rice",
    title: "Rice & curry",
    note: "Five curries, papadam, sambol. Served from noon.",
    dishes: [
      { name: "Vegetable", line: "Dhal, beetroot, kale mallum, ash plantain, jackfruit", price: "Rs 1,450", tags: ["Vegan"] },
      { name: "Chicken", line: "Village-style red chicken curry", price: "Rs 1,750" },
      { name: "Fish ambul thiyal", line: "Sour goraka-cured tuna", price: "Rs 1,950" },
      { name: "Mutton", line: "Slow-cooked, black pepper and roasted spice", price: "Rs 2,250", tags: ["Spicy"] },
      { name: "Crab", line: "Whole lagoon crab, market price on the day", price: "Market", tags: ["Chef's pick"] },
    ],
  },
  {
    id: "hoppers",
    title: "Hoppers & kottu",
    note: "From 6pm",
    dishes: [
      { name: "Plain hoppers", line: "Three, with lunu miris", price: "Rs 650", tags: ["Vegan"] },
      { name: "Egg hoppers", line: "Two, soft yolk", price: "Rs 850" },
      { name: "String hoppers", line: "Ten, with kiri hodi and pol sambol", price: "Rs 950", tags: ["Vegan"] },
      { name: "Chicken kottu", line: "Godamba roti, egg, leeks", price: "Rs 1,550" },
      { name: "Cheese kottu", line: "The one everyone photographs", price: "Rs 1,650" },
    ],
  },
  {
    id: "drinks",
    title: "Drinks & sweets",
    dishes: [
      { name: "Wood apple juice", line: "Fresh, lightly sweetened", price: "Rs 550", tags: ["Vegan"] },
      { name: "King coconut", line: "Whole, chilled", price: "Rs 400", tags: ["Vegan"] },
      { name: "Ceylon tea", line: "Pot, Nuwara Eliya single estate", price: "Rs 450" },
      { name: "Watalappan", line: "Jaggery and coconut custard", price: "Rs 750" },
      { name: "Curd & treacle", line: "Buffalo curd, kithul treacle", price: "Rs 700" },
    ],
  },
];

export const REVIEWS = [
  { name: "Tharindu R.", where: "Colombo", stars: 5, body: "The ambul thiyal tastes like my grandmother's. I've stopped trying to make it at home." },
  { name: "Emily H.", where: "Visiting from London", stars: 5, body: "Booked on the website at 11pm and got a confirmation straight away. Hoppers were worth the detour." },
  { name: "Nuwan D.", where: "Dehiwala", stars: 4, body: "Brilliant food, and they actually answer the phone. Gets loud on Friday nights, which I don't mind." },
];

export const DELIVERY = [
  { name: "PickMe Food", note: "Colombo 1–7, 30–45 min" },
  { name: "Uber Eats", note: "Colombo 1–7" },
  { name: "Call us directly", note: "No commission, Rampart Road area" },
];

export const PARTY_SIZES = ["1", "2", "3", "4", "5", "6", "7+"];
export const SITTINGS = ["Lunch · 12:00", "Lunch · 13:30", "Dinner · 18:30", "Dinner · 20:00", "Dinner · 21:30"];
export const OCCASIONS = ["Just dinner", "Birthday", "Anniversary", "Business", "Family gathering"];
