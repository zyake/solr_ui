FacetManager = Object.create(AbstractionProxy, {

    fields: { value: { facets: { value: [] } } },

    initialize: { value: function(control) {
        AbstractionProxy.initialize.call(this, control);
        this.control.addEventRef(this.id, Id.onPresentation(this).load());
    }},

    notify: { value: function(event, arg) {
        if ( Id.onPresentation(this).change() == event ) {
            this.setFacet(arg);
        } else {
            AbstractionProxy.notify.call(this, event, arg);
        }
    }},

    setFacet: { value: function(arg) {
        if ( arg.enabled ) {
            this.facets.push(arg.field + ":\"" + arg.facet + "\"");
        } else {
              var index = this.facets.indexOf(arg.field + ":\"" + arg.facet + "\"");
              if ( index > -1 ) {
                delete this.facets[index];
              }
        }
    }},

    getFacets: { value: function() {
        return this.facets;
    }}
});