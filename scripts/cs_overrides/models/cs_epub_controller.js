
Readium.Models.CSEpubController = Readium.Models.EPUBController.extend({

	// ------------------------------------------------------------------------------------ //
	//  "PUBLIC" METHODS (THE API)                                                          //
	// ------------------------------------------------------------------------------------ //

	initialize: function() {

		var that = this;

		this.epub = this.get("epub");
        
        this.set("media_overlay_controller",  new Readium.Models.MediaOverlayController({epubController : this}));

		this.paginator = new Readium.Models.CSPaginationStrategySelector({book: this});

		this.packageDocument = this.epub.getPackageDocument();

		var file_path = this.packageDocument.file_path;
		
		Readium.TmpFileSystemApi(function(tmpFileApi){
		
			tmpFileApi.fileExists(file_path, function(fileExists){
				console.log(file_path, fileExists);
				that.packageDocument.fetch({
		
					// success callback is executed once the filesSystem contents have 
					// been read and parsed
					success: function() {
						
						var func = function(){
							// restore the position the reader left off at from cookie storage
							var PATTERN_ROOT = /^[^\/\\]+[\/\\]/i;
							
							Readium.TmpFileSystemApi(function(tmpApi){
								var path = that.packageDocument.file_path.match(PATTERN_ROOT)[0] + INDEX_FILE_NAME;
								tmpApi.readTextFile(path, function(data){
									var indexData = JSON.parse(data);
									Readium.SearchApi(function(searchApi){
										searchApi.load(indexData, function(){
											var pos = that.restorePosition();
							                that.get("media_overlay_controller").restoredPosition();
											that.set("spine_position", pos);
							
											// tell the paginator to start rendering spine items from the 
											// freshly restored position
											var items = that.paginator.renderSpineItems(false);
											that.set("rendered_spine_items", items);
											
											// check if a TOC is specified in the `packageDocument`
											that.set("has_toc", ( !!that.packageDocument.getTocItem() ) );
										
										});
									});
								
								});
							});
						}
						
						if (fileExists){
							func();
						}else{
							Readium.FileSystemApi(function(fsApi){
								fsApi.createSearchIndexes(that.packageDocument, func);
							});
						}
					}
				});
			})
		});
		
		this.on("change:spine_position", this.savePosition, this);
		this.on("change:spine_position", this.setMetaSize, this);
	},


	defaults: {
		"font_size": 10,
    	"two_up": false,
    	"full_screen": false,
    	"toolbar_visible": true,
    	"toc_visible": false,
    	"search_result_visible": false,
    	"search_result":[],
    	"rendered_spine_items": [],
    	"current_theme": "default-theme",
    	"current_margin": 3,
    	"epubCFIs" : {}
  	},
	
	setVisibleSearchResult: function(value) {
		this.set("search_result_visible", value);
	},
	
	search: function(searchValue){
		var that = this;
		Readium.SearchApi(function(searchApi){
			searchApi.search(searchValue, function(result){
				console.log("for "+searchValue+" search resut ", result)
				result.sort(
					function(a,b){
						return a.composite_index - b.composite_index;
					}
				);
				that.set("search_result", result);
				that.setVisibleSearchResult(true);	
			});
			
		});
	
	},


	getSearch: function() {
		that = this;
		return new Readium.Models.Search({book: that});
	},

});
