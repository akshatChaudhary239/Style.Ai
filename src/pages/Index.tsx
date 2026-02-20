import { Navbar } from "@/components/Navbar";
import { HeroSection } from "@/components/HeroSection";
import { AboutSection } from "@/components/AboutSection";
import { StoriesSection } from "@/components/StoriesSection";
import { VisionSection } from "@/components/VisionSection";
import { GallerySection } from "@/components/GallerySection";
import { Footer } from "@/components/Footer";

export default function Index() {
  return (
    <div className="min-h-screen bg-background text-foreground overflow-x-hidden">
      <Navbar />
      <HeroSection />
      <AboutSection />
      <StoriesSection />
      <VisionSection />
      <GallerySection />
      <Footer />
    </div>
  );
}
