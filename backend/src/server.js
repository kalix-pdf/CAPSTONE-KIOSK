import dotenv from "dotenv";
import { createServer } from 'http';
import app, { initWebSocket } from './app.js';

dotenv.config();

const PORT = process.env.PORT || 5000;

const server = createServer(app); 
initWebSocket(server);  

server.listen(PORT, () => {
  console.log(`🚀 Server running at http://localhost:${PORT}`);
});
