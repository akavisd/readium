// REFACTORING CANDIDATE: Parts of this model are making calls to the current view through the epubController->paginator->view->etc., 
//   that is a lot of indirection. Perhaps epubController shouldn't be at the centre of this model anymore.

Readium.Views.CSViewerApplicationView = Readium.Views.ViewerApplicationView.extend({


	
	
	
	initialize: function() {
	
		this.model.on("change:search_result_visible", this.renderSearchResultVisible, this);
		
		//Readium.Views.ViewerApplicationView.prototype.initialize.call(this);

		
		
		
		this.model.on("change:full_screen", this.toggleFullscreen, this);

		this.model.on("change:current_theme", this.renderTheme, this);
		this.model.on("change:toolbar_visible", this.renderPageButtons, this);
		this.model.on("change:toc_visible", this.renderTocVisible, this);

		this.optionsPresenter = new Readium.Models.OptionsPresenter({
			book: this.model
		});
		this.optionsView = new Readium.Views.OptionsView({model: this.optionsPresenter});
		this.optionsView.render();

		// the top bar
		this.toolbar = new Readium.Views.CSToolbarView({model: _epubController});
		this.toolbar.render();

		// the table of contents
		this.model.on("change:has_toc", this.init_toc, this);

		this.addGlobalEventHandlers();

		$('#bar-logo').attr('aria-pressed', 'false');
		$('#readium-info').on('shown', function(){
		$('#version-info').focus();
		setTimeout(function(){
		$('#bar-logo').attr('aria-pressed', 'true');
		}, 1);
		})
		.on('hidden', function(){
		setTimeout(function(){
		$('#bar-logo').attr('aria-pressed', 'false').focus();
		}, 1);
		});
		
		Acc.title = this.model.get('title') + ', by ' + this.model.get('author');
		
		
		
		//-------------------
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
