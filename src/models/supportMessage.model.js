const mongoose = require("mongoose");

const supportMessageSchema = new mongoose.Schema(
  {
    conversationId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "SupportConversation",
      required: true,
    },

    userId: {
      type: String,
      required: true,
    },

    senderId: {
      type: String,
      required: true,
    },

    senderRole: {
      type: String,
      enum: ["user", "admin"],
      required: true,
    },

    message: {
      type: String,
      required: true,
    },

    isSeen: {
      type: Boolean,
      default: false
    }

  },
  { timestamps: true }
);

supportMessageSchema.index({ userId: 1, isSeen: 1 });

module.exports = mongoose.model("SupportMessage", supportMessageSchema);