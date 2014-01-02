package my.apps.docsearchui.data.search.solr;

import my.apps.docsearchui.config.Configuration;
import my.apps.docsearchui.config.ConfigurationRepository;
import my.apps.docsearchui.config.ConfigurationUpdateListener;
import my.apps.docsearchui.domain.Document;
import my.apps.docsearchui.domain.DocumentSearcher;
import my.apps.docsearchui.domain.SearchException;
import my.apps.docsearchui.domain.SearchResult;
import org.apache.solr.client.solrj.SolrQuery;
import org.apache.solr.client.solrj.SolrServer;
import org.apache.solr.client.solrj.SolrServerException;
import org.apache.solr.client.solrj.impl.HttpSolrServer;
import org.apache.solr.client.solrj.response.FacetField;
import org.apache.solr.client.solrj.response.QueryResponse;
import org.apache.solr.common.SolrDocument;
import org.springframework.beans.factory.annotation.Autowired;

import java.util.*;
import java.util.logging.Level;
import java.util.logging.Logger;

public class SolrDocumentSearcher implements DocumentSearcher, ConfigurationUpdateListener {

    private static final Logger LOGGER = Logger.getLogger(SolrDocumentSearcher.class.getName());

    @Autowired(required = true)
    private ConfigurationRepository configurationRepository;

    private volatile SolrServer solrServer;

    @Override
    public void init() {
        if ( LOGGER.isLoggable(Level.INFO) ) {
            LOGGER.info("start initializing...: " + configurationRepository.toString());
        }

        configurationRepository.addListener(this);

        Configuration configuration = configurationRepository.getConfiguration("global", "solr_url");

        renewSolrServer(configuration.getConfigValue());

        if ( LOGGER.isLoggable(Level.INFO) ) {
            LOGGER.info("end initializing: solr url=" + configuration.getConfigValue());
        }
    }

    @Override
    public void finish() {
        configurationRepository.deleteListener(this);
        solrServer.shutdown();
    }

    @Override
    public SearchResult searchDocuments(String searchPhrase, int start, int rows) {
        SolrQuery solrQuery = new SolrQuery(searchPhrase)
        .setHighlight(true)
        .addHighlightField("content")
        .setStart(start)
        .setRows(rows);

        QueryResponse response = query(solrQuery);
        List<Document> resultDocs = new ArrayList<>();
        for ( SolrDocument doc : response.getResults() ) {
            Document parsedDocument = parseDocument(doc, response);
            resultDocs.add(parsedDocument);
        }

        int timeMillsec = response.getQTime();
        int numFound = (int) response.getResults().getNumFound();

        SearchResult searchResult = new SearchResult(numFound, timeMillsec, start, rows, resultDocs);

        return searchResult;
    }

    @Override
    public Document getDocument(String id) {
        SolrQuery solrQuery = new SolrQuery();
        solrQuery.add("q", "id:\"" + id + "\"");

        QueryResponse queryResponse = query(solrQuery);
        boolean documentNotFound = queryResponse.getResults().size()  == 0;
        if ( documentNotFound ) {
            throw new SearchException("document not found in Solr: id=" + id);
        }

        Document document = parseDocument(queryResponse.getResults().get(0), queryResponse);

        return document;
    }

    @Override
    public Map<String, Integer> getFacets(String facetField) {
        SolrQuery solrQuery = new SolrQuery("*:*")
                .addFacetField(facetField)
                .addFilterQuery("id");

        QueryResponse response = query(solrQuery);
        Map<String, Integer> facets = new HashMap<>();
        for ( FacetField field : response.getFacetFields() ) {
            facets.put(field.getName(), field.getValueCount());
        }

        return facets;
    }

    protected Document parseDocument(SolrDocument doc, QueryResponse res) {
        String title = null;
        if ( doc.getFieldValueMap().containsKey("title") ) {
            title = toSingleString(doc.getFieldValue("title"));
        }

        String id = null;
        if ( doc.getFieldValueMap().containsKey("id") ) {
            id = toSingleString(doc.getFieldValue("id"));
        }

        String author = null;
        if ( doc.getFieldValueMap().containsKey("author") ) {
            author = toSingleString(doc.getFieldValue("author").toString());
        }

        Date lastModified = null;
        if ( doc.getFieldValueMap().containsKey("last_modified") ) {
            lastModified = (Date) doc.getFieldValue("last_modified");
        }

        String contentType = null;
        if ( doc.getFieldValueMap().containsKey("content_type") ) {
            contentType = toSingleString(doc.getFieldValue("content_type"));
        }

        String matchedSection = null;
        boolean hasHighlightedContents = res.getHighlighting() != null && res.getHighlighting().containsKey(id) && res.getHighlighting().get(id).containsKey("content" );
        if ( hasHighlightedContents ) {
            matchedSection = toSingleString(res.getHighlighting().get(id).get("content"));
        }

        Document document = new Document(title, id, author, lastModified, contentType, matchedSection);

        return document;
    }

    private QueryResponse query(SolrQuery query) {
        try {
            return solrServer.query(query);
        } catch (SolrServerException e) {
            throw new SearchException(e, "Solr Request failed.");
        }
    }

    private String toSingleString(Object obj) {
        if ( obj instanceof  List ) {
            return ( (List) obj ).get(0).toString();
        }

        return obj.toString();
    }

    @Override
    public void update(Configuration oldConfiguration, Configuration newConfigurations) {
        String category = newConfigurations.getCategory();
        String configValue = newConfigurations.getConfigValue();
        boolean isTarget = "global".equals(category) && "solr_url".equals(configValue);
        if ( ! isTarget ) {
            return;
        }

        SolrServer tmpServer = solrServer;
        renewSolrServer(configValue);
        tmpServer.shutdown();
    }

   protected void renewSolrServer(String solrUrl) {
       solrServer = new HttpSolrServer(solrUrl);
   }
}
