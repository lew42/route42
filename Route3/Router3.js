var Route = require("./Route3");
var shared = require("../shared");
var History = require("history").createBrowserHistory;
var is = require("util42").is;
var Promise = require("bluebird");
var Router = module.exports = Route.extend({
	name: "Router3",
	path: "/",
	part: "",
	parts: [],
	init: function(){
		this.log("new router");
		this.router = this;
		this.activeRoute = this;
		this.isActiveRoute = true;
		this.active = true;

		this.history = History();
		this.history.listen(this.historyListener.bind(this));
	},
	historyListener: function(location, action){
		var match;
		this.log.group("historyListener", location, action);
		if (action === "POP"){
			this.matchAndActivate();
		} else {
			this.log("action:", action, "(do nothing)");
		}
		this.log.end();
	},
	useCurrent: function(){
		this.path = window.location.pathname;
		this.log(this.path);
		this.parts = shared.parts(this.path);
	},
	activate: function(){
		return Promise.resolve();
	},
	getCurrentURLPathParts: function(){
		// var winLocParts = shared.parts(window.location.pathname);
		// var myParts = shared.parts(this.path);
		// var matching = 0;

		// // compare the arrays
		// for (var i = 0; i < winLocParts.length; i++){
		// 	if (winLocParts[i] === myParts[i])
		// 		matching++;
		// }

		// or...
		return shared.parts(window.location.pathname.replace(this.path, ""));
	},
	historyListener: function(location, action){
		var match;
		this.log.group("historyListener", location, action);
		if (action === "POP"){
			this.matchAndActivate();
		} else {
			this.log("action:", action, "(do nothing)");
		}
		this.log.end();
	},
	matchAndActivate: function(){
		this.log.group("matchAndActivate");
		var match = this.match(this.getCurrentURLPathParts());
		if (match){
			match.route.remaining = match.remaining;
			match.route.activate();
		}
		this.log.end();
		return this;
	},
	match: function(pathParts){
		var match;
		for (var i = 0; i < this.routes.length; i++){
			match = this.routes[i].match(pathParts)
			if (match)
				return match;
		}
		return false;
	},
});