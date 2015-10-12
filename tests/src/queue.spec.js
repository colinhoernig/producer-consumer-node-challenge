// Unit tests for queue.js
import { assert, expect, should } from 'chai';
import Queue from '../lib/queue';

describe('queue', function() {

  let expressionQueue = new Queue();

  beforeEach(function() {
    expressionQueue.clear();
  });

  afterEach(function() {
    expressionQueue.clear();
  });

  it('should enqueue a message', function() {
    assert.equal(expressionQueue.size(), 0);
    expressionQueue.enqueue('1+2=');
    assert.equal(expressionQueue.size(), 1);
  });

  it('should dequeue a message', function() {
    assert.equal(expressionQueue.size(), 0);
    expressionQueue.enqueue('1+2=');
    assert.equal(expressionQueue.size(), 1);

    var message = expressionQueue.dequeue();
    assert.equal(expressionQueue.size(), 0);
    assert.equal(message, '1+2=');
  });

  it('should clear all messages', function() {
    assert.equal(expressionQueue.size(), 0);
    expressionQueue.enqueue('1+2=');
    expressionQueue.enqueue('2/3=');
    assert.equal(expressionQueue.size(), 2);
    expressionQueue.clear();
    assert.equal(expressionQueue.size(), 0);
  });

});
