// This is the namespace and initialization code that is used by
// by the library view of the chrome extension

window.Readium = {
	Models: {},
	Collections: {},
	Views: {},
	Routers: {},
	Utils: {},
	Init: function() {

		window.options = Readium.Models.ReadiumOptions.getInstance();
		window.optionsView = new Readium.Views.ReadiumOptionsView({model: window.options});

		window._library =new Readium.Collections.LibraryItems(window.ReadiumLibraryData);
		window._lib_view = new Readium.Views.LibraryItemsView({collection: window._library});
		window._fp_view = new Readium.Views.FilePickerView({collection: window._library});
		window.router = new Readium.Routers.LibraryRouter({picker: window._fp_view});
		Backbone.history.start({pushState: false, root: "views/library.html"});

		window._library.trigger('reset');

		var hc = $('#library-items-container').hasClass("row-view");
		$("#block-view-btn").attr('aria-pressed', hc ? 'false' : 'true');
		$("#row-view-btn").attr('aria-pressed', hc ? 'true' : 'false');

		document.body.addEventListener('drop', function(e) {
		    e.stopPropagation();
		    e.preventDefault();
		    // todo stop this!
		    window._fp_view.handleFileSelect({target: e.dataTransfer});
		  }, false);

		$("#block-view-btn").click(function(e) {
			$("#block-view-btn").attr('aria-pressed', 'true');
			$("#row-view-btn").attr('aria-pressed', 'false');
			$('#library-items-container').addClass("block-view").removeClass("row-view");
			Readium.Utils.setCookie("lib_view", "block", 1000);
		});

		$("#row-view-btn").click(function(e) {
			$("#block-view-btn").attr('aria-pressed', 'false');
			$("#row-view-btn").attr('aria-pressed', 'true');
			$('#library-items-container').addClass("row-view").removeClass("block-view");
			Readium.Utils.setCookie("lib_view", "row", 1000);
		});
	}
};

$(function() {
	window.chrome.i18n.init();

	Readium.LibraryApi(function(api) {
		api.getLibraryMeta(function(result) {
				window.ReadiumLibraryData = JSON.parse(result);
				window.Readium.Init();
			}, function() {
				console.error("Failed to load library meta");
		})
	});
});