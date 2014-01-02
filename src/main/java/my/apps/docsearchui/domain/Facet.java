package my.apps.docsearchui.domain;

import java.util.Collections;
import java.util.Map;

/**
 * 検索サーバに登録されたドキュメントをある観点で見た時の一面。
 */
public class Facet {

    private final String facetField;

    private final Map<String, Integer> facetMap;

    public Facet(String facetField, Map<String, Integer> facetMap) {
        this.facetField = facetField;
        this.facetMap = Collections.unmodifiableMap(facetMap);
    }

    public String getFacetField() {
        return facetField;
    }

    public Map<String, Integer> getFacetMap() {
        return facetMap;
    }
}
