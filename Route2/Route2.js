var Mod4 = require("mod42/Mod4");
var Mod2 = require("mod42/Mod2");
var is = require("util42").is;
var view = require("view42");

var shared = require("../shared");

var logger = require("log42");
var log = logger();

/*
I'm going to run into issues with auto cloning arrays?
Not if they stay empty, I suppose.  But, the cloning didnt seem to be working.
*/

var Route = module.exports = Mod2.Sub.extend({
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
		this.log("new route: ", this.path);
		this.parsePath();
	},
	parsePath: function(){
		if (this.path.indexOf("/") > -1){
			console.warn("bridging needed");
		} else {
			this.part = this.path;
		}
	},
	set_parent: function(parent, name){
		if (parent instanceof Route2){
			if (this.hasOwnProperty('parent'))
				console.warn("re-set route.parent?");

			// parent should be a route
			this.parent = parent;
			this.makeFullPath();
		} else if (parent instanceof view){
			this.set_view(parent);
		}

		if (name && !this.hasOwnProperty("name")){
			this.name = name;
		}
	},
	makeFullPath: function(){
		if (this.parent){
			this.parts = this.parent.parts.slice(0)
		} else {
			this.parts = [];
		}

		this.parts.push(this.part);

		this.path = "/" + this.parts.join("/") + "/";
		return this.path;
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
		} else {
			this.reactivate();
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
		// do the matching here
		if (!route instanceof Route){
			route = Route.apply(null, [].slice.call(arguments, 0).unshift({
				parent: this
			}));
		}
		this.routes.push(route);
		if (!this[route.part]){
			this[route.part] = route;
		}
	},
	each: function(fn){
		var ret;
		for (var i = 0; i < this.routes.length; i++){
			ret = fn.call(this, this.routes[i], i);
			if (is.def(ret)){
				return ret;
			}
		}
	},
	match: function(parts){
		if (parts[0] === this.part){
			return this.matchChildren(parts.slice(1));
		} else {
			return false;
		}
	},
	matchChildren: function(parts){
		var match;
		if (parts.length){
			match = this.each(function(route){
				var match = route.match(parts);
				if (match)
					return match;
			});
		}
		return {
			route: this,
			remaining: remaining
		}
	},
	matched: function(remaining){
		var match;
		if (remaining.length){
			for (var i = 0; i < this.routes.length; i++){
				match = this.routes[i].match(remaining);
				if (match)
					return match;
			}	
		}
		return {
			route: this,
			remaining: remaining
		};
	},

	// maybe pass the path to activate?
	activate: function(remainingParts){
		if (!this.active){
			this.active = true;
			this.activateSelf();
			this.execCBs();
		}
		
		this.activateChildren(remainingParts);
	},
	activateSelf: function(){
		
	},
	activateChildren: function(pathParts){
		var router = this;
		var pathParts = pathParts || shared.parts(window.location.pathname);
		console.log(pathParts);
		// either do matching here, or in the route?
		this.each(function(route){
			var match = route.match(pathParts);
			if (match){
				match.route.remaining = match.remaining;
				match.route.activate();
				return true;
			}
		});
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