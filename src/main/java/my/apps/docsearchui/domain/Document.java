package my.apps.docsearchui.domain;

import java.util.Date;

/**
 * 検索サーバに登録されたドキュメント。
 */
public class Document {

    private String title;

    private final String id;

    private final String author;

    private final Date lastModified;

    private final String contentType;

    private final String matchedSection;

    public Document(String title, String id, String author, Date lastModified, String contentType, String matchedSection) {
        this.title = title;
        this.id = id;
        this.author = author;
        this.lastModified = lastModified;
        this.contentType = contentType;
        this.matchedSection = matchedSection;
    }

    public String getId() {
        return id;
    }

    public String getAuthor() {
        return author;
    }

    public Date getLastModified() {
        return lastModified;
    }

    public String getContentType() {
        return contentType;
    }

    public String getMatchedSection() {
        return matchedSection;
    }

    @Override
    public String toString() {
        return String.format("{ title=%s, id=%s, author=%s, lastModified=%s, contentType=%s, " +
                "matchedSection= %s }",
                title, id, author, lastModified, contentType, matchedSection);
    }

    public String getTitle() {
        return title;
    }
}
