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
  const prompt = await fs.readFile(`prompt.txt`, "utf-8");

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
              ${prompt}
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
