var HtmlContentModel = Backbone.Model.extend({

    initialize: function(arg) {
        this.retrieveUrl = arg.retrieveUrl;
        this.isRetrieving = false;
    },

    retrieveContent: function(query) {
        if ( this.isRetrieving ) {
            return;
        }

        this.isRetrieving = true;

        var me = this;
        var xhr = this.createXhr();
        xhr.open("GET", this.retrieveUrl);
        xhr.send(null);

        return true;
    },

    createXhr: function() {
        var me = this;
        var xhr = new XMLHttpRequest();
        xhr.addEventListener("load", function() {
            me.isRetrieving = false;
            me.start += me.rows;
            me.trigger("retrieve.success", xhr);
        });

        xhr.addEventListener("error", function() {
            me.isRetrieving = false;
            me.trigger("retrieve.failure", xhr);
        });

        return xhr;
    }
});