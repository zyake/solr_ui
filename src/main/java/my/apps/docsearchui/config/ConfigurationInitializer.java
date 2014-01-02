package my.apps.docsearchui.config;

import org.apache.commons.io.FileUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.core.io.Resource;

import javax.sql.DataSource;
import java.io.IOException;
import java.sql.Connection;
import java.sql.ResultSet;
import java.sql.SQLException;
import java.sql.Statement;

/**
 * データベースを初期化します。
 *
 * テーブルが存在しない場合、DDLを実行してデフォルト値を挿入します。
 */
public class ConfigurationInitializer {

    @Autowired(required = true)
    private DataSource dataSource;

    @Autowired(required = true)
    @Qualifier("initCategories")
    private Resource initCategoriesResource;

    @Autowired(required = true)
    @Qualifier("initConfigurations")
    private Resource initConfigurationsResource;

    public void initialize() throws SQLException, IOException {
       try( Connection connection = dataSource.getConnection() ) {
           createCategories(connection);
           createConfigurations(connection);
       }
    }

    private void createCategories(Connection connection) throws SQLException, IOException {
        if ( existsTable("CATEGORIES", connection) ) {
            return;
        }
        String initCategories = FileUtils.readFileToString(initCategoriesResource.getFile());
        initializeTable(initCategories, connection);
    }

    private void createConfigurations(Connection connection) throws SQLException, IOException {
        if ( existsTable("CONFIGURATIONS", connection) ) {
            return;
        }
        String initConfigurations = FileUtils.readFileToString(initConfigurationsResource.getFile());
        initializeTable(initConfigurations, connection);
    }

    boolean existsTable(String tableName, Connection connection) throws SQLException {
        ResultSet resultSet = null;
        try ( Statement statement = connection.createStatement() ) {
            resultSet = statement.executeQuery(
                    "SELECT COUNT(TABLE_NAME) FROM INFORMATION_SCHEMA.TABLES WHERE TABLE_NAME like '" + tableName + "'");
            resultSet.next();
            boolean existsTable = resultSet.getInt(1) > 0;

            return existsTable;
        } finally {
            if ( resultSet != null ) {
                resultSet.close();
            }
        }
    }

    void initializeTable(String initScript, Connection connection) throws SQLException {
        try ( Statement statement = connection.createStatement() ) {
         statement.execute(initScript);
        }
    }
}
