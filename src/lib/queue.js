// queue data structure
'use strict';

export default class Queue {
  constructor(list) {
    this._queue = list || [];
  }

  size() {
    return this._queue.length;
  }

  enqueue(item) {
    return this._queue.push(item);
  }

  dequeue() {
    return this._queue.shift();
  }

  clear() {
    this._queue = [];
  }
}
