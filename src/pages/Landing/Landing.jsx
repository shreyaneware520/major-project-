import Navbar from "../../components/Landing/Navbar";
import Hero from "../../components/Landing/Hero";
import FeatureHighlights from "../../components/Landing/FeatureHighlights";
import BenefitsSection from "../../components/Landing/BenefitsSection";
import CTASection from "../../components/Landing/CTASection";
import Footer from "../../components/Landing/Footer";

function Landing() {
  return (
    <div className="min-h-screen flex flex-col font-sans" style={{ backgroundColor: "#040F18" }}>
      <Navbar />
      <main className="flex-grow">
        <Hero />
        <FeatureHighlights />
        <BenefitsSection />
        <CTASection />
      </main>
      <Footer />
    </div>
  );
}

export default Landing;
