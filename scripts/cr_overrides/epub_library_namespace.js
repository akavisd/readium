// This is the namespace and initialization code that is used by
// by the library view of the chrome extension

window.Readium = {
	Models: {},
	Collections: {},
	Views: {},
	Routers: {},
	Utils: {},
	Init: function() {
/*
			window.options = Readium.Models.ReadiumOptions.getInstance();
			window.optionsView = new Readium.Views.ReadiumOptionsView({model: window.options});
				
			window.Library = new Readium.Collections.LibraryItems(window.ReadiumLibraryData);
			window.lib_view = new Readium.Views.LibraryItemsView({collection: window.Library});
			//window.fp_view = new Readium.Views.FilePickerView();
			window.router = new Readium.Routers.ApplicationRouter({collection: window.Library});

			Backbone.history.start({pushState: false});
			// window.Library.fetch();
			window.Library.trigger('reset');

*/
		window.options = Readium.Models.ReadiumOptions.getInstance();
		window.optionsView = new Readium.Views.ReadiumOptionsView({model: window.options});
		

		window._library =new Readium.Collections.LibraryItems(window.ReadiumLibraryData);
		window._lib_view = new Readium.Views.LibraryItemsView({collection: window._library});
		window._fp_view = new Readium.Views.FilePickerView({collection: window._library});
		window.router = new Readium.Routers.LibraryRouter({picker: window._fp_view});
		Backbone.history.start({pushState: false, root: "views/library.html"});

		window._library.trigger('reset');

		// load the library data from localstorage and 
		// use it trigger a reset event on the library
		/*
		_lawnchair = new Lawnchair(function() {
			this.all(function(all) {

				// Exclude entries in the store that are for epubView properties. These should not be 
				// rendered in the list of epubs in the library
				var ePUBList = _.reject(all, function(element) { 
					return element.key.split("_")[1] === "epubViewProperties";
				});
				window._library.reset(ePUBList);							
			});
		});
*/
		// TODO: this is not how we should do this, we should use a proper backbone view.

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