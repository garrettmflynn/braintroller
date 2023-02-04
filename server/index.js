import robot from 'robotjs'
import './network.js' // Print the network you're on

import { WebSocketServer } from 'ws';


const wss = new WebSocketServer({ port: 8765 });

wss.on('connection', function connection(ws) {
  ws.on('error', console.error);
  ws.on('message', (message) => robot.keyTap(message));
});