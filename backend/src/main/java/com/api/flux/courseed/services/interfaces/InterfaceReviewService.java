package com.api.flux.courseed.services.interfaces;

import java.security.Principal;

import org.springframework.data.domain.Page;

import com.api.flux.courseed.projections.dtos.CreateReviewDto;
import com.api.flux.courseed.projections.dtos.ReviewDto;
import com.api.flux.courseed.projections.dtos.UpdateReviewDto;

import reactor.core.publisher.Mono;

public interface InterfaceReviewService {
    Mono<Page<ReviewDto>> getAllReviews(int page, int size, String search, String userId);
    Mono<Page<ReviewDto>> getReviewsByCourseId(String courseId, int page, int size);
    Mono<Page<ReviewDto>> getReviewsByAuthUser(Principal principal, int page, int size);
    Mono<Object> createReview(Principal principal, CreateReviewDto createReviewDto);
    Mono<ReviewDto> updateReview(Principal principal, String id, UpdateReviewDto saveReviewDto);
    Mono<Boolean> deleteReview(Principal principal, String id);
}
