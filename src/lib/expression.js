'use strict';

const OPERATORS = ['+', '-', '*', '/'];

export default class Expression {
  /**
   * Generate a random expression with with terms between 1, 1000
   *
   * @return {string} Expression formatted as 1+2=
   */
  static generate() {
    const firstTerm = this._rand(1, 1000);
    const secondTerm = this._rand(1, 1000);
    const operator = OPERATORS[this._rand(0, 3)];

    return firstTerm + operator + secondTerm + "=";
  }

  /**
   * @param  {string}
   * @return {array} An array of expression parts
   *
   * matchedExpression[0] = first term
   * matchedExpression[1] = operator
   * matchedExpression[2] = second term
   * matchedExpression[3] = '='
   */
  static parse(expression) {
    // Regex pattern explaination:
    // (\d{1,})     match any digit an unlimited number of times (greedy)
    // ([\+\-\*\/]) match operators +, -, *, /
    // (\d{1,})     match any digit an unlimited number of times (greedy)
    // \=           match = (equals) character
    const pattern = /^(\d{1,})([\+\-\*\/])(\d{1,})\=$/;
    const matchedExpression = expression.match(pattern);

    if (!Array.isArray(matchedExpression)) {
      throw new Error('Could not parse expression: ' + expression);
    }

    // Remove the first element of the matchedExpression array,
    // as it is just the expression itself.
    if (matchedExpression.length) {
      matchedExpression.shift();
    }

    return matchedExpression;
  }

  /**
   * Solve an expression in the format 1+2=
   *
   * @param  {string}
   * @return {float}
   */
  static solve(expression) {
    const parsedExpression = this.parse(expression);

    const firstTerm = parseInt(parsedExpression[0]);
    const operator = parsedExpression[1];
    const secondTerm = parseInt(parsedExpression[2]);

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

  /**
   * Generate a random integer between two values
   *
   * @param  {int} minimum value, inclusive
   * @param  {int} maximum value, exclusive
   * @return {int} random integer
   */
  static _rand(min, max) {
    min = min || 0;
    max = max || 1;

    return Math.floor(Math.random() * (max - min + 1)) + min;
  }
}
