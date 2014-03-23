CompositeModel = Object.create(AbstractionProxy, {

    fields: { value: { models: { value: null, writable: true } } },

    create: { value: function(id, models) {
        var model = AbstractionProxy.create.call(this, id, {}, "");
        model.models = models;

        return model;
    }},

    initialize: { value: function(control) {
        AbstractionProxy.initialize.call(this, control);
        for ( key in this.models ) {
            var model = this.models[key];
            model.initialize(control);
        }
    }},

    notify: { value: function(event, arg) {
        for ( key in this.models ) {
            var model = this.models[key];
            model.notify(event, arg);
        }
    }}
});