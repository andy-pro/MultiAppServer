#Multi App Server for Node.js

[![Node.js](https://upload.wikimedia.org/wikipedia/commons/d/d9/Node.js_logo.svg)](https://nodejs.org)

***

###Features
- Single Page Applications Design
- Static server
- Common resources
- 'index.html' provider for all '/path/'-like HTTP-requests
- RPC (Remote Procedure Call), API provider for HTTP-requests
- API provider for AJAX requests
- Escaped JSON provider for API & AJAX
- Arguments to array parsing
- Variables & POST-data to object parsing
- Access restriction
- Fully asynchronous
- No special dependencies  

***
#### config.json parameters
```
port - desired port
api - directory: contains controllers for mega projects or 'index.js' for tiny projects
mega - false/true: tiny/mega model, 'tiny' default
orig - false/true, merge original request to custom
server-static - static files folder for server, default is 'static'
app-static - static files folder for applications, default is 'static'
```
#### Request structure
for tiny model:
```
http://localhost:3000/app1/function1/arg0/arg1?var1=value1&var2=value2
application: 'app1'
function: 'function1'
args: [ 'arg0', 'arg1' ]
query: 'var1=value1&var2=value2'
vars: {var1: 'value1', var2: 'value2'}
```
for mega model:
```
http://localhost:3000/app1/controller1/function1/arg0/arg1?var1=value1&var2=value2
application: 'app1'
controller: 'controller1'
function: 'function1'
args: [ 'arg0', 'arg1' ]
query: 'var1=value1&var2=value2'
vars: {var1: 'value1', var2: 'value2'}
```
POST-data merged to vars
***
#### Examples included
for run examples: in "example-tiny", "example-mega" folders type ```node index.js``` or ```nodemon index.js``` if **nodemon** installed  
and visit [localhost:3000] for tiny or [localhost:3001] for mega-structure example  
app *Calculator* require [mathjs]

***

#### Folders structure for tiny projects (see example-tiny)
```
app1
  api
    index.js
  static
    css
    js
  index.html
app2
  ***
app3
  ***
static
  css
  js
index.js
```
#### Folders structure for mega projects (see example-mega)
```
app1
  api
    ctrl1.js
    ctrl2.js
    ...
  ...
  /* same as tiny */
```
**andy-pro 2016**
[mathjs]: http://mathjs.org/
[localhost:3000]: http://localhost:3000/
[localhost:3001]: http://localhost:3001/
