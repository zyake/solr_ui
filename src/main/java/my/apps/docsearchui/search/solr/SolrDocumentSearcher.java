package my.apps.docsearchui.search.solr;

import my.apps.docsearchui.domain.Document;
import my.apps.docsearchui.search.DocumentSearcher;
import my.apps.docsearchui.search.SearchException;
import my.apps.docsearchui.search.SearchResult;
import org.apache.solr.client.solrj.SolrQuery;
import org.apache.solr.client.solrj.SolrServer;
import org.apache.solr.client.solrj.SolrServerException;
import org.apache.solr.client.solrj.response.QueryResponse;
import org.apache.solr.common.SolrDocument;

import java.util.ArrayList;
import java.util.Date;
import java.util.List;

public class SolrDocumentSearcher implements DocumentSearcher {

    private final SolrServer solrServer;

    public SolrDocumentSearcher(SolrServer solrServer) {
        this.solrServer = solrServer;
    }

    @Override
    public void init() {
    }

    @Override
    public void finish() {
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
}
