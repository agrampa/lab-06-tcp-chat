'use strict';

const Client = require('./model/client.js');
const net = require('net');
const EE = require('events').EventEmitter;
const ee = new EE();
const server = net.createServer();
const PORT = process.env.PORT || 3000;

const userPool = [];

// ee.on('default', (client, string) => {
//   client.socket.write(`You entered an invalid command: ${string.split(' ', 1)}. Please try again.\n}`);
// });

ee.on('/all', (client, string) => {
  userPool.forEach(user => user.socket.write(`${client.nickName}: ${string}`));
});

ee.on('/nick', (client, string) => {
  let nickname = `${string}`;
  client.nickName = nickname;
});

// ee.on('/dm')

server.listen(PORT, () => console.log(`Listening on: ${PORT}`));

server.on('connection', socket => {
  let client = new Client(socket);
  userPool.push(client);
  userPool.forEach(user => user.socket.write(`${client.nickName} has connected!\n`));
  
  socket.on('data', data => {
    let command = data.toString().split(' ').shift().trim();
    
    if(command === '/all') {
      ee.emit('/all', client, data.toString().split(' ').slice(1).join(' '));
      return;
    }
    
    if(command === '/nick') {
      // console.log('in nick socket function');
      ee.emit('/nick', client, data.toString().split(' ').slice(1).join(' '));
      return;
    }
    
    if(command === '/dm') {
      
      return;
    }
    
    // ee.emit('default', client, data.toString());
  });
});