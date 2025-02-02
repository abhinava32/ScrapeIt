import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import Signup from "./pages/Signup";
import { useEffect, useState } from "react";
import Login from "./pages/Login";
import ForgotPassword from "./pages/ForgotPassword";
import AboutUs from "./pages/AboutUs";
import NotFound from "./pages/NotFound";
import PricingPage from "./pages/PricingPage";
import ContactUs from "./pages/ContactUs";
import MainApp from "./pages/MainApp";
import LoadingLogo from "./components/LoadingLogo";
import axios from "axios";
import { useDispatch } from "react-redux";
import { AppDispatch } from "./store/store";
import { login } from "./features/setUser";

function App() {
  const [isLoaded, setLoaded] = useState(false);
  const dispatch = useDispatch<AppDispatch>();

  const request = async () => {
    try {
      const response = await axios.get("/api/user/profile", {
        withCredentials: true,
        timeout: 3000,
      });

      dispatch(
        login({
          isLoggedIn: true,
          name: response.data.data.name,
          email: response.data.data.email,
          avatar: response.data.data.avatar,
          id: response.data.data.id,
        })
      );
    } catch (err) {
      console.log("User not logged in");
    }
    setLoaded(true);
  };

  useEffect(() => {
    setTimeout(request, 2000);
  }, []);

  return (
    <>
      {isLoaded ? (
        <Router>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/signup" element={<Signup />}></Route>
            <Route path="/about" element={<AboutUs />} />
            <Route path="/login" element={<Login />}></Route>
            <Route path="/forgot-password" element={<ForgotPassword />} />
            <Route path="/pricing" element={<PricingPage />} />
            <Route path="/contact" element={<ContactUs />} />
            <Route path="/app" element={<MainApp />} /> //temporary for
            accessing the app
            <Route path="*" element={<NotFound />} />
          </Routes>
        </Router>
      ) : (
        // <div className="w-20 h-20 mt-60 m-auto">Loadi</div>
        <LoadingLogo />
      )}
    </>
  );
}

export default App;
