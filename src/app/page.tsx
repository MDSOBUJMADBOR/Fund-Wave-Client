import HeroSection from '@/components/HeroSection';
import HowItWorksSection from '@/components/HowItWorksSection';
import ExploreByCategorySection from '@/components/ExploreByCategorySection';
import ImpactStatsSection from '@/components/ImpactStatsSection';
import TestimonialSection from '@/components/TestimonialSection';

export default function Home() {
  return (
    <main>
      <HeroSection />
      <HowItWorksSection />
      <ExploreByCategorySection />
      <ImpactStatsSection />
      <TestimonialSection />
    </main>
  );
}