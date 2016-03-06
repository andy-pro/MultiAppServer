/*
  # server side
  #
  # api/ajax controller
  #
  # andy-pro 2016
*/

api = { // controllers for ajax or api requests
  
  date: (req, res) => {  
  
    return res({
      controller: req.controller, 
      function: req.function, 
      date: new Date().toLocaleDateString()
    });  
    
  },
  
  //=================================================
   
  time: (req, res) => {  
  
    return res({controller: 'ctrl1', function: 'time', time: new Date().toLocaleTimeString()});  
    
  },  
  
  //=================================================
   
  request: (req, res) => {  
    
    // console.log(req)
    return res({req: req});  
    
  },
  
  //=================================================
  
  upperize: (req, res) => {

    return res({value: req.vars.word.toUpperCase()});
    
  }
   
}

module.exports = api;
