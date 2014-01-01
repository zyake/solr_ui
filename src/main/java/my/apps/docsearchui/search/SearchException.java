package my.apps.docsearchui.search;

import org.apache.solr.client.solrj.SolrServerException;

public class SearchException extends RuntimeException {

    public SearchException(SolrServerException e, String msg) {
        super(msg, e);
    }

    public SearchException(String msg) {
        super(msg);
    }
}
