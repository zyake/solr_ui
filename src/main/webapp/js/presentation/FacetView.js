FacetView = Object.create(Presentation, {

    fields: { value: {
        facet: { value: null, writable: true },
        loadingImg: { value: null, writable: true }
    }},

    doInitialize: { value: function() {
        this.doQueries({ facet: ".facet", loadingImg: ".loadingImg" });
        this.event()
            .ref().onAbstraction().load(this.enableFacets)
            .ref().onAbstraction().failure(this.renderFailure)
            .raise().start({});
    }},

    enableFacets: { value: function(successResult) {
        this.loadingImg.style.display = "none";
        this.facet.innerHTML = successResult;

        var me = this;
        var actionButtons = this.facet.querySelectorAll(".actionButton");
        for( key = 0 ; key < actionButtons.length ; key ++ ) {
            var actionButton = actionButtons[key];
            this.constructActionButton(actionButton);
        }
    }},

 	constructActionButton: { value: function(actionButton) {
 	    var me = this;
        actionButton.isAppended = false;
        actionButton.addButton = actionButton.querySelector(".addImg");
        actionButton.stopButton = actionButton.querySelector(".stopImg");
        actionButton.enableAppended = function() {
            this.isAppended = true;
            this.stopButton.style.display = "inline";
            this.addButton.style.display = "none"

            var field = this.attributes["field"].nodeValue;
            var facet = this.attributes["facet"].nodeValue;
            me.event().raise().change({ field: field, facet: facet, enabled: true });
        };

        actionButton.disableAppended = function() {
            this.isAppended = false;
            this.stopButton.style.display = "none";
            this.addButton.style.display = "inline";
            var field = this.attributes["field"].nodeValue;
            var facet = this.attributes["facet"].nodeValue;
            me.event().raise().change({ field: field, facet: facet, enabled: false });
        };

        actionButton.onclick = function() {
            if ( actionButton.isAppended ) {
                actionButton.disableAppended();
            } else {
                actionButton.enableAppended();
            }
        };
 	}},
});