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
    // Storage facility for connected Producers
    this.producers = producers || new Set();

    // Storage facility for messages
    this.expressionQueue = new Queue();

    // How often to consume messages on the queue?
    this.consumeFrequency = config.consumerFrequency || 100;

    // Start a TCP server
    this.createServer(port, host);
  }

  /**
   * Create a TCP server that listens on specified port, and
   * keeps track of all connected producers.  Any time the
   * expression queue has a message, process it.
   */
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

    return server.listen(port, function() {
      console.log("Consumer listening on port " + port + "\n");
    });
  }

  /**
   * Handle events on the Consumer socket connection
   *
   * @param  {socket}
   */
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

  /**
   * Process an expression, solving it, and notifying the producer
   * of the solved expression
   */
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

  /**
   * @param  {string} Message to send to Producer
   * @param  {int} Port number of Producer that we want to send to
   * @return {string} Message sent to Producer
   */
  notifyProducer(message, sender) {
    // Send the message to the Producer
    this.producers.forEach(function(producer) {
      if (sender === producer._peername.port) {
        producer.write(message + "\n");
      }
    });

    // Log the message to the standard output
    return console.log(message);
  }
}

// Create the new Consumer
new Consumer();
