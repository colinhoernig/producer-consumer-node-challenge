'use strict';

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

var _http = require('http');

var _http2 = _interopRequireDefault(_http);

var _config = require('./config');

var _config2 = _interopRequireDefault(_config);

/**
 * Simple class for flooding the Producer service with requests :)
 */

var Generate = (function () {
  function Generate() {
    _classCallCheck(this, Generate);
  }

  _createClass(Generate, null, [{
    key: 'makeRequests',
    value: function makeRequests(count) {
      count = parseInt(count) || 1000;

      for (var x = 1; x <= 1000; x++) {
        var request = _http2['default'].request({
          host: 'localhost',
          port: _config2['default'].producerPort,
          path: '/generate-expression'
        }, function (response) {
          var output = '';
          response.on('data', function (chunk) {
            output += chunk;
          });
          response.on('end', function () {
            console.log(output);
          });
          response.on('error', function (error) {
            throw new Error(error);
          });
        }).end();
      }
    }
  }]);

  return Generate;
})();

Generate.makeRequests();