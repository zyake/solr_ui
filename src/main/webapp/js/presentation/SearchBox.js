SearchBox = Object.create(Presentation, {

    fields: { value: {
        searchBoxEl: { value: null, writable: true },
        inputBox: { value: null, writable: true },
        resultSummary: { value: null, writable: true },
        submitButton: { value: null, writable: true },
        loadingImg: { value: null, writable: true }
    }},

    initialize: { value: function(control) {
        Presentation.initialize.call(this, control);
        this.searchBoxEl = this.elem;
        this.doQueries({
            inputBox: ".input",
            resultSummary: ".resultSummary",
            submitButton: ".submit",
            loadingImg: ".loadingImg"});

        this.on(this.submitButton, "click", this.submit);
        this.on(this.inputBox, "keypress", function(event) {
            if ( event.keyIdentifier === "Enter" ) {
                this.submit();
            }
        })
        this.event()
            .ref().onAbstraction().load(this.renderSuccess)
            .ref().onAbstraction().failure(this.renderFailure);
    }},

    submit: { value: function() {
        if ( this.submitting ) {
            return;
        }
        this.disableSubmitting();
        this.event().raise().start({ phrase: this.inputBox.value, initialized: true });
    }},

    renderSuccess: { value: function(result) {
        this.enableSubmitting();
        var contentCount = result.contentCount;
        var contentFound = result.contentFound;
        var searchTime = result.searchTime;
        this.resultSummary.innerHTML = "Your search request has been completed.(matched count=" + contentFound +
        ", retrieved count=" + contentCount + ", search time=" + searchTime + "ms)";
    }},

    renderFailure: { value: function(result) {
        this.enableSubmitting();
        this.resultSummary.innerHTML =
            "Your search request has been failed. A error may be occurred in the server side." +
            "(" + result.message + ")";
    }},

    enableSubmitting: { value: function() {
        this.submitting = false;
        this.submitButton.style.disable = false;
        this.inputBox.style.disable= false;
        this.loadingImg.style.display = "none";
    }},

    disableSubmitting: { value: function() {
        this.submitting = true;
        this.submitButton.style.disable = true;
        this.inputBox.style.disable= true;
        this.loadingImg.style.display = "inline";
        this.resultSummary.innerHTML= "now searching...";
    }}
 });

Object.seal(SearchBox);