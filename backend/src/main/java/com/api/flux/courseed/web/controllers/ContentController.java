package com.api.flux.courseed.web.controllers;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.api.flux.courseed.projections.dtos.ContentDto;
import com.api.flux.courseed.projections.dtos.SaveContentDto;
import com.api.flux.courseed.services.implementations.ContentService;

import jakarta.validation.Valid;
import reactor.core.publisher.Flux;
import reactor.core.publisher.Mono;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;


@RestController
@RequestMapping("/contents")
public class ContentController {

    @Autowired
    private ContentService contentService;

    @GetMapping("/course/{courseId}")
    public Flux<ContentDto> getContentByCourseId(@PathVariable String courseId) {
        return contentService.getContentsByCourseId(courseId);
    }

    @GetMapping("/{id}")
    public Mono<ResponseEntity<ContentDto>> getContentById(@PathVariable String id) {
        return contentService.getContentById(id)
            .map(ResponseEntity::ok)
            .defaultIfEmpty(ResponseEntity.notFound().build());
    }
    
    @PostMapping
    public Mono<ResponseEntity<ContentDto>> createContent(@Valid @RequestBody SaveContentDto saveContentDto) {
        return contentService.createContent(saveContentDto)
            .map(ResponseEntity::ok)
            .defaultIfEmpty(ResponseEntity.notFound().build());
    }

    @PutMapping("/{id}")
    public Mono<ResponseEntity<ContentDto>> updateContent(@PathVariable String id, @Valid @RequestBody SaveContentDto saveContentDto) {
        return contentService.updateContent(id, saveContentDto)
            .map(ResponseEntity::ok)
            .defaultIfEmpty(ResponseEntity.notFound().build());
    }

    @DeleteMapping("/{id}")
    public Mono<ResponseEntity<Void>> deleteContent(@PathVariable String id) {
        return contentService.deleteContent(id)
            .map(c -> ResponseEntity.ok(c));
    }
}
