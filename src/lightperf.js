"use strict"

const lighthouse = require('lighthouse');
const _ = require('underscore');
const chromeLauncher = require('chrome-launcher');
const requests = 100;
const batchSize = 10;

function launchChromeAndRunLighthouse(url, opts, config = null) {
  return chromeLauncher.launch({chromeFlags: opts.chromeFlags}).then(chrome => {
    opts.port = chrome.port;
    return lighthouse(url, opts, config).then(results => {
      // use results.lhr for the JS-consumeable output
      // https://github.com/GoogleChrome/lighthouse/blob/master/types/lhr.d.ts
      // use results.report for the HTML/JSON/CSV output as a string
      // use results.artifacts for the trace/screenshots/other specific case you need (rarer)
      return chrome.kill().then(() => results.lhr)
    });
  });
}


// Recursively fetch batches of audits
function fetch(url, opts, pointer = 0, results = []){
  var increment = batchSize, 
      idx = 0,
      promises = [];
  if(pointer < requests){  
    increment = Math.min(increment, (requests - pointer));
    pointer += increment;
    for(idx = 0; idx < increment; idx++){
      promises.push(launchChromeAndRunLighthouse(url, opts));
    }
    Promise.all(promises).then( data => {
      results = results.concat(data);
      return fetch(url, opts, pointer, results);
    });     
  }
  return results;
}
const opts = {
  chromeFlags: ['--show-paint-rects']
};

function processResults(results){
  return results;
}

function render(results){
  console.log(results);
}
exports = function(url, flags){
  fetch(url, flags).then( results =>{
    render(processResults(results));
  });
}
