package com.api.flux.courseed.services.interfaces;

import com.api.flux.courseed.projections.dtos.CourseDto;
import com.api.flux.courseed.projections.dtos.SaveCourseDto;

import reactor.core.publisher.Flux;
import reactor.core.publisher.Mono;

public interface InterfaceCourseService {
    public Flux<CourseDto> getAllCourses();
    public Flux<CourseDto> getCoursesByCategoryId(String categoryId);
    public Flux<CourseDto> getCoursesByInstitutionId(String institutionId);
    public Flux<CourseDto> searchCoursesByText(String text);
    public Mono<CourseDto> getCourseById(String id);
    public Mono<CourseDto> createCourse(SaveCourseDto saveCourseDto);
    public Mono<CourseDto> updateCourse(String id, SaveCourseDto saveCourseDto);
    public Mono<Boolean> deleteCourse(String id);
}
