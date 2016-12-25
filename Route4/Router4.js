var Route = require("./Route3");
var shared = require("../shared");
var History = require("history").createBrowserHistory;
var is = require("util42").is;
var Promise = require("bluebird");

var RouterView = require("../Route3/RouterView");

var Router = module.exports = Route.extend({
	name: "Router3",
	View: RouterView,
	set_path: function(path){
		this.path = path;
		this.parts = shared.parts(this.path);
	},
	path: "/",
	part: "",
	parts: [],
	transitionLevel: 0,
	init: function(){
		this.log("new router");
		this.router = this;

		this.history = History();
		this.history.listen(this.historyListener.bind(this));
	},
	historyListener: function(location, action){
		if (!this.transitioning){
			this.matchAndActivate(true);
		} else {
			this.log.info("already in transition, skipping");
		}
	},
	useCurrent: function(){
		this.path = window.location.pathname;
		this.log(this.path);
		this.parts = shared.parts(this.path);
	},
	sync: function(){
		this.transitioning = false;
		// this.transitionLevel--;
		// this.log.info("transitionLevel", this.transitionLevel);

		this.activeRoute = this;
		this.isActiveRoute = true;
		this.active = true;

		this.activeChild = false;
		this.view && this.view.sync();
	},
	getCurrentURLPathParts: function(){
		// an attempt to make the router work when dropped on any given relative page
		return shared.parts(window.location.pathname.replace(this.path, ""));
	},
	matchAndActivate: function(hard){
		// this.log.group("matchAndActivate");
		// debugger;
		var match = this.match(this.getCurrentURLPathParts());
		if (match){
			this.log((hard?"hard ":"") + "match found", match)
			match.route.remainder = match.remainder;
			if (hard)
				match.route.activate();
			else
				match.route.softActivate();
		}
		// this.log.end();
		return this;
	},
	match: function(parts){
		return this.matchChildren(parts);
	},
});