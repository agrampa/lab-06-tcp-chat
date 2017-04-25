'use strict';

const uuidV4 = require('uuid/v4');

module.exports = function(socket){
  this.socket = socket;
  this.nickName = `${Math.random()}`;
  this.userName = uuidV4();
};