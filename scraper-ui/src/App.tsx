import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";
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

function App() {
  const [isLoaded, setLoaded] = useState(false);

  const request = async () => {
    setLoaded(true);
    return true;
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
        <div className="w-20 h-20 mt-60 m-auto">Loading....</div>
      )}
    </>
  );
}

export default App;
