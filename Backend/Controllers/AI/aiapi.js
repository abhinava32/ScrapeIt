const axios = require("axios");
const cheerio = require("cheerio");
const fs = require("fs").promises;
const filterLinks = require("./linkFilter");
const { getDetails, getLinks } = require("./details");
const sendToAi = require("./APIcalls");
const WebsiteData = require("../../Models/websiteData");
const tiktokens = require("tiktoken");
const limit = 80000;
const {
  contactRegex,
  businessRegex,
  productsRegex,
  serviceRegex,
  termsRegex,
  privacyRegex,
  faqRegex,
  blogRegex,
  careersRegex,
} = require("./regex.js");

module.exports.ask = async (req, res) => {
  const model = req.body.model;

  const url = req.body.url;
  let domain = "temp";
  const enc = tiktokens.encoding_for_model(model);
  try {
    const testUrl = url.match(/www\.(.*?)\.[a-z]{2,6}/);
    if (testUrl.length > 1) {
      domain = testUrl[1];
    } else {
      doamin = `temp-${url}`;
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
      await getDetails(url, "home page", domain, model);
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

    const contactLinks = filterLinks(links, contactRegex, url);
    const businessLinks = filterLinks(links, businessRegex, url);
    const productsLinks = filterLinks(links, productsRegex, url);
    const serviceLinks = filterLinks(links, serviceRegex, url);
    const termsLinks = filterLinks(links, termsRegex, url);
    const faqLinks = filterLinks(links, faqRegex, url);
    const blogLinks = filterLinks(links, blogRegex, url);
    const careersLinks = filterLinks(links, careersRegex, url);
    const privacyLinks = filterLinks(links, privacyRegex, url);

    const uniqueContactLinks = [...new Set(contactLinks)];
    const uniqueBusinessLinks = [...new Set(businessLinks)];
    const uniqueProductLinks = [...new Set(productsLinks)];
    const uniqueServiceLinks = [...new Set(serviceLinks)];
    const uniqueTermsLinks = [...new Set(termsLinks)];
    const uniqueFaqLinks = [...new Set(faqLinks)];
    const uniqueBlogLinks = [...new Set(blogLinks)];
    const uniqueCareersLinks = [...new Set(careersLinks)];
    const privacyLinksLinks = [...new Set(privacyLinks)];

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
      for (let i = 0; i < uniqueServiceLinks.length; i++) {
        try {
          await fs.appendFile(
            `${domain}-link.txt`,
            "Service Links \n" + uniqueServiceLinks[i] + "\n"
          );
        } catch (err) {
          console.log("error writing Service links to file");
        }
      }
      for (let i = 0; i < uniqueTermsLinks.length; i++) {
        try {
          await fs.appendFile(
            `${domain}-link.txt`,
            "Terms Links \n" + uniqueTermsLinks[i] + "\n"
          );
        } catch (err) {
          console.log("error writing Terms links to file");
        }
      }
      for (let i = 0; i < uniqueFaqLinks.length; i++) {
        try {
          await fs.appendFile(
            `${domain}-link.txt`,
            "FAQ Links \n" + uniqueFaqLinks[i] + "\n"
          );
        } catch (err) {
          console.log("error writing FAQ links to file");
        }
      }
      for (let i = 0; i < uniqueBlogLinks.length; i++) {
        try {
          await fs.appendFile(
            `${domain}-link.txt`,
            "Blog Links \n" + uniqueBlogLinks[i] + "\n"
          );
        } catch (err) {
          console.log("error writing Blog links to file");
        }
      }
      for (let i = 0; i < uniqueCareersLinks.length; i++) {
        try {
          await fs.appendFile(
            `${domain}-link.txt`,
            "Careers Links \n" + uniqueCareersLinks[i] + "\n"
          );
        } catch (err) {
          console.log("error writing Careers links to file");
        }
      }
      for (let i = 0; i < privacyLinksLinks.length; i++) {
        try {
          await fs.appendFile(
            `${domain}-link.txt`,
            "Privacy Links \n" + privacyLinksLinks[i] + "\n"
          );
        } catch (err) {
          console.log("error writing Privacy links to file");
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
  const getTokenLength = async () => {
    const content = await fs.readFile(`scrape-${domain}.html`, "utf-8");
    const tokens = enc.encode(content);
    if (process.env.DEBUG) {
      console.log("tokens >> ", tokens.length);
    }

    return tokens.length;
  };

  try {
    const links = await getLinks(model, domain);
    if (links.aboutus_link && (await getTokenLength()) < limit) {
      if (process.env.DEBUG_MODE === "true") {
        console.log("about link is ", links.aboutus_link);
      }
      await getDetails(links.aboutus_link, "About Us Page", domain, model);
    }
    // let tokens = enc.encode(await fs.readFile(`scrape-${domain}.html`));
    if (links.contactus_link && (await getTokenLength()) < limit) {
      if (process.env.DEBUG_MODE === "true") {
        console.log("contact link is ", links.contactus_link);
      }
      await getDetails(links.contactus_link, "Contact Page", domain, model);
    }
    if (links.products_link && (await getTokenLength()) < limit) {
      if (process.env.DEBUG_MODE === "true") {
        console.log("product link is ", links.products_link);
      }
      await getDetails(
        links.products_link,
        "Product/Services Page",
        domain,
        model
      );
    }
    if (links.service_link && (await getTokenLength()) < limit) {
      if (process.env.DEBUG_MODE === "true") {
        console.log("service link is ", links.service_link);
      }
      await getDetails(links.service_link, "Service Page", domain, model);
    }

    if (links.terms_link && (await getTokenLength()) < limit) {
      if (process.env.DEBUG_MODE === "true") {
        console.log("terms link is ", links.terms_link);
      }
      await getDetails(links.terms_link, "Terms Page", domain, model);
    }
    if (links.privacy_link && (await getTokenLength()) < limit) {
      if (process.env.DEBUG_MODE === "true") {
        console.log("privacy link is ", links.privacy_link);
      }
      await getDetails(links.privacy_link, "Privacy Page", domain, model);
    }
    if (links.faq && (await getTokenLength()) < limit) {
      if (process.env.DEBUG_MODE === "true") {
        console.log("faq link is ", links.faq);
      }
      await getDetails(links.faq, "FAQ Page", domain, model);
    }
    if (links.blog && (await getTokenLength()) < limit) {
      if (process.env.DEBUG_MODE === "true") {
        console.log("blog link is ", links.blog);
      }
      await getDetails(links.blog, "Blog Page", domain, model);
    }
    if (links.career && (await getTokenLength()) < limit) {
      if (process.env.DEBUG_MODE === "true") {
        console.log("career link is ", links.career);
      }
      await getDetails(links.careers, "Career Page", domain, model);
    }
    if (links.other_important_link1 && (await getTokenLength()) < limit) {
      if (process.env.DEBUG_MODE === "true") {
        console.log("other link is ", links.other_important_link1);
      }
      await getDetails(
        links.other_important_link1,
        "Other Important Page",
        domain,
        model
      );
    }
    if (links.other_important_link2 && (await getTokenLength()) < limit) {
      if (process.env.DEBUG_MODE === "true") {
        console.log("other link is ", links.other_important_link2);
      }
      await getDetails(
        links.other_important_link2,
        "Other Important Page",
        domain,
        model
      );
    }
    if (links.other_important_link3 && (await getTokenLength()) < limit) {
      if (process.env.DEBUG_MODE === "true") {
        console.log("other link is ", links.other_important_link3);
      }
      await getDetails(
        links.other_important_link3,
        "Other Important Page",
        domain,
        model
      );
    }
    if (links.other_important_link4 && (await getTokenLength()) < limit) {
      if (process.env.DEBUG_MODE === "true") {
        console.log("other link is ", links.other_important_link4);
      }
      await getDetails(
        links.other_important_link4,
        "Other Important Page",
        domain,
        model
      );
    }

    let detailData = await sendToAi(model, domain);
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
    detailData["Contact_Details"]["email"] = Array.from(
      new Set(detailData["Contact_Details"]["email"])
    );
    if (detailData) {
      if (process.env.DEBUG_MODE === "true") {
        console.log("data is ", detailData);
      }

      if (process.env.NODE_ENV === "production") {
        try {
          const websiteData = new WebsiteData({
            url,
            data: detailData,
            user: req.user,
          });
          await websiteData.save();
        } catch (err) {
          console.log("EA8: error in saving data to database");
        }
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
    console.log("EA7: error in processing", err);
    return res.status(500).json({
      message: "Error in processing data",
      details: err.message,
    });
  }
};
