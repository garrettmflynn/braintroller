import robot from 'robotjs'

import { WebSocketServer } from 'ws';

const wss = new WebSocketServer({ port: 8765 });

wss.on('connection', function connection(ws) {
  ws.on('error', console.error);

  ws.on('message',  (data) => {
    console.log('received: %s', data);
    robot.keyTap(data)
  });

//   ws.send('something');
});