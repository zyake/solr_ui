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
        this.doQueries({
            formTable: "tbody",
            loadingImg: ".loadingImg",
            submitButton: "input[type=submit]",
            formResult: ".formResult"});
        this.on(this.submitButton, "click", this.submit);

        this.event()
            .ref().onAbstraction().load(this.renderSuccessResult)
            .ref().onAbstraction().failure(this.renderFailureResult)
            .raise().start({});
    }},

    submit: { value: function(event) {
        event.preventDefault();
        if ( this.submitting ) {
            return;
        }
        this.disableSubmitting();
        this.event().raise().load(this.collectSettings());
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