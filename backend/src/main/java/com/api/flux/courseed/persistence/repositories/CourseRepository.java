package com.api.flux.courseed.persistence.repositories;

import org.springframework.data.domain.Pageable;
import org.springframework.data.mongodb.repository.Query;
import org.springframework.data.mongodb.repository.ReactiveMongoRepository;
import org.springframework.stereotype.Repository;

import com.api.flux.courseed.persistence.documents.Course;

import reactor.core.publisher.Flux;

@Repository
public interface CourseRepository extends ReactiveMongoRepository<Course, String> {

    Flux<Course> findAllBy(Pageable pageable);

    @Query("{ '$or': [ { 'title': { '$regex': ?0, '$options': 'i' } }, { 'description': { '$regex': ?0, '$options': 'i' } }, { 'duration': { '$regex': ?0, '$options': 'i' } } ] }")
    Flux<Course> searchCourses(String text, Pageable pageable);

    Flux<Course> findByCategoryId(String categoryId, Pageable pageable);
    Flux<Course> findByInstitutionId(String institutionId, Pageable pageable);
}
