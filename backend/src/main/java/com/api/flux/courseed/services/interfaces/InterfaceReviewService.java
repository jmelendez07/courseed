package com.api.flux.courseed.services.interfaces;

import java.security.Principal;

import org.springframework.data.domain.Page;

import com.api.flux.courseed.projections.dtos.CreateReviewDto;
import com.api.flux.courseed.projections.dtos.ReviewDto;
import com.api.flux.courseed.projections.dtos.UpdateReviewDto;

import reactor.core.publisher.Mono;

public interface InterfaceReviewService {
    public Mono<Page<ReviewDto>> getReviewsByCourseId(String courseId, int page, int size);
    public Mono<Page<ReviewDto>> getReviewsByAuthUser(Principal principal, int page, int size);
    public Mono<Object> createReview(Principal principal, CreateReviewDto createReviewDto);
    public Mono<ReviewDto> updateReview(Principal principal, String id, UpdateReviewDto saveReviewDto);
    public Mono<Boolean> deleteReview(Principal principal, String id);
}
