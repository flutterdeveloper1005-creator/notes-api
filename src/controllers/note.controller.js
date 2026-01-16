const Note = require("../models/note.model");

const createNote = async (req, res) => {
  try {
    const { title, content } = req.body;

    if (!title || !content) {
      return res.status(400).json({
        message: "Title and content are required",
      });
    }

    const note = await Note.create({
      title,
      content,
      userId: req.user._id, // 🔐 ownership
    });

    res.status(201).json({
      message: "Note created successfully",
      data: note,
    });
  } catch (error) {
    console.error("Create note error:", error);
    res.status(500).json({
      message: "Internal server error",
    });
  }
};


const getAllNotes = async (req, res) => {
  try {
    // 1️⃣ Read query params
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;

    // 2️⃣ Calculate skip
    const skip = (page - 1) * limit;

    const notes = await Note.find({ userId: req.user._id })
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    const totalNotes = await Note.countDocuments({
      userId: req.user._id,
    });


    // 5️⃣ Build pagination metadata
    const totalPages = Math.ceil(totalNotes / limit);

    // 6️⃣ Send response
    res.status(200).json({
      message: "Notes fetched successfully",
      data: notes,
      pagination: {
        page,
        limit,
        totalNotes,
        totalPages,
        hasMore: page < totalPages,
      },
    });
  } catch (error) {
    console.error("Get notes error:", error);
    res.status(500).json({
      message: "Internal server error",
    });
  }
};


module.exports = {
  createNote,
  getAllNotes,
};
