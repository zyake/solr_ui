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
        this.model = arg.model;
        this.content = arg.content;
        this.loadingImg = arg.loadingImg;
        this.retrieveLink = arg.retrieveLink;
        this.retrieveLink.addEventListener("click", function() {
            me.loadingImg.style.display = "inline";
            me.model.retrieveNext(false);
        });
        this.listenTo(this.model, "retrieve.success", function(xhr, initialized) { me.appendContent(xhr, initialized); });
   },

   appendContent: function(xhr, initialized) {
        if ( initialized ) {
            this.content.innerHTML = "";
        }

        this.loadingImg.style.display = "none";
        this.content.innerHTML += xhr.responseText;
   }
});