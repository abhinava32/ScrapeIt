import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

const AboutUs = () => {
  return (
    <>
      <Navbar></Navbar>
      <div className="bg-white">
        {/* Hero Section */}
        <div className="relative overflow-hidden bg-white py-28">
          <div className="hidden lg:absolute lg:inset-y-0 lg:block lg:h-full lg:w-full lg:bg-gray-50">
            <div
              className="relative mx-auto h-full max-w-prose text-lg"
              aria-hidden="true"
            >
              <svg
                className="absolute top-12 left-full transform translate-x-32"
                width="404"
                height="384"
                fill="none"
                viewBox="0 0 404 384"
              >
                <defs>
                  <pattern
                    id="74b3fd99-0a6f-4271-bef2-e80eeafdf357"
                    x="0"
                    y="0"
                    width="20"
                    height="20"
                    patternUnits="userSpaceOnUse"
                  >
                    <rect
                      x="0"
                      y="0"
                      width="4"
                      height="4"
                      className="text-gray-200"
                      fill="currentColor"
                    />
                  </pattern>
                </defs>
                <rect
                  width="404"
                  height="384"
                  fill="url(#74b3fd99-0a6f-4271-bef2-e80eeafdf357)"
                />
              </svg>
            </div>
          </div>

          <div className="relative px-4 sm:px-6 lg:px-8">
            <div className="mx-auto max-w-7xl">
              <div className="grid grid-cols-1 gap-12 lg:grid-cols-2 lg:gap-8 items-center">
                {/* Content */}
                <div>
                  <h1 className="text-4xl font-bold tracking-tight text-gray-900 sm:text-5xl">
                    Transforming Data Collection
                    <span className="block text-blue-600">Since 2019</span>
                  </h1>
                  <p className="mt-6 text-xl leading-8 text-gray-600">
                    For over 5 years, Scrape2Data has been at the forefront of
                    web scraping technology, providing businesses with quality
                    data solutions that drive growth and innovation.
                  </p>
                  <div className="mt-8 space-y-6 text-gray-500">
                    <p>
                      Our journey began with a simple mission: to make web data
                      accessible to everyone. Today, we serve thousands of
                      clients worldwide, from startups to enterprise
                      organizations, helping them make data-driven decisions.
                    </p>
                    <p>
                      With our advanced scraping technology and dedicated
                      support team, we ensure that our clients receive accurate,
                      reliable, and timely data, tailored to their specific
                      needs.
                    </p>
                  </div>

                  {/* Stats */}
                  <div className="mt-10 grid grid-cols-2 gap-8 border-t border-gray-200 pt-10">
                    <div>
                      <p className="text-4xl font-bold text-blue-600">
                        5+ Years
                      </p>
                      <p className="mt-2 text-base text-gray-500">
                        Industry Experience
                      </p>
                    </div>
                    <div>
                      <p className="text-4xl font-bold text-blue-600">10M+</p>
                      <p className="mt-2 text-base text-gray-500">
                        Data Points Collected
                      </p>
                    </div>
                  </div>
                </div>

                {/* SVG Illustration */}
                <div className="relative">
                  <svg
                    className="w-full h-auto"
                    viewBox="0 0 500 500"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    {/* Background Elements */}
                    <circle cx="250" cy="250" r="200" fill="#EBF4FF" />
                    <path
                      d="M150 350 C 150 350, 350 350, 350 350"
                      stroke="#C3DAFE"
                      strokeWidth="2"
                      fill="none"
                    />

                    {/* Data Visualization Elements */}
                    <g transform="translate(180, 150)">
                      {/* Bar Chart */}
                      <rect
                        x="0"
                        y="100"
                        width="20"
                        height="100"
                        fill="#3B82F6"
                      />
                      <rect
                        x="30"
                        y="80"
                        width="20"
                        height="120"
                        fill="#60A5FA"
                      />
                      <rect
                        x="60"
                        y="60"
                        width="20"
                        height="140"
                        fill="#93C5FD"
                      />
                      <rect
                        x="90"
                        y="40"
                        width="20"
                        height="160"
                        fill="#BFDBFE"
                      />
                    </g>

                    {/* Professional Figure */}
                    <g transform="translate(200, 180)">
                      {/* Head */}
                      <circle cx="50" cy="30" r="25" fill="#4B5563" />

                      {/* Body */}
                      <path
                        d="M50 55 L50 120 M20 80 L80 80 M50 120 L30 180 M50 120 L70 180"
                        stroke="#4B5563"
                        strokeWidth="8"
                        fill="none"
                      />

                      {/* Laptop/Device */}
                      <rect
                        x="20"
                        y="70"
                        width="60"
                        height="40"
                        fill="#3B82F6"
                        rx="5"
                      />
                      <rect
                        x="25"
                        y="75"
                        width="50"
                        height="30"
                        fill="#BFDBFE"
                        rx="3"
                      />
                    </g>

                    {/* Data Flow Lines */}
                    <g>
                      <path
                        d="M150 150 C 200 100, 300 100, 350 150"
                        stroke="#60A5FA"
                        strokeWidth="2"
                        fill="none"
                        strokeDasharray="5,5"
                      />
                      <path
                        d="M150 200 C 200 150, 300 150, 350 200"
                        stroke="#93C5FD"
                        strokeWidth="2"
                        fill="none"
                        strokeDasharray="5,5"
                      />
                    </g>
                  </svg>
                </div>
              </div>

              {/* Features Section */}
              <div className="mt-16 grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
                {[
                  {
                    title: "Expert Team",
                    description:
                      "Our team of data specialists ensures the highest quality of service.",
                    icon: (
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M15 19.128a9.38 9.38 0 002.625.372 9.337 9.337 0 004.121-.952 4.125 4.125 0 00-7.533-2.493M15 19.128v-.003c0-1.113-.285-2.16-.786-3.07M15 19.128v.106A12.318 12.318 0 018.624 21c-2.331 0-4.512-.645-6.374-1.766l-.001-.109a6.375 6.375 0 0111.964-3.07M12 6.375a3.375 3.375 0 11-6.75 0 3.375 3.375 0 016.75 0zm8.25 2.25a2.625 2.625 0 11-5.25 0 2.625 2.625 0 015.25 0z"
                      />
                    ),
                  },
                  {
                    title: "Reliable Data",
                    description:
                      "Accurate and up-to-date information you can trust.",
                    icon: (
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M9 12.75L11.25 15 15 9.75m-3-7.036A11.959 11.959 0 013.598 6 11.99 11.99 0 003 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285z"
                      />
                    ),
                  },
                  {
                    title: "Custom Solutions",
                    description:
                      "Tailored scraping solutions for your specific needs.",
                    icon: (
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M11.42 15.17L17.25 21A2.652 2.652 0 0021 17.25l-5.877-5.877M11.42 15.17l2.496-3.03c.317-.384.74-.626 1.208-.766M11.42 15.17l-4.655 5.653a2.548 2.548 0 11-3.586-3.586l6.837-5.63m5.108-.233c.55-.164 1.163-.188 1.743-.14a4.5 4.5 0 004.486-6.336l-3.276 3.277a3.004 3.004 0 01-2.25-2.25l3.276-3.276a4.5 4.5 0 00-6.336 4.486c.091 1.076-.071 2.264-.904 2.95l-.102.085m-1.745 1.437L5.909 7.5H4.5L2.25 3.75l1.5-1.5L7.5 4.5v1.409l4.26 4.26m-1.745 1.437l1.745-1.437m6.615 8.206L15.75 15.75M4.867 19.125h.008v.008h-.008v-.008z"
                      />
                    ),
                  },
                ].map((feature) => (
                  <div key={feature.title} className="relative">
                    <dt>
                      <div className="absolute flex h-12 w-12 items-center justify-center rounded-md bg-blue-600 text-white">
                        <svg
                          className="h-6 w-6"
                          xmlns="http://www.w3.org/2000/svg"
                          fill="none"
                          viewBox="0 0 24 24"
                          strokeWidth={1.5}
                          stroke="currentColor"
                        >
                          {feature.icon}
                        </svg>
                      </div>
                      <p className="ml-16 text-lg font-medium leading-6 text-gray-900">
                        {feature.title}
                      </p>
                    </dt>
                    <dd className="mt-2 ml-16 text-base text-gray-500">
                      {feature.description}
                    </dd>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
      <Footer></Footer>
    </>
  );
};

export default AboutUs;
