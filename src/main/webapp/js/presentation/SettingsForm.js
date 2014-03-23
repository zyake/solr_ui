SettingsForm = Object.create(Presentation, {

    fields: { value: {
        form: { value: null, writable: true },
        formTable: { vlaue: null, writable: true },
        submitButton: { value: null, writable: true }
    }},

    initialize: { value: function(control) {
        Presentation.initialize.call(this, control);
        this.form = this.elem;
        this.formTable = this.query("tbody");
        this.submitButton = this.query("input[type=submit]");
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
    }},

    renderFailureResult: { value: function(failureResult) {
        this.enableSubmitting();
        this.resultSummary.innerHTML =
            "検索に失敗しました。サーバサイドで何らかのトラブルが発生した可能性があります。" +
            "(" + failureResult + ")";
    }},

 	enableSubmitting: { value: function() {
 	    this.submitting = false;
 	    this.submitButton.style.disable = false;
 	}},

 	disableSubmitting: { value: function() {
 	    this.submitting = true;
 	    this.submitButton.style.disable = true;
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