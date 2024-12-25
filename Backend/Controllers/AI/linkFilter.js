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

module.exports = filterLinks;
