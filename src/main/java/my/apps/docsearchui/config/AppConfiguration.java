package my.apps.docsearchui.config;

import my.apps.docsearchui.resource.ResourceLoader;
import my.apps.docsearchui.resource.UrlResourceLoader;
import my.apps.docsearchui.search.DocumentSearcher;
import my.apps.docsearchui.search.DocumentSearcherFactory;
import my.apps.docsearchui.search.solr.HttpSolrDocumentSearcherFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
public class AppConfiguration {

    @Value("${solr.url}")
    String solrUrl;

    @Bean( destroyMethod = "finish" )
    public DocumentSearcher createDocumentSearcher() {
        DocumentSearcherFactory searcherFactory = new HttpSolrDocumentSearcherFactory(solrUrl);
        return searcherFactory.createSearcher();
    }

    @Bean
    public ResourceLoader createResourceLoader() {
        return new UrlResourceLoader();
    }
}
