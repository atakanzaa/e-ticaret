package com.search_service.controller;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/")
public class SearchController {

    @GetMapping("/api/search")
    public ResponseEntity<List<Map<String, Object>>> search(@RequestParam String q, @RequestParam(defaultValue = "product") String type, @RequestParam(defaultValue = "0") int page) {
        // TODO: perform FTS search on search_products/search_stores
        return ResponseEntity.ok(List.of());
    }
}


