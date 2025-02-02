import axios from "axios";
import { useState } from "react";
import { Link } from "react-router-dom";
import { logout } from "../../features/setUser";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { RootState } from "../../store/store";

const Navbar = () => {
  const user = useSelector((state: RootState) => state.user);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const Navigate = useNavigate();
  const dispatch = useDispatch();
  const logoutFunc = async () => {
    const response = await axios.get("/api/user/logout", {
      withCredentials: true,
      headers: {
        "Content-Type": "application/json",
      },
    });
    if (response.status == 200) {
      dispatch(logout());
      Navigate("/");
    }
    setIsMenuOpen(false);
  };

  return (
    <nav className="bg-white fixed w-full top-0 z-40">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-24">
          {/* Logo Section */}
          <div className="flex-shrink-0 flex items-center">
            <Link to="/" className="flex items-center">
              <span className="text-2xl font-bold text-blue-600">
                <img src="/icon.png" className="h-16" alt="" />
              </span>
            </Link>
          </div>

          {/* Desktop Menu */}
          <div className="hidden md:flex items-center space-x-8">
            <div className="flex items-center space-x-4">
              <div>
                Welcome <b className="text-blue-600">{user.name}</b>
              </div>
              <button
                onClick={logoutFunc}
                className="text-blue-600 ring ring-blue hover:ring-blue-800 hover:text-blue-700 px-3 py-2 rounded-md text-sm font-medium border-ring"
              >
                Logout
              </button>
            </div>
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden flex items-center">
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="inline-flex items-center justify-center p-2 rounded-md text-gray-700 hover:text-blue-600 focus:outline-none"
            >
              <svg
                className="h-6 w-6"
                stroke="currentColor"
                fill="none"
                viewBox="0 0 24 24"
              >
                {isMenuOpen ? (
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M6 18L18 6M6 6l12 12"
                  />
                ) : (
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M4 6h16M4 12h16M4 18h16"
                  />
                )}
              </svg>
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {isMenuOpen && (
        <div className="md:hidden">
          <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
            <div className="space-y-2 pt-2">
              <div className="mx-auto b-2">
                Welcome <b className="text-blue-600">{user.name}</b>
              </div>
              <button
                onClick={logoutFunc}
                className="block w-full text-left bg-blue-600 text-white hover:bg-blue-700 px-3 py-2 rounded-md text-base font-medium"
              >
                Logout
              </button>
            </div>
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
