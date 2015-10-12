'use strict';

Object.defineProperty(exports, '__esModule', {
  value: true
});

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

var OPERATORS = ['+', '-', '*', '/'];

var Expression = (function () {
  function Expression() {
    _classCallCheck(this, Expression);
  }

  _createClass(Expression, null, [{
    key: 'generate',

    // Generate a random expression
    // format:  [num][operator][num]=
    // example: 12+30=
    value: function generate() {
      var firstTerm = this._rand(1, 1000);
      var secondTerm = this._rand(1, 1000);
      var operator = OPERATORS[this._rand(0, 3)];

      return firstTerm + operator + secondTerm + "=";
    }
  }, {
    key: 'parse',
    value: function parse(expression) {
      // Regex pattern explaination:
      // (\d{1,})     match any digit an unlimited number of times (greedy)
      // ([\+\-\*\/]) match operators +, -, *, /
      // (\d{1,})     match any digit an unlimited number of times (greedy)
      // \=           match = (equals) character
      var pattern = /^(\d{1,})([\+\-\*\/])(\d{1,})\=$/;
      var matchedExpression = expression.match(pattern);

      // Remove the first element of the matchedExpression array,
      // as it is just the expression itself.
      if (matchedExpression.length) {
        matchedExpression.shift();
      }

      return matchedExpression;
    }
  }, {
    key: 'solve',
    value: function solve(expression) {
      var parsedExpression = this.parse(expression);

      var firstTerm = parseInt(parsedExpression[0]);
      var operator = parsedExpression[1];
      var secondTerm = parseInt(parsedExpression[2]);

      // Handle division by zero case
      if (operator === '/' && secondTerm === 0) {
        throw new Error('Invalid expression: Divison by Zero.');
      }

      switch (operator) {
        case '+':
          return firstTerm + secondTerm;
          break;
        case '-':
          return firstTerm - secondTerm;
          break;
        case '*':
          return firstTerm * secondTerm;
          break;
        case '/':
          return firstTerm / secondTerm;
          break;
        default:
          // Handle invalid operator
          throw new Error('Invalid operator: Must be +, -, *, /');
      }
    }
  }, {
    key: '_rand',
    value: function _rand(min, max) {
      min = min || 0;
      max = max || 1;

      return Math.floor(Math.random() * (max - min + 1)) + min;
    }
  }]);

  return Expression;
})();

exports['default'] = Expression;
module.exports = exports['default'];