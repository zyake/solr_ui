package my.apps.docsearchui.service;

import my.apps.docsearchui.resource.Resource;
import my.apps.docsearchui.search.SearchResult;

public interface DocumentSearchService {

    void init();

    void finish();

    SearchResult searchDocuments(String searchPhrase, int start, int rows);

    Resource loadDocument(String id, String query);
}
