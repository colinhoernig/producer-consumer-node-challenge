// Producer
'use strict';

var net = require('net');
var expression = require('./lib/expression');
var config = require('./config');

var port = config.consumerPort || 3001;
var host = config.consumerHost || 'localhost';

// Create a socket connection
var producer = new net.Socket();
producer.connect(port, host, function() {
  console.log("Connected to Consumer on port " + port + "\n");

  // Generate a set of expressions
  for (var x = 1; x < config.expressionCount; x++) {
    var exp = expression.generate();
    console.log(exp);
    producer.write(exp + "\n", 'utf8');
  }
});

// Handle response from server
var responseCount = 1;
producer.on('data', function(data) {
  data.toString().split("\n").forEach(function(message) {
    if (message) {
      console.log(message);
      if (++responseCount === config.expressionCount) {
        console.log("\nAll expressions solved.");
        producer.destroy();
      }
    }
  });
});

// Handle connection close
producer.on('close', function() {
  console.log('Connection to Consumer closed.');
});

// Handle errors
producer.on('error', function(error) {
  switch(error.code) {
    case 'ECONNREFUSED':
      console.log('Connection to Consumer @ ' + host + ':' + port + ' refused.');
      break;
    default:
      console.log('Producer Error: ', error);
  }
});
