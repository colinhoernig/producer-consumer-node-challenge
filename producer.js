// Producer Service
'use strict';

Object.defineProperty(exports, '__esModule', {
  value: true
});

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

var _net = require('net');

var _net2 = _interopRequireDefault(_net);

var _connect = require('connect');

var _connect2 = _interopRequireDefault(_connect);

var _libExpression = require('./lib/expression');

var _libExpression2 = _interopRequireDefault(_libExpression);

var _config = require('./config');

var _config2 = _interopRequireDefault(_config);

var consumerPort = _config2['default'].consumerPort || 3001;
var consumerHost = _config2['default'].consumerHost || 'localhost';

var Producer = (function () {
  function Producer() {
    _classCallCheck(this, Producer);

    this.socket = new _net2['default'].Socket();

    // Setup ports and hosts for Producer
    this.producerPort = _config2['default'].producerPort || 3002;
    this.producerHost = _config2['default'].producerHost || 'localhost';

    this.connectToConsumer(consumerPort, consumerHost);
  }

  _createClass(Producer, [{
    key: 'createHttpServer',
    value: function createHttpServer(port, host, socket) {
      var app = (0, _connect2['default'])();
      app.use('/generate-expression', function (req, res) {
        var expression = _libExpression2['default'].generate();

        var replyMessage = "Generate Expression: " + expression;
        res.end(replyMessage);
        console.log(replyMessage);

        socket.write(expression + "\n", 'utf8');
      });

      return app.listen(port, host);
    }
  }, {
    key: 'connectToConsumer',
    value: function connectToConsumer(consumerPort, consumerHost) {
      this.socket.connect(consumerPort, consumerHost, (function () {
        this.createHttpServer(this.producerPort, this.producerHost, this.socket);
      }).bind(this));

      this.handleEventsFromConsumer();
    }
  }, {
    key: 'handleEventsFromConsumer',
    value: function handleEventsFromConsumer() {
      this.socket.on('data', function (data) {
        // Data received from the Consumer is deliminated by newlines
        data.toString().split("\n").forEach(function (message) {
          if (message) {
            console.log(message);
          }
        });
      });

      this.socket.on('close', (function () {
        console.log('Connection to Consumer closed.');
        process.exit();
      }).bind(this));

      this.socket.on('error', (function (error) {
        switch (error.code) {
          case 'ECONNREFUSED':
            console.log('Connection to Consumer @ ' + consumerHost + ':' + consumerPort + ' refused.');
            break;
          default:
            console.log('Producer Error: ', error);
        }
      }).bind(this));
    }
  }]);

  return Producer;
})();

exports['default'] = Producer;

new Producer();
module.exports = exports['default'];