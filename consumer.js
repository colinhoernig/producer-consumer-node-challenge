// Consumer Service
// Inspired by:
//  https://gist.github.com/creationix/707146
//  https://github.com/brandonmoser/node_challenge
'use strict';

var net = require('net');
var expression = require('./lib/expression');
var queue = require('./lib/queue');
var config = require('./config');

var port = config.consumerPort || 3001;
var host = config.consumerHost || 'localhost';
var frequency = config.consumerFrequency || 100;

// Structure to keep track of connected Producers
var producers = [];

// Start a TCP server
var server = net.createServer(function(socket) {

  // Keep track of newly connected Producer
  producers.push(socket);

  // If the queue has any messages, process them at the specified frequency
  setInterval(function() {
    if (queue.size() > 0) {
      processMessage();
    }
  }, frequency);

  // Handle incoming expressions from Producer
  socket.on('data', function(data) {
    queue.enqueue([
      data.toString(),
      socket.remotePort
    ]);
  });

  // Remove Producer on disconnect
  socket.on('end', function() {
    producers.splice(producers.indexOf(socket), 1);
  });

  function processMessage() {
    // Grab the expression message in the queue
    var exps = queue.dequeue();
    var sender = exps[1];

    // Expressions from the socket stream are delimited with a newline
    // so let's split on the newline to only keep the expression
    exps[0].split('\n').forEach(function(exp) {
      if (exp) {
        // Solve the expression and build the output message
        var result = expression.solve(exp);
        var solvedExpression = exp + result;

        // Send a message to all Producers letting them know
        // that an expression has been solved
        notifyProducer('Consumer Solved Expression: ' + solvedExpression, sender);
      }
    });
  }

  function notifyProducer(message, sender) {
    // Send the message to the Producer
    producers.forEach(function(producer) {
      if (sender === producer._peername.port) {
        producer.write(message + "\n");
      }
    });

    // Log the message
    process.stdout.write(message + "\n");
  }

}).listen(port, function() {
  console.log("Consumer listening on port " + port + "\n");
});

module.exports = server;
