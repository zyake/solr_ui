package my.apps.docsearchui.service;

import my.apps.docsearchui.data.search.FacetManager;
import my.apps.docsearchui.domain.Document;
import my.apps.docsearchui.data.resource.Resource;
import my.apps.docsearchui.data.resource.ResourceLoader;
import my.apps.docsearchui.data.search.DocumentSearcher;
import my.apps.docsearchui.data.search.SearchResult;
import my.apps.docsearchui.domain.Facet;
import my.apps.docsearchui.data.search.SearchRequest;
import org.apache.commons.logging.Log;
import org.apache.commons.logging.LogFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.logging.Level;
import java.util.stream.Collectors;

@Service
public class DefaultDocumentSearchService implements DocumentSearchService {

    private static final Log LOG = LogFactory.getLog(DefaultDocumentSearchService.class);

    @Autowired(required = true)
    private DocumentSearcher searcher;

    @Autowired(required = true)
    private ResourceLoader resourceLoader;

    @Autowired(required = true)
    private FacetManager facetManager;

    @Override
    public void init() {
    }

    @Override
    public void finish() {
    }

    @Override
    public SearchResult searchDocuments(SearchRequest request) {
        LOG.info(request.toString());

        SearchResult searchResult = searcher.searchDocuments(request);

        LOG.info("end service: solr result=" + request.getPhrase() + ", count=" + searchResult.getDocuments().size());

        return searchResult;
    }

    @Override
    public Resource loadDocument(String id, String query) {
        Document document = searcher.getDocument(id);

        return resourceLoader.findResource(document);
    }

    @Override
    public List<Facet> getFacets() {
        LOG.info("start service...");

        List<Facet> facets = facetManager.getFacetFields()
                .stream()
                .map((f)-> searcher.getFacet(f))
                .collect(Collectors.toList());

        LOG.info("end service: facet field=" + facets + ", facets=" + facets);

        return facets;
    }
}
