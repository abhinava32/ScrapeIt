import Navbar from "../components/Navbar";
import Hero from "../components/homeComponents/Hero";
import Pricing from "../components/homeComponents/Pricing";
import CarouselSection from "../components/homeComponents/CarouselSection";
import Footer from "../components/Footer";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "../store/store";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

const Home = () => {
  const user = useSelector((state: RootState) => state.user);
  const navigate = useNavigate();
  useEffect(() => {
    if (user.isLoggedIn) {
      navigate(`/app`);
    }
  }, []);
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
