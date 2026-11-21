import type { Metadata } from "next";
import { getLegalPage } from "@/lib/content";
import { LegalDoc } from "@/components/sections/LegalDoc";

const page = getLegalPage("terms");

export const metadata: Metadata = {
  title: page.title,
  description: page.intro,
  alternates: { canonical: "/terms" },
};

export default function TermsPage() {
  return <LegalDoc page={page} />;
}
