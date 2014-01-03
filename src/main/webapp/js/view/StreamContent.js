/**
 * twitterライクな流れるコンテンツを表すためのビュー。
 *
 * インデックス、クエリ情報を保持するモデルから情報を取得し、
 * 画面にコンテンツを表示する。
 *
 * 初期表示後は、retrieveLinkをクリックすることで、
 * 次のコンテンツを取得することができる。
 */
var StreamContent = Backbone.View.extend({

   initialize: function(arg) {
        var me = this;
        this.retrieveFailed = false;
        this.model = arg.model;
        this.content = arg.content;
        this.loadingImg = arg.loadingImg;
        this.retrieveLink = arg.retrieveLink;
        this.retrieveInitialText = this.retrieveLink.innerHTML;
        this.retrieveLink.addEventListener("click", function() {
            me.initializeMessage();
            me.loadingImg.style.display = "inline";
            me.model.retrieveNext(false);
        });
        this.listenTo(this.model, "retrieve.start", function(xhr) { me.initializeMessage(); });
        this.listenTo(this.model, "retrieve.success", function(xhr, initialized) { me.appendContent(xhr, initialized); });
        this.listenTo(this.model, "retrieve.failure", function(xhr) { me.renderFailure(xhr) });
   },

    initializeMessage: function() {
        if ( this.retrieveFailed ) {
            this.retrieveFailed = false;
            this.retrieveLink.innerHTML = this.retrieveInitialText;
        }
    },

   appendContent: function(xhr, initialized) {
        if ( initialized ) {
            this.content.innerHTML = "";
        }
        this.loadingImg.style.display = "none";
        this.content.innerHTML += xhr.responseText;
   },

   renderFailure: function(xhr) {
        this.retrieveFailed = true;
        this.loadingImg.style.display = "none";
        this.retrieveLink.innerHTML =
        "コンテンツの取得に失敗しました。" +
        "サーバ側で何らかの障害が発生した可能性があります。" +
        "(" + xhr.statusText + ")";
   }
});