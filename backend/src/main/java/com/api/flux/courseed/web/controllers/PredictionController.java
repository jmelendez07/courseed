package com.api.flux.courseed.web.controllers;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.web.reactive.function.server.ServerRequest;
import org.springframework.web.reactive.function.server.ServerResponse;

import com.api.flux.courseed.projections.dtos.FormPredictionDto;
import com.api.flux.courseed.services.implementations.PredictionService;

import reactor.core.publisher.Mono;

import java.util.Map;

public class PredictionController {

    @Autowired
    private PredictionService predictionService;

    public Mono<ServerResponse> getUserCourseRecomended(ServerRequest serverRequest) {
        String userId = serverRequest.queryParam("userId").orElse("");
        String courseId = serverRequest.queryParam("courseId").orElse("");

        return predictionService.getUserCourseRecomended(userId, courseId)
            .flatMap(userCourseRecomended -> ServerResponse.ok().bodyValue(userCourseRecomended))
            .switchIfEmpty(ServerResponse.notFound().build());
    }

    public Mono<ServerResponse> getRecomendedCoursesByUser(ServerRequest serverRequest) {
        String userId = serverRequest.queryParam("userId").orElse("");
    
        return predictionService.getRecomendedCoursesByUser(userId)
            .flatMap(courses -> ServerResponse.ok().bodyValue(courses))
            .switchIfEmpty(ServerResponse.notFound().build());
    }

    public Mono<ServerResponse> predictCourseRecommendation(ServerRequest serverRequest) {
        return serverRequest.bodyToMono(FormPredictionDto.class)
            .flatMap(formData -> predictionService.predictCourseRecommendation(formData))
            .flatMap(recommendation -> ServerResponse.ok().bodyValue(recommendation))
            .onErrorResume(error -> {
                error.printStackTrace();
                return ServerResponse.badRequest()
                    .bodyValue("Error al procesar la predicción: " + error.getMessage());
            });
    }

    public Mono<ServerResponse> getTotalCoursesRecomended(ServerRequest serverRequest) {
        // Extract principal from the request
        return serverRequest.principal()
            .flatMap(principal -> predictionService.getTotalCoursesRecomended(principal)
                .flatMap(totalCourses -> ServerResponse.ok()
                    .contentType(MediaType.APPLICATION_JSON)
                    .bodyValue(Map.of("totalCourses", totalCourses))
                )
            );
    }
}
