package com.api.flux.courseed.persistence.repositories;

import org.springframework.data.domain.Pageable;
import org.springframework.data.mongodb.repository.ReactiveMongoRepository;
import org.springframework.stereotype.Repository;

import com.api.flux.courseed.persistence.documents.SearchHistory;

import reactor.core.publisher.Flux;

@Repository
public interface SearchHistoryRepository extends ReactiveMongoRepository<SearchHistory, String> {
    Flux<SearchHistory> findByUserIdOrderByCreatedAtDesc(String userId);
    Flux<SearchHistory> findByUserIdOrderByCreatedAtDesc(String userId, Pageable pageable);
}
