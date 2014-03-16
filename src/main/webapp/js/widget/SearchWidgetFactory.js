SearchWidgetFactory = function(id, elem, repository) {

    var SEARCH_URL = "/solr_ui/apps/search";
    var FACET_URL = "/solr_ui/apps/facets";
    var widget = Widget.create(id, elem, repository);
    widget
    .defineComponents({
        searchBox: function(id, elem) { return SearchBox.create(elem.querySelector("." + id), id) },
        streamContentView: function(id, elem) { return StreamContentView.create(elem.querySelector(".right"), id) },
        compositeView: function(id, views) {  return CompositePresentation.create(id, views); },
        searchBoxModel: function(id) {
            var reqResMap = {};
            reqResMap[Id.start()] = Id.load();
            var searchModel = StreamContentModel.create(id, reqResMap, SEARCH_URL);
            searchModel.resHandler = function(xhr) {
                 var response = {
                     searchPhrase: xhr.getResponseHeader("Search-Phrase"),
                     searchInitialized: xhr.getResponseHeader("Search-Initialized") === "false" ? false : true,
                     contentCount: xhr.getResponseHeader("Content-Count"),
                     contentFound: xhr.getResponseHeader("Content-Found"),
                     searchTime: xhr.getResponseHeader("Search-Time"),
                     responseBody: xhr.responseText
                 };
                 return response;
             };

             return searchModel;
        },
        facetView: function(id, elem) {
            return FacetView.create(elem.querySelector("." + id ), id); },
        facetModel: function(id) {
          var reqResMap = {};
          reqResMap[Id.start()] = Id.load();
          var model = FacetManager.create(id, reqResMap, FACET_URL);
            model.resHandler = AbstractionProxy.AS_TEXT;

            return model;
        }

    })
    .defineControls({

        searchControl: function(id, widget, presentation, abstraction) {
            var searchBox = this.get("searchBox", widget.elem);
            var streamContentView = this.get("streamContentView", widget.elem);
            var compositeView = this.get("compositeView", [searchBox, streamContentView]);
            var model = this.get("searchBoxModel");
            return Control.create(id, widget, compositeView, model);
        },

        facetControl: function(id, widget, presentation, abstraction) {
            var facetView = this.get("facetView", widget.elem);
            var model = this.get("facetModel");
            return Control.create(id, widget, facetView, model);
        },
    });
    return widget;
}