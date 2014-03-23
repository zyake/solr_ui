package my.apps.docsearchui.data.search;

import my.apps.docsearchui.config.Configuration;
import my.apps.docsearchui.config.ConfigurationRepository;
import my.apps.docsearchui.config.ConfigurationUpdateListener;
import org.springframework.beans.factory.annotation.Autowired;

import java.util.ArrayList;
import java.util.List;
import java.util.Map;
import java.util.concurrent.ConcurrentHashMap;
import java.util.function.Predicate;

/**
 * アプリで使用するFacetを管理するためのマネージャ。
 */
public class FacetManager implements ConfigurationUpdateListener {

    private static final Predicate<Configuration> FACET_FIELD_PREDICATE = (c)-> c.getCategory().equals("facet");

    @Autowired(required = true)
    private ConfigurationRepository configurationRepository;

    private final Map<String, String> facetFieldMap = new ConcurrentHashMap<>();

    public void initialize() {
        List<Configuration> configs = configurationRepository.listConfigurations(FACET_FIELD_PREDICATE);
        configs.stream().forEach((c)-> facetFieldMap.put(c.getConfigKey(), c.getConfigValue()));
    }

    public List<String> getFacetFields() {
        return new ArrayList<>(facetFieldMap.values());
    }

    @Override
    public void update(Configuration oldConfiguration, Configuration newConfigurations) {
        if ( FACET_FIELD_PREDICATE.test(newConfigurations) ) {
            facetFieldMap.put(newConfigurations.getConfigKey(), newConfigurations.getConfigValue());
        }
    }
}
