package my.apps.docsearchui.service;

import my.apps.docsearchui.config.Configuration;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

public interface SettingsService {

    List<Configuration> getSettings();

    @Transactional
    List<Configuration> updateSettings(List<Configuration> configs);
}
