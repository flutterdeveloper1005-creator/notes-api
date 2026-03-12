const { generateAIResponse } = require("../services/ai.service");

const chatWithAI = async (req, res) => {
  try {
    const { message } = req.body;

    if (!message) {
      return res.status(400).json({
        message: "Message is required",
      });
    }

    const reply = await generateAIResponse(message);

    return res.status(200).json({
      message: "AI response generated",
      data: reply,
    });
  } catch (error) {
  console.error("AI chat error:", error);

  if (error.code === "insufficient_quota") {
    return res.status(500).json({
      message: "AI service quota exceeded. Check OpenAI billing."
    });
  }

  return res.status(500).json({
    message: "Failed to generate AI response",
  });
}
};

module.exports = {
  chatWithAI,
};