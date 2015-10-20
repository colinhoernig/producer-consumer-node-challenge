// Unit tests for expression.js
import { assert, expect, should } from 'chai';
import Expression from '../../dist/lib/expression';

describe('expression', function() {

  it('should generate a random mathematical expression', function() {
    const exp = Expression.generate();
    const parsedExpression = Expression.parse(exp);

    // Look for 3 parts (first term, operator, second term)
    assert.equal(parsedExpression.length, 3);

    // Check that the first and second terms are integers
    assert(isInt(parsedExpression[0]));
    assert(isInt(parsedExpression[2]));

    // Check that the operator is valid
    assert(isOperator(parsedExpression[1]));
  });

  it('should generate different random mathematical expressions with each invocation', function() {
    const firstExpression = Expression.generate();
    const secondExpression = Expression.generate();

    assert(firstExpression !== secondExpression);
  });

  it('should solve a mathematical expression in the format of 1+2=', function() {
    const result = Expression.solve('1+2=');
    assert.equal(result, 3);
  });

});

// utility method to check if a value is strictly an integer
function isInt(value) {
  if (isNaN(value)) {
    return false;
  }
  const x = parseFloat(value);
  return (x | 0) === x;
}

// utility method to check if a value is a valid mathematical operator
function isOperator(value) {
  const OPERATORS = ['+', '-', '*', '/'];
  return OPERATORS.indexOf(value) > -1;
}
