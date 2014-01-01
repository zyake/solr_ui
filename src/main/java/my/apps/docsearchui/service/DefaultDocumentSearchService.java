package my.apps.docsearchui.service;

import my.apps.docsearchui.domain.Document;
import my.apps.docsearchui.resource.Resource;
import my.apps.docsearchui.resource.ResourceLoader;
import my.apps.docsearchui.resource.UrlResource;
import my.apps.docsearchui.search.DocumentSearcher;
import my.apps.docsearchui.search.SearchResult;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.logging.Logger;

@Service
public class DefaultDocumentSearchService implements DocumentSearchService {

    private static final Logger LOGGER = Logger.getLogger(DefaultDocumentSearchService.class.getName());

    @Autowired(required = true)
    private DocumentSearcher searcher;

    @Autowired(required = true)
    private ResourceLoader resourceLoader;

    @Override
    public void init() {
    }

    @Override
    public void finish() {
    }

    @Override
    public SearchResult searchDocuments(String searchPhrase, int start, int rows) {
        LOGGER.info("start service: search phrase=" + searchPhrase);

        SearchResult searchResult = searcher.searchDocuments(searchPhrase, start, rows);

        LOGGER.info("end service: search result=" + searchPhrase + ", count=" + searchResult.getDocuments().size());

        return searchResult;
    }

    @Override
    public Resource loadDocument(String id, String query) {
        Document document = searcher.getDocument(id);
        Resource resource = resourceLoader.findResource(document);

        return resource;
    }
}
