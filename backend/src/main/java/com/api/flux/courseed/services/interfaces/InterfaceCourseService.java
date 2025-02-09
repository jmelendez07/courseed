package com.api.flux.courseed.services.interfaces;

import org.springframework.data.domain.Page;

import com.api.flux.courseed.projections.dtos.CourseDto;
import com.api.flux.courseed.projections.dtos.SaveCourseDto;

import reactor.core.publisher.Mono;

public interface InterfaceCourseService {
    public Mono<Page<CourseDto>> getAllCourses(int page, int size);
    public Mono<Page<CourseDto>> getCoursesByCategoryId(String categoryId, int page, int size);
    public Mono<Page<CourseDto>> getCoursesByInstitutionId(String institutionId, int page, int size);
    public Mono<Page<CourseDto>> searchCoursesByText(String text, int page, int size);
    public Mono<CourseDto> getCourseById(String id);
    public Mono<CourseDto> createCourse(SaveCourseDto saveCourseDto);
    public Mono<CourseDto> updateCourse(String id, SaveCourseDto saveCourseDto);
    public Mono<Boolean> deleteCourse(String id);
}
