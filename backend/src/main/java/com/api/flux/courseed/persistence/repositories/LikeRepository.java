package com.api.flux.courseed.persistence.repositories;

import org.springframework.data.mongodb.repository.ReactiveMongoRepository;
import org.springframework.stereotype.Repository;

import com.api.flux.courseed.persistence.documents.Like;

import reactor.core.publisher.Flux;
import reactor.core.publisher.Mono;

@Repository
public interface LikeRepository extends ReactiveMongoRepository<Like, String> {
    Flux<Like> findByCourseId(String courseId);
    Flux<Like> findByUserId(String userId);
    Mono<Like> findByUserIdAndCourseId(String userId, String courseId);
}
