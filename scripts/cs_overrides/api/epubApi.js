Readium.EpubApi = function(initCallback) {

   	var PATTERN_WORD = /[^,?.!;:"'()\[\] \f\n\r\t\v]+/gi
	var PATTERN_IMG = /\<img[^>]+\/\>/ig;
	var PATTERN_ROOT = /^[^\/\\]+[\/\\]/i;
	var CITATE_LENGTH = 50;
	
	
	var getTextNodesIn = function(el) {
		var fnd = el.find(":not(iframe)");
		if (fnd.length >0){
		    return fnd.contents().filter(function() {
		        return this.nodeType == 3 && this.nodeValue.trim();
		    });
		}else{
			return [];
		}
	};


	function getCitate(value, anchorIindex){
		var start = anchorIindex - CITATE_LENGTH/2;
		start = (start < 0)?0:start;
		
		
		return ((start > 0)?"...":"")+value.substr(start, CITATE_LENGTH)+((start+CITATE_LENGTH < value.length)?"...":"");
	}

	var createSearchIndexByItemIndex = function(index, finalCallback, api, storeIndexData, packageDoc){
		
		var self = this;
		//var packageDoc = window._epub.packageDocument;
		var length = packageDoc.spineLength();
		var callBack;
		if ((index+1) >= length){
			callBack = function(){
				finalCallback(storeIndexData);
			};
		}else{
			callBack = function(){
				createSearchIndexByItemIndex(index+1, finalCallback, api, storeIndexData, packageDoc);
			}
		}

		var spineItem  = packageDoc.getSpineItem(index);
		var href = spineItem.get('href');
		var uri = new URI(href);
		var pckgUri = new URI(packageDoc.file_path);
		
		var pth = uri.resolve(pckgUri).toString();
		console.log("index", index, pth);
		
		api.readTextFile(pth, function(data){
			data = data.replace(PATTERN_IMG, "<img src='' />");
			var doc = $(data);
			var nodes = getTextNodesIn(doc);
			var itemObj;
			var arr;
			
			var path ;
			
			var ndsArr = [];
			
			for (var i = 0; i < nodes.length; i++){
				path = xPathUtil.getXPathByNode(nodes[i]);
				ndsArr.push({item:nodes[i], pathObj:path});
			}
			
			for (var i = 0; i < ndsArr.length; i++){
				itemObj = ndsArr[i];
				var item = itemObj.item;
				var itemIndex = 0;
			
				while ((arr = PATTERN_WORD.exec(item.nodeValue)) != null){
					//console.log(arr[0]);
					var citate = getCitate(item.nodeValue, arr.index);
					storeIndexData.push({
						url:				pth,
					    xpath:				itemObj.pathObj.xPath,
					    start_offset:		arr.index,
					    end_offset:			arr.index + arr[0].length,
					    text:				arr[0],
					    composite_index: 	index*10000000 + i*1000+itemIndex,
					    citate: 			citate
					    
					});	
					
					itemIndex ++;	
				}
			}
			callBack();
		});
	}
   
   
    var api = {
    	
    	createSearchIndexes : function(packageDoc, callback){
    		var storeIndexData = [];
    		var path = packageDoc.file_path.match(PATTERN_ROOT)[0] + INDEX_FILE_NAME;

			createSearchIndexByItemIndex(0, function(data){
				var strData = JSON.stringify(data);
				Readium.TmpFileSystemApi(function(tmpFileApi) {
					
					tmpFileApi.writeFile(path, strData, function(){
						console.log("Indexes were saved", path);
						callback();
					})
				});
			}, this, storeIndexData, packageDoc);
		},
    
    
        readTextFile: function(path, readCallback, errorCallback) {
			var self = this;
			Readium.TmpFileSystemApi(function(tmpFileApi) {
				tmpFileApi.readTextFile(path, 
					function(fileData){
						readCallback(fileData);
					}, 
				function(e) {
					console.log("File not exists");
					switch (e.code) {
						case FileError.NOT_FOUND_ERR:
							Readium.LibraryApi(function(libraryApi) {
								var key = path.split("/")[0];
								libraryApi.getEPUB(key, 
									function(){
										console.log("LibraryApi get epub complete");
										tmpFileApi.getFsUri(path, function(uri) {
											console.log("============== TRY TO STOP HERE!!!================");
											window._epub.packageDocument.uri_obj = new URI(uri);
											tmpFileApi.readTextFile(path, readCallback, errorCallback);
										})
									}
								, errorCallback);
							})
				    	break;
				    	default:
							console.log('FileSystemError Error: ', e);
			      		break;
					};//switch
				});
			});

        },


        getFsUri: function(path, successCallback, errorCallback) {
			Readium.TmpFileSystemApi(function(api) {
				api.getFsUri(path, successCallback,	errorCallback);
			});
        },

        rmdir: function(bookKey) {
			var path = "/"+bookKey;
			Readium.TmpFileSystemApi(function(api) {
				api.rmdir(path);
			});
			
			Readium.LibraryApi(function(libraryApi) {
				libraryApi.remove(bookKey);
			});
        },

        
    }
    
    return function (callback) {
        callback(api);
        return api;
    }
}();

Readium.FileSystemApi = Readium.EpubApi;