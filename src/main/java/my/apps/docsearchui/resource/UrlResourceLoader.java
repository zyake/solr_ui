package my.apps.docsearchui.resource;

import my.apps.docsearchui.domain.Document;
import my.apps.docsearchui.search.SearchException;

import java.io.IOException;
import java.io.InputStream;
import java.net.URL;

public class UrlResourceLoader implements ResourceLoader {

    @Override
    public Resource findResource(Document document) {
        InputStream inputStream = null;
        try {
            inputStream = new URL(document.getId()).openStream();
        } catch (IOException e) {
            throw new SearchException("failed to retrieve resource: id=" + document.getId());
        }

        return new UrlResource(document.getContentType(), document.getId(), inputStream);
    }
}
