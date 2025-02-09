package com.api.flux.courseed.persistence.repositories;

import org.springframework.data.domain.Pageable;
import org.springframework.data.mongodb.repository.ReactiveMongoRepository;
import org.springframework.stereotype.Repository;

import com.api.flux.courseed.persistence.documents.User;

import reactor.core.publisher.Flux;
import reactor.core.publisher.Mono;

@Repository
public interface UserRepository extends ReactiveMongoRepository<User, String> {
    Flux<User> findAllBy(Pageable pageable);
    Mono<User> findByEmail(String email);
    Mono<User> findByEmailAndIdNot(String email, String id);
}
