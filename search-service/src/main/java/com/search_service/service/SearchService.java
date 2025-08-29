package com.search_service.service;

import com.search_service.config.SearchProperties;
import com.search_service.repository.SearchRepository;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Locale;
import java.util.Map;

@Service
public class SearchService {

    private final SearchRepository searchRepository;
    private final SearchProperties searchProperties;

    public SearchService(SearchRepository searchRepository, SearchProperties searchProperties) {
        this.searchRepository = searchRepository;
        this.searchProperties = searchProperties;
    }

    public List<Map<String, Object>> search(String rawQuery, String rawType, int page) {
        String query = rawQuery == null ? "" : rawQuery.trim();
        if (query.isEmpty()) {
            return List.of();
        }

        int safePage = Math.max(0, page);
        int limit = Math.min(Math.max(1, searchProperties.getDefaultLimit()), searchProperties.getMaxLimit());
        int offset = safePage * limit;

        String type = rawType == null ? "product" : rawType.toLowerCase(Locale.ROOT);
        switch (type) {
            case "product":
            case "products":
                return searchRepository.searchProducts(query, limit, offset);
            case "store":
            case "stores":
                return searchRepository.searchStores(query, limit, offset);
            default:
                throw new IllegalArgumentException("Invalid search type: " + rawType);
        }
    }
}


