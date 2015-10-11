// Producer Service
'use strict';

var net = require('net');
var connect = require('connect');
var expression = require('./lib/expression');
var config = require('./config');

var consumerPort = config.consumerPort || 3001;
var consumerHost = config.consumerHost || 'localhost';

var producerPort = config.producerPort || 3002;
var producerHost = config.producerHost || 'localhost';

// Create a socket connection to the Consumer
var producer = new net.Socket();

// Connect to the Consumer service and start a simple HTTP server
// for generating expressions
producer.connect(consumerPort, consumerHost, function() {
  producerServer(producerPort, producerHost, producer);
});

// Handle incoming data from Consumer
producer.on('data', function(data) {
  // Data received from the Consumer is deliminated by newlines
  data.toString().split("\n").forEach(function(message) {
    if (message) {
      console.log(message);
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
      console.log('Connection to Consumer @ ' + consumerHost + ':' + consumerPort + ' refused.');
      break;
    default:
      console.log('Producer Error: ', error);
  }
});

var producerServer = function(port, host, producer) {
  console.log("Producer started on " + producerHost + ':' + producerPort);
  console.log("Connected to Consumer on " + consumerHost + ':' + consumerPort + "\n");

  // Create an HTTP endpoint for generating requests and sending
  // them to the Consumer
  var app = connect();
  app.use('/generate-expression', function(req, res) {
    // Generate a random expression
    var exp = expression.generate();

    // Reply back with the expression to the requester
    var message = "Generated Expression: " + exp;
    res.end(message);
    console.log(message);

    // Finally, send the expression to the Consumer
    producer.write(exp + "\n", 'utf8');
  });

  // Start the HTTP server
  return app.listen(producerPort, producerHost);
};

module.exports = producerServer;
