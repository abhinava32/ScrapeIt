const cheerio = require("cheerio");
const axios = require("axios");
const fs = require("fs").promises;
const { getPageHtml } = require("./getPageDetails");

const getDetails = async (link, pageType, domain) => {
  if (!link) {
    return { message: "No link provided" };
  }
  if (process.env.DEBUG_MODE === true) {
    console.log("fetching details from ", link);
  }

  try {
    var { data: html } = await axios.get(link, {
      headers: {
        "User-Agent":
          "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/114.0.0.0 Safari/537.36",
      },
      timeout: 10000,
    });
    // var { data: html } = await axios.get(link);
    // var html = await getPageHtml(link);
  } catch (err) {
    console.log("EGD1: error in getDetails");
    return;
  }

  const $ = cheerio.load(html);
  $(
    "style, script, noscript, iframe, img, link, meta, form, button, svg"
  ).remove();
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
              "service_link":"single_service_page_link"
              "terms_link":"single_terms_link"
              "privacy_link":"single_privacy_link"
              "faq":"single_faq_link"
              "blog":"single_blog_link"
              "careers":"single_careers_link"
              "other_important_link1": "single_other_link_here",
              "other_important_link2": "single_other_link_here",
              "other_important_link3": "single_other_link_here",
              "other_important_link4": "single_other_link_here",
            }
            
            HTML Content: ${htmlContent}`,
          },
        ],
        temperature: 0.3, // Lower temperature for more consistent output
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
      if (process.env.DEBUG_MODE === true) {
        console.log("Extracted links:", JSON.stringify(jsonResponse, null, 2));
      }
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
