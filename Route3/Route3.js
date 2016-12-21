var Mod4 = require("mod42/Mod4");
var Mod2 = require("mod42/Mod2");
var is = require("util42").is;
var view = require("view42");

var Promise = require("bluebird");

var shared = require("../shared");

var logger = require("log42");
var log = logger();

var Route = module.exports = Mod2.Sub.extend({
	name: "Route3",
	log: true,
	cbs: [],
	dcbs: [],
	routes: [],
	set: {
		other: function(route, value){
			if (is.str(value))
				route.set_path(value);
			else
				console.warn("ehh");
		}
	},
	set_parent: function(parent, name){
		if (parent instanceof Route){
			if (this.hasOwnProperty("parent"))
				console.warn("override route.parent?");

			this.parent = parent;
			this.router = parent.router;
			this.makeFullPath();
		}
		if (name && !this.hasOwnProperty("name")){
			this.name = name;
		}
	},
	init: function(){
		this.log("new route:", this.path);
	},
	makeFullPath: function(){
		if (this.part){	
			if (this.parent){
				this.parts = this.parent.parts.slice(0)
			} else {
				this.parts = [];
			}

			this.parts.push(this.part);

			this.path = "/" + this.parts.join("/") + "/";
			return this.path;
		}
	},
	set_path: function(path){
		if (path.indexOf("/") > -1){
			console.warn("bridging needed");
		} else {
			this.part = path;
			this.name = this.part;
			this.makeFullPath();
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
	add: function(route){
		var args;
		// do the matching here
		if (!(route instanceof Route)){
			args = [].slice.call(arguments, 0);
			args.unshift({
				parent: this
			});
			route = Route.apply(null, args);
		}
		this.routes.push(route);
		if (!this[route.part]){
			this[route.part] = route;
		}
		return route;
	},
	push: function(){
		// the final step, actually displaying the new route
		if (this.router.transitioning)
			this.replace();
		else 
			this.router.history.push(this.path);
		
		this.sync();
	},
	sync: function(){
		this.parent.activeChild = this;
		this.parent.isActiveRoute = false;

		this.router.activeRoute = this;
		this.isActiveRoute = true;
		this.active = true;

		this.activeChild = false;
	},
	replace: function(){
		this.router.history.replace(this.path);
	},
	activate: function(){
		if (this.isActiveRoute){
			return this.alreadyActiveRoute();
		} else if (this.active){
			this.log("activeChild.deactivate()");
			// !this.isActiveRoute, so one of this children must be
			return this.activeChild.deactivate();
		} else if (this.router.activeRoute !== this.parent){
			// then make it so
				// this will loop, climbing the path hierarchy back towards the root route
				// each route asks its parent to activate, and then activateSelf, and returns it, so we basically have our deactivate until common base, and reactivate from commonBase until this, all in one.
			this.log("parent.activate().then(this.activateSelf)");
			return this.parent.activate()
				.then(this.activateSelf.bind(this));
		} else {
			this.log("activateSelf()")
			// .activeRoute is this.parent
			return this.activateSelf();
		}
	},
	alreadyActiveRoute: function(){
		this.log("already activeRoute");
		return Promise.resolve();
	},
	activateSelf: function(){
		return Promise.all(this.cbs.map(function(cb){
			return cb();
		})).then(this.push.bind(this));
		// run the CBs, then set the url when they're all complete.
	},
	deactivate: function(){
		if (this.isActiveRoute){
			return this.deactivateSelf();
		} else if (this.active){
			// and not activeRoute...
				// this will climb down the route hierarchy to find the activeRoute, run its deactivation, and all the parent's are chained onto it.
			return this.activeChild.deactivate()
				.then(this.deactivateSelf.bind(this));
		} else {
			console.warn("not active");
			return Promise.resolve();
		}
	},
	deactivateSelf: function(){
		// page deactivation (transition) needs to follow route drop...
		this.drop();

		// execute dcbs as promisified array
		return Promise.all(this.dcbs.map(function(cb){
			return cb(); // return promise from cb to delay anything added to deactivate()
		}));
	},
	// goes from root.com/parent/this-route-part/ to root.com/parent/, just dropping this route part from the URL
	// needs to either history.pushState or history.replaceState
	drop: function(){
		// just removes this current /part/ from the URL
		this.active = false;
		this.isActiveRoute = false;
		this.parent.push();
	},
});

/*
With promisified cbs, we can optionally delay the sequence by returning a promise from a CB.
.pre_activate
.post_activate

It would be cool if these hooks were... always available as a submodule.  Instead of having to: this.addPreactivateCB(fn(){});
You could just this.pre_activate.then(function(){});
// pre_activate could be a promise that's renewed?

Promises are kinda beastly, I have no idea how to clone one.  So, I think the best way to get around that is to just make my own promise wrapper.

An object (module?) for pre_activate and post_activate?

Ideally, we can call activate().then(), and not have a post_activate?

Unforuntately, these promise routines don't seem to provide much assistance in terms of order (prepending a promise, or something);







Maybe transitions should be a separate module?

.activate()
	new Transition({
		from: page,
		to: page
	})
*/