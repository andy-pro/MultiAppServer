/*
 * client side
 *
 * Calculator
 * server calculations
 * Math.js library
 * read help for more information
 *
 * andy-pro 2016
 */
 
$(function () { 

    function calc(e, key) {
      if (key == 13) e.keyCode = 13;
      if (e.keyCode === 13) { // check 'Enter' key
        var start = this.selectionStart,
            el = e.target,
            val = el.value,
            lines = val.split("\n"),
            before = val.substr(0, start),
            after = val.substr(this.selectionEnd),
            idx = before.split("\n").length - 1,
            expr = lines[idx];
        if (isNaN(expr)) {
        
          $.post('calc/calculate', {expr: expr}).always(function(data, status, _x) {
      	    if (status=='success') {
              var result = data.result;
              if (isNaN(result)) { 
                stat.val(result); 
              } else {
                el.value = before + '\n' + result + after;
                this.selectionStart = this.selectionEnd = start + result.length + 1;
                stat.val('Ok');                    
                stat.css({color:'#555'});
              }
	          } else {
              console.warn(data); console.warn(status); console.warn(_x);
              // self.raise_error(data.status, status);
              // data = false;
              stat.val(status);
              stat.css({color:'red'});
      	    }
          });
          return false;
        }
      }
    }
    
    function insertSymbol(ns){
      var pos = ta.caret();
      var s = ta.val();      
      ta.val(s.slice(0, pos) + ns + s.slice(pos));    
      ta.caret(pos + 1);
    }
    
    var stat = $("#status"),
        cp = $("#calc-pad"),
        hm = $("#help-pad"),
        ta = $("#memo").on('keydown', calc).focus(),
        hide = 'hide',
        show = 'show',
        speed = 300;
        
    // localStorage is a simpler, but we are just learning
    var newtheme = document.cookie.replace(/(?:(?:^|.*;\s*)theme\s*\=\s*([^;]*).*$)|^.*$/, "$1");
    theme = (newtheme === "light" || newtheme === "dark") ? newtheme : "light";    
    $("body").attr("class", theme);
    
    $("#theme").click(function() {
      $("body").toggleClass("light dark");
      theme = $("body").attr("class");
      document.cookie='theme=' + theme +' ;expires=Fri, 31 Dec 9999 23:59:59 GMT'; // ~infinity    
    });
    
    $("#help").click(function() {
      if (Math.round(Math.random())) { // 0 or 1
        hide = 'hide';
        show = 'show';
      } else {
        hide = 'fadeOut';
        show = 'fadeIn';
      }
      var dfr = $.get('calc/help.md');
      cp[hide](speed, function() {
        dfr.always(function(data) {
          hm.html(markdown.toHTML(data));
          hm[show](speed);
        });
      });
    });

    hm.click(function() { hm[hide](speed, function() { cp[show](speed); }); });

    $("button.equ").click(function(){ ta.trigger('keydown', [13]); });

    $("button").click(function(){ ta.focus(); });  

    $("button.crsl").click(function () { ta.caret(ta.caret() - 1); });
    
    $("button.crsr").click(function () { ta.caret(ta.caret() + 1); });
    
    $("button.clr").click(function(){ ta.val(''); });
   
    $("button.del").click(function(){
      var pos = ta.caret();
      if (pos > 0) {
          var s = ta.val();     
          var s1 = s.slice(0, pos-1);      
          var s2 = s.slice(pos);      
          ta.val(s1 + s2);    
          ta.caret(pos-1);
      }
    });

    $("button.op").click(function(){
      var s = $(this).attr("tag");
      return insertSymbol(s);
    });

    $("button.dr").click(function(){
      var s = $(this).html();            
      return insertSymbol(s);
    });

});
