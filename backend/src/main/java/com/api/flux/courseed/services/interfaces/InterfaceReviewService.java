package com.api.flux.courseed.services.interfaces;

import com.api.flux.courseed.projections.dtos.ReviewDto;
import com.api.flux.courseed.projections.dtos.SaveReviewDto;

import reactor.core.publisher.Flux;
import reactor.core.publisher.Mono;

public interface InterfaceReviewService {
    public Flux<ReviewDto> getReviewsByCourseId(String courseId);
    public Flux<ReviewDto> getReviewsByUserId(String userId);
    public Mono<ReviewDto> getReviewById(String id);
    public Mono<ReviewDto> createReview(SaveReviewDto saveReviewDto);
    public Mono<ReviewDto> updateReview(String id, SaveReviewDto saveReviewDto);
    public Mono<Void> deleteReview(String id);
}
