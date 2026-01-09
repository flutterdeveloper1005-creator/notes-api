// index.js, think of this files as main.dart in Flutter

const express = require("express"); // Import Express framework (Flutter framework for backend)
const cors = require("cors"); // Import CORS middleware (CORS = Cross-Origin Resource Sharing, handles communication between front end and backend Without CORS → frontend calls will fail)

const app = express();  // app = backend application instance 
app.use(cors()); //everything is attached to app instance, security / preprocessing layer
app.use(express.json());

// Test route
app.get("/", (req, res) => {
  res.send("API is running 🚀");
});

// Notes route
app.get("/notes", (req, res) => {
  res.json([
    { id: 1, title: "First Note", content: "Hello World" },
  ]);
});

app.post("/notes", (req, res) => {
  const note = req.body;
  res.status(201).json({
    message: "Note created",
    note,
  });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
