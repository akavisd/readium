Readium.SearchApi = function(initCallback) {

	var parser_for_all = new fullproof.StandardAnalyzer([fullproof.normalizer.to_lowercase_nomark]);
	parser_for_all.sendFalseWhenComplete = false;
   
   
	var under_test = 
		    {
				label: "memory store",
	       	    store: new fullproof.store.MemoryStore(),
	       	    parameters: new fullproof.Capabilities(),
	       	    indexName: "mainIdx",
		       	parser: parser_for_all,
		       	
			};

	under_test.id = "epubSingleStore";
	var ireq = new fullproof.IndexRequest(under_test.indexName, under_test.parameters);
	under_test.store.open(under_test.parameters, [ireq], function() {
		 under_test.index = under_test.store.getIndex(under_test.indexName);
	});
   


	var api = {

		search: function(word, callback) {
			under_test.index.lookup(word, function(data) {
				callback(data.data);
			});
		},
	   
		
		load: function(storeData, callback) {
			under_test.index.clear(function() {
				var dataItem;
				for (var i = 0; i < storeData.length; i++) {
					dataItem =  storeData[i]
					under_test.parser.parse(dataItem.text, function(word) {
						//ilog += ("storing word " + word +" => " + l + "\n");
//						console.log("storing word " + word +" => ", d1, d2, d3);
						under_test.index.inject(word, dataItem); // the line number is the value stored
//						under_test.index.inject(word, i); // the line number is the value stored
					});
					//under_test.index.inject(dataItem.text, dataItem); 
				}
				console.log("SearchApi data loaded", storeData.length);
				callback();
			});
		}
	}

 	return function ( callback ) {
        callback(api);
        return api;
    }
}()