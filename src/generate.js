'use strict';

import http from 'http';
import config from './config';

/**
 * Simple class for flooding the Producer service with requests :)
 */
class Generate {
  static makeRequests(count) {
    count = parseInt(count) || 1000;

    for (let x = 1; x <= 1000; x++) {
      let request = http.request({
        host: 'localhost',
        port: config.producerPort,
        path: '/generate-expression'
      }, function(response) {
        let output = '';
        response.on('data', function(chunk) {
          output += chunk;
        });
        response.on('end', function() {
          console.log(output);
        });
        response.on('error', function(error) {
          throw new Error(error);
        });
      }).end();
    }
  }
}

Generate.makeRequests();
