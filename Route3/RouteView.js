var View = require("view42");
require("./Route3.less");

var Promise = require("bluebird");

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
		icon: "circle",
		btn: "bolt",
		content: function(){
			var routeView = this.parent;
			var route = routeView.parent;

			this.set({
				label: route.part || route.path
			});

			this.btn.click(function(){
				
				if (route.router.toggle){
					Promise.resolve().then(function(){
						return route.router.view.body.slideUp().$el.promise();
					}).then(function(){
						return route.activate();
					});
				} else {
					route.activate();
				}
			});

			this.label.click(function(){
				if (route.router.toggle)
					routeView.body.slideToggle();
			});

			this.icon.render();
			this.label.render();
			this.btn.render();
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
		if (!this.parent.router.expand)
			this.body.hide();
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