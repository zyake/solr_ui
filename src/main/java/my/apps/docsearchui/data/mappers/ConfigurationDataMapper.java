package my.apps.docsearchui.data.mappers;

import my.apps.docsearchui.config.Configuration;
import org.apache.ibatis.annotations.Select;
import org.apache.ibatis.annotations.Update;

import java.util.List;

public interface ConfigurationDataMapper {

    @Select("SELECT CATEGORY, CONFIG_KEY, CONFIG_VALUE, COMMENT FROM CONFIGURATIONS")
    List<Configuration> getConfigurations();

    @Update("UPDATE CONFIGURATIONS SET CONFIG_VALUE=#{configValue} WHERE CATEGORY=#{category} AND CONFIG_KEY=#{configKey}")
    int updateConfiguration(Configuration configuration);
}
