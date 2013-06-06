window.Readium = {
	Models: {},
	Collections: {},
	Views: {},
	Routers: {},
	Utils: {},
	Init: function() {
		_router = new Readium.Routers.ViewerRouter();
		Backbone.history.start({pushState: true});
	}
};

$(function() {
	Readium.LibraryApi(function(api) {
		api.getLibraryMeta(function(result) {
				window.ReadiumLibraryData = JSON.parse(result);
				window.Readium.Init();
			}, function() {
				console.error("Failed to load library meta");
		})
	});
	
});