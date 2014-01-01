package my.apps.docsearchui.resource;

import my.apps.docsearchui.domain.Document;

public interface ResourceLoader {

    /**
     * ドキュメントに紐づくリソースを取得します。
     * @param document
     * @return
     */
    Resource findResource(Document document);
}
