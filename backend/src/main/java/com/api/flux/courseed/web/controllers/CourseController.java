package com.api.flux.courseed.web.controllers;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.api.flux.courseed.projections.dtos.CourseDto;
import com.api.flux.courseed.projections.dtos.SaveCourseDto;
import com.api.flux.courseed.services.implementations.CourseService;

import jakarta.validation.Valid;
import jakarta.validation.constraints.NotBlank;
import reactor.core.publisher.Flux;
import reactor.core.publisher.Mono;

import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;

@RestController
@RequestMapping("/courses")
public class CourseController {

    @Autowired
    private CourseService courseService;

    @GetMapping
    public Flux<CourseDto> getAllCourses() {
        return courseService.getAllCourses();
    }

    @GetMapping("/category/{id}")
    public Flux<CourseDto> getCoursesByCategoryId(@PathVariable String id) {
        return courseService.getCoursesByCategoryId(id);
    }

    @GetMapping("/institution/{id}")
    public Flux<CourseDto> getCoursesByInstitutionId(@PathVariable String id) {
        return courseService.getCoursesByInstitutionId(id);
    }

    @GetMapping("/search")
    public Flux<CourseDto> searchCoursesByText(@Valid @NotBlank(message = "texto requerido") @RequestParam String text) {
        return courseService.searchCoursesByText(text);
    }
    
    @GetMapping("/{id}")
    public Mono<ResponseEntity<CourseDto>> getCourseById(@PathVariable String id) {
        return courseService.getCourseById(id)
            .map(course -> ResponseEntity.ok(course))
            .defaultIfEmpty(ResponseEntity.notFound().build());
    }

    @PostMapping
    public Mono<ResponseEntity<CourseDto>> createCourse(@Valid @RequestBody SaveCourseDto saveCourseDto) {
        return courseService.createCourse(saveCourseDto)
            .map(c -> ResponseEntity.ok(c))
            .defaultIfEmpty(ResponseEntity.notFound().build());
    }
    
    @PutMapping("/{id}")
    public Mono<ResponseEntity<CourseDto>> updateCourse(@PathVariable String id, @Valid @RequestBody SaveCourseDto saveCourseDto) {
        return courseService.updateCourse(id, saveCourseDto)
            .map(c -> ResponseEntity.ok(c))
            .defaultIfEmpty(ResponseEntity.notFound().build());
    }

    @DeleteMapping("/{id}")
    public Mono<Void> deleteCourse(@PathVariable String id) {
        return courseService.deleteCourse(id);
    }    
}
