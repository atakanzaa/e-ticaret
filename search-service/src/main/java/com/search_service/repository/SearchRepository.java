package com.search_service.repository;

import java.util.List;
import java.util.Map;

public interface SearchRepository {

	List<Map<String, Object>> searchProducts(String queryText, int limit, int offset);

	List<Map<String, Object>> searchStores(String queryText, int limit, int offset);
}


