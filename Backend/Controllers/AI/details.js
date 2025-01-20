const cheerio = require("cheerio");
const axios = require("axios");
const fs = require("fs").promises;

const getDetails = async (link, pageType, domain) => {
  console.log("fetching details from  ", link);
  if (!link) {
    return { message: "No link provided" };
  }
  try {
    var { data: html } = await axios.get(link);
  } catch (err) {
    console.log("EGD1: error in getDetails");
    return;
  }

  const $ = cheerio.load(html);
  $("style, script, img, link, meta").remove();
  const text = $("body").text();
  cleanText = text
    .split("\n") // Split by new lines
    .map((line) => line.trim()) // Trim each line
    .filter((line) => line.length > 0) // Remove empty lines
    .join("\n"); // Join lines back

  try {
    await fs.appendFile(`scrape-${domain}.html`, `**** ${pageType}**** \n`);
    await fs.appendFile(`scrape-${domain}.html`, cleanText);
    await fs.appendFile(`scrape-${domain}.html`, `\n`);
    // console.log("file written successfully");
  } catch (error) {
    console.log("EGD2: error wrting file", pageType);
    return null;
  }
};

const getLinks = async (model, domain) => {
  const htmlContent = await fs.readFile(`${domain}-link.txt`);
  // console.log("content: ", htmlContent);

  try {
    const response = await axios.post(
      "https://api.openai.com/v1/chat/completions",
      {
        model,
        messages: [
          {
            role: "system",
            content:
              "You are a JSON formatter. You must respond with valid JSON only, no additional text or explanation. The JSON must follow the exact structure specified in the user's request.",
          },
          {
            role: "user",
            content: `Extract exactly one link for each category (contact-us, about-us, products/services) from the provided HTML content. Please ignore pdf links and Return ONLY a JSON object with this exact structure:
            {
              "contactus_link": "single_contact_link_here",
              "aboutus_link": "single_about_link_here",
              "products_link": "single_product_link_here"
            }
            
            HTML Content: ${htmlContent}`,
          },
        ],
        temperature: 0.1, // Lower temperature for more consistent output
        max_tokens: 1000,
        response_format: { type: "json_object" }, // Enforce JSON response
      },
      {
        headers: {
          Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
          "Content-Type": "application/json",
        },
      }
    );

    const aiResponse = response.data.choices[0].message.content;

    // Additional safety check to ensure valid JSON
    try {
      const jsonResponse = JSON.parse(aiResponse);
      // console.log("Extracted links:", JSON.stringify(jsonResponse, null, 2));
      return jsonResponse;
    } catch (parseError) {
      console.error("EGD3: JSON Parse Error:", parseError);
      // return res.status(500).json({ error: "Invalid JSON response from AI" };
      throw new Error("Invalid JSON response from AI");
    }
  } catch (error) {
    console.error("EGD4: Error contacting OpenAI:");
    throw error;
  }
};

module.exports = {
  getDetails,
  getLinks,
};
