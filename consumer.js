// Consumer Service
'use strict';

Object.defineProperty(exports, '__esModule', {
  value: true
});

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

var _net = require('net');

var _net2 = _interopRequireDefault(_net);

var _libExpression = require('./lib/expression');

var _libExpression2 = _interopRequireDefault(_libExpression);

var _libQueue = require('./lib/queue');

var _libQueue2 = _interopRequireDefault(_libQueue);

var _config = require('./config');

var _config2 = _interopRequireDefault(_config);

var port = _config2['default'].consumerPort || 3001;
var host = _config2['default'].consumerHost || 'localhost';

var Consumer = (function () {
  function Consumer(producers) {
    _classCallCheck(this, Consumer);

    // Storage facility for connected Producers
    this.producers = producers || new Set();

    // Storage facility for messages
    this.expressionQueue = new _libQueue2['default']();

    // How often to consume messages on the queue?
    this.consumeFrequency = _config2['default'].consumerFrequency || 100;

    // Start a TCP server
    this.createServer(port, host);
  }

  // Create the new Consumer

  /**
   * Create a TCP server that listens on specified port, and
   * keeps track of all connected producers.  Any time the
   * expression queue has a message, process it.
   */

  _createClass(Consumer, [{
    key: 'createServer',
    value: function createServer() {
      var server = _net2['default'].createServer((function (socket) {
        // Keep track of the connected Producer
        this.producers.add(socket);

        // Consume expressions at the specified frequency
        setInterval((function () {
          if (this.expressionQueue.size() > 0) {
            this.processExpression();
          }
        }).bind(this), this.consumeFrequency);

        this.setupEventHandlers(socket);
      }).bind(this));

      return server.listen(port, function () {
        console.log("Consumer listening on port " + port + "\n");
      });
    }

    /**
     * Handle events on the Consumer socket connection
     *
     * @param  {socket}
     */
  }, {
    key: 'setupEventHandlers',
    value: function setupEventHandlers(socket) {
      // Handle incoming expressions from Producer
      socket.on('data', (function (data) {
        this.expressionQueue.enqueue([data.toString(), // Incoming xpression
        socket.remotePort // Producer port number
        ]);
      }).bind(this));

      // Remove Producer on disconnect
      socket.on('end', (function () {
        this.producers['delete'](socket);
      }).bind(this));
    }

    /**
     * Process an expression, solving it, and notifying the producer
     * of the solved expression
     */
  }, {
    key: 'processExpression',
    value: function processExpression() {
      // Grab the expression message in the queue
      var message = this.expressionQueue.dequeue();
      var producer = message[1];

      // Expressions from the socket stream are delimited with a newline
      // so let's split on the newline to only keep the expression
      message[0].split('\n').forEach((function (expression) {
        if (expression) {
          // Solve the expression and build the output message
          var result = _libExpression2['default'].solve(expression);
          var solvedExpression = expression + result;

          // Send a message to all Producers letting them know
          // that an expression has been solved
          this.notifyProducer('Consumer Solved Expression: ' + solvedExpression, producer);
        }
      }).bind(this));
    }

    /**
     * @param  {string} Message to send to Producer
     * @param  {int} Port number of Producer that we want to send to
     * @return {string} Message sent to Producer
     */
  }, {
    key: 'notifyProducer',
    value: function notifyProducer(message, sender) {
      // Send the message to the Producer
      this.producers.forEach(function (producer) {
        if (sender === producer._peername.port) {
          producer.write(message + "\n");
        }
      });

      // Log the message to the standard output
      return console.log(message);
    }
  }]);

  return Consumer;
})();

exports['default'] = Consumer;
new Consumer();
module.exports = exports['default'];