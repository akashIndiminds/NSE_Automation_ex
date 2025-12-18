import app from './app.js';
import server_config from './src/config/server.config.js';
import { initSocket } from './socket.js';
import http from 'http';
import { initializeApp } from './connection.js';

// Create a single HTTP server instance
const server = http.createServer(app);

initializeApp();
// Attach Socket.IO to the HTTP server
initSocket(server);

process.on("unhandledRejection", (reason, promise) => {
  console.error("⚠️ Unhandled Rejection:", reason);
});

process.on("uncaughtException", (err) => {
  console.error("⚠️ Uncaught Exception:", err);
});

// Start the server
server.listen(server_config.server.port, server_config.server.ip, () => {
  console.log(`Server is running on http://${server_config.server.ip}:${server_config.server.port}`);
});