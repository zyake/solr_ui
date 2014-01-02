package my.apps.docsearchui.data.search;

import my.apps.docsearchui.domain.Document;
import my.apps.docsearchui.domain.SearchResult;

import java.util.Map;

public interface DocumentSearcher {

    void init();

    void finish();

    SearchResult searchDocuments(String searchPhrase, int start, int rows);

    Document getDocument(String id);

    Map<String, Integer> getFacets(String facetField);
}
