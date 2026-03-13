require("dotenv").config();

const http = require("http");
const app = require("./src/app");

const { initSocket } = require("./src/socket/socket");

const PORT = process.env.PORT || 3000;

// create http server
const server = http.createServer(app);

// initialize socket
initSocket(server);

server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});