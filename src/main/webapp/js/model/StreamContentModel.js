var StreamContentModel = Backbone.Model.extend({

    defaults: function() {
        return {
            start: 0,
            rows: 5,
            isRetrieving: false,
            query: null,
        };
    },

    initialize: function(arg) {
        this.retrieveUrl = arg.retrieveUrl;
    },

    reset: function(query) {
        this.start = 0;
        this.rows = 5;
        this.isRetrieving = false;
        this.query = query;
    },

    retrieveContent: function(query) {
        if ( this.isRetrieving ) {
            return;
        }
        this.reset(query);
        this.retrieveNext(true);
    },

    retrieveNext: function(initialized) {
        if ( this.isRetrieving ) {
            return;
        }

        this.isRetrieving = true;

        var me = this;
        var xhr = this.createXhr(initialized);
        xhr.open("GET", this.retrieveUrl + "?query=" + this.query + "&start=" + this.start + "&rows=" + this.rows);
        xhr.send(null);

        return true;
    },

    createXhr: function(initialized) {
        var me = this;
        var xhr = new XMLHttpRequest();
        xhr.addEventListener("load", function() {
            me.isRetrieving = false;
            me.start += me.rows;
            me.trigger("retrieve.success", xhr, initialized);
        });

        xhr.addEventListener("error", function() {
            me.isRetrieving = false;
            me.trigger("error", xhr);
        });

        return xhr;
    }
});