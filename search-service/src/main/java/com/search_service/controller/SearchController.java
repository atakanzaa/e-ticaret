package com.search_service.controller;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

import com.search_service.service.SearchService;

@RestController
@RequestMapping("/")
public class SearchController {

    private final SearchService searchService;

    public SearchController(SearchService searchService) {
        this.searchService = searchService;
    }

    @GetMapping("/api/search")
    public ResponseEntity<List<Map<String, Object>>> search(@RequestParam String q, @RequestParam(defaultValue = "product") String type, @RequestParam(defaultValue = "0") int page) {
        return ResponseEntity.ok(searchService.search(q, type, page));
    }
}


