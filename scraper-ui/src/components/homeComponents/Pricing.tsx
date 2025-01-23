import { useState } from "react";
import { useNavigate } from "react-router-dom";

const Pricing = () => {
  const [isAnnual, setIsAnnual] = useState(false);
  const navigate = useNavigate();

  const pricingPlans = [
    {
      name: "Silver",
      monthlyPrice: 29,
      annualPrice: 290,
      features: [
        "Basic web scraping",
        "1000 requests per month",
        "Email support",
        "Basic API access",
        "Data export (CSV, JSON)",
      ],
      color: "gray",
    },
    {
      name: "Gold",
      monthlyPrice: 59,
      annualPrice: 590,
      features: [
        "Advanced web scraping",
        "5000 requests per month",
        "Priority email support",
        "Full API access",
        "All export formats",
        "Custom scheduling",
      ],
      color: "yellow",
      popular: true,
    },
    {
      name: "Platinum",
      monthlyPrice: 99,
      annualPrice: 990,
      features: [
        "Enterprise web scraping",
        "Unlimited requests",
        "24/7 phone support",
        "Advanced API features",
        "Custom solutions",
        "Dedicated account manager",
        "Custom integrations",
      ],
      color: "blue",
    },
  ];

  return (
    <div className="py-24 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Pricing Header */}
        <div className="text-center">
          <h2 className="text-3xl font-extrabold text-gray-900 sm:text-4xl">
            Simple, Transparent Pricing
          </h2>
          <p className="mt-4 text-lg text-gray-600">
            Choose the perfect plan for your scraping needs
          </p>
        </div>

        {/* Billing Toggle */}
        <div className="mt-12 flex justify-center items-center space-x-3">
          <span
            className={`text-sm ${
              !isAnnual ? "text-gray-900 font-semibold" : "text-gray-500"
            }`}
          >
            Monthly
          </span>
          <button
            className="relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 bg-gray-200"
            onClick={() => setIsAnnual(!isAnnual)}
          >
            <span
              className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${
                isAnnual ? "translate-x-5" : "translate-x-0"
              }`}
            />
          </button>
          <span
            className={`text-sm ${
              isAnnual ? "text-gray-900 font-semibold" : "text-gray-500"
            }`}
          >
            Annually
            <span className="ml-1.5 inline-flex items-center rounded-full bg-green-100 px-2 py-0.5 text-xs font-medium text-green-800">
              Save 20%
            </span>
          </span>
        </div>

        {/* Pricing Cards */}
        <div className="mt-12 space-y-4 sm:mt-16 sm:grid sm:grid-cols-3 sm:gap-6 sm:space-y-0 lg:mx-auto lg:max-w-4xl xl:mx-0 xl:max-w-none">
          {pricingPlans.map((plan) => (
            <div
              key={plan.name}
              className={`rounded-lg shadow-lg divide-y divide-gray-200 bg-white ${
                plan.popular ? "ring-2 ring-blue-500" : ""
              }`}
            >
              <div className="p-6">
                {plan.popular && (
                  <span className="inline-flex px-4 py-1 rounded-full text-sm font-semibold tracking-wide uppercase bg-blue-100 text-blue-600 mb-4">
                    Most Popular
                  </span>
                )}
                <h3 className="text-2xl font-semibold text-gray-900">
                  {plan.name}
                </h3>
                <p className="mt-8">
                  <span className="text-4xl font-extrabold text-gray-900">
                    ${isAnnual ? plan.annualPrice : plan.monthlyPrice}
                  </span>
                  <span className="text-base font-medium text-gray-500">
                    /{isAnnual ? "year" : "month"}
                  </span>
                </p>
                <button
                  onClick={() => navigate("/signup")}
                  className={`mt-8 block w-full bg-${plan.color}-600 hover:bg-${plan.color}-700 text-white font-semibold rounded-md py-2 px-4 text-center transition duration-150 ease-in-out`}
                >
                  Get Started
                </button>
              </div>
              <div className="px-6 pt-6 pb-8">
                <h4 className="text-sm font-semibold text-gray-900 tracking-wide uppercase">
                  What's included
                </h4>
                <ul className="mt-6 space-y-4">
                  {plan.features.map((feature, index) => (
                    <li key={index} className="flex space-x-3">
                      <svg
                        className="flex-shrink-0 h-5 w-5 text-green-500"
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 20 20"
                        fill="currentColor"
                      >
                        <path
                          fillRule="evenodd"
                          d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                          clipRule="evenodd"
                        />
                      </svg>
                      <span className="text-sm text-gray-500">{feature}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          ))}
        </div>

        {/* Money Back Guarantee */}
        <div className="mt-12 text-center">
          <p className="text-gray-600">
            30-day money-back guarantee • No credit card required • Cancel
            anytime
          </p>
        </div>
      </div>
    </div>
  );
};

export default Pricing;
