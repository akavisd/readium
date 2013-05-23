Readium.Models.Search = Backbone.Model.extend({

	sync: BBFileSystemSync,

	initialize: function(options) {
		this.book = options.book;
		this.book.on("change:search_result_visible", this.setVisibility, this);
		this.book.on("change:toolbar_visible", this.setToolBarVis, this);
		this.book.on("change:toc_visible", this.setTocVis, this);
		this.book.on("change:search_result", this.setSearchresult, this);
	},

	handleLink: function(href) {

	},


	setSearchresult: function(){
		this.set("search_result", this.book.get("search_result"));
	},
	
	setVisibility: function() {
		this.set("visible", this.book.get("search_result_visible"));
		
		if (this.book.get("search_result_visible")){
			this.book.set("toc_visible", false)
		}
	},

	hide: function() {
		this.book.set("search_result_visible", false)
	},

	setToolBarVis: function() {
		if(!this.book.get("toolbar_visible")) {
			this.book.set("search_result_visible", false);
		}
	},

	setTocVis: function() {
		if(this.book.get("toc_visible")) {
			this.book.set("search_result_visible", false);
		}
	},


	defaults: {
		visible: false
	},


	SearchView: function() {
		return new Readium.Views.SearchView({model: this});
	}

});

