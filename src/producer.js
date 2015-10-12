// Producer Service
'use strict';

import net from 'net';
import connect from 'connect';
import Expression from './lib/expression';
import config from './config';

let consumerPort = config.consumerPort || 3001;
let consumerHost = config.consumerHost || 'localhost';

export default class Producer {
  constructor() {
    this.socket = new net.Socket();

    // Setup ports and hosts for Producer
    this.producerPort = config.producerPort || 3002;
    this.producerHost = config.producerHost || 'localhost';

    this.connectToConsumer(consumerPort, consumerHost);
  }

  createHttpServer(port, host, socket) {
    let app = connect();
    app.use('/generate-expression', function(req, res) {
      let expression = Expression.generate();

      let replyMessage = "Generate Expression: " + expression;
      res.end(replyMessage);
      console.log(replyMessage);

      socket.write(expression + "\n", 'utf8');
    });

    return app.listen(port, host);
  }

  connectToConsumer(consumerPort, consumerHost) {
    this.socket.connect(consumerPort, consumerHost, function() {
      this.createHttpServer(this.producerPort, this.producerHost, this.socket);
    }.bind(this));

    this.handleEventsFromConsumer();
  }

  handleEventsFromConsumer() {
    this.socket.on('data', function(data) {
      // Data received from the Consumer is deliminated by newlines
      data.toString().split("\n").forEach(function(message) {
        if (message) {
          console.log(message);
        }
      });
    });

    this.socket.on('close', function() {
      console.log('Connection to Consumer closed.');
      process.exit();
    }.bind(this));

    this.socket.on('error', function(error) {
      switch(error.code) {
        case 'ECONNREFUSED':
          console.log('Connection to Consumer @ ' + consumerHost + ':' + consumerPort + ' refused.');
          break;
        default:
          console.log('Producer Error: ', error);
      }
    }.bind(this));
  }
}

new Producer();
