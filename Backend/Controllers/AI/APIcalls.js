const cheerio = require("cheerio");
const axios = require("axios");
const fs = require("fs").promises;
const tokenLimit = 30000;

const sendToAi = async (model, link) => {
  // reading file
  const htmlContent = await fs.readFile(`scrape-${link}.html`, "utf-8");
  //console.log("html is ", htmlContent);
  const $ = cheerio.load(htmlContent);
  const reducedContent = $("body").text().trim();
  const tokenEstimate = Math.ceil(reducedContent.length / 4); // Estimate tokens

  console.log("Estimated Tokens:", tokenEstimate);
  if (tokenEstimate > tokenLimit) {
    //console.log("Reduce input size to keep cost below $0.01.");
    return {
      message: "Reduce input size to keep cost below $0.01.",
      costly: true,
    };
  }

  try {
    const response = await axios.post(
      "https://api.openai.com/v1/chat/completions",
      {
        model,
        messages: [
          {
            role: "system",
            content:
              "You are a helpful assistant that extracts information from HTML reduced text. Respond with raw JSON only. Do not include escape characters or format it as a string.",
          },
          {
            role: "user",
            content: `Can you give me the details in a JSON format like this: 
              {
                Contact_Details: {
                  name: [name of the company], 
                  phone: [list of phone (max 3) (retain country codes and area codes in the correct sequence but remove special characters and spaces keeping digits in the correct order)], 
                  email: [list of emails (max 3)], 
                  fax: [fax (remove speacial characters) and do not remove any digit], 
                  country: [country], 
                  address: {
                      street: [street],
                      city: [city],
                      state: [state],
                      country: [country],
                      pincode: [pincode],
                      fullAddress: [full address]
                    }. 
                  },
                Business_Details: {
                  description: [small description],
                  businessType: [Look if the business type is manufacturer. Someone can be Manufacturer only if they make products on their own (service providers are not manufacturer). if business type is not manufacturer then choose only one type of business from the following options only(do not add anything from your side): 
                                    1. Industrial Services (if the business is helping others for manufacturing of products)
                                    2. Exporter
                                    3. Trader
                                    4. Distributor
                                    5. Supplier
                                    6. Wholesaler
                                    7. Others.
                                    
                                ],
                  reason: [reason why you chose this business type],
                  products: [list of max three products in this format:
                    {name: [], description: []}  
                  ],
                  products: [list of max three products (with code number if possible)]
                  extraInfo: [extraInfo in string]
              }
               from the HTML: ${htmlContent}. I only want the details in JSON format.`,
          },
        ],
        temperature: 0.1, // Lower temperature for more consistent output
        response_format: { type: "json_object" },
      },
      {
        headers: {
          Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
          "Content-Type": "application/json",
        },
      }
    );

    // Get the raw response and clean it up
    const aiResponse = response.data.choices[0].message.content;

    // Clean up any escape characters (like \n or \")
    const cleanedJson = aiResponse.replace(/\\n/g, "").replace(/\\"/g, '"');

    // Parse the cleaned JSON
    const jsonResponse = JSON.parse(cleanedJson);
    // console.log("response is ", jsonResponse);
    // console.log("Extracted details:", JSON.stringify(jsonResponse, null, 2));
    return jsonResponse;
  } catch (error) {
    console.error("EAI1: Error contacting OpenAI:", error);
    return res.status(500).json({
      message:
        "Error in contacting AI, please retry again or contact your admin",
      details: error.message,
    });
  }
};

module.exports = sendToAi;
