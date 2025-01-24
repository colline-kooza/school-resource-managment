import Hero from "@/components/frontend/Hero";
import { getData } from "@/lib/getData";
import Image from "next/image";

export default async function Home() {

  return (
    <div className="">
      <Hero/>
    </div>
  );
}
