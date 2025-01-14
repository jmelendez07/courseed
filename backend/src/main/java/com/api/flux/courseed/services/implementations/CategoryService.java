package com.api.flux.courseed.services.implementations;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.api.flux.courseed.persistence.repositories.CategoryRepository;
import com.api.flux.courseed.projections.dtos.CategoryDto;
import com.api.flux.courseed.projections.dtos.SaveCategoryDto;
import com.api.flux.courseed.projections.mappers.CategoryMapper;
import com.api.flux.courseed.services.interfaces.InterfaceCategoryService;

import reactor.core.publisher.Flux;
import reactor.core.publisher.Mono;

@Service
public class CategoryService implements InterfaceCategoryService {

    @Autowired
    private CategoryRepository categoryRepository;

    @Autowired
    private CategoryMapper categoryMapper;

    @Override
    public Flux<CategoryDto> getAllCategories() {
        return categoryRepository.findAll()
            .map(categoryMapper::toCategoryDto);
    }

    @Override
    public Mono<CategoryDto> getCategoryById(String id) {
        return categoryRepository.findById(id)
            .map(categoryMapper::toCategoryDto);
    }

    @Override
    public Mono<CategoryDto> getCategoryByName(String name) {
        return categoryRepository.findByName(name)
            .map(categoryMapper::toCategoryDto);
    }

    @Override
    public Mono<CategoryDto> createCategory(SaveCategoryDto saveCategoryDto) {
        return categoryRepository.save(categoryMapper.toCategory(saveCategoryDto))
            .map(categoryMapper::toCategoryDto);
    }

    @Override
    public Mono<CategoryDto> updateCategory(String id, SaveCategoryDto saveCategoryDto) {
        return categoryRepository.findById(id)
            .flatMap(existingCategory -> {
                existingCategory.setName(saveCategoryDto.getName());
                return categoryRepository.save(existingCategory);
            })
            .map(categoryMapper::toCategoryDto)
            .onErrorReturn(new CategoryDto());
    }

    @Override
    public Mono<Void> deleteCategory(String id) {
        return categoryRepository.deleteById(id);
    }

}
