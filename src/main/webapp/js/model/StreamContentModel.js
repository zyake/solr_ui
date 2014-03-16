StreamContentModel = Object.create(AbstractionProxy, {

    fields: { value: {
        start: { value: 0, writable: true },
        rows: { value: 5, writable: true },
        facetManager: { value: null, writable: true }
    }},

    initialize: { value: function(control) {
        AbstractionProxy.initialize.call(this, control);
        this.reqHandler = AbstractionProxy.FOR_JSON;
        this.method = "POST";
        this.reset();
        this.control.addEventRef(this.id, Id.onPresentation(this).change());
    }},

    notify: { value: function(event, arg) {
        if ( Id.onPresentation(this).change() == event ) {
            this.filters[arg.key] = arg.value;
        } else if ( Id.onPresentation(this).start() == event ) {
         if ( arg.initialized ) {
             this.reset();
         }
            var me = this;
            this.fetch(event, {
                phrase: arg.phrase,
                start: me.start,
                rows: me.rows,
                initialized: arg.initialized || false,
                fqueries: this.facetManager.getFacets() });
            this.increment();
        }
    }},

    reset: { value: function() {
        this.start = 0;
        this.rows = 5;
    }},

    increment: { value: function() {
        this.start += this.rows;
    }}
});