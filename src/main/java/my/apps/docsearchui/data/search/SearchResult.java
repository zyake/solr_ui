package my.apps.docsearchui.data.search;

import my.apps.docsearchui.domain.Document;

import java.util.Collections;
import java.util.List;

/**
 * 読み取り専用の検索結果を提供します。
 */
public class SearchResult {

    private final int numFound;

    private final int timeMillsec;

    private final int start;

    private final int rows;

    private final List<Document> documents;

    public SearchResult(int numFound, int timeMillsec, int start, int rows, List<Document> documents) {
        this.numFound = numFound;
        this.timeMillsec = timeMillsec;
        this.start = start;
        this.rows = rows;
        this.documents = Collections.unmodifiableList(documents);
    }

    /**
     * 検索時にサーバ上でマッチしたドキュメントの総数を取得します。
     * このドキュメントの総数は実際に取得したドキュメントの総数と一致しないことがあります。
     * @return
     */
    public int getNumFound() {
        return numFound;
    }

    /**
     * 検索にかかった時間を取得します。
     * @return
     */
    public int getTimeMillsec() {
        return timeMillsec;
    }

    /**
     * 取得するドキュメントの開始インデックスを取得します。
     * @return
     */
    public int getStart() {
        return start;
    }

    /**
     * 開始インデックスから数えて取得するドキュメントの総数を取得します。
     * @return
     */
    public int getRows() {
        return rows;
    }

    /**
     * 実際に取得したドキュメントのリストを返します。
     * @return
     */
    public List<Document> getDocuments() {
        return documents;
    }
}
