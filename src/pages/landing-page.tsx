import { LandingPageFeatures } from "@/components/landing-page-features";
import LandingPageFooter from "@/components/landing-page-footer";
import { LandingPageHeroSection } from "@/components/landing-page-hero-section";
import { LandingPageNavBar } from "@/components/landing-page-navbar";
import LandingPageNewsLetter from "@/components/landing-page-newsletter";
import LandingPagePricing from "@/components/landing-page-pricing";
import { Section } from "@/components/section";

const LandingPage = () => {
  return (
    <div className="overflow-x-hidden">
      <LandingPageNavBar />
      <LandingPageHeroSection />
      <Section>
        <LandingPageFeatures />
        <LandingPagePricing />
        <LandingPageNewsLetter />
      </Section>
      <LandingPageFooter />
    </div>
  );
};

export default LandingPage;
