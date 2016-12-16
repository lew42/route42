var test = require("test42");
var view = require("view42");
var assert = test.assert;


var Route = require("./index");
var Router = Route.Router;

test("initialize router", function(){
	var router = new Router({
		log: true
	});

	assert(router.path === "/");
	assert(router.cbs !== Router.prototype.cbs);

	router.activate();
});