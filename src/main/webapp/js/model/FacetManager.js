FacetManager = Object.create(AbstractionProxy, {

    fields: { value: { facets: { value: [] } } },

    doInitialize: { value: function() {
        this.event()
            .ref().onPresentation().change(this.setFacet)
            .ref().onPresentation().start(this.handleDefault);
    }},

    notify: { value: function(event, arg) {
       this.event().handle(event, arg);
    }},

    handleDefault: { value: function(arg,event) {
        AbstractionProxy.notify.call(this, event, arg);
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