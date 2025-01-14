package com.api.flux.courseed.web.controllers;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.api.flux.courseed.projections.dtos.LikeDto;
import com.api.flux.courseed.projections.dtos.SaveLikeDto;
import com.api.flux.courseed.services.implementations.LikeService;

import jakarta.validation.Valid;
import reactor.core.publisher.Flux;
import reactor.core.publisher.Mono;

@RestController
@RequestMapping("/likes")
public class LikeController {

    @Autowired
    private LikeService likeService;

    @GetMapping("/course/{courseId}")
    public Flux<LikeDto> getLikeByCourseId(@PathVariable String courseId) {
        return likeService.getLikesByCourseId(courseId);
    }

    @GetMapping("/user/{userId}")
    public Flux<LikeDto> getLikeByUserId(@PathVariable String userId) {
        return likeService.getLikesByUserId(userId);
    }

    @GetMapping("/{id}")
    public Mono<ResponseEntity<LikeDto>> getLikeById(@PathVariable String id) {
        return likeService.getLikeById(id)
            .map(ResponseEntity::ok)
            .defaultIfEmpty(ResponseEntity.notFound().build());
    }

    @PostMapping
    public Mono<ResponseEntity<LikeDto>> createLike(@Valid @RequestBody SaveLikeDto saveLikeDto) {
        return likeService.createLike(saveLikeDto)
            .map(ResponseEntity::ok)
            .defaultIfEmpty(ResponseEntity.notFound().build());
    }

    @PutMapping("/{id}")
    public Mono<ResponseEntity<LikeDto>> updateLike(@PathVariable String id, @Valid @RequestBody SaveLikeDto saveLikeDto) {
        return likeService.updateLike(id, saveLikeDto)
            .map(ResponseEntity::ok)
            .defaultIfEmpty(ResponseEntity.notFound().build());
    }

    @DeleteMapping("/{id}")
    public Mono<ResponseEntity<Void>> deleteLike(@PathVariable String id) {
        return likeService.deleteLike(id)
            .map(l -> ResponseEntity.ok(l));
    }

}
