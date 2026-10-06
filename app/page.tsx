import Hero from "@/components/Hero";
import Marquee from "@/components/Marquee";
import ServiceOverview from "@/components/ServiceOverview";
import Services from "@/components/Services";
import OperatingModel from "@/components/OperatingModel";
import About from "@/components/About";
import Process from "@/components/Process";
import Contact from "@/components/Contact";

export default function Home() {
  return (
    <main className="relative min-h-screen bg-void">
      <Hero />
      <Marquee />
      <ServiceOverview />
      <Services />
      <OperatingModel />
      <About />
      <Process />
      <Contact />
    </main>
  );
}
