package com.api.flux.courseed.web.controllers;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.reactive.function.server.ServerRequest;
import org.springframework.web.reactive.function.server.ServerResponse;

import com.api.flux.courseed.services.implementations.PredictionService;

import reactor.core.publisher.Mono;

public class PredictionController {

    @Autowired
    private PredictionService predictionService;
    
    public Mono<ServerResponse> getRecomendedCourses(ServerRequest serverRequest) {
        return serverRequest.principal()
            .flatMap(principal -> predictionService.recomendedCourses(principal)
                .flatMap(courses -> ServerResponse.ok().bodyValue(courses))
                .switchIfEmpty(ServerResponse.notFound().build())  
            );
    }
}
