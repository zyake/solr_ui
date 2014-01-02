package my.apps.docsearchui.config;

/**
 * アプリケーションの設定を表します。
 */
public class Configuration implements Cloneable {

    private String category;

    private String configKey;

    private String configValue;

    private String comment;

    public String getCategory() {
        return category;
    }

    public void setCategory(String category) {
        this.category = category;
    }

    public String getConfigKey() {
        return configKey;
    }

    public void setConfigKey(String configKey) {
        this.configKey = configKey;
    }

    public String getConfigValue() {
        return configValue;
    }

    public void setConfigValue(String configValue) {
        this.configValue = configValue;
    }

    public String getComment() {
        return comment;
    }

    public void setComment(String comment) {
        this.comment = comment;
    }

    @Override
    protected Object clone() {
        Configuration configuration = new Configuration();
        configuration.setCategory(getCategory());
        configuration.setComment(getComment());
        configuration.setConfigKey(getConfigKey());
        configuration.setConfigValue(getConfigValue());

        return configuration;
    }

    @Override
    public String toString() {
        return "{ category=" + category + ", key=" + configKey +
                ", value=" + configValue + ", comment=" + comment + "}";
    }
}
