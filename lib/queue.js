'use strict';

var Queue = function() {
  this._queue = [];
}

Queue.prototype = {
  size: function() {
    return this._queue.length;
  },
  enqueue: function(item) {
    this._queue.push(item);
  },
  dequeue: function() {
    return this._queue.shift();
  },
  clear: function() {
    this._queue = [];
  }
};

module.exports = new Queue();
