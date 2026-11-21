import type { Metadata } from "next";
import { getLegalPage } from "@/lib/content";
import { LegalDoc } from "@/components/sections/LegalDoc";

const page = getLegalPage("privacy");

export const metadata: Metadata = {
  title: page.title,
  description: page.intro,
  alternates: { canonical: "/privacy" },
};

export default function PrivacyPage() {
  return <LegalDoc page={page} />;
}
