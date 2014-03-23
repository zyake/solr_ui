package my.apps.docsearchui.config;


import java.util.List;
import java.util.function.Predicate;


/**
 * アプリの設定を管理するためのリポジトリ。
 *
 * 取得する設定は、その時リポジトリで管理している設定の「ビュー」であり、
 * 取得したビューをクライアントで操作しても、他のオブジェクトに反映することはできない。
 * 設定の更新に成功した場合は、登録されているリスナに通知される。
 */
public interface ConfigurationRepository {

    Predicate<Configuration> ACCEPT_ALL = (config)-> true;

    Configuration getConfiguration(String category, String configKey);

    List<Configuration> listConfigurations(Predicate<Configuration> predicate);

    List<String> listCategories();

    Configuration updateConfiguration(Configuration configuration);

    void addListener(ConfigurationUpdateListener listener);

    void deleteListener(ConfigurationUpdateListener listener);
}
