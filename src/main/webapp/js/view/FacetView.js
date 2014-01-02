 /**
  * 単一のテキストボックスと送信ボタン、結果のサマリ表示エリアを持つ検索ボックス。
  */
 var SearchBox = Backbone.View.extend({

 	initialize: function(args) {
		this.inputBox = args.inputBox;
		this.resultSummary = args.resultSummary;
		this.submitButton = args.submitButton;
		this.loadingImg = args.loadingImg;
		this.model = args.model;
		this.submitting = false;

        var me = this;
        this.submitButton.addEventListener("click", function() { me.submit() });
        this.listenTo(this.model, "retrieve.success", function(xhr) { me.enableSubmitting(xhr) });
 	},

 	submit: function() {
 	    if ( this.submitting ) {
 	        return;
 	    }
 	    this.disableSubmitting();
        this.model.retrieveContent(this.inputBox.value);
 	},

 	enableSubmitting: function(xhr) {
 	    this.submitting = false;
 	    this.submitButton.style.disable = false;
 	    this.inputBox.style.disable= false;

        this.loadingImg.style.display = "none";
 	    var contentCount = xhr.getResponseHeader("Content-Count");
 	    var contentFound = xhr.getResponseHeader("Content-Found");
 	    var timeMillsec = xhr.getResponseHeader("Search-Time");
 	    this.resultSummary.innerHTML = "検索が完了しました.(マッチしたもの=" + contentFound +
 	    ", 取得したもの=" + contentCount + ", 検索時間=" + timeMillsec + "ms)";
 	},

 	disableSubmitting: function() {
 	    this.submitting = true;
 	    this.submitButton.style.disable = true;
 	    this.inputBox.style.disable= true;
 	    this.loadingImg.style.display = "inline";
 	    this.resultSummary.innerHTML= "検索中です...";
 	},
});