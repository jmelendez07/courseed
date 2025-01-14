package com.api.flux.courseed.services.interfaces;

import com.api.flux.courseed.projections.dtos.CategoryDto;
import com.api.flux.courseed.projections.dtos.SaveCategoryDto;

import reactor.core.publisher.Flux;
import reactor.core.publisher.Mono;

public interface InterfaceCategoryService {
    Flux<CategoryDto> getAllCategories();
    Mono<CategoryDto> getCategoryById(String id);
    Mono<CategoryDto> getCategoryByName(String name);
    Mono<CategoryDto> createCategory(SaveCategoryDto category);
    Mono<CategoryDto> updateCategory(String id, SaveCategoryDto category);
    Mono<Void> deleteCategory(String id);
}
