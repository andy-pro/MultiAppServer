/*
  # server side
  #
  # api/ajax controller
  #
  # andy-pro 2016
*/

var math = require('mathjs');

var elapsed_time = function(start){
  var precision = 3; // 3 decimal places
  var elapsed = process.hrtime(start);
  return elapsed[0] + " s, " + (elapsed[1] / 1000000).toFixed(precision) + " ms ";
}

api = { 
 
  calculate: function(req, res) {
    var expr = req.vars.expr.replace(/√(\d+)/g, function(s, m) { return `sqrt(${m})`; }).replace(/√\(/g, 'sqrt('),
        start = process.hrtime();   
    return res({ result: math.eval(expr), elapsed: elapsed_time(start)});    
  }
  
}

module.exports = api;
