// Unit tests for expression.js
'use strict';

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

var _chai = require('chai');

var _libExpression = require('../lib/expression');

var _libExpression2 = _interopRequireDefault(_libExpression);

describe('expression', function () {

  it('should generate a random mathematical expression', function () {
    var exp = _libExpression2['default'].generate();
    var parsedExpression = _libExpression2['default'].parse(exp);

    // Look for 3 parts (first term, operator, second term)
    _chai.assert.equal(parsedExpression.length, 3);

    // Check that the first and second terms are integers
    (0, _chai.assert)(isInt(parsedExpression[0]));
    (0, _chai.assert)(isInt(parsedExpression[2]));

    // Check that the operator is valid
    (0, _chai.assert)(isOperator(parsedExpression[1]));
  });

  it('should generate different random mathematical expressions with each invocation', function () {
    var firstExpression = _libExpression2['default'].generate();
    var secondExpression = _libExpression2['default'].generate();

    (0, _chai.assert)(firstExpression !== secondExpression);
  });

  it('should solve a mathematical expression in the format of 1+2=', function () {
    var result = _libExpression2['default'].solve('1+2=');
    _chai.assert.equal(result, 3);
  });
});

// utility method to check if a value is strictly an integer
function isInt(value) {
  if (isNaN(value)) {
    return false;
  }
  var x = parseFloat(value);
  return (x | 0) === x;
}

// utility method to check if a value is a valid mathematical operator
function isOperator(value) {
  var OPERATORS = ['+', '-', '*', '/'];
  return OPERATORS.indexOf(value) > -1;
}