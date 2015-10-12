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
  * `expressionCount` - the number of expressions the Producer should generate
  * `producerPort` - the port that the Producer service lives on
  * `consumerPort` - the port that the Consumer service lives on
  * `consumerFrequency` - the frequency of which to consume produced expressions
3. Start the Consumer service with `npm run consumer`.
4. Start the Producer service with `npm run producer`.
5. You may generate a large number of expressions quickly by running `node generate.js`.  This will flood the Producer with 1000 requests for generating expressions. Generate an single expression by issuing a GET request to the Producer: `curl http://localhost:3002/generate-expression`, then take a look at the log output in the Consumer and Producer services.  You'll notice the Consumer outputs all solved expressions, and the Producer outputs all generated and solved expressions.

The Producer service will generate expressions and send them via TCP socket connection to the Consumer service, which will queue each expression.  If the queue contains messages, the Consumer will parse and solve the expressions and log the solved expression.

### Running Tests

1. Run `npm install` to install the test dependencies.
2. Run `npm test` to run unit tests
3. All tests should ideally pass :)

### Rebuilding from Source
1. Install Babel ES6 Transpiler with `npm install -g babel`
2. Transpile `src` directory into project root with `babel src --out-dir . && babel tests/src --out-dir tests`

## UML Diagrams

![UML Sequence Diagram](/images/producer-consumer-sequence-diagram.png?raw=true "UML Sequence Diagram")

![UML Activity Diagram](/images/producer-consumer-activity-diagram.png?raw=true "UML Activity Diagram")

---

#### Inspiration

The implementations of Consumer and Producer are partly inspired by:

* https://gist.github.com/creationix/707146
* https://github.com/dustinboston/node-producer-consumer
* https://github.com/brandonmoser/node_challenge
