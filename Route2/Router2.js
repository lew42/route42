var Route = require("./Route2");
var is = require("util42").is;

var view = require("view42");

var History = require("history").createBrowserHistory;

var shared = require("../shared");

var Router = module.exports = Route.extend({
	name: "Router2",
	path: "/",
	orphan: true, // avoids adoption
	init: function(){
		this.history = History();
		this.history.listen(this.listener.bind(this));
	},
	listener: function(){
		this.activate();
	},
	reactivate: function(){
		this.activateChildren();
	}
});