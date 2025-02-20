package com.api.flux.courseed.web.controllers;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.reactive.function.server.ServerRequest;
import org.springframework.web.reactive.function.server.ServerResponse;

import com.api.flux.courseed.projections.dtos.SaveCourseDto;
import com.api.flux.courseed.services.implementations.CourseService;
import com.api.flux.courseed.services.implementations.ValidationService;

import reactor.core.publisher.Mono;

public class CourseController {

    @Autowired
    private CourseService courseService;

    @Autowired
    private ValidationService validationService;

    public Mono<ServerResponse> getAllCourses(ServerRequest serverRequest) {
        return courseService
            .getAllCourses(
                Integer.parseInt(serverRequest.queryParam("page").orElse("0")), 
                Integer.parseInt(serverRequest.queryParam("size").orElse("10"))
            )
            .flatMap(courses -> ServerResponse.ok().bodyValue(courses))
            .switchIfEmpty(ServerResponse.notFound().build());
    }

    public Mono<ServerResponse> getCourseById(ServerRequest serverRequest) {
        return courseService.getCourseById(serverRequest.pathVariable("id"))
            .flatMap(course -> ServerResponse.ok().bodyValue(course))
            .switchIfEmpty(ServerResponse.notFound().build());
    }

    public Mono<ServerResponse> searchCoursesByText(ServerRequest serverRequest) {
        return courseService
            .searchCoursesByText(
                serverRequest.queryParam("text").orElse(""),
                Integer.parseInt(serverRequest.queryParam("page").orElse("0")), 
                Integer.parseInt(serverRequest.queryParam("size").orElse("10"))
            )
            .flatMap(courses -> ServerResponse.ok().bodyValue(courses))
            .switchIfEmpty(ServerResponse.notFound().build()); 
    }

    public Mono<ServerResponse> getCoursesByCategoryId(ServerRequest serverRequest) {
        return courseService
            .getCoursesByCategoryId(
                serverRequest.pathVariable("categoryId"),
                Integer.parseInt(serverRequest.queryParam("page").orElse("0")), 
                Integer.parseInt(serverRequest.queryParam("size").orElse("10"))
            )
            .flatMap(courses -> ServerResponse.ok().bodyValue(courses))
            .switchIfEmpty(ServerResponse.notFound().build());
    }

    public Mono<ServerResponse> getCoursesByInstitutionId(ServerRequest serverRequest) {
        return courseService
            .getCoursesByInstitutionId(
                serverRequest.pathVariable("institutionId"),
                Integer.parseInt(serverRequest.queryParam("page").orElse("0")), 
                Integer.parseInt(serverRequest.queryParam("size").orElse("10"))
            )
            .flatMap(courses -> ServerResponse.ok().bodyValue(courses))
            .switchIfEmpty(ServerResponse.notFound().build());
    }

    public Mono<ServerResponse> getTopCoursesWithReviewsAndLikes(ServerRequest serverRequest) {
        return courseService.getTopCoursesWithReviewsAndLikes(
            Integer.parseInt(serverRequest.queryParam("page").orElse("0")), 
            Integer.parseInt(serverRequest.queryParam("size").orElse("10"))
        )
        .flatMap(courses -> ServerResponse.ok().bodyValue(courses))
        .switchIfEmpty(ServerResponse.notFound().build());
    }

    public Mono<ServerResponse> createCourse(ServerRequest serverRequest) {
        return serverRequest.bodyToMono(SaveCourseDto.class)
            .doOnNext(validationService::validate)
            .flatMap(saveCourseDto -> courseService.createCourse(saveCourseDto)
                .flatMap(courseDto -> ServerResponse.ok().bodyValue(courseDto))
                .switchIfEmpty(ServerResponse.notFound().build())
            );
    }
    
    public Mono<ServerResponse> updateCourse(ServerRequest serverRequest) {
        return serverRequest.bodyToMono(SaveCourseDto.class)
            .doOnNext(validationService::validate)
            .flatMap(saveCourseDto -> courseService.updateCourse(serverRequest.pathVariable("id"), saveCourseDto)
                .flatMap(courseDto -> ServerResponse.ok().bodyValue(courseDto))
                .switchIfEmpty(ServerResponse.notFound().build())
            );
    }

    public Mono<ServerResponse> deleteCourse(ServerRequest serverRequest) {
        return courseService.deleteCourse(serverRequest.pathVariable("id"))
            .flatMap(c -> ServerResponse.ok().bodyValue(c))
            .switchIfEmpty(ServerResponse.notFound().build());
    }    
}
