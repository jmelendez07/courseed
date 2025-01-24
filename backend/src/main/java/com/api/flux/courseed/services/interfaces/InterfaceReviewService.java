package com.api.flux.courseed.services.interfaces;

import java.security.Principal;

import com.api.flux.courseed.projections.dtos.CreateReviewDto;
import com.api.flux.courseed.projections.dtos.ReviewDto;
import com.api.flux.courseed.projections.dtos.UpdateReviewDto;

import reactor.core.publisher.Flux;
import reactor.core.publisher.Mono;

public interface InterfaceReviewService {
    public Flux<ReviewDto> getReviewsByCourseId(String courseId);
    public Flux<ReviewDto> getReviewsByAuthUser(Principal principal);
    public Mono<Object> createReview(Principal principal, CreateReviewDto createReviewDto);
    public Mono<ReviewDto> updateReview(Principal principal, String id, UpdateReviewDto saveReviewDto);
    public Mono<Boolean> deleteReview(Principal principal, String id);
}
