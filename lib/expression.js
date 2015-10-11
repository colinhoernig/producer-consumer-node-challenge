'use strict';

var OPERATORS = ['+', '-', '*', '/'];

module.exports = {
  // Generate a random expression
  // format:  [num][operator][num]=
  // example: 12+30=
  generate: function() {
    var firstTerm = rand(1, 1000);
    var secondTerm = rand(1, 1000);
    var operator = OPERATORS[rand(0, 3)];

    return firstTerm + operator + secondTerm + "=";
  },
  parse: function(expression) {
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
  },
  solve: function(expression) {
    var parsedExpression = this.parse(expression);

    var firstTerm = parseInt(parsedExpression[0]);
    var operator = parsedExpression[1];
    var secondTerm = parseInt(parsedExpression[2]);

    // Handle division by zero case
    if (operator === '/' && secondTerm === 0) {
      throw new Error('Invalid expression: Divison by Zero.');
    }

    switch(operator) {
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
}

// Simple utility method for generating random integers
// between min (inclusive) and max (exclusive)
function rand(min, max) {
  var min = min || 0;
  var max = max || 1;

  return Math.floor(Math.random() * (max - min + 1)) + min;
}
