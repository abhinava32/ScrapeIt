const cheerio = require("cheerio");
const axios = require("axios");
const fs = require("fs").promises;
const tokenLimit = 100000;
const tiktokens = require("tiktoken");

const sendToAi = async (model, link) => {
  const enc = tiktokens.encoding_for_model(model);

  const htmlContent = await fs.readFile(`scrape-${link}.html`, "utf-8");

  const prompt = await fs.readFile(`prompt.txt`, "utf-8");
  const contents = `Can you give me the details in a JSON format like this: 
              ${prompt}
               from the HTML: ${htmlContent}. I only want the details in JSON format.`;
  const tokenEstimate = enc.encode(contents);

  console.log("Estimated Tokens:", tokenEstimate.length);

  if (tokenEstimate.length > tokenLimit) {
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
              "You are a helpful assistant that extracts information from HTML reduced text. Please convert it to english if other language is there in the html text. language. Respond with raw JSON only. Do not include escape characters or format it as a string.  ",
          },
          {
            role: "user",
            content: contents,
          },
        ],
        temperature: 0.3, // Lower temperature for more consistent output
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
    // console.log("ai response --> ", aiResponse);
    return JSON.parse(aiResponse);
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
