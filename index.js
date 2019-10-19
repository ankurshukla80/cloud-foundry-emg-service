'use strict';
var debug = require('debug')
var url = require('url');

module.exports.init = function(config, logger, stats) {
  
  // perform content transformation here
  // the result of the transformation must be another Buffer
  function transform(data) {
    return new Buffer(data.toString().toUpperCase());
  }
  return {
   
    onrequest: function(req, res, data, next) {
      console.log('***** EMG Service plugin - event - onrequest');
      console.log('original req.targetHostname : '+ JSON.stringify(req.targetHostname));
      console.log('original req.targetPath : '+ JSON.stringify(req.targetPath));

      var adr = req.headers['x-cf-forwarded-url'];
      var addressParsed = url.parse(adr, true);
      
      console.log(addressParsed.host); //returns 'localhost:8080'
      console.log(addressParsed.pathname); //returns '/default.htm'
      req.targetHostname = addressParsed.host;
      console.log('New req.targetHostname : '+ JSON.stringify(req.targetHostname));
      req.targetPath = addressParsed.pathname;
      console.log('New req.targetPath : '+ JSON.stringify(req.targetPath));
      next(null, data);
    },
    // chunk of request body data received from client
    // should return (potentially) transformed data for next plugin in chain
    // the returned value from the last plugin in the chain is written to the target
    ondata_response: function(req, res, data, next) {
      // transform each chunk as it is received
      next(null, data ? transform(data) : null);
    },

    onend_response: function(req, res, data, next) {
      // transform accumulated data, if any
      next(null, data ? transform(data) : null);
    },

    ondata_request: function(req, res, data, next) {
      // transform each chunk as it is received
      next(null, data ? transform(data) : null);
    },

    onend_request: function(req, res, data, next) {
      // transform accumulated data, if any
      next(null, data ? transform(data) : null);
    }
    
  };
}
