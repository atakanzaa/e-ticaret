package com.catalog_service;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.context.annotation.Primary;
import org.springframework.context.annotation.Bean;
import com.catalog_service.service.ProductService;
import com.catalog_service.service.impl.JpaProductService;

@SpringBootApplication
public class CatalogServiceApplication {

	public static void main(String[] args) {
		SpringApplication.run(CatalogServiceApplication.class, args);
	}

	@Bean
	@Primary
	public ProductService productService(JpaProductService jpaProductService) {
		return jpaProductService;
	}
}
