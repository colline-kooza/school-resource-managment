import FAQSection from "@/components/frontend/faq";
import LearningFeatures from "@/components/frontend/features";
import Hero from "@/components/frontend/Hero";
import HowItWorks from "@/components/frontend/HowItWorks";
import NewsletterSubscription from "@/components/frontend/newsletter";
import AnimatedStatistics from "@/components/frontend/statistics";

export default async function Home() {
  return (
    <div className="bg-white">
      <Hero />
      <AnimatedStatistics />
      <LearningFeatures />
      <HowItWorks />
      <FAQSection />
      <NewsletterSubscription />
    </div>
  );
}


