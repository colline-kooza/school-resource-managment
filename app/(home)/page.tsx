import FAQSection from "@/components/frontend/faq";
import AgricultureFeatures from "@/components/frontend/features";
import Hero from "@/components/frontend/Hero";
import QuickLinks from "@/components/frontend/links";
import NewsletterSubscription from "@/components/frontend/newsletter";
import PreHero from "@/components/frontend/pre-hero";
import QuickAccess from "@/components/frontend/quickaccess";
import AnimatedStatistics from "@/components/frontend/statistics";
import { getData } from "@/lib/getData";
import Image from "next/image";

export default async function Home() {

  return (
    <div className="">
      <Hero/>
      <PreHero/>
      <AnimatedStatistics/>
      <QuickAccess/>
      <QuickLinks/>
      <AgricultureFeatures/>
      <FAQSection/>
      <NewsletterSubscription/>
    </div>
    
  );
}
