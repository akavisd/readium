Readium.EpubApi = function(initCallback) {
   
    var api = {
        readTextFile: function(path, readCallback, errorCallback) {

			Readium.TmpFileSystemApi(function(tmpFileApi) {
				tmpFileApi.readTextFile(path, readCallback, 
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

    return function ( callback ) {
        callback(api);
        return api;
    }
}();

Readium.FileSystemApi = Readium.EpubApi;