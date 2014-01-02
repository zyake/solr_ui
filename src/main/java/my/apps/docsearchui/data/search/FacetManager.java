package my.apps.docsearchui.data.search;

import my.apps.docsearchui.config.Configuration;
import my.apps.docsearchui.config.ConfigurationRepository;
import my.apps.docsearchui.config.ConfigurationUpdateListener;
import org.apache.commons.collections.Predicate;
import org.springframework.beans.factory.annotation.Autowired;

import java.util.ArrayList;
import java.util.List;
import java.util.Map;
import java.util.concurrent.ConcurrentHashMap;

/**
 * アプリで使用するFacetを管理するためのマネージャ。
 */
public class FacetManager implements ConfigurationUpdateListener {

    private static final Predicate FACET_FIELD_PREDICATE = new Predicate() {
        @Override
        public boolean evaluate(Object o) {
            Configuration config = (Configuration) o;
            if (config.getConfigKey().startsWith("facet_field")) {
                return true;
            }

            return false;
        }
    };

    @Autowired(required = true)
    private ConfigurationRepository configurationRepository;

    private final Map<String, String> facetFieldMap = new ConcurrentHashMap<>();

    public void initialize() {
        List<Configuration> configs = configurationRepository.listConfigurations(FACET_FIELD_PREDICATE);
        for ( Configuration config : configs ) {
            facetFieldMap.put(config.getConfigKey(), config.getConfigValue());
        }
    }

    public List<String> getFacetFields() {
        return new ArrayList<>(facetFieldMap.values());
    }

    @Override
    public void update(Configuration oldConfiguration, Configuration newConfigurations) {
        if ( FACET_FIELD_PREDICATE.evaluate(newConfigurations) ) {
            facetFieldMap.put(newConfigurations.getConfigKey(), newConfigurations.getConfigValue());
        }
    }
}
