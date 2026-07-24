import Navbar from "../components/home/Navbar";
import Hero from "../components/home/Hero";
import Features from "../components/home/Features";
import HowItWorks from "../components/home/HowItWorks";
import TechStack from "../components/home/TechStack";
import Footer from "../components/home/Footer";

const HomePage = () => {
  return (
    <>
      <Navbar />
      <Hero />
      <Features />
      <HowItWorks />
      <TechStack />
      <Footer />
    </>
  );
};

export default HomePage;