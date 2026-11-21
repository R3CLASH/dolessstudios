/**
 * Fixture content for "The Class" demo — a fictional A/L tuition institute.
 * Not site copy: this is the stand-in business a prospect clicks around.
 * Nothing here is real, and the demo says so in its own banner.
 */
export const VIDURA = {
  name: "Vidura Institute",
  tagline: "A/L Maths, Physics and Chemistry in Nugegoda and Kandy",
  phone: "+94 71 902 4455",
  phoneHref: "tel:+94719024455",
  whatsapp: "https://wa.me/94719024455",
  email: "register@viduraclasses.lk",
  host: "viduraclasses.lk",
  hours: "Office open Mon–Sat, 9am – 7pm",
  established: "2009",
  stats: [
    { k: "16 years", v: "of A/L classes" },
    { k: "1,400+", v: "students taught" },
    { k: "2 branches", v: "Nugegoda and Kandy" },
  ],
};

export type ClassRow = {
  slug: string;
  subject: string;
  grade: string;
  teacher: string;
  day: string;
  time: string;
  branch: string;
  seats: string;
  fee: string;
};

/** The timetable is data, not a photograph of a timetable. That's the whole pitch. */
export const TIMETABLE: ClassRow[] = [
  {
    slug: "maths-13-theory",
    subject: "Combined Maths — Theory",
    grade: "Grade 13",
    teacher: "Mr. A. Fernando",
    day: "Saturday",
    time: "8.00am – 11.00am",
    branch: "Nugegoda",
    seats: "6 seats left",
    fee: "Rs 4,500 / month",
  },
  {
    slug: "maths-13-revision",
    subject: "Combined Maths — Revision",
    grade: "Grade 13",
    teacher: "Mr. A. Fernando",
    day: "Sunday",
    time: "8.00am – 11.00am",
    branch: "Nugegoda",
    seats: "Full — waiting list",
    fee: "Rs 5,000 / month",
  },
  {
    slug: "physics-13",
    subject: "Physics — Theory",
    grade: "Grade 13",
    teacher: "Mrs. S. Jayawardena",
    day: "Saturday",
    time: "1.00pm – 4.00pm",
    branch: "Nugegoda",
    seats: "Open",
    fee: "Rs 4,500 / month",
  },
  {
    slug: "chemistry-13",
    subject: "Chemistry — Theory",
    grade: "Grade 13",
    teacher: "Dr. N. Perera",
    day: "Sunday",
    time: "1.00pm – 4.00pm",
    branch: "Nugegoda",
    seats: "Open",
    fee: "Rs 4,500 / month",
  },
  {
    slug: "maths-12",
    subject: "Combined Maths — Theory",
    grade: "Grade 12",
    teacher: "Mr. A. Fernando",
    day: "Friday",
    time: "4.00pm – 7.00pm",
    branch: "Nugegoda",
    seats: "Open",
    fee: "Rs 4,000 / month",
  },
  {
    slug: "physics-12",
    subject: "Physics — Theory",
    grade: "Grade 12",
    teacher: "Mrs. S. Jayawardena",
    day: "Wednesday",
    time: "4.00pm – 7.00pm",
    branch: "Nugegoda",
    seats: "Open",
    fee: "Rs 4,000 / month",
  },
  {
    slug: "maths-13-kandy",
    subject: "Combined Maths — Theory",
    grade: "Grade 13",
    teacher: "Mr. A. Fernando",
    day: "Sunday",
    time: "8.00am – 11.00am",
    branch: "Kandy",
    seats: "Open",
    fee: "Rs 4,500 / month",
  },
  {
    slug: "paper-class",
    subject: "Paper Class — all three subjects",
    grade: "Grade 13",
    teacher: "All three teachers",
    day: "Saturday",
    time: "5.00pm – 7.30pm",
    branch: "Nugegoda",
    seats: "Open from January",
    fee: "Rs 3,000 / month",
  },
];

