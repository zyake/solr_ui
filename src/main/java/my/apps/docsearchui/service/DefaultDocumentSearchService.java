package my.apps.docsearchui.service;

import my.apps.docsearchui.data.search.FacetManager;
import my.apps.docsearchui.domain.Document;
import my.apps.docsearchui.data.resource.Resource;
import my.apps.docsearchui.data.resource.ResourceLoader;
import my.apps.docsearchui.data.search.DocumentSearcher;
import my.apps.docsearchui.data.search.SearchResult;
import my.apps.docsearchui.domain.Facet;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;
import java.util.logging.Level;
import java.util.logging.Logger;

@Service
public class DefaultDocumentSearchService implements DocumentSearchService {

    private static final Logger LOGGER = Logger.getLogger(DefaultDocumentSearchService.class.getName());

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
    public SearchResult searchDocuments(String searchPhrase, int start, int rows, String[] fqueries) {
        if ( LOGGER.isLoggable(Level.INFO) ) {
            LOGGER.info("start service: solr phrase=" + searchPhrase +", start=" + start +
                    ", rows=" + rows + ", fqueries=" + (fqueries == null ? "" : Arrays.asList(fqueries)));
        }

        SearchResult searchResult = searcher.searchDocuments(searchPhrase, start, rows, fqueries);

        if ( LOGGER.isLoggable(Level.INFO) ) {
            LOGGER.info(
                    "end service: solr result=" + searchPhrase + ", count=" + searchResult.getDocuments().size());
        }

        return searchResult;
    }

    @Override
    public Resource loadDocument(String id, String query) {
        Document document = searcher.getDocument(id);
        Resource resource = resourceLoader.findResource(document);

        return resource;
    }

    @Override
    public List<Facet> getFacets() {
        if ( LOGGER.isLoggable(Level.INFO) ) {
            LOGGER.info("start service...");
        }

        List<Facet> facets = new ArrayList<>();
        List<String> facetFields = facetManager.getFacetFields();
        for( String facetField : facetFields ) {
            Facet facet = searcher.getFacet(facetField);
            facets.add(facet);
        }

        if ( LOGGER.isLoggable(Level.INFO) ) {
            LOGGER.info("end service: facet field=" + facets + ", facets=" + facets);
        }

        return facets;
    }
}
