StreamContentModel = Object.create(AbstractionProxy, {

    fields: { value: {
        start: { value: 0, writable: true },
        rows: { value: 5, writable: true },
        facetManager: { value: null, writable: true }
    }},

    doInitialize: { value: function() {
        this.reqHandler = AbstractionProxy.FOR_JSON;
        this.method = "POST";
        this.reset();
        this.event()
            .ref().onPresentation().change(this.setFilter)
            .ref().onPresentation().start(this.retrieveContent);
    }},

    notify: { value: function(event, arg) {
        this.event().handle(event, arg);
    }},

    setFilter: { value: function(arg) {
        this.filters[arg.key] = arg.value;
    }},

    retrieveContent: { value: function(arg, event) {
        if ( arg.initialized ) {
            this.reset();
        }

        this.fetch(event, {
            phrase: arg.phrase,
            start: this.start,
            rows: this.rows,
            initialized: arg.initialized || false,
            fqueries: this.facetManager.getFacets() });
        this.increment();
    }},

    reset: { value: function() {
        this.start = 0;
        this.rows = 5;
    }},

    increment: { value: function() {
        this.start += this.rows;
    }}
});