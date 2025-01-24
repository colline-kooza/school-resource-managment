import Hero from "@/components/frontend/Hero";
import PreHero from "@/components/frontend/pre-hero";
import QuickAccess from "@/components/frontend/quickaccess";
import { getData } from "@/lib/getData";
import Image from "next/image";

export default async function Home() {

  return (
    <div className="">
      <Hero/>
      <PreHero/>
      <QuickAccess/>
      <p>Lorem ipsum, dolor sit amet consectetur adipisicing elit. Placeat quos, amet dolores dolore magnam expedita laborum aliquam obcaecati cupiditate quasi magni provident dolorem nihil, quibusdam alias voluptatem sint assumenda beatae unde ipsa ab ipsam laudantium aut eveniet. Saepe aspernatur cupiditate dignissimos quis similique minus sint veritatis non autem. Commodi, quos corrupti? Deleniti, saepe dicta beatae eius, iure molestiae nesciunt sed vel possimus similique error officia sequi mollitia aut cumque ipsum debitis sapiente non cupiditate culpa dolor quod ex accusantium. Nam eaque quis aliquam. Voluptatem tempore atque similique excepturi libero distinctio cum! Facilis doloribus esse veritatis laboriosam, saepe harum cumque ea?</p>
    </div>
  );
}
