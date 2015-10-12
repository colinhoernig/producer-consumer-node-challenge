// queue data structure
'use strict';

Object.defineProperty(exports, '__esModule', {
  value: true
});

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

var Queue = (function () {
  function Queue(list) {
    _classCallCheck(this, Queue);

    this._queue = list || [];
  }

  _createClass(Queue, [{
    key: 'size',
    value: function size() {
      return this._queue.length;
    }
  }, {
    key: 'enqueue',
    value: function enqueue(item) {
      return this._queue.push(item);
    }
  }, {
    key: 'dequeue',
    value: function dequeue() {
      return this._queue.shift();
    }
  }, {
    key: 'clear',
    value: function clear() {
      this._queue = [];
    }
  }]);

  return Queue;
})();

exports['default'] = Queue;
module.exports = exports['default'];