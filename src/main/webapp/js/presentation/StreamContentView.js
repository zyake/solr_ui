StreamContentView = Object.create(Presentation, {

    fields: { value: {
        content: { value: null, writable: true },
        loadingImg: { value: null, writable: true },
        retrieveLink: { value: null, writable: true },
        retrieveInitialText: { value: null, writable: true },
        prevPhrase: { value: "", writable: true }
    }},

    doInitialize: { value: function(){
        this.content = this.query(".content");
        this.loadingImg = this.query(".loadingImg");
        this.retrieveLink = this.query(".retrieveLink");
        this.retrieveInitialText = this.retrieveLink.innerHTML;

        this.on(this.retrieveLink, "click", function() {
            if ( this.retrieveFailed ) {
                this.retrieveFailed = false;
                this.retrieveLink.innerHTML = this.retrieveInitialText;
            }
            this.loadingImg.style.display = "inline";
            this.raiseEvent( Id.onPresentation(this).start(), { phrase: this.prevPhrase });
        });

        this.addEventRef(this.id, Id.onAbstraction(this).load());
        this.addEventRef(this.id, Id.onAbstraction(this).failure());
    }},

    notify: { value: function(event, arg) {
        if ( Id.onAbstraction(this).load() == event ) {
            this.renderSuccessResult(arg);
        } else if ( Id.onAbstraction(this).failure() == event ) {
            this.renderFailureResult(arg);
        }
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