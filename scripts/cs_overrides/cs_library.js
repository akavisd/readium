
Readium.Models.CSLibraryItem = Readium.Models.LibraryItem.extend({

	getViewBookUrl: function(book) {
		return "./cs_views/viewer.html?book=" + this.get('key');
	},

	destroy: function() {
		var key = this.get('key');
		Lawnchair(function() {
			var that = this; // <=== capture Lawnchair scope

			Readium.FileSystemApi(function(fs) {
				fs.rmdir(key);
				that.remove(key);
			});

	
			propertiesKey = key + "_epubViewProperties";
			this.get(propertiesKey, function(epubViewProperties) {
				if(epubViewProperties) {
					Readium.FileSystemApi(function(fs) {
						fs.rmdir(epubViewProperties.key);
						that.remove(propertiesKey);
					});
				}
			});
		});
		
	}
});


Readium.Collections.CSLibraryItems = Readium.Collections.LibraryItems.extend({
	model: Readium.Models.CSLibraryItem
});

Readium.Views.CSLibraryItemView = Readium.Views.LibraryItemView.extend({

	events: {
		"click .delete": function(e) {
			e.preventDefault();
			var confMessage;
			var selector = "#details-modal-" + this.model.get('key');
			confMessage  = chrome.i18n.getMessage("i18n_are_you_sure");
			confMessage += "'";			
			confMessage += this.model.get('title');
			confMessage += "'";	
			confMessage += "?";


			if(confirm(confMessage)) {
				$(selector).modal('hide');
				this.model.destroy();
				this.remove();
			}
		},

		"click .read": function(e) {
			e.preventDefault();
			this.model.openInReader();
		}
		
	}
});

Readium.Views.CSLibraryItemsView = Readium.Views.LibraryItemsView.extend({
	
	render: function() {
		var collection = this.collection;
		var content = this.template({});
		var $el = this.$el;
		$el.html(content);
		
		this.$('#empty-message').toggle(collection.isEmpty());

		collection.each(function(item) {
			var view = new Readium.Views.CSLibraryItemView({
				model: item,
				collection: collection,
				id: item.get('id')
			});
			$el.append( view.render().el );

		});
		this.restoreViewType();
		// i dunno if this should go here
		$('#library-books-list').html(this.el);
		return this;
	},


	addOne: function(book) {
		var view = new Readium.Views.CSLibraryItemView({
			model: book,
			collection: this.collection,
			id: book.get('id')
		});
		// we are adding so this should always be hidden!
		this.$('#empty-message').toggle(false);
		$(this.el).append( view.render().el );
	},
	
});

Readium.Views.CSExtractItemView = Readium.Views.ExtractItemView.extend({});


Readium.Views.CSReadiumOptionsView = Readium.Views.ReadiumOptionsView.extend({
	
		save: function(e) {
			e.preventDefault();
			this.model.save();
			this.$el.modal("hide");
			
		}

});

Readium.Views.CSFilePickerView = Readium.Views.FilePickerView.extend({

	handleFileSelect: function(evt) {
		var self  = this;
		var files = evt.target.files; // FileList object
		Readium.LibraryApi(function(api){
			api.uploadFile(files[0], 
			function(){
				self.hide();
				location.reload();
			},
			function(){
			
			}
			)
		})
	},
	
	
	beginExtraction: function(extractor) {
		var that = this;
		var timer = new Timer();
		timer.start();
		window._extract_view = new Readium.Views.ExtractItemView({model: extractor});
		extractor.on("extraction_success", function() {
			var book = extractor.packageDoc.toJSON();
			timer.stop();
			timer.report();
			that.collection.add(new Readium.Models.LibraryItem(book));
			that.resetForm();
			setTimeout(function() {
				chrome.tabs.create({url: "./cs_views/viewer.html?book=" + book.key });
			}, 800);
		});
		extractor.on("change:failure", this.resetForm, this);
		
		extractor.extract();
		this.hide();
	}


});
