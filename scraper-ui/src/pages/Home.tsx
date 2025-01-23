import Navbar from "../components/Navbar";
import Hero from "../components/homeComponents/Hero";
import Pricing from "../components/homeComponents/Pricing";
import CarouselSection from "../components/homeComponents/CarouselSection";
import Footer from "../components/Footer";

const Home = () => {
  return (
    <>
      <Navbar></Navbar>

      <Hero></Hero>
      <CarouselSection></CarouselSection>
      <Pricing></Pricing>
      <Footer></Footer>
    </>
  );
};

export default Home;
