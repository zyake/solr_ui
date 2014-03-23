package my.apps.docsearchui.service;

import my.apps.docsearchui.config.Configuration;
import my.apps.docsearchui.config.ConfigurationRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.logging.Level;
import java.util.logging.Logger;

@Service
public class DefaultSettingsService implements SettingsService {

    private static final Logger LOG = Logger.getLogger(DefaultSettingsService.class.getName());

    private static final Object UPDATE_LOCK = new Object();

    @Autowired(required = true)
    private ConfigurationRepository repository;

    @Override
    public List<Configuration> getSettings() {
        return repository.listConfigurations(ConfigurationRepository.ACCEPT_ALL);
    }

    @Override
    public List<Configuration> updateSettings(List<Configuration> configs) {
        synchronized ( UPDATE_LOCK ) {
            if ( LOG.isLoggable(Level.FINE) ) {
                LOG.fine("start updating... : configs=" + configs);
            }

            configs.stream().forEach((c) -> repository.updateConfiguration(c));

            if ( LOG.isLoggable(Level.FINE) ) {
                LOG.fine("end updating: configs=" + configs);
            }

            return configs;
        }
    }
}
