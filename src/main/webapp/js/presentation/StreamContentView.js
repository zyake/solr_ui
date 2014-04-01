StreamContentView = Object.create(Presentation, {

    fields: { value: {
        content: { value: null, writable: true },
        loadingImg: { value: null, writable: true },
        retrieveLink: { value: null, writable: true },
        retrieveInitialText: { value: null, writable: true },
        prevPhrase: { value: "", writable: true }
    }},

    doInitialize: { value: function() {
        this.doQueries({
            content: ".content",
            loadingImg: ".loadingImg",
            retrieveLink: ".retrieveLink"});
        this.retrieveInitialText = this.retrieveLink.innerHTML;

        this.on(this.retrieveLink, "click", function() {
            if ( this.retrieveFailed ) {
                this.retrieveFailed = false;
                this.retrieveLink.innerHTML = this.retrieveInitialText;
            }
            this.loadingImg.style.display = "inline";
            this.event().raise().start({ phrase: this.prevPhrase });
        });

        this.event()
            .ref().onAbstraction().load(this.renderSuccess)
            .ref().onAbstraction().failure(this.renderFailure);
    }},

    renderSuccess: { value: function(result) {
        if ( result.searchInitialized ) {
            this.content.innerHTML = "";
        }
        this.prevPhrase = result.searchPhrase;
        this.loadingImg.style.display = "none";
        this.content.innerHTML += result.responseBody;
   }},

   renderFailure: { value: function(result) {
       this.retrieveFailed = true;
       this.loadingImg.style.display = "none";
       this.retrieveLink.innerHTML =
       "Content retrieving has been failed." +
       "A error may be occurred in the server side." +
       "(" + result.message + ")";
   }}
});