// This is the router used by the web served version of readium
// This router is used in the book view of the chrome extension build of readium
Readium.Routers.ViewerRouter = Backbone.Router.extend({

	routes: {
		"classroom/views/viewer.html?book=:key": "openBook",
		"*splat": "splat_handler"
	},

	openBook: function(key) {

		// look up the book by its key in the global array or library data
		var book_data = _.find(window.ReadiumLibraryData, function(obj) {
			return obj.key === key;
		});

		if(book_data) {
//			book_data.root_url = "bla-bla-bla";
					// initialze the viewer for that book
			window._epub = new Readium.Models.EPUB(book_data);
			window._epubController = new Readium.Models.CRController(_.extend({epub : window._epub}, book_data));
			window._applicationView = new Readium.Views.ViewerEpubApplicationView({
				model: window._epubController
			});
			window._applicationView.render();
		}
		else {
			// did not find the book in our library
			alert("The book you requested does not exist");
		}

	},

	splat_handler: function(splat) {
		console.log(splat)
	}

});