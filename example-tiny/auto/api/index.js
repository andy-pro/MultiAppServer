/*
  # server side
  #
  # api/ajax controller
  #
  # andy-pro 2016
*/

var fs = require("fs"),
    path = require("path");
    
api = {
  
  time: function(req, res) {
    return res({time: new Date().toLocaleTimeString()});    
  },
  
  imagelist: function(req, res) {   
    var list = [];
    fs.readdir(path.join(req.approot, req.vars.href), function(err, files) {
      files.forEach(function(file) {
        if ((/\.(jpg|jpeg|png)$/i).test(file)) list.push(file);
      });
      return res({pics: list});    
    });    
  },
  
}

module.exports = api;
