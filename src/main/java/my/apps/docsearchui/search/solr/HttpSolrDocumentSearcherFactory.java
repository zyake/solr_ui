package my.apps.docsearchui.search.solr;

import my.apps.docsearchui.search.DocumentSearcher;
import my.apps.docsearchui.search.DocumentSearcherFactory;
import org.apache.solr.client.solrj.SolrServer;
import org.apache.solr.client.solrj.impl.HttpSolrServer;

public class HttpSolrDocumentSearcherFactory implements DocumentSearcherFactory {

    private final String solrUrl;

    public HttpSolrDocumentSearcherFactory(String solrUrl) {
        this.solrUrl = solrUrl;
    }

    @Override
    public DocumentSearcher createSearcher() {
        SolrServer solrServer = createSolrServer();
        DocumentSearcher documentSearcher = new SolrDocumentSearcher(solrServer);

        return documentSearcher;
    }

    public String getSolrUrl() {
        return solrUrl;
    }

    protected SolrServer createSolrServer() {
        HttpSolrServer solrServer = new HttpSolrServer(getSolrUrl());
        solrServer.setAllowCompression(true);

        return solrServer;
    }
}
