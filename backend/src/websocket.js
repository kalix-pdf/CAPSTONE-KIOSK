import { WebSocketServer, WebSocket } from 'ws';

const adminClients = new Set();

export const initWebSocket = (server) => {
  const wss = new WebSocketServer({ server });

  wss.on('connection', (ws) => {
    adminClients.add(ws);
    console.log('Admin connected. Total:', adminClients.size);

    ws.on('close', () => {
      adminClients.delete(ws);
      console.log('Admin disconnected. Total:', adminClients.size);
    });
  });
};

export const broadcast = (event, data) => {
  const message = JSON.stringify({ event, data, timestamp: new Date().toISOString() });
  adminClients.forEach((client) => {
    if (client.readyState === WebSocket.OPEN) {
      client.send(message);
    }
  });
};