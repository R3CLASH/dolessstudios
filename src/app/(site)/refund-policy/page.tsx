import type { Metadata } from "next";
import { getLegalPage } from "@/lib/content";
import { LegalDoc } from "@/components/sections/LegalDoc";

const page = getLegalPage("refund-policy");

export const metadata: Metadata = {
  title: page.title,
  description: page.intro,
  alternates: { canonical: "/refund-policy" },
};

export default function RefundPolicyPage() {
  return <LegalDoc page={page} />;
}
