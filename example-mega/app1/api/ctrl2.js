/*
  # server side
  #
  # api/ajax controller
  #
  # andy-pro 2016
*/

api = { // controllers for ajax or api requests 
  
  directory: (req, res) => {
    
    return res({
      controller: req.controller, 
      function: req.function,
      arguments: req.args
    });
    
  },
  
  //=================================================
  
  file: (req, res) => {
    
    return res({controller: 'ctrl2', function: 'file', vars: req.vars});
    
  },

  //=================================================
   
  lowerize: (req, res) => {

    return res({value: req.vars.word.toLowerCase()});
    
  }
  
}

module.exports = api;
