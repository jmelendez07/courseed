package com.api.flux.courseed.persistence.repositories;

import org.springframework.data.domain.Pageable;
import org.springframework.data.mongodb.repository.ReactiveMongoRepository;

import com.api.flux.courseed.persistence.documents.Reaction;

import reactor.core.publisher.Flux;
import reactor.core.publisher.Mono;

public interface ReactionRepository extends ReactiveMongoRepository<Reaction, String> {
    Mono<Long> countByCourseId(String courseId);
    Flux<Reaction> findByCourseId(String courseId);
    Flux<Reaction> findByCourseId(String courseId, Pageable pageable);
    Mono<Reaction> findByCourseIdAndUserId(String courseId, String userId);
    Flux<Reaction> findByUserId(String userId);
    Flux<Reaction> findByType(String type);
}
