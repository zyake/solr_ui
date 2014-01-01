package my.apps.docsearchui.resource;

import java.io.InputStream;

public class UrlResource implements Resource {

    private final String contentType;

    private final String id;

    private final String filename;

    private final InputStream inputStream;

    UrlResource(String contentType, String id, InputStream inputStream) {
        this.contentType = contentType;
        this.id = id;
        int lastIndex = id.lastIndexOf("/");
        filename = id.substring(lastIndex + 1);
        this.inputStream = inputStream;
    }

    @Override
    public String getContentType() {
        return contentType;
    }

    @Override
    public String getId() {
        return id;
    }

    @Override
    public String getFilename() {
        return filename;
    }

    @Override
    public InputStream getInputStream() {
        return inputStream;
    }
}
