'use strict';

const io = require('socket.io-client');

var socket = io();
socket.on('progress', function(msg){
   $('#test').append($('<li>').text(msg));
});


// ./node_modules/.bin/browserify .\public\js\socket.js > .\public\js\socket_out.js