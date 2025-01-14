package com.api.flux.courseed.web.controllers;

import java.util.HashMap;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.bind.annotation.RestController;

import com.api.flux.courseed.projections.dtos.CategoryDto;
import com.api.flux.courseed.projections.dtos.SaveCategoryDto;
import com.api.flux.courseed.services.implementations.CategoryService;

import jakarta.validation.Valid;
import reactor.core.publisher.Flux;
import reactor.core.publisher.Mono;

import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.PutMapping;

@RestController
@RequestMapping("/categories")
public class CategoryController {

    @Autowired 
    private CategoryService categoryService;

    @GetMapping
    public Flux<CategoryDto> getAllCategories() {
        return categoryService.getAllCategories();
    }

    @GetMapping("/{id}")
    public Mono<ResponseEntity<CategoryDto>> getCategoryById(@PathVariable String id) {
        return categoryService.getCategoryById(id)
            .map(category -> ResponseEntity.ok(category))
            .defaultIfEmpty(ResponseEntity.notFound().build());
    }

    @GetMapping("/name/{name}")
    public Mono<ResponseEntity<CategoryDto>> getCategoryByName(@PathVariable String name) {
        return categoryService.getCategoryByName(name)
            .map(category -> ResponseEntity.ok(category))
            .defaultIfEmpty(ResponseEntity.notFound().build());
    }

    @PostMapping
    public Mono<ResponseEntity<CategoryDto>> createCategory(@Valid @RequestBody SaveCategoryDto saveCategoryDto) {
        return categoryService.createCategory(saveCategoryDto)
            .map(c -> new ResponseEntity<>(c, HttpStatus.CREATED))
            .defaultIfEmpty(ResponseEntity.notFound().build());
    }

    @PutMapping("/{id}")
    public Mono<ResponseEntity<CategoryDto>> updateCategory(@PathVariable String id, @Valid @RequestBody SaveCategoryDto saveCategoryDto) {
        return categoryService.updateCategory(id, saveCategoryDto)
            .map(c -> new ResponseEntity<>(c, HttpStatus.OK))
            .defaultIfEmpty(ResponseEntity.notFound().build());
    }

    @DeleteMapping("/{id}")
    public Mono<ResponseEntity<Void>> deleteCategory(@PathVariable String id) {
        return categoryService.deleteCategory(id)
            .map(c -> ResponseEntity.ok(c));
    }

    @ResponseStatus(HttpStatus.BAD_REQUEST)
    @ExceptionHandler(MethodArgumentNotValidException.class)
    public Mono<ResponseEntity<Map<String, String>>> handleValidationExceptions(MethodArgumentNotValidException ex) {
        Map<String, String> errors = new HashMap<>();
        ex.getBindingResult().getFieldErrors().forEach(error -> 
            errors.put(error.getField(), error.getDefaultMessage()));
        return Mono.just(ResponseEntity.badRequest().body(errors));
    }
}
