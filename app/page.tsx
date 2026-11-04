import ContactSection from "@/components/ContactSection";
import CertificatesSection from "@/components/CertificatesSection";
import ProjectsSection from "@/components/ProjectsSection";
import Hero from "@/components/Hero";
import AboutSection from "@/components/AboutSection";

export default function Home() {
  return (
    <>
      <div id="home">
        <Hero />
      </div>
      <div id="about">
        <AboutSection />
      </div>
      <ProjectsSection />
      <CertificatesSection />
      <ContactSection />
    </>
  );
}