const express = require("express");
const router = express.Router();

const supportChatController = require("../controllers/supportChat.controller");
const authMiddleware = require("../middleware/auth.middleware");

// User sends message (token required)
router.post(
  "/user/message",
  authMiddleware,
  supportChatController.sendUserMessage
);

// USER LOAD CHAT HISTORY
router.get(
  "/user/messages",
  authMiddleware,
  supportChatController.getUserMessages
);

router.get(
  "/user/unread-count",
  authMiddleware,
  supportChatController.getUnreadCount
);

// Admin reply (no token required)
router.post(
  "/admin/message",
  supportChatController.sendAdminMessage
);

module.exports = router;