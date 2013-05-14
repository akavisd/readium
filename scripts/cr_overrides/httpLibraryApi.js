Readium.HTTPLibraryApi = function(initCallback) {
    
    var api = {
        
        beginExtraction: function(extractor, readCallback) {
			var that = this;
//			var timer = new Timer();
//			timer.start();
			window._extract_view = new Readium.Views.ExtractItemView({model: extractor});
			extractor.on("extraction_success", function() {
				var book = extractor.packageDoc.toJSON();
//				timer.stop();
//				timer.report();
/*
				that.collection.add(new Readium.Models.LibraryItem(book));
				that.resetForm();
*/
				setTimeout(function() {
//					chrome.tabs.create({url: "./views/viewer.html?book=" + book.key });
					readCallback();
				}, 800);

			});
//			extractor.on("change:failure", this.resetForm, this);
			
			extractor.extract();
//			this.hide();
		},
        
        
        getTextFile_: function(path, readCallback, errorCallback) {
            $.ajax({
                'url' : path,
                'dataType' : 'text',
                'type' : "GET",
                'success' : function(data, textStatus, jqXHR) {
                    readCallback(data, jqXHR)
                },
                'error' : function(data, textStatus, jqXHR) {
                    errorCallback(data, textStatus, jqXHR)
                }
            })
        },
        
        
        uploadFile : function(file, successCallback, errorCallback) {
			var url = REMOTE_SERVICE_URL+"/upload";
			var self = this;
			var formData = new FormData();
			formData.append('file', file);
			var xhr = new XMLHttpRequest();
			xhr.open('POST', url, true);
			xhr.onload = function(e) {
				if (this.status == 200) {
					console.log("uploaded");
					successCallback();
				}
			};
			xhr.send(formData);
        },

        
        getCoverHref:function(itemData){
        	if (itemData.cover_href){
        		return REMOTE_SERVICE_URL+"/epub-cover/"+itemData.key;
        	}else{
        		return EMPTY_COVER_HREF;
        	}
        },
        
        
        getEPUB: function(epub_key, readCallback, errorCallback) {
        	var url = REMOTE_SERVICE_URL+"/epub-file/"+epub_key;
			var self = this;
			var xhr = new XMLHttpRequest();
			xhr.open('GET', url, true);
			xhr.responseType = 'blob';
			xhr.onload = function(e) {
				if (this.status == 200) {
			    	var blob = this.response;
					var extractor = new Readium.Models.HTTPZipExtractor({file: blob, key: epub_key});
					self.beginExtraction(extractor, readCallback);
				}
			};
			
			xhr.send();
        },
        
		getLibraryMeta: function(successCallback, errorCallback) {
			var url = REMOTE_SERVICE_URL+"/metadata";
			return this.getTextFile_(url, successCallback, errorCallback);
		},
		
		remove: function(key, successCallback, errorCallback) {
			var url = REMOTE_SERVICE_URL+"/remove/"+key;
			
			$.ajax({
                'url' : url,
                'dataType' : 'text',
                'type' : "GET",
                'success' : function(data, textStatus, jqXHR) {
                    if (successCallback){
                    	successCallback(data);
                    }
                },
                'error' : function(data, textStatus, jqXHR) {
                    if (errorCallback){
                    	errorCallback(data, textStatus, jqXHR);
                    }
                }
            })
		},

		
		

    }//api

    return function ( callback ) {
        callback(api);
        return api;
    }
}();


Readium.LibraryApi = Readium.HTTPLibraryApi;