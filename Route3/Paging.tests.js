var test = require("test42");
var view = require("view42");
var assert = test.assert;
var util = require("util42");
var is = util.is;

var Promise = require("bluebird");


var Route = require("./index");
var Router = require("./Router3");
// var Router = Route.Router;

	var router = window.router = Router("/test/route42/Route3/Paging/");
	// router.useCurrent();

	var a = router.add("a");
	var a1 = a.add("a1");
	var a2 = a.add("a2");

	var a2x = a2.add("a2x");
	var a2y = a2.add("a2y");
	var a2z = a2.add("a2z");

	var a3 = a.add("a3");
	var b = router.add("b");
	var c = router.add("c");

	router.toggle = false;
	router.log = true;
	router.expand = true;
	router.matchAndActivate();
	router.render()




var page = view.extend({
	addClass: "page",
	content: function(){
		if (this.dark)
			this.addClass("dark");

		var pg = this;
		this.h3(this.route.part);

		if (this.route.routes.length){
			view(function(){
				this.addClass("children");
				pg.route.each(function(route){
					page({
						dark: !pg.dark,
						route: route
					});
				});
				
			});
		}

		pg.route.then(function(){
			return pg.slideDown().fadeIn().$el.promise();
		}, function(){
			return pg.slideUp().fadeOut().$el.promise();
		});

		this.click(function(){
			pg.route.activate();
		});

		// this.hide();
	}
})

view(function(){
	this.addClass("well");

	router.each(function(route){
		page({route: route, dark: false});
	});
	
});
