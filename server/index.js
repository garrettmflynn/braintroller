import robot from 'robotjs'
import './network.js' // Print the network you're on
import { WebSocketServer } from 'ws';


const wss = new WebSocketServer({ port: 8765 });

wss.on('connection', function connection(ws) {

  console.log('Client connected!\n')

  ws.on('error', console.error);
  ws.on('message', (message) => {
    const { id, command, payload } = JSON.parse(message)
    
    const response = { id, command, response: true }
    if (command === 'key') robot.keyTap(payload)

    else if (command === 'platform') response.payload = process.platform
    
    else {
      response.error = 'Unknown command'
      delete response.payload
    }

    ws.send(JSON.stringify(response))

  });
});