package my.apps.docsearchui.config;

import my.apps.docsearchui.data.resource.ResourceLoader;
import my.apps.docsearchui.data.resource.UrlResourceLoader;
import my.apps.docsearchui.data.search.DocumentSearcher;
import my.apps.docsearchui.data.search.FacetManager;
import my.apps.docsearchui.data.search.solr.SolrDocumentSearcher;
import org.h2.jdbcx.JdbcDataSource;
import org.mybatis.spring.SqlSessionFactoryBean;
import org.mybatis.spring.annotation.MapperScan;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.*;
import org.springframework.context.annotation.Configuration;
import org.springframework.core.env.Environment;
import org.springframework.core.io.Resource;
import org.springframework.jdbc.datasource.DataSourceTransactionManager;
import org.springframework.transaction.annotation.EnableTransactionManagement;
import org.springframework.web.servlet.ViewResolver;
import org.springframework.web.servlet.config.annotation.EnableWebMvc;
import org.springframework.web.servlet.view.InternalResourceViewResolver;
import org.springframework.web.servlet.view.JstlView;

import javax.annotation.PostConstruct;
import javax.sql.DataSource;
import java.io.IOException;
import java.util.logging.LogManager;

/**
 * Spring Java Configにより、アプリケーション全体の設定を定義します。
 */
@Configuration
@EnableWebMvc
@EnableTransactionManagement
@ComponentScan( basePackages = "my.apps.docsearchui")
@PropertySource("classpath:jdbc.properties")
@MapperScan(basePackages = "my.apps.docsearchui.data.mappers")
public class AppConfiguration {

    @Autowired( required = true )
    Environment env;

    @Value("/WEB-INF/ddls/Init_Categories.sql")
    private Resource initCategoriesResource;

    @Value("/WEB-INF/ddls/Init_Configurations.sql")
    private Resource initConfigurationsResource;

    @Value("/WEB-INF/mybatis_config.xml")
    private Resource myBatisConfigResource;

    @Bean( initMethod = "init", destroyMethod = "finish" )
    public DocumentSearcher documentSearcher() {
        return new SolrDocumentSearcher();
    }

    @Bean
    public ResourceLoader resourceLoader() {
        return new UrlResourceLoader();
    }

    @Bean
    public DataSource dataSource() {
        JdbcDataSource dataSource = new JdbcDataSource();
        dataSource.setURL(env.getProperty("jdbc.url"));
        dataSource.setUser(env.getProperty("jdbc.user"));
        dataSource.setPassword(env.getProperty("jdbc.password"));

        return dataSource;
    }

    @Bean
    public Resource initCategories() {
        return initCategoriesResource;
    }

    @Bean
    public Resource initConfigurations() {
        return initConfigurationsResource;
    }

    @Bean(initMethod = "initialize")
    public ConfigurationInitializer configurationInitializer() {
        return new ConfigurationInitializer();
    }

    @Bean
    public DataSourceTransactionManager txManager() {
        return new DataSourceTransactionManager(dataSource());
    }

    @Bean(initMethod = "initialize")
    @DependsOn("configurationInitializer")
    public ConfigurationRepository configurationRepository() {
        return new DefaultConfigurationRepository();
    }

    @Bean
    public SqlSessionFactoryBean sqlSessionFactory() {
        SqlSessionFactoryBean sqlSessionFactoryBean = new SqlSessionFactoryBean();
        sqlSessionFactoryBean.setDataSource(dataSource());
        sqlSessionFactoryBean.setConfigLocation(myBatisConfigResource);

        return sqlSessionFactoryBean;
    }

    @Bean(initMethod = "initialize")
    public FacetManager facetManager() {
        return new FacetManager();
    }

    @Bean
    public ViewResolver viewResolver() {
        InternalResourceViewResolver viewResolver = new InternalResourceViewResolver();
        viewResolver.setViewClass(JstlView.class);
        viewResolver.setPrefix("/WEB-INF/jsp/");
        viewResolver.setSuffix(".jsp");

        return viewResolver;
    }
}
