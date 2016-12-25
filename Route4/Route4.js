var Mod4 = require("mod42/Mod4");
var Mod2 = require("mod42/Mod2");
var is = require("util42").is;
var view = require("view42");

var Promise = require("bluebird");

var shared = require("../shared");

var RouteView = require("../Route3/RouteView");

var logger = require("log42");
var log = logger();

var Route = module.exports = Mod2.Sub.extend({
	name: "Route3",
	View: RouteView,
	// log: true,
	cbs: [],
	dcbs: [],
	routes: [],
	toggle: true, // a UI switch
	set: {
		other: function(route, value){
			if (is.str(value))
				route.set_path(value);
			else
				console.warn("ehh");
		},
		Method: {
			disable_return: true
		}
	},
	set_parent: function(parent, name){
		if (parent instanceof Route){
			if (this.hasOwnProperty("parent"))
				console.warn("override route.parent?");

			parent.routes.push(this);

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
		// this.cbs.push(function(){
		// 	// debugger;
		// 	return this.view.header.label.slideDown().$el.promise();
		// });
		// this.dcbs.push(function(){
		// 	// debugger;
		// 	return this.view.header.label.slideUp().$el.promise();
		// });
	},
	render: function(){
		this.view = new this.View({
			parent: this
		});
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
	// .path is mapped to .part, and then a full path is made
	// "path" just makes more sense, as an API: { path: "yo" }
	set_path: function(path){
		if (path.indexOf("/") > -1){
			console.warn("bridging needed");
		} else {
			this.part = path;
			this.name = this.part;
			this.makeFullPath();
			this.relPath = this.path.replace(this.router.path, "");
		}
	},
	each: function(fn){
		var ret;
		for (var i = 0; i < this.routes.length; i++){
			ret = fn.call(this, this.routes[i], i);
			if (ret) // return truthy breaks the loop, falsey continues
				return ret;
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
		var childMatch;
		if (parts.length){
			childMatch = this.each(function(route){
				// console.log("child:", route);
				// truthy breaks loop, falsey continues search
				return route.match(parts);
			});
		}

		return childMatch || {
			route: this,
			remainder: parts
		};
	},
	// create blank routes for all of these
	bridge: function(parts){
		var next = this;
		for (var i = 0; i < parts.length; i++){
			next = next.add(parts[i]);
		}
		return next;
	},
	// find the correct parent to add the new route to
	// if the new path has a "/" ("a/b"), then we need to first add a, then b
	// this is the "bridging", where we fill the gaps between all/the/child/routes/that/might/not/exist.
	add: function(route){
		// get the parts
		var path = is.str(route) ? route : route.path;
		var parts = shared.parts(path);

		// find the appropriate parent
		// could be this, an existing child, or it might not exist yet
		var parent;

		// search for an existing child
		var match = this.matchChildren(parts);

		if (match){
			// exact match was found 
			if (!match.remainder.length){
				console.warn("attempting to re-add an existing route");
				return match.route;
			
			// a partial match
			} else {
				// even if only 1 remainder, parent becomes the match.route (bridge loops through an empty array, and returns self)
				parent = match.route.bridge(match.remainder.slice(0, -1));
			}
		} else {
			// again, even if parts.length is 1, this should still work
			parent = this.bridge(parts.slice(0, -1));
		}

		// set a potential long/path to just the last path part
		path = parts[parts.length - 1];

		// fix the arguments to convert long/path to the single path part
		if (is.str(route)){
			route = path;
		} else {
			route.path = path;
		}

		// create the new route, using the correct parent
		var args = [].slice.call(arguments, 0);
		
		args.unshift({
			parent: parent
		});

		route = Route.apply(null, args);

		return route;
	},
	push: function(){
		// the final step, actually displaying the new route
		if (window.location.pathname === this.path){
			// debugger;
			console.warn("path matches, no need to push");
		}
		else if (this.router.firstPush){
			this.log.error("firstPush");
			this.router.firstPush = false;
			this.router.history.push(this.path);
		} else {
			this.router.history.replace(this.path);
		}
		
		this.sync();
	},
	sync: function(){
		this.parent.activeChild = this;
		this.parent.isActiveRoute = false;
		this.parent.active = true;

		this.router.activeRoute = this;
		this.router.transitioning = false;
		this.router.routeToBe = false;
		// this.router.transitionLevel--;
		// this.log.info("transitionLevel", this.router.transitionLevel);

		this.isActiveRoute = true;
		this.active = true;

		if (this.activeChild){
			this.activeChild.active = false;
			this.activeChild.isActiveRoute = false;
			this.activeChild = false;
		}

		this.parent.view && this.parent.view.sync();
		this.view && this.view.sync();
	},
	replace: function(){
		this.router.history.replace(this.path);
	},
	activate: function(push){
		push = is.def(push) ? push : true;

		if (this.isActiveRoute){
			return this.alreadyActiveRoute();
		} else {
			push && this.push();

			if (this.active){
				return this.activeChild.deactivate()
					.then(this.reactivate.bind(this));
			} else if (this.parent.isActiveRoute){
				return this.exec();
			} else {
				this.parent.activate(false)
					.then(this.exec.bind(this));
			}
		}
	},
	deactivate: function(push){
		push = is.def(push) ? push : true;

		if (this.active){
			push && this.parent.push();

			if (this.isActiveRoute)
				return this.dexec();
			else
				return this.activeChild.deactivate(false)
					.then(this.dexec.bind(this));
		} else {
			this.log.warn("not active");
			return Promise.resolve();
		}
	},
	reactivate: function(){
		// when this is already active, and we just deactivate activeChildren until this becomes active
	},
	alreadyActiveRoute: function(){
		this.log("already activeRoute");
		return Promise.resolve();
	},
	activateSelf: function(){
		var route = this;
		this.router.transitioning = true;
		this.router.routeToBe = this;
		return Promise.all(this.cbs.map(function(cb){
			return cb.call(route);
		})).then(this.push.bind(this));
		// run the CBs, then set the url when they're all complete.
	},
	softActivate: function(){
		// just exec CBs, without doing all the promise/transition stuff
		var route = this;

		if (this.parent)
			this.parent.softActivate(); // should climb back to router

		this.sync(); // set all the state
		this.router.routeToBe = this; // just in case we need that 

		this.cbs.forEach(function(cb){
			cb.call(route);
		});
	},
	deactivateSelf: function(){
		var route = this;

		// router needs to be in transitioning = true mode before we history.pushState
		this.router.transitioning = true;
		// this.router.transitionLevel++;
		// this.log.info("transitionLevel", this.router.transitionLevel);

		// page deactivation (transition) needs to follow route drop...
		this.drop();
			// drop uses parent.push, which turns transitioning off

		// execute dcbs as promisified array
		return Promise.all(this.dcbs.map(function(cb){
			return cb.call(route); // return promise from cb to delay anything added to deactivate()
		}));
	},
	// goes from root.com/parent/this-route-part/ to root.com/parent/, just dropping this route part from the URL
	// needs to either history.pushState or history.replaceState
	drop: function(){
		// just removes this current /part/ from the URL
		this.active = false;
		this.isActiveRoute = false;
		this.view.sync();
		this.parent.push();
	},
	then: function(cb, dcb){
		this.cbs.push(cb);
		if (dcb)
			this.andThen(dcb);
		return this;
	},
	andThen: function(dcb){
		this.dcbs.push(dcb);
		return this;
	},
});

Route.prototype.set.mfn.rewrapAll(Route.prototype);

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