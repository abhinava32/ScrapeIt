import { useState, useEffect } from "react";
import { TypeAnimation } from "react-type-animation";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

const CarouselSection = () => {
  const [currentSlide, setCurrentSlide] = useState(0);

  const carouselData = [
    {
      title: "E-commerce Data",
      description:
        "Extract product prices, descriptions, and reviews automatically",
      typingText: ["Products", 1000, "Prices", 1000, "Reviews", 1000],
      color: "blue",
      svg: (
        <svg
          className="w-full h-full"
          viewBox="0 0 400 300"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          {/* Shopping Cart and Data Elements */}
          <circle cx="200" cy="150" r="130" fill="#EBF8FF" />
          <g transform="translate(100, 70)">
            {/* Shopping Cart */}
            <path
              d="M40 120h160l20-80H20l20 80z"
              fill="#3B82F6"
              stroke="#2563EB"
              strokeWidth="4"
            />
            <path
              d="M60 140a15 15 0 100 30 15 15 0 000-30zM180 140a15 15 0 100 30 15 15 0 000-30z"
              fill="#1D4ED8"
            />
            {/* Data Points */}
            <g transform="translate(0, -40)">
              <rect
                x="40"
                y="20"
                width="20"
                height="60"
                fill="#60A5FA"
                rx="2"
              />
              <rect
                x="70"
                y="40"
                width="20"
                height="40"
                fill="#93C5FD"
                rx="2"
              />
              <rect
                x="100"
                y="30"
                width="20"
                height="50"
                fill="#BFDBFE"
                rx="2"
              />
              {/* Price Tags */}
              <text x="45" y="10" fill="#1D4ED8" fontSize="12">
                $
              </text>
              <text x="75" y="30" fill="#1D4ED8" fontSize="12">
                $
              </text>
              <text x="105" y="20" fill="#1D4ED8" fontSize="12">
                $
              </text>
            </g>
          </g>
        </svg>
      ),
    },
    {
      title: "Social Media Insights",
      description: "Gather social media metrics and engagement data",
      typingText: ["Trends", 1000, "Metrics", 1000, "Analytics", 1000],
      color: "blue",
      svg: (
        <svg
          className="w-full h-full"
          viewBox="0 0 400 300"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          {/* Social Media Analytics Visual */}
          <circle cx="200" cy="150" r="130" fill="#EBF8FF" />
          <g transform="translate(80, 60)">
            {/* Network Connections */}
            <g stroke="#3B82F6" strokeWidth="2">
              <line x1="120" y1="90" x2="180" y2="60" />
              <line x1="120" y1="90" x2="60" y2="60" />
              <line x1="120" y1="90" x2="120" y2="150" />
              <line x1="120" y1="90" x2="180" y2="120" />
              <line x1="120" y1="90" x2="60" y2="120" />
            </g>
            {/* Connection Points */}
            <circle cx="120" cy="90" r="20" fill="#2563EB" />
            <circle cx="180" cy="60" r="15" fill="#60A5FA" />
            <circle cx="60" cy="60" r="15" fill="#60A5FA" />
            <circle cx="120" cy="150" r="15" fill="#60A5FA" />
            <circle cx="180" cy="120" r="15" fill="#60A5FA" />
            <circle cx="60" cy="120" r="15" fill="#60A5FA" />
            {/* Analytics Lines */}
            <g transform="translate(220, 40)">
              <rect width="40" height="120" fill="#BFDBFE" opacity="0.3" />
              <path d="M0 120 L40 80 L40 120 Z" fill="#3B82F6" />
              <path d="M0 120 L40 40 L40 80 L0 120" fill="#60A5FA" />
            </g>
          </g>
        </svg>
      ),
    },
    {
      title: "Real Estate Data",
      description: "Collect property listings and market analysis",
      typingText: ["Properties", 1000, "Prices", 1000, "Markets", 1000],
      color: "blue",
      svg: (
        <svg
          className="w-full h-full"
          viewBox="0 0 400 300"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          {/* Real Estate Visual */}
          <circle cx="200" cy="150" r="130" fill="#EBF8FF" />
          <g transform="translate(100, 70)">
            {/* Buildings */}
            <g>
              {/* Building 1 */}
              <rect x="20" y="60" width="60" height="100" fill="#3B82F6" />
              <rect x="30" y="70" width="15" height="15" fill="#BFDBFE" />
              <rect x="55" y="70" width="15" height="15" fill="#BFDBFE" />
              <rect x="30" y="95" width="15" height="15" fill="#BFDBFE" />
              <rect x="55" y="95" width="15" height="15" fill="#BFDBFE" />
              <rect x="30" y="120" width="15" height="15" fill="#BFDBFE" />
              <rect x="55" y="120" width="15" height="15" fill="#BFDBFE" />

              {/* Building 2 */}
              <rect x="100" y="40" width="70" height="120" fill="#2563EB" />
              <rect x="110" y="50" width="20" height="20" fill="#BFDBFE" />
              <rect x="140" y="50" width="20" height="20" fill="#BFDBFE" />
              <rect x="110" y="80" width="20" height="20" fill="#BFDBFE" />
              <rect x="140" y="80" width="20" height="20" fill="#BFDBFE" />
              <rect x="110" y="110" width="20" height="20" fill="#BFDBFE" />
              <rect x="140" y="110" width="20" height="20" fill="#BFDBFE" />

              {/* Graph Elements */}
              <g transform="translate(180, 40)">
                <rect width="15" height="120" fill="#BFDBFE" opacity="0.2" />
                <rect width="15" height="80" fill="#3B82F6" />
                <rect
                  x="25"
                  width="15"
                  height="120"
                  fill="#BFDBFE"
                  opacity="0.2"
                />
                <rect x="25" width="15" height="95" fill="#3B82F6" />
                <rect
                  x="50"
                  width="15"
                  height="120"
                  fill="#BFDBFE"
                  opacity="0.2"
                />
                <rect x="50" width="15" height="60" fill="#3B82F6" />
              </g>
            </g>
          </g>
        </svg>
      ),
    },
  ];

  const settings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 5000,
    beforeChange: (oldIndex: number, newIndex: number) => {
      setCurrentSlide(newIndex);
    },
    customPaging: (i: number) => (
      <div
        className={`w-3 h-3 rounded-full transition-all duration-300 ${
          i === currentSlide
            ? `bg-${carouselData[currentSlide].color}-600`
            : "bg-gray-300"
        }`}
      />
    ),
  };

  return (
    <div className="relative bg-gray-50 py-16 sm:py-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center mb-16">
          <h2 className="text-3xl font-extrabold tracking-tight text-gray-900 sm:text-4xl">
            Scrape Any Type of Data
          </h2>
          <p className="mt-4 max-w-2xl mx-auto text-xl text-gray-500">
            Powerful scraping solutions for{" "}
            <span className="text-blue-600 font-semibold">
              <TypeAnimation
                sequence={[
                  "e-commerce",
                  2000,
                  "social media",
                  2000,
                  "real estate",
                  2000,
                ]}
                wrapper="span"
                repeat={Infinity}
              />
            </span>
          </p>
        </div>

        {/* Carousel */}
        <div className="relative">
          <Slider {...settings}>
            {carouselData.map((slide, index) => (
              <div key={index} className="px-4">
                <div className="relative bg-white border-2 border-green-600 rounded-2xl shadow-xl overflow-hidden">
                  <div className="lg:grid lg:grid-cols-2 lg:gap-8">
                    {/* Content */}
                    <div className="p-8 sm:p-12">
                      <h3
                        className={`text-2xl font-bold text-${slide.color}-600 mb-4`}
                      >
                        {slide.title}
                      </h3>
                      <p className="text-gray-600 mb-6">{slide.description}</p>
                      <div className="h-16">
                        <TypeAnimation
                          sequence={slide.typingText}
                          wrapper="div"
                          repeat={Infinity}
                          className={`text-3xl font-bold text-${slide.color}-600`}
                        />
                      </div>
                      <div className="mt-8">
                        <button
                          className={`inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md shadow-sm text-white bg-${slide.color}-600 hover:bg-${slide.color}-700 transition-colors duration-300`}
                        >
                          Learn More
                          <svg
                            className="ml-2 -mr-1 w-5 h-5"
                            xmlns="http://www.w3.org/2000/svg"
                            viewBox="0 0 20 20"
                            fill="currentColor"
                          >
                            <path
                              fillRule="evenodd"
                              d="M10.293 3.293a1 1 0 011.414 0l6 6a1 1 0 010 1.414l-6 6a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-4.293-4.293a1 1 0 010-1.414z"
                              clipRule="evenodd"
                            />
                          </svg>
                        </button>
                      </div>
                    </div>

                    {/* Image */}
                    <div className="relative p-8">{slide.svg}</div>
                  </div>
                </div>
              </div>
            ))}
          </Slider>
        </div>

        {/* Features Grid */}
        <div className="mt-16 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {[
            {
              title: "Automated Extraction",
              description: "Set up once, get data automatically on schedule",
              icon: "⚡",
            },
            {
              title: "Clean Data Output",
              description: "Get structured data in JSON, CSV, or Excel format",
              icon: "📊",
            },
            {
              title: "API Integration",
              description: "Connect with your existing tools and workflows",
              icon: "🔄",
            },
          ].map((feature) => (
            <div
              key={feature.title}
              className="relative group bg-white p-6 rounded-lg shadow-sm hover:shadow-lg transition-shadow duration-200"
            >
              <div className="text-3xl mb-4">{feature.icon}</div>
              <h3 className="text-lg font-medium text-gray-900">
                {feature.title}
              </h3>
              <p className="mt-2 text-sm text-gray-500">
                {feature.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default CarouselSection;
