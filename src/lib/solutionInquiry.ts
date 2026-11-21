import { z } from "zod";
import { inquirySchema } from "@/lib/inquiry";
import { ADD_ON_IDS, SOLUTION_SLUGS } from "@/lib/content";

/**
 * Quote requests from an off-the-shelf page.
 *
 * Built from `inquirySchema` on purpose: name/email/company/timeline keep the
 * exact same rules, including the single-line guard that stops anything sneaking
 * into an email header. Only the two fields that don't fit are replaced — there
 * are no free-text services here, and the picked add-ons are the brief, so a
 * message isn't required.
 */
export const solutionInquirySchema = inquirySchema.omit({ services: true, message: true }).extend({
  solution: z.enum(SOLUTION_SLUGS, "Pick one of the off-the-shelf sites."),
  addons: z.array(z.enum(ADD_ON_IDS, "That add-on isn't on the list.")).max(40, "That's more add-ons than exist.").default([]),
  message: z
    .string()
    .trim()
    .max(5000, "That's a lot. Keep it under 5,000 characters and we'll ask for the rest.")
    .optional()
    .or(z.literal("")),
});

export type SolutionInquiry = z.infer<typeof solutionInquirySchema>;

export function readSolutionInquiry(formData: FormData) {
  return solutionInquirySchema.safeParse({
    name: formData.get("name") ?? "",
    email: formData.get("email") ?? "",
    company: formData.get("company") ?? "",
    timeline: formData.get("timeline") ?? "",
    solution: formData.get("solution") ?? "",
    addons: formData.getAll("addons"),
    message: formData.get("message") ?? "",
  });
}
