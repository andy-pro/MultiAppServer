/*
  # Multi app server
  #
  # Single Page Applications Design
  # Static server
  # 'index.html' provider for all HTTP-requests
  # RPC (Remote Procedure Call), API provider for HTTP-requests
  # API provider for ajax requests
  # fully asynchronous
  # no special dependencies
  #
  # andy-pro 2016
*/

var http = require("http"),
    path = require("path"),
    fs = require("fs"),
    qs = require("querystring"),
    cfg = require("./config.json"),
    root = process.cwd(),
    count = 0, // requests count
    mime = { 
      /* add your own mime types for responseFile */
      '.html': 'text/html; charset=UTF-8',
      '.txt': 'text/plain',
      '.jpeg': 'image/jpeg',
      '.jpg': 'image/jpeg'
    };
    /* end vars */

/* like lodash.merge or util._extend
   new keys to orig add */
function _extendObj(orig, add) {
  if (add && typeof add === 'object') {
    var keys = Object.keys(add);
    var i = keys.length;
    while (i--) orig[keys[i]] = add[keys[i]];
  }
};

 function urlparse(_req) {
  var _url = _req.url,
      uurl = qs.unescape(path.normalize(_url)),
      parts = uurl.split('?'),
      /* e.g. parts[0] = '/static/images/logo.jpg', after parse:
      { root:'\\', dir: '\\static\\images', base: 'logo.jpg', ext: '.jpg', name: 'logo' } */
      req = path.parse(parts[0]),
      idx = 2;
  req.url = _url; // original url
  req.uurl = uurl; // unescaped url
  req.uri = decodeURI(_url);
  req.path = parts[0];
  req.query = (parts.length > 1) ? parts[1] : '';
  req.vars = qs.parse(req.query);
  parts = req.path.split(path.sep);
  req.application = parts[1];
  req.ajax = _req.headers['x-requested-with'] === 'XMLHttpRequest';
  req.apidir = cfg.api;
  req.method = _req.method;
  if (parts[2] === cfg.api && !req.ajax) {
    idx++;
    req.api = true;
  }
  if (cfg.mega) {
    req.controller = parts[idx];
    idx++;
  }
  req.function = parts[idx];
  req.args = parts.slice(idx+1) || [];
  
  req.cwd = root;
  req.approot = path.join(root, req.application);
  req.abs = path.join(root, req.path); // absolute filename
  
  /* if _CTRL is true (for mega projects): e.g. http://localhost:3000/app1/controller1/function1/arg0/arg1?var1=value1&var2=value2
  { application: 'app1', controller: 'controller1', function: 'function1', args: [ 'arg0', 'arg1' ],
    query: 'var1=value1&var2=value2', vars: { var1: 'value1', var2: 'value2' } }
    
  if _CTRL is false (for tiny projects): e.g. http://localhost:3000/app1/function1/arg0/arg1?var1=value1&var2=value2
  { application: 'app1', function: 'function1', args: [ 'arg0', 'arg1' ],
    query: 'var1=value1&var2=value2', vars: { var1: 'value1', var2: 'value2' } } */ 
    
  return req;
}
    
http.createServer(function(request, response) {
  
  function responseIndex(p) {
    req.ext = '.html';
    p = path.join(p, 'index'+req.ext);
    console.log('\033[1;44mResponse index:\033[0m', p);
    return responseFile(p);
  }
  
  function responseFile(src) {
    fs.readFile(src, "binary", function(err, file) {
      if (err) return responseErr(500, err);     
      var meta = mime[req.ext];
      return __response(200, file, meta);
    });
  }

  function responseObj(obj) {
    return __response(200, escapeJSON(obj), 'application/json');
  } 
  
  function responseErr(code, err) { 
    if (code == 404) err = "Not found";
    console.log('\033[1;41mError:\033[0m', code, err);
    return __response(code, err + "\n", "text/plain");
  }
  
  function __response(code, data, meta) {    
    response.writeHead(code, meta ? {"Content-Type" : meta} : {});
    response.write(data, "binary");
    response.end();
  }  
  
  function escapeJSON(obj) {
    return JSON.stringify(obj).replace(/[\u0080-\uFFFF]/g, function(m) {
      return "\\u" + ("0000" + m.charCodeAt(0).toString(16)).slice(-4); 
    });
  }

  request.setEncoding("utf8");
  
  var postData = "",
      req = urlparse(request); // custom request

  if (cfg.orig) req.orig = request; // original request

  request.addListener("data", function(chunk) {
    postData += chunk;
  });

  request.addListener("end", function() {

    if (postData) _extendObj(req.vars, qs.parse(postData)); // add post data to vars object
    
    fs.exists(req.abs, function(exists) {    
      try {      
        if (exists) {        
          fs.stat(req.abs, function(err, stats) {
            if (err) throw(err);
            if (stats.isDirectory()) responseIndex(req.abs); // send 'index.html' in current dir
            else responseFile(req.abs); // static file
         }); 
        } else {
          if (req.ajax || req.api) {
            var ctrl = require('./' + path.join(req.application, req.apidir, (cfg.mega ? req.controller : ''))),
                f = ctrl[req.function];
            if (typeof f === 'function') f(req, responseObj);
            else throw('bad function');          
          } else (req.ext) ? responseErr(404) : responseIndex(req.application);
        }
      } catch (err) {          
        responseErr(500, err);
      }    
    }); 

    console.log('\033[1;33mRequest count: \033[0m', ++count, 'url: ', req.uri);
    
  });
 
}).listen(parseInt(cfg.port, 10));

console.log("server running at\n  => http://localhost:" + cfg.port + "/\nCTRL + C to shutdown");
