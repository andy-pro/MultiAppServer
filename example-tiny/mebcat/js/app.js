/*
 * client side
 *
 * Furniture catalog example
 * Мебельщикам всех стран посвящается!!!
 * Backbone
 * Underscore
 * <a href="xyz"> SPA type link
 * <a data-bypass href="xyz"> regular link
 *
 * andy-pro 2016
 */

$(function () {    
        
    var app = {
      root: "mebcat",
      name: "Каталог мебели",
      // views: {},
      template: _.template($('#thumbTmpl').html()),
      titles: ['Кухни "Классика"', 'Кухни "Модерн"', 'Шкафы-купе', 'Прихожие', 'Гостиные', 'Офисная', 'Детские', 'Разное'],
      itemtitle: ['Кухня классика', 'Кухня модерн', 'Шкаф-купе', 'Прихожая', 'Гостиная', 'Офис', 'Детская', 'Разное'],
      initialize: function() {
        var root = this.root;
        this.cats = this.titles.map(function(cat, i) { return [`/${root}/category/${i}`, cat]; }); 
        // create categorie's menu
        var el = $("#catmenu");
        this.cats.forEach(function(cat, i) { el.append(`<li><a href="${cat[0]}">${cat[1]}</a></li>`); });          
        // prepare routes hash
        var r = {};
        [ ['', 'main'], 
          ['/', 'main'],
          ['/projects/:client/:project', 'showProject'], 
          ['/category/:cat', 'showCategory']
        ].forEach(function(i) { r[root+i[0]] = i[1]; });        
        this.router = new Router({routes: r});
        // views hash
        this.views = {
          main: new MainView(),
          cat:  new CategoryView(),
          prj:  new ProjectView()
        }
        
        // enable history.back() when 'ESC' key pressed
        document.onkeydown = function(e) {
          if (e.keyCode == 27) {  // escape key code check
            history.back(); 
            return false;
          }
	      }
        // links setup 
        $("body").on("click","a:not(a[data-bypass])",function(e){
          e.preventDefault();
          var href = $(this).attr("href");
          app.location = href;
          Backbone.history.navigate(href, {trigger: true});
        });
      }

    }
                
    //=================================================
    var Router = Backbone.Router.extend({
      
      main: function() {
        // console.log('route is main');
        document.title = app.name;
        app.views.main.render();
      },
      
      showCategory: function(cat) {
        document.title = app.titles[cat];
        this.get_ajax('cat', cat);
      },  
      
      showProject: function(cl, prj) {
        document.title = `${cl} ${prj}`;
        //this.get_ajax('prj', cl, prj);
      },     
      
      get_ajax: function(view, arg0, arg1) {
        var href = '/' + Backbone.history.getFragment();
        console.log('route: ', view, ' href: ', href); 
        $.get(href).always(function(data, status) {
		  if (status=='success') app.views[view].render(data, arg0, arg1);
          else console.log(status);
        });
      }
            
    });
    
    //=================================================
    var ProjectView = Backbone.View.extend({
      el: $("#content"),

      render: function (items, cl, prj) { 
        var html = '',
            title = 'Фото';
        items.forEach(function(item, i) {
        // console.log(this);
          html += app.template({
            ahref: `/${app.root}/preview/${cl}/${prj}/${item.thumb}`,
            ihref: `/../${app.root}/images/mebprj/${cl}/${prj}/thumbnails/${item.thumb}`,
            hint: `${title} ${i+1}`,
            title: `${title} ${i+1}`
          });
        });
        
        this.$el.html(html);
        return this;
      },
      
    });     
       
    //=================================================
    var CategoryView = Backbone.View.extend({
      el: $("#content"),

      render: function (items, cat) { 
        var html = '',
            title = app.itemtitle[cat];
        items.forEach(function(item, i) {
        // console.log(this);
          html += app.template({
            ahref: `/${app.root}/projects/${item.client}/${item.project}`,
            ihref: `/../${app.root}/images/${item.thumb}`,
            hint: item.client,
            title: `${title} ${i+1}`
          });
        });
        
        this.$el.html(html);
        return this;
      },
      
    }); 

    //=================================================
    
    var MainView = Backbone.View.extend({      
      el: $("#content"),      
      html: '',      
      initialize: function () {
        var self = this;
        app.cats.forEach(function(cat, i) {
          self.html += app.template({
            ahref: cat[0],
            ihref: `../${app.root}/images/0${i+1}.jpg`,
            hint: cat[1],
            title: cat[1]
          });
        });
      },
      render: function () {     
        this.$el.html(this.html);
        return this;
      },
    });    
    
    //=================================================
    
    app.initialize();
    
    Backbone.history.start({
        root: '/',
        pushState: true
    });
 
}); 
