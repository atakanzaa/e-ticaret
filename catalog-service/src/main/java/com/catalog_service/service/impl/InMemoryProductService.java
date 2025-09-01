package com.catalog_service.service.impl;

import com.catalog_service.service.ProductService;
import com.catalog_service.service.model.Product;
import org.springframework.stereotype.Service;

import java.time.Instant;
import java.util.*;
import java.util.concurrent.ConcurrentHashMap;
import java.util.stream.Collectors;

@Service
public class InMemoryProductService implements ProductService {

	private final Map<UUID, Product> products = new ConcurrentHashMap<>();

	@Override
	public List<Product> home(int limit) {
		return products.values().stream()
				.filter(Product::isActive)
				.sorted(Comparator.comparing(Product::getCreatedAt).reversed())
				.limit(limit)
				.collect(Collectors.toList());
	}

	@Override
	public List<Product> list(String category, String q, String sort, int page) {
		return products.values().stream()
				.filter(Product::isActive)
				.filter(p -> category == null || category.isBlank() || Objects.equals(p.getCategoryId(), category) || p.getCategoryName().equalsIgnoreCase(category))
				.filter(p -> q == null || q.isBlank() || p.getName().toLowerCase().contains(q.toLowerCase()))
				.sorted(resolveComparator(sort))
				.collect(Collectors.toList());
	}

	private Comparator<Product> resolveComparator(String sort) {
		if (sort == null || sort.isBlank()) return Comparator.comparing(Product::getCreatedAt).reversed();
		return switch (sort) {
			case "price,asc" -> Comparator.comparing(Product::getPrice);
			case "price,desc" -> Comparator.comparing(Product::getPrice).reversed();
			case "name,asc" -> Comparator.comparing(Product::getName, String.CASE_INSENSITIVE_ORDER);
			default -> Comparator.comparing(Product::getCreatedAt).reversed();
		};
	}

	@Override
	public Optional<Product> findBySlug(String slug) {
		return products.values().stream().filter(p -> slug.equals(p.getSlug())).findFirst();
	}

	@Override
	public Optional<Product> findById(UUID id) {
		return Optional.ofNullable(products.get(id));
	}

	@Override
	public Product create(String name, double price, String currency, int stock, String categoryId, String description, String image) {
		UUID id = UUID.randomUUID();
		String slug = name.toLowerCase().replaceAll("[^a-z0-9]+", "-").replaceAll("(^-|-$)", "") + "-" + id.toString().substring(0, 8);
		Product p = new Product();
		p.setId(id);
		p.setStoreId(UUID.randomUUID());
		p.setName(name);
		p.setSlug(slug);
		p.setPrice(price);
		p.setCurrency(currency);
		p.setStock(stock);
		p.setCategoryId(categoryId);
		p.setCategoryName("General");
		p.setRatingAvg(0);
		p.setRatingCount(0);
		p.setActive(true);
		p.setImage(image);
		p.setDescription(description);
		p.setCreatedAt(Instant.now());
		products.put(id, p);
		return p;
	}

	@Override
	public Product update(UUID id, String name, Double price, String currency, Integer stock, String categoryId, String description, String image) {
		Product p = products.get(id);
		if (p == null) throw new NoSuchElementException("Product not found");
		if (name != null) p.setName(name);
		if (price != null) p.setPrice(price);
		if (currency != null) p.setCurrency(currency);
		if (stock != null) p.setStock(stock);
		if (categoryId != null) p.setCategoryId(categoryId);
		if (description != null) p.setDescription(description);
		if (image != null) p.setImage(image);
		return p;
	}

	@Override
	public void delete(UUID id) {
		products.remove(id);
	}

	@Override
	public Product setActive(UUID id, boolean isActive) {
		Product p = products.get(id);
		if (p == null) throw new NoSuchElementException("Product not found");
		p.setActive(isActive);
		return p;
	}

	@Override
	public boolean decrementStock(UUID productId, int quantity) {
		Product p = products.get(productId);
		if (p == null) {
			throw new NoSuchElementException("Product not found");
		}

		if (p.getStock() < quantity) {
			return false;
		}

		p.setStock(p.getStock() - quantity);
		return true;
	}

	@Override
	public java.util.List<Product> getAllActive() {
		return products.values().stream()
				.filter(Product::isActive)
				.collect(java.util.stream.Collectors.toList());
	}

	@Override
	public java.util.List<Product> getByStoreId(UUID storeId) {
		return products.values().stream()
				.filter(product -> product.getStoreId() != null && product.getStoreId().equals(storeId))
				.collect(java.util.stream.Collectors.toList());
	}
}


