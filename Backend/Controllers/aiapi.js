const axios = require("axios");
const cheerio = require("cheerio");
const { readFile } = require("fs");
const fs = require("fs").promises;
const { writeFile } = require("fs/promises");
// const model = "gpt-3.5-turbo";
const tokenLimit = 15000;
// const model = "gpt-4-turbo";
// const model = "gpt-4o-mini";

const getDetails = async (link, pageType, domain) => {
  console.log("fetching details from  ", link);
  if (!link) {
    return { message: "No link provided" };
  }
  try {
    var { data: html } = await axios.get(link);
  } catch (err) {
    console.log("error in getDetails");
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
    //console.log("file written successfully");
  } catch (error) {
    console.log("error wrting file", pageType);
    return null;
  }
};

const filterLinks = (links, regex, baseUrl) => {
  return links
    .filter((link) => isValidUrl(link) && regex.test(link))
    .map((link) => {
      try {
        return link.startsWith("http") ? link : new URL(link, baseUrl).href;
      } catch (error) {
        console.log(`Invalid URL: ${link}`);
        return null;
      }
    })
    .filter(Boolean); // Remove null values
};

const isValidUrl = (link) => {
  // Invalid protocols to filter out
  const invalidProtocols = [
    "mailto:",
    "tel:",
    "sms:",
    "javascript:",
    "data:",
    "ftp:",
    "file:",
    "whatsapp:",
    "skype:",
    "callto:",
    "wtai:",
    "market:",
    "geopoint:",
    "ymsgr:",
    "msnim:",
    "gtalk:",
    "steam:",
    "webcal:",
    "viber:",
  ];

  // Check if link starts with any invalid protocol
  if (
    invalidProtocols.some((protocol) => link.toLowerCase().startsWith(protocol))
  ) {
    return false;
  }

  // Filter out empty or invalid links
  if (
    !link ||
    link === "#" ||
    link === "/" ||
    link.startsWith("#") ||
    link.startsWith("javascript:void") ||
    link.includes("{{") || // Angular/Vue.js template
    link.includes("{%") // Template literals
  ) {
    return false;
  }

  return true;
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
            content: `Extract exactly one link for each category (contact-us, about-us, products/services) from the provided HTML content. Return ONLY a JSON object with this exact structure:
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
      console.error("JSON Parse Error:", parseError);
      // return res.status(500).json({ error: "Invalid JSON response from AI" };
      throw new Error("Invalid JSON response from AI");
    }
  } catch (error) {
    console.error("Error contacting OpenAI:", error);
    throw error;
  }
};

module.exports.ask = async (req, res) => {
  const model = req.body.model;
  const contactRegex =
    /(?:contact[-\s]?(?:us|form|page|info|information|details|support|sales|team|now|here|today)?|get[-\s](?:in[-\s]touch|connected)|reach[-\s](?:us|out)|connect[-\s](?:with[-\s]us|now)|support[-\s](?:center|desk)|help[-\s]desk|enquiry|inquiry|feedback|write[-\s]to[-\s]us|message[-\s]us|talk[-\s]to[-\s]us|let\'s[-\s]talk|customer[-\s](?:service|support|care)|technical[-\s]support|sales[-\s](?:inquiry|team)|locations?|offices?|branches?|where[-\s](?:to[-\s]find[-\s]us|we[-\s]are)|visit[-\s]us)/i;

  const businessRegex =
    /(?:about[-\s]?(?:us|company|team|business|organization|firm|group|leadership|management|story|history|values|culture|philosophy|approach|experience|expertise|people)?|company[-\s](?:profile|info|overview|history|background)|who[-\s](?:we[-\s]are|are[-\s]we)|our[-\s](?:story|mission|vision|values|philosophy|approach|team|leadership|management|people|culture|history|journey|commitment|excellence|quality|difference|advantage|expertise|experience)|corporate[-\s](?:info|profile|overview|governance|responsibility|values)|meet[-\s](?:the[-\s]team|our[-\s]team)|leadership[-\s]team|executive[-\s]team|management[-\s]team|team[-\s]members?|what[-\s]we[-\s]do|why[-\s](?:choose[-\s]us|us)|heritage|legacy|milestones|achievements)/i;

  // const productsRegex = /products|services|products-and-services/i;
  const productsRegex =
    /(?:products?(?:[-\s](?:and|&)[-\s]services?)?|services?|solutions?|offerings?|merchandise|goods|items?|supplies|equipment|tools?|accessories|parts?|components?|systems?|packages?|bundles?|kits?|collections?|catalogs?|inventory|stock|product[-\s]line|service[-\s]offerings?|business[-\s]solutions?|enterprise[-\s]solutions?|professional[-\s]services?|consulting[-\s]services?|managed[-\s]services?|support[-\s]services?|maintenance[-\s]services?|repair[-\s]services?|installation[-\s]services?|technical[-\s]services?|cloud[-\s]services?|digital[-\s]services?|online[-\s]services?|products?[-\s]portfolio|service[-\s]portfolio|business[-\s]portfolio|solutions?[-\s]portfolio|product[-\s]catalog|service[-\s]catalog|product[-\s]range|service[-\s]range|product[-\s]suite|service[-\s]suite|solutions?[-\s]suite|business[-\s]suite|enterprise[-\s]suite|product[-\s]offering|service[-\s]offering|solutions?[-\s]offering|business[-\s]offering|enterprise[-\s]offering)/i;

  const url = req.body.url;
  const domain = url.match(/www\.(.*?)\.[a-z]{2,6}/)[1];
  const now = new Date();
  const options = { timeZone: "Asia/Kolkata", hour12: false };
  const istDateTime = now.toLocaleString("en-IN", options);
  console.log(istDateTime, ": url is ", url);
  try {
    // Fetch the HTML from the given URL
    const { data: html } = await axios.get(url, {
      headers: {
        "User-Agent":
          "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/114.0.0.0 Safari/537.36",
      },
      timeout: 10000,
    });
    if (!html) {
      return res.status(404).json({
        message: "Site not working",
      });
    }
    const $ = cheerio.load(html);
    $("style, script").remove();

    const links = [];
    $("a").each((_, element) => {
      const href = $(element).attr("href");
      if (href) {
        links.push(href);
      }
    });

    const contactLinks = filterLinks(links, contactRegex, url);
    const businessLinks = filterLinks(links, businessRegex, url);
    const productsLinks = filterLinks(links, productsRegex, url);

    const uniqueContactLinks = [...new Set(contactLinks)];
    const uniqueBusinessLinks = [...new Set(businessLinks)];
    const uniqueProductLinks = [...new Set(productsLinks)];

    try {
      // links.map(async (link) => await fs.appendFile("links.txt"));
      for (let i = 0; i < uniqueContactLinks.length; i++) {
        // await fs.appendFile("links.txt", "Contact Us links");
        try {
          await fs.appendFile(
            `${domain}-link.txt`,
            "contact us links \n" + uniqueContactLinks[i] + "\n"
          );
        } catch (err) {
          console.log("error writing contact links to file", err);
        }
      }
      for (let i = 0; i < uniqueBusinessLinks.length; i++) {
        try {
          await fs.appendFile(
            `${domain}-link.txt`,
            "About Us links \n" + uniqueBusinessLinks[i] + "\n"
          );
        } catch (err) {
          console.log("error writing About Us links to file");
        }
      }
      for (let i = 0; i < uniqueProductLinks.length; i++) {
        try {
          await fs.appendFile(
            `${domain}-link.txt`,
            "Product/Services Links \n" + uniqueProductLinks[i] + "\n"
          );
        } catch (err) {
          console.log("error writing Product/Services links to file");
        }
      }
    } catch (err) {
      console.log("error in writing links file");
    }
  } catch (err) {
    // console.log(err);
    return res.status(500).json({
      message: "Error in processing data",
      details: err.message,
    });
  }

  try {
    const links = await getLinks(model, domain);
    // console.log("links are ", links);
    if (links.contactus_link) {
      await getDetails(links.contactus_link, "Contact Page", domain);
    }
    if (links.aboutus_link) {
      await getDetails(links.aboutus_link, "About Us Page", domain);
    }
    if (links.products_link) {
      await getDetails(links.products_link, "Product/Services Page", domain);
    }

    const detailData = await sendToAi(model, domain);
    try {
      await fs.access(`${domain}-link.txt`);
      await fs.unlink(`${domain}-link.txt`);
    } catch (err) {
      console.log(`error in deleting ${domain}-link.txt`);
    }

    try {
      await fs.access(`scrape-${domain}.html`);
      await fs.unlink(`scrape-${domain}.html`);
    } catch (err) {
      console.log(`error in deleting scrape-${domain}.html`);
    }

    detailData["Links"] = links;
    if (detailData) {
      return res.status(200).json({
        data: detailData,
        message: "Scraping completed successfully.",
      });
    } else {
      return res.status(500).json({
        message: "Error in processing data",
        details: err.message,
      });
    }
  } catch (err) {
    // console.log(err);
    return res.status(500).json({
      message: "Error in processing data",
      details: err.message,
    });
  }
};

const sendToAi = async (model, link) => {
  // reading file
  //console.log("sending to AI...");
  const htmlContent = await fs.readFile(`scrape-${link}.html`, "utf-8");
  //console.log("html is ", htmlContent);
  const $ = cheerio.load(htmlContent);
  const reducedContent = $("body").text().trim();
  const tokenEstimate = Math.ceil(reducedContent.length / 4); // Estimate tokens

  console.log("Estimated Tokens:", tokenEstimate);
  if (tokenEstimate > tokenLimit) {
    //console.log("Reduce input size to keep cost below $0.01.");
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
    console.error("Error contacting OpenAI:", error);
    return res.status(500).json({
      message: "Error in processing data",
      details: error.message,
    });
  }
};
