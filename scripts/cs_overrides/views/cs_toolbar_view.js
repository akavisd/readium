Readium.Views.CSToolbarView = Readium.Views.ToolbarView.extend({

	events: {
		"click #hide-toolbar-button": "hide_toolbar",
		"click #show-toolbar-button": "show_toolbar",
		"click #fs-toggle-btn": "toggle_fs",
		"click #toggle-toc-btn": "toggle_toc",
		"click #nightmode-btn": "toggle_night_mode",
		"click #play-mo-btn": "play_mo",
        "change #mo-volume-slider": "set_mo_volume",
        "click #mo-volume-btn": "mute_mo",
        "click #mo-volume-muted-btn": "mute_mo",
        "change #mo-rate-slider": "set_mo_rate",
        "click #mo-rate-btn": "reset_mo_rate",
   		"click #search-button": "search"
	},

	search: function(e) {
		e.preventDefault();
		var searchText = $("#search-text")[0];
		this.model.search(searchText.value.trim().toLowerCase());
	}
   
});
