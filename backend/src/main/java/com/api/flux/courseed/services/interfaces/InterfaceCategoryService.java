package com.api.flux.courseed.services.interfaces;

import org.springframework.data.domain.Page;

import com.api.flux.courseed.projections.dtos.CategoryDto;
import com.api.flux.courseed.projections.dtos.SaveCategoryDto;

import reactor.core.publisher.Mono;

public interface InterfaceCategoryService {
    Mono<Page<CategoryDto>> getAllCategories(int page, int size);
    Mono<CategoryDto> getCategoryById(String id);
    Mono<CategoryDto> getCategoryByName(String name);
    Mono<Object> createCategory(SaveCategoryDto category);
    Mono<Object> updateCategory(String id, SaveCategoryDto category);
    Mono<Boolean> deleteCategory(String id);
}
