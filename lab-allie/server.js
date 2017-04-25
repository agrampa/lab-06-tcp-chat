'use strict';

const Client = require('./model/client.js');
const net = require('net');
const EE = require('events').EventEmitter;
const ee = new EE();
const server = net.createServer();
const PORT = process.env.PORT || 3000;

const userPool = [];

ee.on('default', (client, string) => {
  client.socket.write(`You entered an invalid command: ${string.split(' ', 1)}. Please try again.\n}`);
});

ee.on('/all', (client, string) => {
  userPool.forEach(user => user.socket.write(`${client.nickName}: ${string}`));
});

ee.on('/nick', (client, string) => {

  let nickname = `${string}`.trim();
  client.nickName = nickname;
});

ee.on('/dm', (client, string) => {
  console.log('string', string);
  let directUser = string.split(' ')[0];
  console.log('direct user', directUser);
  let message = string.split(' ').slice(1).join(' ').trim();
  console.log('message', message);
  for(var i = 0; i < userPool.length; i++) {
    console.log('userPool', userPool[i].nickName);
    if(userPool[i].nickName === directUser) {
      userPool[i].socket.write(`${message}`);
    }
  }
  console.log('direct user', directUser);
});

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
      ee.emit('/nick', client, data.toString().split(' ').slice(1).join(' '));
      return;
    }
    
    if(command === '/dm') {

      ee.emit('/dm', client, data.toString().split(' ').slice(1).join(' '));

      return;
    }
    
    ee.emit('default', client, data.toString());
  });

    
  socket.on('close', () =>
    ee.removeListener('close', function(client){
      // console.log(userPool);
      userPool.splice(userPool.indexOf(client), 1);
      // console.log(userPool);
    })
  );
  
  socket.on('uncaughtException', (error) => console.error('Oops! An error occurred', error));
  
});


// ee.on('error') uncaught exception

