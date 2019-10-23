'use strict';
var debug = require('debug')
var url = require('url');

module.exports.init = function(config, logger, stats) {
  
  return {
   
    onrequest: function(req, res, data, next) {

      var adr = req.headers['x-cf-forwarded-url'];
      var addressParsed = url.parse(adr, true);
      
      req.targetHostname = addressParsed.host;
      console.log('New req.targetHostname : '+ JSON.stringify(req.targetHostname));
      req.targetPath = addressParsed.pathname;
      console.log('New req.targetPath : '+ JSON.stringify(req.targetPath));
      next(null, data);
    }
  };
}
