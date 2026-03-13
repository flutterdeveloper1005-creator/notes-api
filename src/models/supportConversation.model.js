const mongoose = require("mongoose");

const supportConversationSchema = new mongoose.Schema(
  {
    userId: {
      type: String,
      required: true,
    },

    adminId: {
      type: String,
      default: "admin_1",
    },

    status: {
      type: String,
      default: "open",
    },

    lastMessage: {
      type: String,
    },

    lastMessageAt: {
      type: Date,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model(
  "SupportConversation",
  supportConversationSchema
);