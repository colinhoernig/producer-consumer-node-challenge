// Consumer Service
'use strict';

import net from 'net';
import Expression from './lib/expression';
import Queue from './lib/queue';
import config from './config';

const port = config.consumerPort || 3001;
const host = config.consumerHost || 'localhost';

export default class Consumer {
  constructor(producers) {
    this.producers = producers || new Set(); // collection of connected Producers
    this.expressionQueue = new Queue();
    this.consumeFrequency = config.consumerFrequency || 100;

    // Start a TCP server
    this.createServer(port, host);
  }

  createServer() {
    const server = net.createServer(function(socket) {
      // Keep track of the connected Producer
      this.producers.add(socket);

      // Consume expressions at the specified frequency
      setInterval(function() {
        if (this.expressionQueue.size() > 0) {
          this.processExpression();
        }
      }.bind(this), this.consumeFrequency);

      this.setupEventHandlers(socket);
    }.bind(this));

    server.listen(port, function() {
      console.log("Consumer listening on port " + port + "\n");
    });
  }

  setupEventHandlers(socket) {
    // Handle incoming expressions from Producer
    socket.on('data', function(data) {
      this.expressionQueue.enqueue([
        data.toString(), // Incoming xpression
        socket.remotePort // Producer port number
      ]);
    }.bind(this));

    // Remove Producer on disconnect
    socket.on('end', function() {
      this.producers.delete(socket);
    }.bind(this));
  }

  processExpression() {
    // Grab the expression message in the queue
    let message = this.expressionQueue.dequeue();
    const producer = message[1];

    // Expressions from the socket stream are delimited with a newline
    // so let's split on the newline to only keep the expression
    message[0].split('\n').forEach(function(expression) {
      if (expression) {
        // Solve the expression and build the output message
        const result = Expression.solve(expression);
        const solvedExpression = expression + result;

        // Send a message to all Producers letting them know
        // that an expression has been solved
        this.notifyProducer('Consumer Solved Expression: ' + solvedExpression, producer);
      }
    }.bind(this));
  }

  notifyProducer(message, sender) {
    // Send the message to the Producer
    this.producers.forEach(function(producer) {
      if (sender === producer._peername.port) {
        producer.write(message + "\n");
      }
    });

    // Log the message to the standard output
    console.log(message);
  }
}

// Create the new Consumer
new Consumer();
