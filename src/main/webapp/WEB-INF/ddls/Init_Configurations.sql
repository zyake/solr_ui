CREATE TABLE CONFIGURATIONS
(
    CATEGORY VARCHAR(30) NOT NULL,
    CONFIG_KEY VARCHAR(30) NOT NULL,
    CONFIG_VALUE VARCHAR(100) NOT NULL,
    COMMENT VARCHAR(100) NOT NULL,
    FOREIGN KEY(CATEGORY) REFERENCES CATEGORIES(CATEGORY),
    PRIMARY KEY(CATEGORY, CONFIG_KEY)
);

INSERT INTO CONFIGURATIONS(CATEGORY, CONFIG_KEY, CONFIG_VALUE, COMMENT) VALUES
 ('global', 'solr_url', 'http://localhost:8888/solr/collection1/', ''),
 ('facet', 'facet_field1', 'content_type', ''),
 ('facet', 'facet_field2', 'author_s', '');