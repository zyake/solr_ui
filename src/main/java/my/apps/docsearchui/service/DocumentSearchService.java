package my.apps.docsearchui.service;

import my.apps.docsearchui.data.resource.Resource;
import my.apps.docsearchui.data.search.SearchResult;
import my.apps.docsearchui.domain.Facet;
import my.apps.docsearchui.data.search.SearchRequest;

import java.util.List;

public interface DocumentSearchService {

    void init();

    void finish();

    SearchResult searchDocuments(SearchRequest requestDTO);

    Resource loadDocument(String id, String query);

    List<Facet> getFacets();
}
