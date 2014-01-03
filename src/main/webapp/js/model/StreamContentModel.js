var StreamContentModel = Backbone.Model.extend({

    initialize: function(arg) {
        this.retrieveUrl = arg.retrieveUrl;
        this.fqueries = [];
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
        xhr.open("GET", this.createQuery());
        this.trigger("retrieve.start", xhr);
        xhr.send(null);

        return true;
    },

    createQuery: function() {
        var fq = "";
        for ( key in this.fqueries ) {
            fq += "&fq=" + key + ":\"" + this.fqueries[key] + "\"" + "&";
        }
       var query = this.retrieveUrl + "?query=" + this.query + "&start=" + this.start +fq +  "&rows=" + this.rows;

       return query;
    },

    getFQueries: function() {
        return this.fqueries;
    },

    createXhr: function(initialized) {
        var me = this;
        var xhr = new XMLHttpRequest();
        xhr.addEventListener("load", function() {
            me.isRetrieving = false;

            if ( xhr.status == 200 ) {
                me.start += me.rows;
                me.trigger("retrieve.success", xhr, initialized);
            } else {
                 me.trigger("retrieve.failure", xhr);
            }
        });

        xhr.addEventListener("error", function() {
            me.isRetrieving = false;
            me.trigger("retrieve.failure", xhr);
        });

        return xhr;
    }
});