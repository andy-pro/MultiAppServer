/*
 * client side
 *
 * Server Tick-Tack Auto Clock
 * get images from server dir in asynchronous mode
 * simply image slider
 * get time from server
 *
 * andy-pro 2016
 */
 
$(function () {

  var Carousel = {
    
    pics: [],
    forward: true,
    width: 0,
    height: 0,
    
    load: function (opts) {      
      var self = this,
          promises = [];
      this.el = $(opts.el);
      this.table = this.el.children();
      this.row = this.table.children();      
      this.onload = opts.onload;
      $.get(opts.url, {href: opts.picdir}).always(function(data) {
        data.pics.forEach(function(fn) {
          var dfr = $.Deferred(),
              pic = $('<img>', {src: (opts.picdir + fn)}).on('load', function() {
                if (this.width > self.width) self.width = this.width;
                if (this.height > self.height) self.height = this.height;
                dfr.resolve();
              }),
              td = $('<td>').append(pic).appendTo(self.row);
          self.pics.push({pic: pic, td: td}); 
          promises.push(dfr);
        }); 
        $.when.apply($, promises).always( function() {
          self.init.call(self);            
        });    
      });      
    },
    
    init: function() {
      this.length = this.pics.length;
      this.el.width(this.width);
      this.el.height(this.height);
      this.el.show('slow');
      this.pos = 0;
      if (typeof this.onload === 'function') this.onload();
    },
    
    left: function() {
      var p = this.pos,
          go = p < this.length-1;
      if (go) {
        var dl = this.table.css('margin-left').replace('px', '');
        dl = (+dl) - (+this.width);
        this.table.animate({ 
          'margin-left': dl+'px',
          }, speed);
        var td = this.pics[p].td;
        td.animate({ 
          opacity: 0
          }, speed, function() {
            td.css('opacity', 1);
          });
        this.pos++;
      }
      return go;
    },
     
    right: function() {      
      var p = this.pos,
          go = p > 0;
      if (go) {
        var dl = this.table.css('margin-left').replace('px', '');
        dl = (+dl) + (+this.width);
        this.table.animate({ 
          'margin-left': dl+'px'
          }, speed);
        var td = this.pics[p].td;
        td.animate({ 
          opacity: 0
          }, speed, function() {
            td.css('opacity', 1);
          });        
        this.pos--;
      } else this.table.css('margin-left', '0px');
      return go;
    },

    slide: function() {
      this.forward ? this.forward = this.left() : this.forward = !this.right();
    }
  }
  
  function appStart() {    
    document.onkeydown = function(e) {
      if (e.keyCode == 37) {  // left arrow key code check
        Carousel.left(); 
        return false;
      } else
      if (e.keyCode == 39) {  // right arrow key code check
        Carousel.right(); 
        return false;
      }
    }
    // if (false)
    setInterval(function() {
      $.get('/auto/time').always(function(data) {
        TS.html(data.time);
        period &= 7;
        if (!period++) Carousel.slide();
      });
    }, 1000);    
  }
  
  var speed = 500,
      TS /* transportnoe sredstvo */ = $('#time-string'),
      period = 1;      
      
  Carousel.load({
    picdir: '/../auto/static/img/slide/',
    url: '/auto/imagelist',
    el: '#carousel',
    onload: appStart
  });
  
});
