package my.apps.docsearchui.search;

import my.apps.docsearchui.domain.Document;

import java.util.List;

public interface DocumentSearcher {

    void init();

    void finish();

    SearchResult searchDocuments(String searchPhrase, int start, int rows);

    Document getDocument(String id);
}
