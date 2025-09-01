package com.catalog_service.service;

import com.catalog_service.service.model.Product;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

public interface ProductService {

	List<Product> home(int limit);

	List<Product> list(String category, String q, String sort, int page);

	Optional<Product> findBySlug(String slug);

	Optional<Product> findById(UUID id);

	Product create(String name,
				  double price,
				  String currency,
				  int stock,
				  String categoryId,
				  String description,
				  String image);

	Product update(UUID id,
				 String name,
				 Double price,
				 String currency,
				 Integer stock,
				 String categoryId,
				 String description,
				 String image);

	void delete(UUID id);

	Product setActive(UUID id, boolean isActive);

	boolean decrementStock(UUID productId, int quantity);

	List<Product> getAllActive();

	List<Product> getByStoreId(UUID storeId);
}


