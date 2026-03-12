const express = require("express");
const cors = require("cors");
const connectDB = require("./config/db");
const noteRoutes = require("./routes/note.routes");
const authRoutes = require("./routes/auth.routes");
const productRoutes = require("./routes/product.routes");
const cartRoutes = require("./routes/cart.routes");
const chatRoutes = require("./routes/chat.routes");

const app = express();

connectDB();

// 🔹 Global middlewares
app.use(cors());
app.use(express.json());

// 🔹 Routes
app.use("/createNotes", noteRoutes);
app.use("/getAllNotes", noteRoutes);
app.use("/auth", authRoutes);
app.use("/products", productRoutes);
app.use("/cart", cartRoutes);
app.use("/chat", chatRoutes);


module.exports = app;
