var Mod4 = require("mod42/Mod4");
var is = require("util42").is;
var view = require("view42");

var shared = require("./shared");

var logger = require("log42");
var log = logger();

/*
I'm going to run into issues with auto cloning arrays?
Not if they stay empty, I suppose.  But, the cloning didnt seem to be working.
*/

var Route = module.exports = Mod4.Sub.extend({
	name: "Route2",
	cbs: [],
	dcbs: [],
	routes: [],
	set: {
		other: function(route, value){
			if (is.str(value))
				route.path = value;
			else if (is.fn(value))
				route.then(value);
		}
	},
	init: function(){
		this.cbs = [];
		this.dcbs = [];
		this.routes = [];

		this.debug();
		this.parsePath();
	},
	debug: function(){
		this.debug = view("route2: " + this.path);
	},
	parsePath: function(){
		if (this.path.indexOf("/") > -1){
			console.warn("bridging needed");
		} else {
			this.part = this.path;
		}
	},
	setup: function(parent, name){
		if (parent instanceof Route2){
			this.set_parent(parent);
		} else if (parent instanceof view){
			this.set_view(parent);
		}

		if (name && !this.hasOwnProperty("name")){
			this.name = name;
		}
	},
	set_parent: function(parent){
		if (this.hasOwnProperty('parent'))
			console.warn("re-set route.parent?");

		// parent should be a route
		this.parent = parent;
	},
	set_view: function(view){
		if (this.hasOwnProperty("view"))
			console.warn("re-set route.view?");
		this.view = view;
	},
	activate: function(){
		// var route = this;
		if (!this.active){
			this.active = true;

			if (this.view){
				this.view.activate(); // show the view before adding contents for debug views

				this.view.capture(function(){
					this.execCBs.apply(this, arguments);
					this.activateChildRoutes(); // before or after cbs?
				}.bind(this));
			} else {
				this.execCBs.apply(this, arguments);
			}
		}
	},
	activateChildRoutes: function(){
		if (!this.parent){

		}
		for (var i = 0; i < this.routes.length; i++){

		}
	},
	matchAndActivate: function(){},
	execCBs: function(){
		for (var i = 0; i < this.cbs.length; i++){
			this.cbs[i].apply(this, arguments);
		}
	},
	then: function(cb){
		this.cbs.push(cb);
	},
	add: function(route){
		if (!route instanceof Route){
			route = Route.apply(null, [].slice.call(arguments, 0).unshift({
				parent: this
			}));
		}
		this.routes.push(route);
		if (!this[route.part]){
			this[route.part] = route;
		}
	}
});

// var Router = Route.extend({
// 	name: "Router",

// })

/*

Root route will be assumed if no path is given?

We'll be initializing the root route on non-root pages...

URL /some/path/
entry.js:
	new Route() --> defaults to root route?
	added routes are relative to the root?
	probably makes more sense to use a router...

	Match against current path..
		- activate root route (router?)
		- root router matches children routes, and activates them if matched


Adding deep routes:
router.add("/deep/path/");

Match: find the deepest match
Bridge the gap between the last path part and the deepest match


Capturing with the view?
If each route has its own view, shouldn't we automatically activate the child routes inside the parent route's view capture?  This would make sense..


It would be nice if views could have routes, and routes could have views, but neither is required (views w/o routes, and routes w/o views).


route.add({
	path: "whatever" || "deep/path/somewhere",
	view: view.x("don't render me"), // defaults to an empty wrapper? or adds classes to parent view (current View.captor?)
	then: [function(){
		// apply args to fn - adding cb

	}],
	onActivate: [function(){}]
});

Route activate might be instant - but might be delayed.
k





*/