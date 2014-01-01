package my.apps.docsearchui.resource;

import java.io.InputStream;

public interface Resource {

    String getContentType();

    String getId();

    String getFilename();

    InputStream getInputStream();
}
