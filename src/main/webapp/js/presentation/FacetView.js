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
        var buttons = this.facet.querySelectorAll(".actionButton");
        for( key = 0 ; key < buttons.length ; key ++ ) {
            var button = buttons[key];
            this.constructButton(button);
        }
    }},

    constructButton: { value: function(button) {
        var me = this;
        button.isAppended = false;
        button.addButton = button.querySelector(".addImg");
        button.stopButton = button.querySelector(".stopImg");
        button.enableAppended = function() {
            this.isAppended = true;
            this.stopButton.style.display = "inline";
            this.addButton.style.display = "none"

            var field = this.attributes["field"].nodeValue;
            var facet = this.attributes["facet"].nodeValue;
            me.event().raise().change({ field: field, facet: facet, enabled: true });
        };

        button.disableAppended = function() {
            this.isAppended = false;
            this.stopButton.style.display = "none";
            this.addButton.style.display = "inline";
            var field = this.attributes["field"].nodeValue;
            var facet = this.attributes["facet"].nodeValue;
            me.event().raise().change({ field: field, facet: facet, enabled: false });
        };

        button.onclick = function() {
            if ( button.isAppended ) {
                button.disableAppended();
            } else {
                button.enableAppended();
            }
        };
    }},
});