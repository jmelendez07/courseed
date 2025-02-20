package com.api.flux.courseed.persistence.repositories;

import org.springframework.data.domain.Pageable;
import org.springframework.data.mongodb.repository.ReactiveMongoRepository;
import org.springframework.stereotype.Repository;
import com.api.flux.courseed.persistence.documents.Review;
import reactor.core.publisher.Flux;
import reactor.core.publisher.Mono;

@Repository
public interface ReviewRepository extends ReactiveMongoRepository<Review, String> {
    Flux<Review> findAllBy(Pageable pageable);
    Flux<Review> findByCourseId(String courseId);
    Flux<Review> findByCourseId(String courseId, Pageable pageable);
    Flux<Review> findByUserId(String userId, Pageable pageable);
    Mono<Review> findByUserIdAndCourseId(String userId, String courseId);
    Mono<Long> countByCourseId(String courseId);
}
