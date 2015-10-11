// Unit tests for queue.js
var chai = require('chai'),
    assert = chai.assert,
    expect = chai.expect,
    should = chai.should();
var queue = require('../lib/queue');

describe('queue', function() {

  beforeEach(function() {
    queue.clear();
  });

  afterEach(function() {
    queue.clear();
  });

  it('should enqueue a message', function() {
    assert.equal(queue.size(), 0);
    queue.enqueue('1+2=');
    assert.equal(queue.size(), 1);
  });

  it('should dequeue a message', function() {
    assert.equal(queue.size(), 0);
    queue.enqueue('1+2=');
    assert.equal(queue.size(), 1);

    var message = queue.dequeue();
    assert.equal(queue.size(), 0);
    assert.equal(message, '1+2=');
  });

  it('should clear all messages', function() {
    assert.equal(queue.size(), 0);
    queue.enqueue('1+2=');
    queue.enqueue('2/3=');
    assert.equal(queue.size(), 2);
    queue.clear();
    assert.equal(queue.size(), 0);
  });

});
