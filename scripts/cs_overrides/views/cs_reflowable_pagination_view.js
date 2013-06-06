
Readium.Views.CSReflowablePaginationView = Readium.Views.ReflowablePaginationView.extend({

	// ------------------------------------------------------------------------------------ //
	//  "PUBLIC" METHODS (THE API)                                                          //
	// ------------------------------------------------------------------------------------ //

	render: function(goToLastPage, hashFragmentId) {
		var that = this;
		var json = this.model.getCurrentSection().toJSON();

		// make everything invisible to prevent flicker
		this.setUpMode();
		this.$('#container').html( this.page_template(json) );
		
		this.$('#readium-flowing-content').on("load", function(e) {
			// Important: Firefox doesn't recognize e.srcElement, so this needs to be checked for whenever it's required.
			if (!e.srcElement) e.srcElement = this;

			console.log("ePUB body:", $("#readium-flowing-content").contents()[0].body);


			var lastPageElementId = that.injectCFIElements();
			that.adjustIframeColumns();
			that.iframeLoadCallback(e);
			that.setFontSize();
			that.injectTheme();
			that.setNumPages();
			that.applyKeydownHandler();

			var searchItem = that.model.get("search_item");
			console.log("searchItem", searchItem);
			
			if (searchItem){
				that.goToSearchFragment();
			}else if (hashFragmentId) {
				that.goToHashFragment(hashFragmentId);
			}
			else if (lastPageElementId) {
				that.goToHashFragment(lastPageElementId);
			}
			else {

				if (goToLastPage) {

					that.pages.goToLastPage();
				}
				else {

					that.pages.goToPage(1);
				}		
			}
            
            
		});
        
		return [this.model.get("spine_position")];
	},

    
 	goToSearchFragment: function() {
		var that = this;
		var searchItem = that.model.get("search_item");
	
		if (!searchItem){
			return;
		}
		
		var body = $("#readium-flowing-content").contents()[0].body;
		var doc = $("#readium-flowing-content").contents()[0];
		
		var el = xPathUtil.getNodeByXPath(doc)(searchItem.xpath, body);
		this.model.set("search_element", el);
		
		
		if(!el) {
        	return;
		}
		
		var prnt = el.parentNode;
		var doc = el.ownerDocument;
		var prevVal = el.nodeValue;
		
		var txtNode1 = doc.createTextNode(prevVal.substring(0, searchItem.start_offset)); 
		var txtNode2 = doc.createTextNode(prevVal.substring(searchItem.start_offset)); 

		var span = doc.createElement('span');
		var anchor = doc.createElement('span');
		
		anchor.id = "ANCHOR_NODE";
		anchor.innerHTML = "X";
		
		span.appendChild(txtNode1);
		span.appendChild(anchor);
		span.appendChild(txtNode2);
				
		prnt.replaceChild(span, el);
		
		var page = this.getElemPageNumber(anchor);
		
		prnt.replaceChild(el, span);
	
//		console.log("page No",page);
		if (page > 0) {
			if (this.pages.get("current_page")[0] !== page){
	        	this.pages.goToPage(page);	
			}else{
				this.showSearchFragment()
			}
		}
 },
 
 
	showSearchFragment:function(){
			var that = this;
	
	       	var searchItem = that.model.get("search_item");
		
			var doc = $("#readium-flowing-content").contents()[0];
			var el = this.model.get("search_element");
		
			var baseLeftOffsetLeft = -1*parseInt(doc.documentElement.offsetLeft);
			var baseLeftOffsetTop = -1*parseInt(doc.documentElement.offsetTop);
			
			if (!searchItem){
				return;
			}
		 	
		 	var d = doc.createRange(); 
		 	d.setStart(el, searchItem.start_offset);
		 	d.setEnd(el, searchItem.end_offset)

			var rangeClientRec = d.getClientRects()[0];

			d.detach();

			var b = doc.createElement("div"); 
			
			b.style.position = "absolute";
			b.style.opacity = 0.5;
			b.style.backgroundColor = "rgb(10, 206, 200)";
			
			b.style.left = (rangeClientRec.left + baseLeftOffsetLeft) + "px"; 
			b.style.top = (rangeClientRec.top + baseLeftOffsetTop) + "px";
			b.style.width = rangeClientRec.width + "px";
			b.style.height = rangeClientRec.height + "px";
			el.parentNode.appendChild(b);
 	 		
			that.model.set("search_item", undefined);
			that.model.set("highlight_div", b);
	},






	// ------------------------------------------------------------------------------------ //
	//  "PRIVATE" HELPERS                                                                   //
	// ------------------------------------------------------------------------------------ //

	// Description: Sometimes these views hang around in memory before
	//   the GC's get them. we need to remove all of the handlers
	//   that were registered on the model

	
	// Save position in epub
	savePosition : function () {

		var $visibleTextNode;
		var existingCFI;
		var lastPageMarkerExists = false;
		var characterOffset;
		var contentDocumentIdref;
		var packageDocument;
		var generatedCFI;

		// Get first visible element with a text node 
		$visibleTextNode = this.findVisibleTextNode();

		// Check if a last page marker already exists on this page
		try {
			$.each($visibleTextNode.parent().contents(), function () {

				if ($(this).hasClass("last-page")) {
					lastPageMarkerExists = true;
					existingCFI = $(this).attr("data-last-page-cfi");

					// Break out of loop
					return false;
				}
			});
		}
		catch (e) {

			console.log("Could not generate CFI for non-text node as first visible element on page");

			// No need to execute the rest of the save position method if the first visible element is not a text node
			return;
		}

		// Re-add the CFI for the marker on this page and shortcut the method
		// REFACTORING CANDIDATE: This shortcut makes this method confusing, it needs to be refactored for simplicity
		if (lastPageMarkerExists) {

			this.model.addLastPageCFI(existingCFI, this.model.get("spine_position"));
			this.model.save();
			return; 
		}

		characterOffset = this.findVisibleCharacterOffset($visibleTextNode);

		// Get the content document idref
		contentDocumentIdref = this.model.getCurrentSection().get("idref");

		// Get the package document
		// REFACTORING CANDIDATE: This is a temporary approach for retrieving a document representation of the 
		//   package document. Probably best that the package model be able to return this representation of itself.
        $.ajax({

            type: "GET",
//            url: this.model.epub.get("root_url"),
            url: this.model.epub.packageDocument.uri_obj.toString(),
            dataType: "xml",
            async: false,
            success: function (response) {

                packageDocument = response;
            }
        });

		// Save the position marker
		generatedCFI = EPUBcfi.Generator.generateCharacterOffsetCFI(
			$visibleTextNode[0], 
			characterOffset, 
			contentDocumentIdref, 
			packageDocument, 
			["cfi-marker", "audiError"], 
			[], 
			["MathJax_Message"]);

		this.model.addLastPageCFI(
			generatedCFI, 
			this.model.get("spine_position"));

		// Save the last page marker been added
		this.model.save();
	},


	pageChangeHandler: function() {
        var that = this;
		this.hideContent();
		setTimeout(function() {
 
			var $reflowableIframe = that.$("#readium-flowing-content");
            if (that.model.get("two_up")) {
				// If the first page is offset, adjust the window to only show one page
				var firstPageIsOffset = that.model.getCurrentSection().firstPageOffset();
				var firstPageOffsetValue;

				// Rationale: A current page of [0, 1] indicates that the current display is synthetic, and that 
				//   only the first page should be showing in that display
				var onFirstPage = 
					that.pages.get("current_page")[0] === 0 &&
				    that.pages.get("current_page")[1] === 1 
				    ? true : false;

				if (firstPageIsOffset && onFirstPage) {

					if (that.model.epub.get("page_prog_dir") === "rtl") {

						firstPageOffset = -(2 * (that.page_width + that.gap_width));
						$reflowableIframe.css("margin-left", firstPageOffset + "px");
					}
					// Left-to-right pagination
					else {

						firstPageOffset = that.page_width + (that.gap_width * 2);
						$reflowableIframe.css("margin-left", firstPageOffset + "px");
					}
                    that.goToPage(1);
				}
				else {

					$reflowableIframe.css("margin-left", "0px");
                    that.goToPage(that.pages.get("current_page")[0]);
				}
			}
			else {

				$reflowableIframe.css("margin-left", "0px");
                that.goToPage(that.pages.get("current_page")[0]);
			}
            that.savePosition();
            //added
            that.showSearchFragment();
		}, 150);
	}
});