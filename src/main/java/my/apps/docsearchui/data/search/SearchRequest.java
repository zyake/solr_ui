package my.apps.docsearchui.data.search;

import java.util.Arrays;

public class SearchRequest {

    private String phrase;

    private String[] fqueries;

    private int start;

    private int rows;

    private boolean initialized;

    public boolean isInitialized() {
        return initialized;
    }

    public void setInitialized(boolean initialized) {
        this.initialized = initialized;
    }

    public String[] getFqueries() {
        return fqueries;
    }

    public void setFqueries(String[] fqueries) {
        this.fqueries = fqueries;
    }

    public int getRows() {
        return rows;
    }

    public void setRows(int rows) {
        this.rows = rows;
    }

    public int getStart() {
        return start;
    }

    public void setStart(int start) {
        this.start = start;
    }

    public String getPhrase() {
        return phrase;
    }

    public void setPhrase(String phrase) {
        this.phrase = phrase;
    }

    @Override
    public String toString() {
        return "SearchRequest{" +
                "fqueries=" + Arrays.toString(fqueries) +
                ", phrase='" + phrase + '\'' +
                ", start=" + start +
                ", rows=" + rows +
                ", initialized=" + initialized +
                '}';
    }
}
