package my.apps.docsearchui.service;

import my.apps.docsearchui.data.resource.Resource;
import my.apps.docsearchui.data.search.SearchResult;
import my.apps.docsearchui.domain.Facet;

import java.util.List;
import java.util.Map;

public interface DocumentSearchService {

    void init();

    void finish();

    SearchResult searchDocuments(String searchPhrase, int start, int rows, String[] fqueries);

    Resource loadDocument(String id, String query);

    List<Facet> getFacets();
}
