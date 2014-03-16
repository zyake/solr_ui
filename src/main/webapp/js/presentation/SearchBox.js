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
        this.inputBox = this.query(".input");
        this.resultSummary = this.query(".resultSummary");
        this.submitButton = this.query(".submit");
        this.loadingImg = this.query(".loading");

        this.on(this.submitButton, "click", this.submit);
        this.on(this.inputBox, "keypress", function(event) {
            if ( event.keyIdentifier === "Enter" ) {
                this.submit();
            }
        })
        this.addEventRef(this.id, Id.onAbstraction(this).load());
        this.addEventRef(this.id, Id.onAbstraction(this).failure());
    }},

    submit: { value: function() {
        if ( this.submitting ) {
            return;
        }
        this.disableSubmitting();
        this.raiseEvent(Id.onPresentation(this).start(), { phrase: this.inputBox.value, initialized: true });
    }},

    notify: { value: function(event, arg) {
        if ( Id.onAbstraction(this).load() == event ) {
            this.renderSuccessResult(arg);
        } else if ( Id.onAbstraction(this).failure() == event ) {
            this.renderFailureResult(arg);
        }
    }},

    renderSuccessResult: { value: function(successResult) {
        this.enableSubmitting();
        var contentCount = successResult.contentCount;
        var contentFound = successResult.contentFound;
        var searchTime = successResult.searchTime;
        this.resultSummary.innerHTML = "検索が完了しました.(マッチしたもの=" + contentFound +
        ", 取得したもの=" + contentCount + ", 検索時間=" + searchTime + "ms)";
    }},

    renderFailureResult: { value: function(failureResult) {
        this.enableSubmitting();
        this.resultSummary.innerHTML =
            "検索に失敗しました。サーバサイドで何らかのトラブルが発生した可能性があります。" +
            "(" + failureResult.message + ")";
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
 	    this.resultSummary.innerHTML= "検索中です...";
 	}}
 });