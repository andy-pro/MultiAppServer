/*
  # server side
  #
  # api/ajax controller
  #
  # andy-pro 2016
*/

api = {
  
  directory: (req, res) => {
    
    return res({
      hint: 'you can play with arguments',
      controller: req.controller, 
      function: req.function,
      arguments: req.args
    });
    
  },
  
  //=================================================
  
  file: (req, res) => {
    
    return res({hint: 'you can play with vars', controller: 'ctrl2', function: 'file', vars: req.vars});
    
  },

  //=================================================
   
  lowerize: (req, res) => {

    return res({value: req.vars.word.toLowerCase()});
    
  }
  
}

module.exports = api;
