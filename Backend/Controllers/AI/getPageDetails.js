const puppeteer = require("puppeteer");
const getPageHtml = async (url) => {
  console.log("checking page ", url);
  let browser;
  try {
    browser = await puppeteer.launch({
      headless: "new",
      args: [
        "--no-sandbox",
        "--disable-setuid-sandbox",
        "--disable-dev-shm-usage",
      ],
    });

    const page = await browser.newPage();

    // Set a user agent similar to your axios configuration
    await page.setUserAgent(
      "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/114.0.0.0 Safari/537.36"
    );

    // Navigate to the page and wait for content to load
    await page.goto(url, {
      waitUntil: "networkidle0",
      timeout: 30000, // Keeping the same timeout as your axios config
    });

    // Get the page HTML
    const html = await page.content();

    return html;
  } catch (error) {
    console.error("Error fetching page:", error);
    throw error;
  } finally {
    if (browser) {
      await browser.close();
    }
  }
};
module.exports = { getPageHtml };
