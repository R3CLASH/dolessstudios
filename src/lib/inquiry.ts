import { z } from "zod";

/** Brief form options and validation, shared by the form (instant feedback) and the server action (the real check). */
export const BRIEF_SERVICES = [
  { v: "web", l: "a website" },
  { v: "shopify", l: "Shopify" },
  { v: "wordpress", l: "WordPress" },
  { v: "web-apps", l: "a web app" },
  { v: "automation", l: "automation" },
  { v: "not-sure", l: "not sure yet" },
] as const;
export const BRIEF_TIMELINES = ["ASAP", "within a month", "in 2–3 months", "no rush"] as const;

const serviceValues = BRIEF_SERVICES.map((s) => s.v) as [string, ...string[]];
// Optional single choice: one of the options, or left blank.
const optional = (values: readonly string[], message: string) => z.enum(["", ...values], message).optional();

// Single-line text: no line breaks, so nothing can sneak into an email header.
const singleLine = (s: string) => !/[\r\n]/.test(s);

export const inquirySchema = z.object({
  name: z
    .string("Tell us your name.")
    .trim()
    .min(2, "We need at least two letters.")
    .max(120, "That's a long name. Keep it under 120 characters.")
    .refine(singleLine, "Keep your name on one line."),
  email: z
    .string("We need an email to reply to.")
    .trim()
    .toLowerCase()
    .min(1, "We need an email to reply to.")
    .max(200, "That email is too long.")
    .pipe(z.email("That email doesn't look right.")),
  company: z
    .string()
    .trim()
    .max(160, "Keep the company name under 160 characters.")
    .refine(singleLine, "Keep the company name on one line.")
    .optional()
    .or(z.literal("")),
  services: z.array(z.enum(serviceValues, "Pick from the options above.")).min(1, "Pick at least one thing."),
  timeline: optional(BRIEF_TIMELINES, "Pick one of the timeline options."),
  message: z
    .string("Give us a sentence or two.")
    .trim()
    .min(10, "Give us a sentence or two.")
    .max(5000, "That's a lot. Keep it under 5,000 characters and we'll ask for the rest."),
});

export type Inquiry = z.infer<typeof inquirySchema>;

export function readInquiry(formData: FormData) {
  return inquirySchema.safeParse({
    name: formData.get("name") ?? "",
    email: formData.get("email") ?? "",
    company: formData.get("company") ?? "",
    services: formData.getAll("services"),
    timeline: formData.get("timeline") ?? "",
    message: formData.get("message") ?? "",
  });
}

/** First message per field, keyed by field name. */
export function fieldErrors(error: z.ZodError) {
  const errors: Record<string, string> = {};
  for (const issue of error.issues) {
    const key = String(issue.path[0] ?? "form");
    errors[key] ??= issue.message;
  }
  return errors;
}
