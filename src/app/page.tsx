import { Hero } from "@/components/home/Hero";
import { Manifesto } from "@/components/home/Manifesto";
import { ServicesRail } from "@/components/home/ServicesRail";
import { BeforeAfter } from "@/components/home/BeforeAfter";
import { Process } from "@/components/home/Process";
import { SelectedWork } from "@/components/home/SelectedWork";
import { StackMarquee } from "@/components/home/StackMarquee";
import { AppShowcase } from "@/components/sections/AppShowcase";
import { Faq } from "@/components/sections/Faq";
import { BigCta } from "@/components/sections/BigCta";
import { FAQ, PROJECTS, SITE } from "@/lib/content";

export default function HomePage() {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "ProfessionalService",
    name: SITE.name,
    description: SITE.description,
    url: SITE.url,
    areaServed: "Worldwide",
    knowsAbout: ["Web development", "Shopify apps", "WordPress plugins", "Web apps", "Business automation"],
  };

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <Hero />
      <Manifesto />
      <ServicesRail />
      <BeforeAfter />
      <Process />
      <SelectedWork />
      <AppShowcase
        projects={PROJECTS.filter((p) => p.tags.includes("shopify") && p.image)}
        index="06"
        eyebrow="Our Shopify apps"
        title={
          <>
            <span className="heavy">We ship</span> <span className="light">our own.</span>
          </>
        }
        intro="Besides client work, we build and run our own Shopify apps. Same review process, same Polaris rules, same merchants. It keeps us sharp for yours."
      />
      <StackMarquee />
      <Faq items={FAQ} />
      <BigCta />
    </>
  );
}
