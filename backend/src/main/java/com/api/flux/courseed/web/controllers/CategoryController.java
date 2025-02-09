package com.api.flux.courseed.web.controllers;

import org.springframework.beans.factory.annotation.Autowired;
import com.api.flux.courseed.projections.dtos.SaveCategoryDto;
import com.api.flux.courseed.services.implementations.CategoryService;
import com.api.flux.courseed.services.implementations.ValidationService;

import reactor.core.publisher.Mono;

import org.springframework.web.reactive.function.server.ServerRequest;
import org.springframework.web.reactive.function.server.ServerResponse;

public class CategoryController {

    @Autowired 
    private CategoryService categoryService;

    @Autowired
    private ValidationService validationService;

    public Mono<ServerResponse> getAllCategories(ServerRequest serverRequest) {
        return categoryService
            .getAllCategories(
                Integer.parseInt(serverRequest.queryParam("page").orElse("0")), 
                Integer.parseInt(serverRequest.queryParam("size").orElse("10")) 
            )
            .flatMap(categories -> ServerResponse.ok().bodyValue(categories))
            .switchIfEmpty(ServerResponse.notFound().build());
    }

    public Mono<ServerResponse> getCategoryById(ServerRequest serverRequest) {
        return categoryService.getCategoryById(serverRequest.pathVariable("id"))
            .flatMap(category -> ServerResponse.ok().bodyValue(category))
            .switchIfEmpty(ServerResponse.notFound().build());
    }

    public Mono<ServerResponse> getCategoryByName(ServerRequest serverRequest) {
        return categoryService.getCategoryByName(serverRequest.pathVariable("name"))
            .flatMap(category -> ServerResponse.ok().bodyValue(category))
            .switchIfEmpty(ServerResponse.notFound().build());
    }

    public Mono<ServerResponse> createCategory(ServerRequest serverRequest) {
        return serverRequest.bodyToMono(SaveCategoryDto.class)
            .doOnNext(validationService::validate)
            .flatMap(saveCategoryDto -> categoryService.createCategory(saveCategoryDto)
                .flatMap(categoryDto -> ServerResponse.ok().bodyValue(categoryDto))
                .switchIfEmpty(ServerResponse.notFound().build())
            );
    }

    public Mono<ServerResponse> updateCategory(ServerRequest serverRequest) {
        return serverRequest.bodyToMono(SaveCategoryDto.class)
            .doOnNext(validationService::validate)
            .flatMap(saveCategoryDto -> categoryService.updateCategory(serverRequest.pathVariable("id"), saveCategoryDto)
                .flatMap(categoryDto -> ServerResponse.ok().bodyValue(categoryDto))
                .switchIfEmpty(ServerResponse.notFound().build())
            );
    }

    public Mono<ServerResponse> deleteCategory(ServerRequest serverRequest) {
        return categoryService.deleteCategory(serverRequest.pathVariable("id"))
            .flatMap(c -> ServerResponse.ok().bodyValue(c))
            .switchIfEmpty(ServerResponse.notFound().build());
    }
}
