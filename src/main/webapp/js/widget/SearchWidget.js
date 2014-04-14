var SEARCH_URL = "/solr_ui/apps/search";
var FACET_URL = "/solr_ui/apps/facets";

SearchWidget = Object.create(Widget, {
    componentDefs : { value : {
        searchBox : {
            target : SearchBox,
            arg : { rootQuery : ".searchBox" }
        },
        streamContentView : {
            target : StreamContentView,
            arg : { rootQuery : ".right" }
        },
        compositeView : {
            target : CompositePresentation,
            arg : { rootQuery : ".top" },
            ref : { views : [ "searchBox", "streamContentView" ] }
        },
        searchBoxModel : {
            target : StreamContentModel,
            arg : {
                reqResMap : Maps.putAll(Id.START, Id.LOAD),
                resHandler : function (xhr) {
                    return {
                        searchPhrase : xhr.getResponseHeader("Search-Phrase"),
                        searchInitialized : xhr.getResponseHeader("Search-Initialized") === "false" ? false : true,
                        contentCount : xhr.getResponseHeader("Content-Count"),
                        contentFound : xhr.getResponseHeader("Content-Found"),
                        searchTime : xhr.getResponseHeader("Search-Time"),
                        responseBody : xhr.responseText
                    }
                },
                url : SEARCH_URL,
                method : "POST"
            },
            ref : { facetManager : "facetModel" }
        },
        facetView : {
            target : FacetView,
            arg : { rootQuery : ".facetView" }
        },
        facetModel : {
            target : FacetManager,
            arg : {
                reqResMap : Maps.putAll(Id.START, Id.LOAD, Id.CHANGE, Id.OTHER),
                resHandler : AbstractionProxy.AS_TEXT,
                url : FACET_URL
            }
        }
    }},
    controlDefs : { value : {
        searchControl : {
            target : Control,
            ref : { presentation : "compositeView", abstraction : "searchBoxModel" }
        },
        facetControl : {
            target : Control,
            ref : { presentation : "facetView", abstraction : "facetModel" }
        }
    }}
});