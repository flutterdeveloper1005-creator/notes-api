// const OpenAI = require("openai");

// const openai = new OpenAI({
//   apiKey: process.env.OPENAI_API_KEY,
// });

// const generateAIResponse = async (message) => {
//   const response = await openai.chat.completions.create({
//     model: "gpt-4o-mini",
//     messages: [
//       {
//         role: "system",
//         content:
//           "You are a helpful shopping assistant for an ecommerce app. Help users find products and answer shopping questions.",
//       },
//       {
//         role: "user",
//         content: message,
//       },
//     ],
//   });

//   return response.choices[0].message.content;
// };

// module.exports = {
//   generateAIResponse,
// };

const { GoogleGenerativeAI } = require("@google/generative-ai");
const Product = require("../models/product.model");

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

const tools = [
  {
    functionDeclarations: [
      {
        name: "search_products",
        description: "Search products by category and price",
        parameters: {
          type: "object",
          properties: {
            category: {
              type: "string",
              description: "Product category"
            },
            max_price: {
              type: "number",
              description: "Maximum product price"
            }
          }
        }
      }
    ]
  }
];

const generateAIResponse = async (message) => {

  const model = genAI.getGenerativeModel({
    // model: "gemini-2.5-flash",
    model: "gemini-3.1-flash-lite-preview",
    tools
  });

  const chat = model.startChat();

  const result = await chat.sendMessage(message);

  const response = result.response;

  const functionCall = response.functionCalls()?.[0];

  if (functionCall?.name === "search_products") {

    const { category, max_price } = functionCall.args;

    const products = await Product.find({
      category,
      price: { $lte: max_price },
      isActive: true
    }).limit(5);

    return {
      type: "products",
      data: products
    };

  }

  return {
    type: "text",
    data: response.text()
  };

};

module.exports = {
  generateAIResponse
};