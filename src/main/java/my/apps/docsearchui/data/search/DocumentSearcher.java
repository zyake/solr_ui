package my.apps.docsearchui.data.search;

import my.apps.docsearchui.domain.Document;
import my.apps.docsearchui.domain.Facet;

import java.util.Map;

public interface DocumentSearcher {

    void init();

    void finish();

    SearchResult searchDocuments(SearchRequest request);

    Document getDocument(String id);

    Facet getFacet(String facetField);
}
