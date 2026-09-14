import HeroSection from '@/components/HeroSection';
import HowItWorksSection from '@/components/HowItWorksSection';
import ExploreByCategorySection from '@/components/ExploreByCategorySection';
import ImpactStatsSection from '@/components/ImpactStatsSection';
import TestimonialSection from '@/components/TestimonialSection';
import TopFoundedCampaigns from '@/components/TopFoundedCampaigns';

export default function Home() {
  return (
    <main>
      <HeroSection />
      <TopFoundedCampaigns />
      <HowItWorksSection />
      <ExploreByCategorySection />
      <ImpactStatsSection />
      <TestimonialSection />
    </main>
  );
}