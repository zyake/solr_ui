package my.apps.docsearchui.config;

import my.apps.docsearchui.data.mappers.ConfigurationDataMapper;
import org.apache.commons.logging.Log;
import org.apache.commons.logging.LogFactory;
import org.springframework.beans.factory.annotation.Autowired;

import java.util.List;
import java.util.concurrent.CopyOnWriteArrayList;
import java.util.function.Predicate;
import java.util.logging.Level;
import java.util.stream.Collectors;

/**
 * スレッドセーフなリポジトリのデフォルト実装。
 *
 *
 */
public class DefaultConfigurationRepository implements ConfigurationRepository {

    private static final Log LOG = LogFactory.getLog(DefaultConfigurationRepository.class);

    @Autowired(required = true)
    private ConfigurationDataMapper dataMapper;

    /**
     * 設定更新通知の追い越し、重複などを防ぐためのロック。
     */
    private final Object NOTIFICATION_LOCK = new Object();

    private final List<Configuration> configurations = new CopyOnWriteArrayList<>();

    private final List<ConfigurationUpdateListener> listeners = new CopyOnWriteArrayList<>();

    public void initialize() {
        LOG.info("start initializing...");

        List<Configuration> configurations = dataMapper.getConfigurations();
        this.configurations.addAll(configurations);

        LOG.info("end initializing: configs=" + configurations);
    }

    @Override
    public Configuration getConfiguration(String category, String configKey) {
        return getConfigurationInternal(category, configKey);
    }

    private Configuration getConfigurationInternal(String category, String configKey) {
        if ( LOG.isDebugEnabled() ) {
            LOG.debug(
                    "start get configuration...: configurations=" + configurations + " , category=" + category + ", configKey=" + configKey);
        }

        Configuration matchedConfig = configurations
                .stream()
                .filter((c) -> c.getCategory().equals(category) && c.getConfigKey().equals(configKey))
                .findFirst()
                .get();
        boolean matchedConfigFound = matchedConfig != null;
        if ( matchedConfigFound ) {
            Configuration clone = (Configuration) matchedConfig.clone();
            if ( LOG.isDebugEnabled() ) {
                LOG.debug("matched configuration found: " + clone);
            }

            return clone;
        } else {
            LOG.warn("configuration not found: category=" + category + ", configKey=" + configKey);

            return null;
        }
    }

    @Override
    public List<Configuration> listConfigurations(Predicate<Configuration> predicate) {
        List<Configuration> configurations = this.configurations
                .stream()
                .filter(predicate)
                .map((c) -> (Configuration) c.clone())
                .collect(Collectors.toList());

        return configurations;
    }

    @Override
    public List<String> listCategories() {
        List<String> categories = this.configurations
                .stream()
                .map((c)-> c.getCategory())
                .collect(Collectors.toList());

        return categories;
    }

    @Override
    public Configuration updateConfiguration(Configuration newConfig) {
        String category = newConfig.getCategory();
        String configKey = newConfig.getConfigKey();
        Configuration config = getConfigurationInternal(category, configKey);
        if ( config == null ) {
            throw new ConfigurationException(
                    "更新対象の設定が見つかりません: カテゴリ=" + newConfig.getCategory());
        }

        dataMapper.updateConfiguration(newConfig);
        Configuration oldConfig = (Configuration) config.clone();
        config.setConfigValue(newConfig.getConfigValue());
        notifyConfiguration(oldConfig, config);

        return (Configuration) newConfig.clone();
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
            this.listeners
                    .stream()
                    .forEach(
                    (listener)-> listener.update((Configuration) oldConfig.clone(), (Configuration) newConfig.clone()));
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
