package my.apps.docsearchui.config;

import my.apps.docsearchui.data.mappers.ConfigurationDataMapper;
import org.apache.commons.collections.Predicate;
import org.springframework.beans.factory.annotation.Autowired;

import java.util.ArrayList;
import java.util.HashSet;
import java.util.List;
import java.util.Set;
import java.util.concurrent.CopyOnWriteArrayList;
import java.util.logging.Level;
import java.util.logging.Logger;

/**
 * スレッドセーフなリポジトリのデフォルト実装。
 *
 *
 */
public class DefaultConfigurationRepository implements ConfigurationRepository {

    private static final Logger LOGGER = Logger.getLogger(DefaultConfigurationRepository.class.getName());

    @Autowired(required = true)
    private ConfigurationDataMapper dataMapper;

    /**
     * 設定更新通知の追い越し、重複などを防ぐためのロック。
     */
    private final Object NOTIFICATION_LOCK = new Object();

    private final List<Configuration> configurations = new CopyOnWriteArrayList<>();

    private final List<ConfigurationUpdateListener> listeners = new CopyOnWriteArrayList<>();

    public void initialize() {
        if ( LOGGER.isLoggable(Level.INFO) ) {
            LOGGER.info("start initializing...");
        }

        List<Configuration> configurations = dataMapper.getConfigurations();
        this.configurations.addAll(configurations);

        if ( LOGGER.isLoggable(Level.INFO) ) {
            LOGGER.info("end initializing: configs=" + configurations);
        }
    }

    @Override
    public Configuration getConfiguration(String category, String configKey) {
        return getConfigurationInternal(category, configKey);
    }

    private Configuration getConfigurationInternal(String category, String configKey) {
        if ( LOGGER.isLoggable(Level.FINE) ) {
            LOGGER.fine(
                    "start get configuration...: configurations=" + configurations +" , category=" + category + ", configKey=" + configKey);
        }

        for ( Configuration configuration : configurations ) {
            if ( LOGGER.isLoggable(Level.FINE) ) {
                LOGGER.fine("first configuration=" + configuration);
            }

            boolean isMatched = category.equals(configuration.getCategory()) && configKey.equals(configuration.getConfigKey());
            if ( isMatched ) {
                Configuration clone = (Configuration) configuration.clone();
                if ( LOGGER.isLoggable(Level.FINE) ) {
                    LOGGER.fine("matched configuration found: " + clone);
                }

                return clone;
            }
        }

        if ( LOGGER.isLoggable(Level.WARNING) ) {
            LOGGER.fine("configuration not found: category=" + category + ", configKey=" + configKey);
        }

        return null;
    }

    @Override
    public List<Configuration> listConfigurations(Predicate predicate) {
        List<Configuration> configurations = new ArrayList<>();
        for ( Configuration configuration : this.configurations ) {
            Configuration config = (Configuration) configuration.clone();
            boolean matched = predicate.evaluate(config);
            if ( matched ) {
                configurations.add(config);
            }
        }

        return configurations;
    }

    @Override
    public List<String> listCategories() {
        Set<String> categories = new HashSet<>();
        for ( Configuration configuration : configurations ) {
            categories.add(configuration.getCategory());
        }

        return new ArrayList<>(categories);
    }

    @Override
    public Configuration updateConfiguration(Configuration configuration) {
        String category = configuration.getCategory();
        String configKey = configuration.getConfigKey();
        Configuration config = getConfigurationInternal(category, configKey);
        if ( config == null ) {
            throw new ConfigurationException(
                    "更新対象の設定が見つかりません: カテゴリ=" + configuration.getCategory());
        }

        dataMapper.updateConfiguration(configuration);
        Configuration oldConfig = (Configuration) config.clone();
        config.setConfigValue(configuration.getConfigValue());
        notifyConfiguration(oldConfig, config);

        return (Configuration) config.clone();
    }

    /**
     * 設定の更新を通知する。
     *
     * 通知のオーバーラップや、追い越しを防ぐために通知操作のみ全てシリアルに実行する。
     * @param oldConfig
     * @param newConfig
     */
    private void notifyConfiguration(Configuration oldConfig, Configuration newConfig) {
        synchronized ( NOTIFICATION_LOCK ) {
            for ( ConfigurationUpdateListener listener : listeners ) {
                listener.update((Configuration) oldConfig.clone(), (Configuration) newConfig.clone());
            }
        }
    }

    @Override
    public void addListener(ConfigurationUpdateListener listener) {
        listeners.add(listener);
    }

    @Override
    public void deleteListener(ConfigurationUpdateListener listener) {
        listeners.remove(listener);
    }
}