export const TEACHERS = [
  {
    name: "Mr. A. Fernando",
    subject: "Combined Maths",
    since: "Teaching since 2009",
    credentials: "BSc Engineering (Moratuwa), 16 years at A/L",
    line: "Takes the theory class and the revision class himself. Known for working every past paper on the board rather than handing out answers.",
  },
  {
    name: "Mrs. S. Jayawardena",
    subject: "Physics",
    since: "Teaching since 2012",
    credentials: "BSc Physics (Colombo), MSc, former school HOD",
    line: "Runs the practical demonstrations that make the mechanics papers click. Her notes are the ones students photocopy for each other.",
  },
  {
    name: "Dr. N. Perera",
    subject: "Chemistry",
    since: "Teaching since 2015",
    credentials: "PhD Chemistry (Peradeniya), examiner experience",
    line: "Has marked at national level, which is why his model answers look like what the marking scheme actually wants.",
  },
];

export const FEES = [
  { item: "Theory class, per subject", price: "Rs 4,500 / month", note: "Grade 13. Grade 12 is Rs 4,000." },
  { item: "Revision class, per subject", price: "Rs 5,000 / month", note: "January to the exam." },
  { item: "Paper class, all three subjects", price: "Rs 3,000 / month", note: "Saturdays, from January." },
  { item: "All three theory subjects", price: "Rs 12,000 / month", note: "Rs 1,500 off the separate price." },
  { item: "Registration", price: "Rs 1,000, once", note: "Covers the student card and the first set of notes." },
  { item: "Notes and past papers", price: "Included", note: "Printed and handed out in class, not sold separately." },
];

export const RESULTS = [
  { year: "2025", line: "41 students sat. 9 island-rank A passes in Combined Maths, 22 A passes across the three subjects." },
  { year: "2024", line: "38 students sat. 7 island-rank A passes, and 3 students into Moratuwa Engineering." },
  { year: "2023", line: "35 students sat. 6 island-rank A passes, 19 A passes overall." },
];

export const REVIEWS = [
  {
    name: "Nimali, parent",
    where: "Nugegoda",
    stars: 5,
    body: "What I appreciate most is that the timetable is actually online. For two years before this we were guessing from WhatsApp messages whether there was a class.",
  },
  {
    name: "Kavindu, 2025 batch",
    where: "Grade 13",
    stars: 5,
    body: "Sir works through the past papers properly instead of just giving the answer. I went from a C at the school term test to an A.",
  },
  {
    name: "Mr. Rajapakse, parent",
    where: "Kandy",
    stars: 5,
    body: "We were driving to Colombo every Sunday until the Kandy branch opened. Same teacher, same notes. Worth it.",
  },
  {
    name: "Hashini, 2024 batch",
    where: "Grade 13",
    stars: 4,
    body: "Good classes and good notes. The Saturday theory class gets very full by about March, so register early.",
  },
];

export const BRANCHES = [
  {
    name: "Nugegoda",
    address: "2nd floor, 114 High Level Road, Nugegoda",
    note: "Above the pharmacy, opposite the bus halt. Parking in the lane behind.",
  },
  {
    name: "Kandy",
    address: "47 Kotugodella Veediya, Kandy",
    note: "Five minutes from the clock tower. Sunday classes only.",
  },
];

export const FAQ = [
  {
    q: "Is there a class on Poya day?",
    a: "Usually yes, unless Poya falls on the same day as a public holiday. Any change is posted on the timetable page and sent to the class WhatsApp group the week before.",
  },
  {
    q: "Can my child join in the middle of the term?",
    a: "For theory classes, yes, up to about the end of the first term. After that there's too much to catch up on and we'd rather tell you that than take the fee.",
  },
  {
    q: "Do you give notes or do we buy them?",
    a: "They're included and handed out in class. We don't sell notes separately and we don't charge for past papers.",
  },
  {
    q: "How big are the classes?",
    a: "Theory classes are capped at 45 so the back row can still read the board. Revision is capped at 30. When a class is full it says so on the timetable rather than letting you register anyway.",
  },
];

export const GRADES = ["Grade 12", "Grade 13", "Repeat / second attempt"];

export const SUBJECT_CHOICES = ["Combined Maths", "Physics", "Chemistry", "All three", "Paper class only"];
