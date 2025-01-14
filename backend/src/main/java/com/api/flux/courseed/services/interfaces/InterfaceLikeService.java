package com.api.flux.courseed.services.interfaces;

import com.api.flux.courseed.projections.dtos.LikeDto;
import com.api.flux.courseed.projections.dtos.SaveLikeDto;

import reactor.core.publisher.Flux;
import reactor.core.publisher.Mono;

public interface InterfaceLikeService {
    public Flux<LikeDto> getLikesByCourseId(String courseId);
    public Flux<LikeDto> getLikesByUserId(String userId);    
    public Mono<LikeDto> getLikeById(String id);
    public Mono<LikeDto> createLike(SaveLikeDto saveLikeDto);
    public Mono<LikeDto> updateLike(String id, SaveLikeDto saveLikeDto);
    public Mono<Void> deleteLike(String id);
}
