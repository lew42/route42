var View = require("view42");
var RouteView = require("./RouteView");

var RouterView = module.exports = RouteView.extend({
	name: "RouterView",
	addClass: "router",
	header: {
		icon: "code-fork"
	}
});