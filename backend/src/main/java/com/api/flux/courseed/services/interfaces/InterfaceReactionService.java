package com.api.flux.courseed.services.interfaces;

import java.security.Principal;

import org.springframework.data.domain.Page;

import com.api.flux.courseed.projections.dtos.ReactionDto;
import com.api.flux.courseed.projections.dtos.SaveReactionDto;

import reactor.core.publisher.Mono;

public interface InterfaceReactionService {
    Mono<Page<ReactionDto>> findReactionsByCourseId(String courseId, int page, int size);
    Mono<Object> createReaction(Principal principal, SaveReactionDto saveReactionDto);
    Mono<ReactionDto> updateReaction(Principal principal, SaveReactionDto saveReactionDto); 
    Mono<Boolean> deleteReaction(Principal principal, String courseId);
}
