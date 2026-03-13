const SupportConversation = require("../models/supportConversation.model");
const SupportMessage = require("../models/supportMessage.model");
const { getIO } = require("../socket/socket");


// USER SEND MESSAGE
exports.sendUserMessage = async (req, res) => {
  try {

    const userId = req.user._id;
    const { message } = req.body;

    if (!message) {
      return res.status(400).json({
        success: false,
        message: "Message is required"
      });
    }

    let conversation = await SupportConversation.findOne({ userId });

    if (!conversation) {
      conversation = await SupportConversation.create({
        userId,
        adminId: "admin_1",
        status: "open",
        lastMessage: message,
        lastMessageAt: new Date()
      });
    }

    const newMessage = await SupportMessage.create({
      conversationId: conversation._id,
      userId,
      senderId: userId,
      senderRole: "user",
      message
    });

    conversation.lastMessage = message;
    conversation.lastMessageAt = new Date();
    await conversation.save();

    // 🔹 SOCKET EMIT
    const io = getIO();

    console.log("Emitting realtime message to:", userId);
    console.log("message sent by user: ", newMessage);


    io.to(userId.toString()).emit("support:new-message", {
      conversationId: conversation._id,
      message: newMessage
    });

    res.json({
      success: true,
      messageId: newMessage._id,
      conversationId: conversation._id
    });

  } catch (error) {

    console.error(error);

    res.status(500).json({
      success: false,
      message: "Server error"
    });

  }
};

// USER LOAD CHAT HISTORY
exports.getUserMessages = async (req, res) => {

  try {

    const userId = req.user._id;

    const { page = 1, limit = 20 } = req.query;

    const conversation = await SupportConversation.findOne({ userId });

    if (!conversation) {
      return res.json({
        success: true,
        messages: []
      });
    }

    const messages = await SupportMessage.find({
      conversationId: conversation._id
    })
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(parseInt(limit));

    res.json({
      success: true,
      conversationId: conversation._id,
      messages
    });

  } catch (error) {

    console.error(error);

    res.status(500).json({
      success: false,
      message: "Server error"
    });

  }

};



// ADMIN SEND MESSAGE
exports.sendAdminMessage = async (req, res) => {

  try {

    const { userId, message } = req.body;

    if (!userId || !message) {
      return res.status(400).json({
        success: false,
        message: "userId and message required"
      });
    }

    const conversation = await SupportConversation.findOne({ userId });

    if (!conversation) {
      return res.status(404).json({
        success: false,
        message: "Conversation not found"
      });
    }

    const newMessage = await SupportMessage.create({
      conversationId: conversation._id,
      userId,
      senderId: "admin_1",
      senderRole: "admin",
      message
    });

    conversation.lastMessage = message;
    conversation.lastMessageAt = new Date();
    await conversation.save();

    // 🔹 SOCKET EMIT
    const io = getIO();

    console.log("Emitting realtime message to:", userId);
    console.log("message sent by admin: ", newMessage);

    io.to(userId.toString()).emit("support:new-message", {
      conversationId: conversation._id,
      message: newMessage
    });

    res.json({
      success: true,
      messageId: newMessage._id
    });

  } catch (error) {

    console.error(error);

    res.status(500).json({
      success: false,
      message: "Server error"
    });

  }
};