#!/usr/bin/env node

/*
 * easyWizard
 * @date:Tue Apr 16 2013 23:46:33 GMT+0200 (CEST)
 * @name: easyWizard.js
 * @licence: MIT
*/


var http = require('http');

var app = http.createServer(function(req,res){
   res.end('I\'m easyWizard, and you');
});


function run(port) {
  port = port || 8000;
  app.listen(port, function() {
    console.log('running on port: '+port);
  });
};
module.exports.run = run;
