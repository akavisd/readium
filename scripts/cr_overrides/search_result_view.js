Readium.Views.SearchView = Backbone.View.extend({

	el: "#readium-search",

	initialize: function() {
		//this.model.on("change", this.render, this);
		this.model.on("change:visible", this.setVisibility, this);
		this.model.on("change:search_result", this.render, this);
	},

	events: {
		"click a": "handleClick",
		"click #close-search-result-button": "close",
	},

	setVisibility: function() {
		this.$el.toggle(this.model.get("visible"));
	},

	handleClick: function(e) {
		e.preventDefault();
		href = $(e.currentTarget).attr("href");
		this.model.handleLink(href);
	},

	close: function(e) {
		e.preventDefault();
		this.model.hide();
	},
	
	render: function() {
		var searchResult = this.model.get("search_result");
		console.log("populateList", searchResult);



		ol = this.addNavPointElements(this.model.get("search_result"));

		this.$('#search-result-body').html("<h2 tabindex='-1'>" + (this.model.get("title") || "Result") + "</h2>")
		this.$('#search-result-body').append(ol);
		this.$('#search-result-body').append("<div id='search-result-end-spacer' class='left-panel-end-spacer'>");
		return this;

		return this;
	},
	
	
	addNavPointElements: function (searchResult) {
		var ol = $("<ol></ol>");
		var that = this;
		$.each(searchResult, function (navIndex) {
			var cit = searchResult[navIndex].citate.replace(searchResult[navIndex].text, "<b>"+searchResult[navIndex].text+"</b>");
			var li = $('<li class="nav-elem"></li>');
			var link =  $('<a href="#" id="search_lnk'+navIndex+'"><b>'+(navIndex+1)+"</b>&nbsp;&nbsp;"+cit+'</a>');
			link.attr('index', navIndex);
			li.append(link);
			ol.append(li);

			link.click(function(e) {
				e.preventDefault();
				var index = $(e.currentTarget).attr('index');
				var searchItem = searchResult[index];
				console.log("click ", searchItem);
				
				if (!searchItem){
					return;
				}

				Readium.FileSystemApi(function(api) {
					api.getFsUri(searchItem.url, function(uri) {
						console.log(uri);
						that.model.book.set("search_item", searchItem);
						that.model.book.goToHref(uri);
					})
				});
			});
		});

		return ol; 
	}
});
