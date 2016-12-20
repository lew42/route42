var Mod4 = require("mod42/Mod4");
var Mod2 = require("mod42/Mod2");
var is = require("util42").is;
var view = require("view42");

var shared = require("../shared");

var logger = require("log42");
var log = logger();

var Route = module.exports = Mod2.Sub.extend({
	name: "Route3",
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
		this.log("new route:", this.path);
		if (this.path)
			this.parsePath();
	},
	parsePath: function(){
		if (this.path.indexOf("/") > -1){
			console.warn("bridging needed");
		} else {
			this.part = this.path;
		}
	},
	deactivate: function(until){
		if (this.active){
			this.active = false;

			this.drop();

			if (this.page.active)
				this.page.deactivate();
		}
	},
	// goes from root.com/parent/this-route-part/ to root.com/parent/, just dropping this route part from the URL
	// needs to either history.pushState or history.replaceState
	drop: function(){
		// just removes this current /part/ from the URL
		if (this.router.firstPush){
			this.router.firstPush = false;
			this.parent.push();
		} else {
			this.parent.replace();
		}
	},
	push: function(){
		this.router.history.push(this.path);
	},
	replace: function(){
		this.router.history.replace(this.path);
	}
});

/*
Maybe transitions should be a separate module?

.activate()
	new Transition({
		from: page,
		to: page
	})
*/