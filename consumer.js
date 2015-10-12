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

    this.producers = producers || new Set();
    this.expressionQueue = new _libQueue2['default']();
    this.consumeFrequency = _config2['default'].consumerFrequency || 100;
    this.server = this.createServer(port, host);
  }

  _createClass(Consumer, [{
    key: 'createServer',
    value: function createServer() {
      var server = _net2['default'].createServer((function (socket) {
        this.producers.add(socket);

        setInterval((function () {
          if (this.expressionQueue.size() > 0) {
            this.processExpression();
          }
        }).bind(this), this.consumeFrequency);

        this.setupEventHandlers(socket);
      }).bind(this));

      server.listen(port, function () {
        console.log("Consumer listening on port " + port + "\n");
      });
    }
  }, {
    key: 'setupEventHandlers',
    value: function setupEventHandlers(socket) {
      // Handle incoming expressions from Producer
      socket.on('data', (function (data) {
        this.expressionQueue.enqueue([data.toString(), // incoming expression
        socket.remotePort // Producer port number
        ]);
      }).bind(this));

      socket.on('end', (function () {
        this.producers['delete'](socket);
      }).bind(this));
    }
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
      console.log(message);
    }
  }]);

  return Consumer;
})();

exports['default'] = Consumer;

new Consumer();
module.exports = exports['default'];