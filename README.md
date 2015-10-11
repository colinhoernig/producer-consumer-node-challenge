# producer-consumer coding challenge

The assignment is to build a simple [Producer/Consumer](https://en.wikipedia.org/wiki/Producer%E2%80%93consumer_problem) system. In this system the Generator will send a series of random arithmetic expressions, while the Evaluator will accept these expressions, compute the result and then report the solution to the Generator.

---

## Requirements

At a minimum, we would like to see the following implemented:

* The Producer and Consumer as separate NodeJS services.
* The Producer generating random addition expressions of two positive integers, e.g. "2+3="
* The Consumer computing and returning the correct mathematical result for the each expression it receives
* The Consumer successfully processing requests from two Producers concurrently at a rate of at least 1 req/sec from each Producer (2 req/sec in aggregate)
* The Consumer and Producer should log all messages they generate and receive.
* You are free to support more than simple addition, but it is not required.

The end product should:

* Be built in strict JavaScript and run with NodeJS
* NOT rely on any external services like Redis, ZeroMQ or similar technologies
* NOT use Express (Connect is Ok)
* Include UML Activity Diagram and UML Sequence Diagram documenting the business logic
* Include Unit tests

## Instructions

1. Clone repo, change to directory, and install dependencies: `git clone git@github.com:colinhoernig/producer-consumer.git && cd producer-consumer && npm install`
2. Edit `config.js` to configure:
  * `expressionCount` - the number of expressions the producer should generate
  * `consumerPort` - the port that the consumer service lives on
  * `consumerFrequency` - the frequency of which to consume produced expressions
3. Start the Consumer service with `npm run consumer`.
4. Start as many Producer services as you wish with `npm run producer`.  When all expressions have been solved, the Producer service instance will terminate.

The Producer service will generate expressions and send them via TCP socket connection to the Consumer service, which will queue each expression.  If the queue contains messages, the Consumer will parse and solve the expressions and log the solved expression.

### Running Tests

1. Run `npm install` to install the test dependencies.
2. Run `npm test` to run unit tests
3. All tests should ideally pass :)
