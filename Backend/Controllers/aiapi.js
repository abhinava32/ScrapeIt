const axios = require("axios");
const cheerio = require("cheerio");
const fs = require("fs");
const { writeFile } = require("fs/promises");
const model = "gpt-3.5-turbo";
//const model = 'gpt-4-turbo'

const getContactAi = async (link) => {
  console.log("getting contact details");
  if (!link) {
    return { message: "No link provided" };
  }
  const { data: html } = await axios.get(link);
  const $ = cheerio.load(html);
  $("style, script, img, link, meta").remove();
  const text = $("body").text();

  cleanText = text
    .split("\n") // Split by new lines
    .map((line) => line.trim()) // Trim each line
    .filter((line) => line.length > 0) // Remove empty lines
    .join("\n"); // Join lines back
  await writeFile("scrapehtml.html", cleanText);
  const htmlContent = fs.readFileSync("scrapehtml.html", "utf-8");
  const $1 = cheerio.load(htmlContent);

  const reducedContent = $1("body").text().trim();

  const tokenEstimate = Math.ceil(reducedContent.length / 4); // Estimate tokens

  console.log("Estimated Tokens:", tokenEstimate);
  if (tokenEstimate > 700 && model === "gpt-4-turbo") {
    console.log("Reduce input size to keep cost below $0.01.");
    return { message: "Reduce input size to keep cost below $0.01." };
  }

  if (tokenEstimate > 3000 && model === "gpt-3.5-turbo") {
    console.log("Reduce input size to keep cost below $0.01.");
    return { message: "Reduce input size to keep cost below $0.01." };
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
            content: `Can you give me the details in a JSON format like this: phone number, email, fax number, country, and address from the HTML: ${htmlContent}. I only want the details in JSON format. Any extra information should be written like extraInfo: [information]. I will convert this text to JSON.`,
          },
        ],
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
    console.log("Extracted details:", JSON.stringify(jsonResponse, null, 2));
    return jsonResponse;
  } catch (error) {
    console.error("Error contacting OpenAI:", error);
  }
};

module.exports.ask = async (req, res) => {
  const contactRegex = /contact|contact-us|get-in-touch|about\/contact/i;
  const businessRegex =
    /about|company|about-us|vision|our-mission|mission|about-us/i;

  const { url } = req.body;
  console.log("Received URL:", url);
  try {
    // Fetch the HTML from the given URL
    const { data: html } = await axios.get(url);
    if (!html) {
      return res.status(404).json({
        message: "Site not working",
      });
    }
    const $ = cheerio.load(html);
    $("style, script").remove();

    const links = [];
    $("a").each(async (_, element) => {
      const href = $(element).attr("href");
      if (href) {
        links.push(href);
      }
    });

    //getting contact details
    const contactLinks = links.filter((link) => contactRegex.test(link));
    const absoluteLinks = contactLinks.map((link) =>
      link.startsWith("http") ? link : new URL(link, url).href
    );
    const uniqueLinks = [...new Set(absoluteLinks)];
    // const details = await Promise.all(
    //   uniqueLinks.map((link) => getContactAi(link))
    // );
    const details = await getContactAi(uniqueLinks[0]);
    //getting business details
    const businessLinks = links.filter((link) => businessRegex.test(link));
    const absoluteBusinessLinks = businessLinks.map((link) =>
      link.startsWith("http") ? link : new URL(link, url).href
    );
    const uniqueBusinessLinks = [...new Set(absoluteBusinessLinks)];
    console.log("business links: ", uniqueBusinessLinks);
    // const detailBusiness = await Promise.all(
    //   uniqueBusinessLinks.map((link) => getBusinessDetails(link))
    // );
    const detailBusiness = await getBusinessDetails(uniqueBusinessLinks[0]);
    res.json({
      Contact_Details: details,
      Business_Details: detailBusiness,
      message: "Scraping completed successfully.",
    });
  } catch (error) {
    res.status(200).json({ error: "Site not working" });
  }
};

const getBusinessDetails = async (link) => {
  console.log("fetching business details... ");
  if (!link) {
    return { message: "No link provided" };
  }
  const { data: html } = await axios.get(link);
  const $ = cheerio.load(html);
  $("style, script, img, link, meta").remove();
  const text = $("body").text();

  cleanText = text
    .split("\n") // Split by new lines
    .map((line) => line.trim()) // Trim each line
    .filter((line) => line.length > 0) // Remove empty lines
    .join("\n"); // Join lines back
  await writeFile("businessdetails.html", cleanText);
  const htmlContent = fs.readFileSync("businessdetails.html", "utf-8");
  const $1 = cheerio.load(htmlContent);

  const reducedContent = $1("body").text().trim();

  const tokenEstimate = Math.ceil(reducedContent.length / 4); // Estimate tokens

  console.log("Estimated Tokens:", tokenEstimate);
  if (tokenEstimate > 700 && model === "gpt-4-turbo") {
    console.log("Reduce input size to keep cost below $0.01.");
    return { message: "Reduce input size to keep cost below $0.01." };
  }

  if (tokenEstimate > 5000 && model === "gpt-3.5-turbo") {
    console.log("Reduce input size to keep cost below $0.01.");
    return { message: "Reduce input size to keep cost below $0.01." };
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
              "You are a helpful assistant that extracts information from HTML reduced text. Respond only with raw, unformatted JSON. Do not stringify or escape the JSON. It must be returned as a plain, valid JSON object without extra characters or formatting.",
          },
          {
            role: "user",
            content: `Please extract the business details from the HTML: ${htmlContent}. The JSON should include up to 3 products and extra information under 'extraInfo'. Specify the business type from the following options in the response JSON:
          1. Manufacturer
          2. Industrial Services
          3. Exporter
          4. Trader
          5. Distributor
          6. Supplier
          7. Wholesaler
          8. Others.
          Return only valid JSON.`,
          },
        ],
      },
      {
        headers: {
          Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
          "Content-Type": "application/json",
        },
      }
    );

    try {
      const aiResponse = response.data.choices[0].message.content;

      // If the response is still a string with escape characters, clean it
      const cleanedJson = aiResponse.replace(/\\n/g, "").replace(/\\"/g, '"');

      // Parse the JSON response
      const jsonResponse = JSON.parse(cleanedJson);
      console.log("Business details:", JSON.stringify(jsonResponse, null, 2));
      return jsonResponse;
    } catch (error) {
      console.error("Error parsing AI response:", error.message);
    }
  } catch (error) {
    console.error("Error contacting OpenAI:", error);
  }
};
