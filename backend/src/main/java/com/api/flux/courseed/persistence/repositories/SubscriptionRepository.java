package com.api.flux.courseed.persistence.repositories;

import org.springframework.data.mongodb.repository.ReactiveMongoRepository;
import org.springframework.stereotype.Repository;

import com.api.flux.courseed.persistence.documents.Subscription;
import reactor.core.publisher.Flux;
import reactor.core.publisher.Mono;

@Repository
public interface SubscriptionRepository extends ReactiveMongoRepository<Subscription, String> {
    Flux<Subscription> findByUserId(String userId);
    Mono<Long> countByUserId(String userId);
}
