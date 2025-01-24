package com.api.flux.courseed.web.controllers;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.MediaType;
import org.springframework.web.reactive.function.server.ServerRequest;
import org.springframework.web.reactive.function.server.ServerResponse;

import com.api.flux.courseed.projections.dtos.CreateReviewDto;
import com.api.flux.courseed.projections.dtos.ReviewDto;
import com.api.flux.courseed.projections.dtos.UpdateReviewDto;
import com.api.flux.courseed.services.implementations.ReviewService;
import com.api.flux.courseed.services.implementations.ValidationService;

import reactor.core.publisher.Flux;
import reactor.core.publisher.Mono;

public class ReviewController {
    
    @Autowired
    private ReviewService reviewService;

    @Autowired
    private ValidationService validationService;

    public Mono<ServerResponse> getReviewsByCourseId(ServerRequest serverRequest) {
        return reviewService.getReviewsByCourseId(serverRequest.pathVariable("courseId"))
            .collectList().flatMap(list -> {
                if (!list.isEmpty()) {
                    return ServerResponse.ok()
                        .contentType(MediaType.APPLICATION_JSON)
                        .body(Flux.fromIterable(list), ReviewDto.class);
                } else {
                    return ServerResponse.notFound().build();
                }
            });
    }

    public Mono<ServerResponse> getReviewsByAuthUser(ServerRequest serverRequest) {
        return serverRequest.principal()
            .flatMap(principal -> reviewService.getReviewsByAuthUser(principal)
                .collectList().flatMap(list -> {
                    if (!list.isEmpty()) {
                        return ServerResponse.ok()
                            .contentType(MediaType.APPLICATION_JSON)
                            .body(Flux.fromIterable(list), ReviewDto.class);
                    } else {
                        return ServerResponse.notFound().build();
                    }
                })
            );
    }

    public Mono<ServerResponse> createReview(ServerRequest serverRequest) {
        return serverRequest.bodyToMono(CreateReviewDto.class)
            .doOnNext(validationService::validate)
            .flatMap(createReviewDto -> serverRequest.principal()
                .flatMap(principal -> reviewService.createReview(principal, createReviewDto)
                    .flatMap(review -> ServerResponse.ok().bodyValue(review))
                    .switchIfEmpty(ServerResponse.notFound().build())
                )
            );
    }

    public Mono<ServerResponse> updateReview(ServerRequest serverRequest) {
        return serverRequest.bodyToMono(UpdateReviewDto.class)
            .doOnNext(validationService::validate)
            .flatMap(updateReviewDto -> serverRequest.principal()
                .flatMap(principal -> reviewService.updateReview(principal, serverRequest.pathVariable("id"), updateReviewDto)
                    .flatMap(review -> ServerResponse.ok().bodyValue(review))
                    .switchIfEmpty(ServerResponse.notFound().build())
                )
            );
    }

    public Mono<ServerResponse> deleteReview(ServerRequest serverRequest) {
        return serverRequest.principal()
            .flatMap(principal -> reviewService.deleteReview(principal, serverRequest.pathVariable("id"))
                .flatMap(review -> ServerResponse.ok().bodyValue(review))
                .switchIfEmpty(ServerResponse.notFound().build())
            );
    }
}
