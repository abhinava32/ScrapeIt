import { useNavigate } from "react-router-dom";

const NotFound = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-white flex flex-col lg:relative">
      <div className="flex-grow flex flex-col">
        <main className="flex-grow flex flex-col bg-white">
          <div className="flex-grow mx-auto max-w-7xl w-full flex flex-col px-4 sm:px-6 lg:px-8">
            <div className="flex-shrink-0 my-auto py-16 sm:py-32">
              <p className="text-sm font-semibold text-blue-600 uppercase tracking-wide">
                404 error
              </p>
              <h1 className="mt-2 text-4xl font-extrabold text-gray-900 tracking-tight sm:text-5xl">
                Page not found
              </h1>
              <p className="mt-4 text-base text-gray-500">
                Sorry, we couldn't find the page you're looking for.
              </p>

              <div className="mt-6 flex space-x-4">
                <button
                  onClick={() => navigate(-1)}
                  className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-blue-700 bg-blue-100 hover:bg-blue-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                >
                  <svg
                    className="mr-2 -ml-1 w-5 h-5"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M10 19l-7-7m0 0l7-7m-7 7h18"
                    />
                  </svg>
                  Go back
                </button>
                <button
                  onClick={() => navigate("/")}
                  className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                >
                  <svg
                    className="mr-2 -ml-1 w-5 h-5"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"
                    />
                  </svg>
                  Go home
                </button>
              </div>

              {/* 404 SVG Illustration */}
              <div className="mt-12">
                <svg
                  className="h-auto w-full max-w-lg mx-auto"
                  viewBox="0 0 600 400"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  {/* Background */}
                  <rect width="600" height="400" fill="#F3F4F6" rx="8" />

                  {/* 404 Text */}
                  <text
                    x="300"
                    y="180"
                    fontSize="120"
                    fontWeight="bold"
                    fill="#E5E7EB"
                    textAnchor="middle"
                  >
                    404
                  </text>

                  {/* Broken Link Illustration */}
                  <g transform="translate(250, 220)">
                    {/* Left Chain */}
                    <path
                      d="M0,0 L40,0"
                      stroke="#9CA3AF"
                      strokeWidth="12"
                      strokeLinecap="round"
                    />
                    <circle cx="20" cy="0" r="8" fill="#9CA3AF" />

                    {/* Break */}
                    <path
                      d="M50,-10 L60,10 M70,-10 L60,10"
                      stroke="#DC2626"
                      strokeWidth="4"
                      strokeLinecap="round"
                    />

                    {/* Right Chain */}
                    <path
                      d="M80,0 L120,0"
                      stroke="#9CA3AF"
                      strokeWidth="12"
                      strokeLinecap="round"
                    />
                    <circle cx="100" cy="0" r="8" fill="#9CA3AF" />
                  </g>

                  {/* Decorative Elements */}
                  <circle
                    cx="480"
                    cy="80"
                    r="40"
                    fill="#BFDBFE"
                    opacity="0.5"
                  />
                  <circle
                    cx="120"
                    cy="300"
                    r="30"
                    fill="#93C5FD"
                    opacity="0.5"
                  />
                  <path
                    d="M420,280 Q460,240 500,280"
                    stroke="#60A5FA"
                    strokeWidth="4"
                    fill="none"
                    opacity="0.5"
                  />
                </svg>
              </div>

              {/* Helpful Links */}
              <div className="mt-12">
                <h2 className="text-sm font-semibold text-gray-500 tracking-wide uppercase">
                  Popular pages
                </h2>
                <ul className="mt-4 border-t border-b border-gray-200 divide-y divide-gray-200">
                  {[
                    { title: "Home", path: "/" },
                    { title: "About Us", path: "/about" },
                    { title: "Pricing", path: "/pricing" },
                    { title: "Contact", path: "/contact" },
                  ].map((link) => (
                    <li key={link.title} className="relative py-4">
                      <button
                        onClick={() => navigate(link.path)}
                        className="hover:text-blue-600 text-gray-600 text-sm w-full text-left flex items-center justify-between"
                      >
                        <span>{link.title}</span>
                        <svg
                          className="w-5 h-5"
                          xmlns="http://www.w3.org/2000/svg"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M9 5l7 7-7 7"
                          />
                        </svg>
                      </button>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default NotFound;
