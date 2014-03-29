SettingsForm = Object.create(Presentation, {

    fields: { value: {
        form: { value: null, writable: true },
        formTable: { vlaue: null, writable: true },
        submitButton: { value: null, writable: true },
        loadingImg: { value: null, writable: true },
        formResult: { value: null, writable: true },
        initializing: { value: true, writable: true }
    }},

    doInitialize: { value: function() {
        this.form = this.elem;
        this.formTable = this.query("tbody");
        this.loadingImg = this.query(".loadingImg");
        this.submitButton = this.query("input[type=submit]");
        this.formResult = this.query(".formResult");
        this.on(this.submitButton, "click", this.submit);
        this.addEventRef(this.id, Id.onAbstraction(this).load());
        this.addEventRef(this.id, Id.onAbstraction(this).failure());

        this.raiseEvent(Id.onPresentation(this).start(), {});
    }},

    submit: { value: function(event) {
        event.preventDefault();
        if ( this.submitting ) {
            return;
        }
        this.disableSubmitting();
        var settings = this.collectSettings();
        this.raiseEvent(Id.onPresentation(this).load(), settings);
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
        this.formTable.innerHTML = successResult;
        if ( this.initializing ) {
            this.initializing = false;
            return;
        }
        this.formResult.innerHTML = "Your update request has been succeeded.";
    }},

    renderFailureResult: { value: function(failureResult) {
        this.enableSubmitting();
        this.formResult.innerHTML =
            "Your update request has been failed. A error may be occurred in the server side." +
            "(" + failureResult + ")";
    }},

 	enableSubmitting: { value: function() {
 	    this.submitting = false;
 	    this.submitButton.style.disable = false;
        this.loadingImg.style.display = "none";
 	}},

 	disableSubmitting: { value: function() {
        this.submitting = true;
        this.submitButton.style.disable = true;
        this.loadingImg.style.display = "block";
        this.formResult.innerHTML = "";
    }},

 	collectSettings: { value : function() {
 	    var settings = [];
 	    var dataElems = this.queryAll("tbody tr");
 	    for ( outerIndex = 0 ; outerIndex < dataElems.length ; outerIndex ++ ) {
 	        var dataElem = dataElems[outerIndex];
 	        var inputs = dataElem.querySelectorAll("input[type=text]");
 	        var setting = {};
            for ( key in inputs ) {
                var input = inputs[key];
                setting[input.name] = input.value;
            }
            settings.push(setting);
 	    }

 	    return settings;
 	}}
 });