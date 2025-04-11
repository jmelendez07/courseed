package com.api.flux.courseed.services.interfaces;

import java.security.Principal;
import java.util.List;

import com.api.flux.courseed.projections.dtos.CourseDto;

import reactor.core.publisher.Mono;

public interface InterfacePredictionService {
    Mono<List<CourseDto>> recomendedCourses(Principal principal);
}
