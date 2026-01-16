const express = require("express");
const {
  createNote,
  getAllNotes,
} = require("../controllers/note.controller");
const authMiddleware = require("../middleware/auth.middleware");

const router = express.Router();

// Protected routes
router.post("/", authMiddleware, createNote);
router.get("/", authMiddleware, getAllNotes);

module.exports = router;
