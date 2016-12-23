var View = require("view42");
require("./Route3.less");

var FlexValue = View.extend({
	addClass: "flex-value",
	left: View.x(),
	right: View.x(),
	content: function(){
		this.left.render();
		this.right.render();
	}
});

var log = function(name, value){
	return FlexValue({
		left: name,
		right: value
	});
}

var RouteView = module.exports = View.extend({
	name: "RouteView",
	addClass: "route",
	header: View.Item.x({
		content: function(){
			var route = this.parent.parent;

			this.set({
				icon: "circle",
				label: route.part
			})

			this.icon.render();
			this.label.render();

			this.click(function(){
				route.activate();
			});
		}
	}),
	body: View.x(function(){
		var route = this.parent.parent;
		var routeView = this.parent;

		// this._id = log("id", route.id);
		// this.path = log("path", route.path);
		// this.relPath = log("relPath", route.relPath);

		View(function(){
			this.addClass("child-routes");
			route.each(function(child){
				child.render();
			})
		})

		this.css("padding-left", "10px")
	}),
	content: function(){
		this.header.render();
		this.body.render();
	},
	sync: function(){
		var route = this.parent;

		if (route.active){
			this.addClass("active");
		} else {
			this.removeClass("active");
		}

		if (route.isActiveRoute){
			this.addClass("isActiveRoute");
		} else {
			this.removeClass("isActiveRoute");
		}
	}
});