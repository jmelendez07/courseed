package com.api.flux.courseed.web.controllers;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.api.flux.courseed.projections.dtos.ReviewDto;
import com.api.flux.courseed.projections.dtos.SaveReviewDto;
import com.api.flux.courseed.services.implementations.ReviewService;

import jakarta.validation.Valid;
import reactor.core.publisher.Flux;
import reactor.core.publisher.Mono;

@RestController
@RequestMapping("/reviews")
public class ReviewController {
    
    @Autowired
    private ReviewService reviewService;

    @GetMapping("/course/{courseId}")
    public Flux<ReviewDto> getReviewsByCourseId(@PathVariable String courseId) {
        return reviewService.getReviewsByCourseId(courseId);
    }

    @GetMapping("/user/{userId}")
    public Flux<ReviewDto> getReviewsByUserId(@PathVariable String userId) {
        return reviewService.getReviewsByUserId(userId);
    }

    @GetMapping("/{id}")
    public Mono<ResponseEntity<ReviewDto>> getReviewById(@PathVariable String id) {
        return reviewService.getReviewById(id)
            .map(ResponseEntity::ok)
            .defaultIfEmpty(ResponseEntity.notFound().build());
    }

    @PostMapping
    public Mono<ResponseEntity<ReviewDto>> createReview(@Valid @RequestBody SaveReviewDto saveReviewDto) {
        return reviewService.createReview(saveReviewDto)
            .map(r -> new ResponseEntity<>(r, HttpStatus.CREATED))
            .defaultIfEmpty(new ResponseEntity<>(HttpStatus.BAD_REQUEST));
    }

    @PutMapping("/{id}")
    public Mono<ResponseEntity<ReviewDto>> updateReview(@PathVariable String id, @Valid @RequestBody SaveReviewDto saveReviewDto) {
        return reviewService.updateReview(id, saveReviewDto)
            .map(r -> new ResponseEntity<>(r, HttpStatus.OK))
            .defaultIfEmpty(new ResponseEntity<>(HttpStatus.BAD_REQUEST));
    }

    @DeleteMapping("/{id}")
    public Mono<ResponseEntity<Void>> deleteReview(@PathVariable String id) {
        return reviewService.deleteReview(id)
            .then(Mono.just(new ResponseEntity<Void>(HttpStatus.OK)))
            .defaultIfEmpty(new ResponseEntity<>(HttpStatus.BAD_REQUEST));
    }
}
