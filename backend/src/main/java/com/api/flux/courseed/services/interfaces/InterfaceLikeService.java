package com.api.flux.courseed.services.interfaces;

import java.security.Principal;

import com.api.flux.courseed.projections.dtos.LikeDto;
import com.api.flux.courseed.projections.dtos.SaveLikeDto;

import reactor.core.publisher.Flux;
import reactor.core.publisher.Mono;

public interface InterfaceLikeService {
    public Flux<LikeDto> getLikesByCourseId(String courseId);
    public Flux<LikeDto> getLikesByAuthUser(Principal principal);
    public Mono<Object> createLike(Principal principal, SaveLikeDto saveLikeDto);
    public Mono<Boolean> deleteLike(Principal principal, String id);
}
