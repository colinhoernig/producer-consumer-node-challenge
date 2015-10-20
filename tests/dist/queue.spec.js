// Unit tests for queue.js
'use strict';

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

var _chai = require('chai');

var _distLibQueue = require('../../dist/lib/queue');

var _distLibQueue2 = _interopRequireDefault(_distLibQueue);

describe('queue', function () {

  var expressionQueue = new _distLibQueue2['default']();

  beforeEach(function () {
    expressionQueue.clear();
  });

  afterEach(function () {
    expressionQueue.clear();
  });

  it('should enqueue a message', function () {
    _chai.assert.equal(expressionQueue.size(), 0);
    expressionQueue.enqueue('1+2=');
    _chai.assert.equal(expressionQueue.size(), 1);
  });

  it('should dequeue a message', function () {
    _chai.assert.equal(expressionQueue.size(), 0);
    expressionQueue.enqueue('1+2=');
    _chai.assert.equal(expressionQueue.size(), 1);

    var message = expressionQueue.dequeue();
    _chai.assert.equal(expressionQueue.size(), 0);
    _chai.assert.equal(message, '1+2=');
  });

  it('should clear all messages', function () {
    _chai.assert.equal(expressionQueue.size(), 0);
    expressionQueue.enqueue('1+2=');
    expressionQueue.enqueue('2/3=');
    _chai.assert.equal(expressionQueue.size(), 2);
    expressionQueue.clear();
    _chai.assert.equal(expressionQueue.size(), 0);
  });
});