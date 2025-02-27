package com.api.flux.courseed.web.controllers;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.MediaType;
import org.springframework.web.reactive.function.server.ServerRequest;
import org.springframework.web.reactive.function.server.ServerResponse;

import com.api.flux.courseed.projections.dtos.LikeDto;
import com.api.flux.courseed.projections.dtos.SaveLikeDto;
import com.api.flux.courseed.services.implementations.LikeService;
import com.api.flux.courseed.services.implementations.ValidationService;

import reactor.core.publisher.Flux;
import reactor.core.publisher.Mono;

public class LikeController {

    @Autowired
    private LikeService likeService;

    @Autowired
    private ValidationService validationService;

    public Mono<ServerResponse> getTotalLikes(ServerRequest serverRequest) {
        return likeService.getTotalLikes()
            .flatMap(user -> ServerResponse.ok().bodyValue(user))
            .switchIfEmpty(ServerResponse.notFound().build());
    } 

    public Mono<ServerResponse> getLikesByCourseId(ServerRequest serverRequest) {
        return likeService.getLikesByCourseId(serverRequest.pathVariable("courseId"))
            .collectList().flatMap(list -> {
                if (!list.isEmpty()) {
                    return ServerResponse.ok()
                        .contentType(MediaType.APPLICATION_JSON)
                        .body(Flux.fromIterable(list), LikeDto.class);
                } else {
                    return ServerResponse.notFound().build();
                }
            });
    }

    public Mono<ServerResponse> getLikesByAuthUser(ServerRequest serverRequest) {
        return serverRequest.principal()
            .flatMap(principal -> likeService.getLikesByAuthUser(
                principal,
                Integer.parseInt(serverRequest.queryParam("page").orElse("0")), 
                Integer.parseInt(serverRequest.queryParam("size").orElse("10"))
            ))
            .flatMap(likes -> ServerResponse.ok().bodyValue(likes))
            .switchIfEmpty(ServerResponse.notFound().build()); 
    }

    public Mono<ServerResponse> createLike(ServerRequest serverRequest) {
        return serverRequest.bodyToMono(SaveLikeDto.class)
            .doOnNext(validationService::validate)
            .flatMap(saveLikeDto -> serverRequest.principal()
                .flatMap(principal -> likeService.createLike(principal, saveLikeDto)
                    .flatMap(like -> ServerResponse.ok().bodyValue(like))
                    .switchIfEmpty(ServerResponse.notFound().build())
                )
            );
    }

    public Mono<ServerResponse> deleteLike(ServerRequest serverRequest) {
        return serverRequest.principal()
            .flatMap(principal -> likeService.deleteLike(principal, serverRequest.pathVariable("id"))
                .flatMap(like -> ServerResponse.ok().bodyValue(like))
                .switchIfEmpty(ServerResponse.notFound().build())
            );
    }

}