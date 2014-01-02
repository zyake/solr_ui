 /**
  * Facetの表示、管理を行うビュー。
  */
 var FacetView = Backbone.View.extend({

 	initialize: function(args) {
		this.facet = args.facet;
		this.loadingImg = args.loadingImg;
		this.facetContentModel = args.model;
        this.streamContentModel = args.streamModel;
        var me = this;
        this.listenTo(this.facetContentModel, "retrieve.success", function(xhr) { me.enableFacets(xhr) });
        this.facetContentModel.retrieveContent();
 	},

 	enableFacets: function(xhr) {
        this.loadingImg.style.display = "none";
 	    this.facet.innerHTML = xhr.responseText;

 	    var me = this;
        var actionButtons = this.facet.querySelectorAll(".actionButton");
        for( key = 0 ; key < actionButtons.length ; key ++ ) {
            var actionButton = actionButtons[key];
            actionButton.isAppended = false;
            actionButton.addButton = actionButton.querySelector(".addImg");
            actionButton.stopButton = actionButton.querySelector(".stopImg");
            actionButtons[key].addEventListener("click", function() {
                if ( this.isAppended ) {
                    this.isAppended = false;
                    this.stopButton.style.display = "none";
                    this.addButton.style.display = "inline"
                   delete me.streamContentModel.getFQueries()[this.attributes["field"].nodeValue];
                } else {
                    this.isAppended = true;
                    this.stopButton.style.display = "inline";
                    this.addButton.style.display = "none"
                    me.streamContentModel.getFQueries()[this.attributes["field"].nodeValue] = this.attributes["facet"].nodeValue;
                }
            });
        }
 	}
});