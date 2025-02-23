package com.api.flux.courseed.services.interfaces;

import java.util.List;

import org.springframework.data.domain.Page;

import com.api.flux.courseed.projections.dtos.CourseDto;
import com.api.flux.courseed.projections.dtos.CourseWithRatingAvg;
import com.api.flux.courseed.projections.dtos.CourseWithReviewsCountAndLikesCount;
import com.api.flux.courseed.projections.dtos.SaveCourseDto;

import reactor.core.publisher.Mono;

public interface InterfaceCourseService {
    Mono<List<CourseWithReviewsCountAndLikesCount>> getTopCoursesWithReviewsAndLikes(int page, int size);
    Mono<List<CourseWithRatingAvg>> getTopCoursesWithRatingAvg(int size);
    Mono<Page<CourseDto>> getAllCourses(int page, int size);
    Mono<Page<CourseDto>> getCoursesByCategoryId(String categoryId, int page, int size);
    Mono<Page<CourseDto>> getCoursesByInstitutionId(String institutionId, int page, int size);
    Mono<Page<CourseDto>> searchCoursesByText(String text, int page, int size);
    Mono<CourseDto> getCourseById(String id);
    Mono<CourseDto> createCourse(SaveCourseDto saveCourseDto);
    Mono<CourseDto> updateCourse(String id, SaveCourseDto saveCourseDto);
    Mono<Boolean> deleteCourse(String id);
}
