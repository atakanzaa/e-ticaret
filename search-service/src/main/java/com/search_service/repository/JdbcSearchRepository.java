package com.search_service.repository;

import org.springframework.jdbc.core.namedparam.MapSqlParameterSource;
import org.springframework.jdbc.core.namedparam.NamedParameterJdbcTemplate;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Map;

@Repository
public class JdbcSearchRepository implements SearchRepository {

    private final NamedParameterJdbcTemplate jdbcTemplate;

    public JdbcSearchRepository(NamedParameterJdbcTemplate jdbcTemplate) {
        this.jdbcTemplate = jdbcTemplate;
    }

    @Override
    public List<Map<String, Object>> searchProducts(String queryText, int limit, int offset) {
        String sql = """
            SELECT product_id, name, attrs_text, is_active, stock,
                   ts_rank_cd(tsv, websearch_to_tsquery('simple', :q)) AS rank
            FROM search_products
            WHERE tsv @@ websearch_to_tsquery('simple', :q)
              AND is_active = TRUE
            ORDER BY rank DESC
            LIMIT :limit OFFSET :offset
        """;

        MapSqlParameterSource params = new MapSqlParameterSource()
                .addValue("q", queryText)
                .addValue("limit", limit)
                .addValue("offset", offset);

        return jdbcTemplate.queryForList(sql, params);
    }

    @Override
    public List<Map<String, Object>> searchStores(String queryText, int limit, int offset) {
        String sql = """
            SELECT store_id, name, bio, is_approved,
                   ts_rank_cd(tsv, websearch_to_tsquery('simple', :q)) AS rank
            FROM search_stores
            WHERE tsv @@ websearch_to_tsquery('simple', :q)
              AND is_approved = TRUE
            ORDER BY rank DESC
            LIMIT :limit OFFSET :offset
        """;

        MapSqlParameterSource params = new MapSqlParameterSource()
                .addValue("q", queryText)
                .addValue("limit", limit)
                .addValue("offset", offset);

        return jdbcTemplate.queryForList(sql, params);
    }
}


