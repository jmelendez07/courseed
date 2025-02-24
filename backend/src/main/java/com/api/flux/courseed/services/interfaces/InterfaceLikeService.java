package com.api.flux.courseed.services.interfaces;

import java.security.Principal;

import org.springframework.data.domain.Page;

import com.api.flux.courseed.projections.dtos.LikeDto;
import com.api.flux.courseed.projections.dtos.SaveLikeDto;

import reactor.core.publisher.Flux;
import reactor.core.publisher.Mono;

public interface InterfaceLikeService {
    public Flux<LikeDto> getLikesByCourseId(String courseId);
    public Mono<Page<LikeDto>> getLikesByAuthUser(Principal principal, int size, int page);
    public Mono<Object> createLike(Principal principal, SaveLikeDto saveLikeDto);
    public Mono<Boolean> deleteLike(Principal principal, String id);
}
