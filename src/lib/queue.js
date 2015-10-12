// queue data structure
'use strict';

export default class Queue {
  /**
   * Initialize private members
   *
   * @param  {array} Items to instantiate queue
   */
  constructor(list) {
    this._queue = list || [];
  }

  /**
   * @return {int} Length of queue
   */
  size() {
    return this._queue.length;
  }

  /**
   * Add an item to the queue
   *
   * @param  {any} Item to add to queue
   * @return {int} length of new queue
   */
  enqueue(item) {
    return this._queue.push(item);
  }

  /**
   * Grab the first item in the queue
   *
   * @return {any} First item in queue
   */
  dequeue() {
    return this._queue.shift();
  }

  /**
   * Clear all items in queue
   *
   * @return {int} Length of empty queue = 0
   */
  clear() {
    this._queue = [];
    return this._queue.length;
  }
}
