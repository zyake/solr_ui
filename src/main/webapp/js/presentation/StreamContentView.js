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
            .ref().onAbstraction().load(this.renderSuccessResult)
            .ref().onAbstraction().failure(this.renderFailure);
    }},

    renderSuccessResult: { value: function(successResult) {
        if ( successResult.searchInitialized ) {
            this.content.innerHTML = "";
        }
        this.prevPhrase = successResult.searchPhrase;
        this.loadingImg.style.display = "none";
        this.content.innerHTML += successResult.responseBody;
   }},

   renderFailure: { value: function(failureResult) {
       this.retrieveFailed = true;
       this.loadingImg.style.display = "none";
       this.retrieveLink.innerHTML =
       "Content retrieving has been failed." +
       "A error may be occurred in the server side." +
       "(" + failureResult.message + ")";
   }}
});