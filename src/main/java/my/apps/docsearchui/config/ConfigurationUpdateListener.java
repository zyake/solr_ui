package my.apps.docsearchui.config;

/**
 * リポジトリ上の設定更新を受信するためのリスナ。
 */
public interface ConfigurationUpdateListener {

    void update(Configuration oldConfiguration, Configuration newConfigurations);
}
