
(function(){

	var i8Map = {};
	
	
	window.chrome = window.chrome || {};
	window.chrome.i18n = {};
	window.chrome.i18n.init = function(settings){
	    var defaults = {
	        language:       'en_US',
	        path:           '_locales',  
	        encoding:       'UTF-8',
	        cache:			false,
	        callback:       null
	    };
	    settings = $.extend(defaults, settings);
	
		var fileName = settings.path+"/"+settings.language+"/messages.json";
	
		$.ajax({
	        url:        fileName,
	        async:      false,
	        cache:		settings.cache,
	        contentType:'text/plain;charset='+ settings.encoding,
	        dataType:   'text',
	        success:    function(data, status) {
	        				 i8Map = JSON.parse(data);
						}
	    });
	        
	};


	window.chrome.i18n.getMessage = function(key){
		
		var result =  (i8Map[key])?i8Map[key].message:undefined;
		//console.info("getMessage", key," : ", result);
		return (result)?result:"";
	}

})();