var View = require("view42");
// var Item = require("Item");
// var Expandable = require("Expandable");

var $ = require("jquery");

var RouterView = module.exports = View.extend({
	name: "RouterView",
	addClass: "router light global-router",
	preview: View.x(function(){
		var routerView = this.parent;
		var router = routerView.parent;
		this.item = View.Item({
			icon: "code-fork",
			label: router.name
		});
	}),
	contents: View.x(function(){
		var routerView = this.parent;
		var router = routerView.parent;

		// console.log("rendering routerview contents", router, router.routes.length);

		for (var i = 0; i < router.routes.length; i++){
			router.routes[i].render();
		}
	}),
	content: function(){
		this.preview.render();
		if (!this.expand)
			this.contents.hide();
		this.contents.render();
	},
	behaviors: function(){
		var expandable = this;
		this.preview.click(function(){
			expandable.contents.slideToggle();
		});
	},
	rendered: function(){
		var view = this;
		$(function(){
			// console.log("add router view to body");
			view.prependTo("body");
		})
	}
})