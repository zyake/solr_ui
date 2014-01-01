/**
 * インデックスページ用のコンポーネントを組み立てる。
 */
function IndexPageConfigurator() {
}

IndexPageConfigurator.prototype.configure = function() {
    var URL = {
         SEARCH: "/solr_ui/apps/search"
    };

    var compRepository = ComponentRepository.create();

    compRepository.addFactory("contentModel", function() {
        return new StreamContentModel({ retrieveUrl: URL.SEARCH });
    });

    compRepository.addFactory("searchBox", function() {
        var me = this;
        var searchBoxEl = document.getElementById("searchBox");
        var inputBox = searchBoxEl.querySelector(".input");
        var resultSummary = searchBoxEl.querySelector(".resultSummary");
        var submitButton = searchBoxEl.querySelector(".submit");
        var loadingImg = searchBoxEl.querySelector(".loading");
        return new SearchBox({
            inputBox: inputBox,
            resultSummary: resultSummary,
            submitButton: submitButton,
            loadingImg: loadingImg,
            model: me.get("contentModel")
        });
    });

    compRepository.addFactory("streamContent", function() {
        var me = this;
        var content = document.getElementById("right");
        var docContent = content.querySelector(".content");
        var retrieveLink = content.querySelector(".retrieveLink");
        var loadingImg = content.querySelector(".loading");
        return new StreamContent({
            model: me.get("contentModel"),
            content: docContent,
            loadingImg: loadingImg,
            retrieveLink: retrieveLink
        });
    });

    compRepository.instantiateAll();
}
