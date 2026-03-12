const express = require("express");
const { chatWithAI } = require("../controllers/chat.controller");
const authMiddleware = require("../middleware/auth.middleware");

const router = express.Router();

router.post("/message", authMiddleware, chatWithAI);

module.exports = router;