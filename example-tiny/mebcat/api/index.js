/*
  # server side
  #
  # api/ajax controller
  #
  # andy-pro 2016
*/

/*
=== FONT ===
\033[0m       normal
\033[1;30m    white dim
\033[1;31m    red
\033[1;32m    green
\033[1;33m    yellow
\033[1;34m    blue
\033[1;35m    magenta
\033[1;36m    cyan
\033[1;37m    white bright
=== BACKGROUND ===
\033[1;41m    red
\033[1;42m    green
\033[1;43m    yellow
\033[1;44m    blue
\033[1;45m    magenta
\033[1;46m    cyan
\033[1;47m    grey     
*/
      
var fs = require("fs"),
    path = require("path"),
    mebcat = ['Кухня классика', 'Кухня модерн', 'Шкаф-купе', 'Прихожая', 'Гостиная', 'Офис', 'Детская', 'Разное'],   
    titles = ['Кухни "Классика"', 'Кухни "Модерн"', 'Шкафы-купе', 'Прихожие', 'Гостиные', 'Офисная', 'Детские', 'Разное'],
    cat_cnt = mebcat.length,
    exts = ['.jpg', '.jpeg'],
    thdir = 'thumbnails', // thumbnails
    thsize = 144,
    pvdir = 'images', // previews
    pvsize = 640;

getCategory = function(mask, map, after) {
  console.time('run for');
  console.log();
  console.log('\033[1;46mCategory:', header, '\033[0m');
  var cnt = 0,
      image = `0${+id+1}.jpg`,
      client, prj;
  for(var i=0; i<10; i++) {
    cnt++;
    client = 'Клиент' + cnt;
    prj = 'Проект' + Math.floor(Math.random() * 10 + 1);
    map(image, client, prj);
  }
  console.log('\033[1;33mCount of projects:\033[0m', cnt);
  console.timeEnd('run for');
  if (typeof after =='function') return after();
}  
   
init = function(_id) { // set module context enviroment
  this.id = _id;
  this.title = mebcat[_id];
  this.mask = new RegExp("^" + this.title);
  this.header = titles[id];
}

api = { // controllers for ajax or api requests

  //=================================================
  
  index: function(req, res) {

    var categories = [];
    titles.forEach(function(h, i) {
      categories.push({
        title: h,
        category: i
      });
    });
    
    return res(categories);
    
  },
  
  //=================================================

  category: function(req, res) {

    var projects = [];
    init(req.args[0]);
    if (!id || id >= cat_cnt) {
      return response();  
    }
    
    function getProject(image, client, prj) {
      projects.push({
        client: client,
        project: prj,
        thumb: image
      });
    }   

    getCategory(mask, getProject, function() {
      return res(projects);
    });

  }
  
}

module.exports = api;
