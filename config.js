'use strict';

module.exports = {
  // How many expressions should the producer generate?
  expressionCount: 20,

  // Which port should the producer live on?
  producerPort: 3002,

  // Which port should the consumer live on?
  consumerPort: 3001,

   // How often should the consumer chew up queue messages?
  consumerFrequency: 1000
};
