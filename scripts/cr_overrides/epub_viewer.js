// REFACTORING CANDIDATE: Parts of this model are making calls to the current view through the epubController->paginator->view->etc., 
//   that is a lot of indirection. Perhaps epubController shouldn't be at the centre of this model anymore.

Readium.Views.ViewerEpubApplicationView = Readium.Views.ViewerApplicationView.extend({

	initialize: function() {
	
		this.model.on("change:search_result_visible", this.renderSearchResultVisible, this);
		//this.model.on("change:has_search", this.init_list, this);
		
		Readium.Views.ViewerApplicationView.prototype.initialize.call(this);
		
		this.init_list();	
	},
	
	
	render: function() {
		Readium.Views.ViewerApplicationView.prototype.render.call(this);
		this.renderSearchResultVisible();
		return this; 
	},

	renderSearchResultVisible: function() {
		var vis = this.model.get("search_result_visible") || this.model.get("toc_visible");
		
		this.$el.toggleClass("show-readium-toc", vis);
		
		if (vis){ 
			setTimeout(function(){
			$('#readium-readium-search').find('h1, h2').first().attr('tabindex', '-1').focus();}, 500);
		}else{
			//$('#toggle-toc-btn').focus();
		}	
		return this;
	},

	//override
	renderTocVisible: function() {
		var vis = this.model.get("search_result_visible") || this.model.get("toc_visible");

		$('#toggle-toc-btn').attr('aria-pressed', vis ? 'true' : 'false');
		
		this.$el.toggleClass("show-readium-toc", vis);
		
		if (vis){ 
			setTimeout(function(){
			$('#readium-toc').find('h1, h2').first().attr('tabindex', '-1').focus();}, 500);
		}else{
			$('#toggle-toc-btn').focus();
		}	
		return this;
	},


	init_list: function() {
		console.log("---------------------init_list");
		
		var search_item = this.model.getSearch();	
		this.search_view = search_item.SearchView();
		//	toc_item.fetch();
		
		/*
		if( this.model.get("has_toc") ) {
			var toc_item = this.model.getToc();			
			this.toc = toc_item.TocView();
			toc_item.fetch();

		}
		*/
	},	


});
