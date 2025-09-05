import Navbar from "@/components/own/navbar";
import Hero from "@/components/own/hero";
import Skills from "@/components/own/skills";
import Footer from "@/components/own/footer";
import Contact from "@/components/own/contact";
import Stats from "@/components/own/stats";
import About from "@/components/own/about";

export default function PageHome() {
  return (
    <>
      <Navbar />
      <Hero />
      <About />
      <Stats />
      <Skills />
      <Contact />
      <Footer />
    </>
  );
}
