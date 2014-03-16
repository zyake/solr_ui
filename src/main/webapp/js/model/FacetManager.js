FacetManager = Object.create(AbstractionProxy, {

    fields: { value: { facets: { value: {} } } },

    initialize: { value: function(control) {
        AbstractionProxy.initialize.call(this, control);
        this.control.addEventRef(this.id, Id.onPresentation(this).load());
    }},

    notify: { value: function(event, arg) {
        if ( Id.onPresentation(this).load() == event ) {
            this.setFacet(arg);
        } else {
            AbstractionProxy.notify.call(this, event, arg);
        }
    }},

    setFacet: { value: function(arg) {
        if ( this.facets[arg.field] == null ) {
            this.facets[arg.field] = [];
        }
        var fields = this.facets[arg.field];

        var newFacetIsEnabled = fields.indexOf(arg.facet) == -1 && arg.enabled;
        if ( newFacetIsEnabled ) {
            fields.push(arg.facet);
            return;
        }

        var facetIsDisabled = fields.indexOf(arg.facet) > -1 && ! arg.enabled;
        if ( facetIsDisabled ) {
            delete fields[fields.indexOf(arg.facet)];
        }
    }}
});