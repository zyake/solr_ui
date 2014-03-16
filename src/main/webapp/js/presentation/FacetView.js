FacetView = Object.create(Presentation, {

    fields: { value: {
        facet: { value: null, writable: true },
        loadingImg: { value: null, writable: true }
    }},

    initialize: { value: function(control) {
        Presentation.initialize.call(this, control);
        this.facet = this.query(".facet");
        this.loadingImg = this.query(".loadingImg");
        this.addEventRef(this.id, Id.onAbstraction(this).load());
        this.addEventRef(this.id, Id.onAbstraction(this).failure());
        this.raiseEvent(Id.onPresentation(this).start(), {});
    }},

    notify: { value: function(event, arg) {
        if ( Id.onAbstraction(this).load() == event ) {
            this.enableFacets(arg);
        } else if ( Id.onAbstraction(this).failure() == event ) {
            this.renderFailure(arg);
        }
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
            me.raiseEvent(Id.onPresentation(me).load(), { field: field, facet: facet, enabled: true });
        };

        actionButton.disableAppended = function() {
            this.isAppended = false;
            this.stopButton.style.display = "none";
            this.addButton.style.display = "inline";
            var field = this.attributes["field"].nodeValue;
            var facet = this.attributes["facet"].nodeValue;
            me.raiseEvent(Id.onPresentation(me).load(), { field: field, facet: facet, enabled: false });
        };

        this.on(actionButton, "click", function() {
            if ( actionButton.isAppended ) {
                actionButton.disableAppended();
            } else {
                actionButton.enableAppended();
            }
        });
 	}},
});