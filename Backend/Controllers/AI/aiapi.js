const axios = require("axios");
const cheerio = require("cheerio");
const fs = require("fs").promises;
const filterLinks = require("./linkFilter");
const { getDetails, getLinks } = require("./details");
const sendToAi = require("./APIcalls");
const WebsiteData = require("../../Models/websiteData");

module.exports.ask = async (req, res) => {
  const model = req.body.model;

  const url = req.body.url;
  let domain = "temp";
  try {
    const testUrl = url.match(/www\.(.*?)\.[a-z]{2,6}/);
    if (testUrl.length > 1) {
      domain = testUrl[1];
    } else {
      doamin = "temp";
    }
  } catch (err) {
    console.log(
      "EA1: error in naming domain, setting it to default name: temp"
    );
  }
  // console.log("domain is ", domain);
  const now = new Date();
  const options = { timeZone: "Asia/Kolkata", hour12: false };
  const istDateTime = now.toLocaleString("en-IN", options);
  console.log(istDateTime, "", req.userDetails.email, " : url is ", url);
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
    try {
      await getDetails(url, "home page", domain);
    } catch (err) {
      console.log("EA2: error in getting home page details");
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

    const contactRegex =
      /(?:contact[-\s]?(?:us|form|page|info|information|details|support|sales|team|now|here|today)?|get[-\s](?:in[-\s]touch|connected)|reach[-\s](?:us|out)|connect[-\s](?:with[-\s]us|now)|support[-\s](?:center|desk)|help[-\s]desk|enquiry|inquiry|feedback|write[-\s]to[-\s]us|message[-\s]us|talk[-\s]to[-\s]us|let\'s[-\s]talk|customer[-\s](?:service|support|care)|technical[-\s]support|sales[-\s](?:inquiry|team)|locations?|offices?|branches?|where[-\s](?:to[-\s]find[-\s]us|we[-\s]are)|visit[-\s]us)/i;

    const businessRegex =
      /(?:about[-\s]?(?:us|company|team|business|organization|firm|group|leadership|management|story|history|values|culture|philosophy|approach|experience|expertise|people)?|company[-\s](?:profile|info|overview|history|background)|who[-\s](?:we[-\s]are|are[-\s]we)|our[-\s](?:story|mission|vision|values|philosophy|approach|team|leadership|management|people|culture|history|journey|commitment|excellence|quality|difference|advantage|expertise|experience)|corporate[-\s](?:info|profile|overview|governance|responsibility|values)|meet[-\s](?:the[-\s]team|our[-\s]team)|leadership[-\s]team|executive[-\s]team|management[-\s]team|team[-\s]members?|what[-\s]we[-\s]do|why[-\s](?:choose[-\s]us|us)|heritage|legacy|milestones|achievements)/i;

    // const productsRegex = /products|services|products-and-services/i;
    const productsRegex =
      /(?:products?(?:[-\s](?:and|&)[-\s]services?)?|services?|solutions?|offerings?|merchandise|goods|items?|supplies|equipment|tools?|accessories|parts?|components?|systems?|packages?|bundles?|kits?|collections?|catalogs?|inventory|stock|product[-\s]line|service[-\s]offerings?|business[-\s]solutions?|enterprise[-\s]solutions?|professional[-\s]services?|consulting[-\s]services?|managed[-\s]services?|support[-\s]services?|maintenance[-\s]services?|repair[-\s]services?|installation[-\s]services?|technical[-\s]services?|cloud[-\s]services?|digital[-\s]services?|online[-\s]services?|products?[-\s]portfolio|service[-\s]portfolio|business[-\s]portfolio|solutions?[-\s]portfolio|product[-\s]catalog|service[-\s]catalog|product[-\s]range|service[-\s]range|product[-\s]suite|service[-\s]suite|solutions?[-\s]suite|business[-\s]suite|enterprise[-\s]suite|product[-\s]offering|service[-\s]offering|solutions?[-\s]offering|business[-\s]offering|enterprise[-\s]offering)/i;

    const contactLinks = filterLinks(links, contactRegex, url);
    const businessLinks = filterLinks(links, businessRegex, url);
    const productsLinks = filterLinks(links, productsRegex, url);

    const uniqueContactLinks = [...new Set(contactLinks)];
    const uniqueBusinessLinks = [...new Set(businessLinks)];
    const uniqueProductLinks = [...new Set(productsLinks)];

    try {
      // links.map(async (link) => await fs.appendFile("links.txt"));
      await fs.appendFile(`${domain}-link.txt`, ""); //create file first
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
      console.log("EA3: error in writing links file");
    }
  } catch (err) {
    console.log("EA4: error in connecting");
    return res.status(500).json({
      message: "Site is unreachable",
      details: err.message,
    });
  }

  try {
    const links = await getLinks(model, domain);
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
    if (detailData.costly) {
      return res.status(500).json({
        message: "Costly Search, Please search this manually !!",
      });
    }
    try {
      await fs.access(`${domain}-link.txt`);
      await fs.unlink(`${domain}-link.txt`);
    } catch (err) {
      console.log(`EA5: error in deleting ${domain}-link.txt`);
    }

    try {
      await fs.access(`scrape-${domain}.html`);
      await fs.unlink(`scrape-${domain}.html`);
    } catch (err) {
      console.log(`EA6: error in deleting scrape-${domain}.html`);
    }

    detailData["Links"] = links;
    if (detailData) {
      if (process.env.NODE_ENV === "production") {
        const websiteData = new WebsiteData({
          url,
          data: detailData,
        });
        await websiteData.save();
      }

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
    console.log("EA7: error in processing");
    return res.status(500).json({
      message: "Error in processing data",
      details: err.message,
    });
  }
};
