package com.api.flux.courseed.web.controllers;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.reactive.function.server.ServerRequest;
import org.springframework.web.reactive.function.server.ServerResponse;

import com.api.flux.courseed.projections.dtos.SaveInstitutionDto;
import com.api.flux.courseed.services.implementations.InstitutionService;
import com.api.flux.courseed.services.implementations.ValidationService;

import reactor.core.publisher.Mono;

public class InstitutionController {

    @Autowired
    private InstitutionService institutionService;

    @Autowired
    private ValidationService validationService;

    public Mono<ServerResponse> getAllInstitutions(ServerRequest serverRequest) {
        return institutionService
            .getAllInstitutions(
                Integer.parseInt(serverRequest.queryParam("page").orElse("0")), 
                Integer.parseInt(serverRequest.queryParam("size").orElse("10"))
            )
            .flatMap(institutions -> ServerResponse.ok().bodyValue(institutions))
            .switchIfEmpty(ServerResponse.notFound().build());
    }

    public Mono<ServerResponse> getInstitutionById(ServerRequest serverRequest) {
        return institutionService.getInstitutionById(serverRequest.pathVariable("id"))
            .flatMap(institutionDto -> ServerResponse.ok().bodyValue(institutionDto))
            .switchIfEmpty(ServerResponse.notFound().build());
    }
    
    public Mono<ServerResponse> getInstitutionByName(ServerRequest serverRequest) {
        return institutionService.getInstitutionByName(serverRequest.pathVariable("name"))
            .flatMap(institutionDto -> ServerResponse.ok().bodyValue(institutionDto))
            .switchIfEmpty(ServerResponse.notFound().build());
    }

    public Mono<ServerResponse> getInstitutionsWithCoursesCount(ServerRequest serverRequest) {
        return institutionService.getInstitutionsWithCoursesCount(
            Integer.parseInt(serverRequest.queryParam("page").orElse("0")), 
            Integer.parseInt(serverRequest.queryParam("size").orElse("10"))
        )
        .flatMap(institutions -> ServerResponse.ok().bodyValue(institutions))
        .switchIfEmpty(ServerResponse.notFound().build());
    }

    public Mono<ServerResponse> createInstitution(ServerRequest serverRequest) {
        return serverRequest.bodyToMono(SaveInstitutionDto.class)
            .doOnNext(validationService::validate)
            .flatMap(saveInstitutionDto -> institutionService.createInstitution(saveInstitutionDto)
                .flatMap(institutionDto -> ServerResponse.ok().bodyValue(institutionDto))
                .switchIfEmpty(ServerResponse.notFound().build())
            );
    }

    public Mono<ServerResponse> updateInstitution(ServerRequest serverRequest) {
        return serverRequest.bodyToMono(SaveInstitutionDto.class)
            .doOnNext(validationService::validate)
            .flatMap(saveInstitutionDto -> institutionService.updateInstitution(serverRequest.pathVariable("id"), saveInstitutionDto)
                .flatMap(institutionDto -> ServerResponse.ok().bodyValue(institutionDto))
                .switchIfEmpty(ServerResponse.notFound().build())
            );
    }

    public Mono<ServerResponse> deleteInstitution(ServerRequest serverRequest) {
        return institutionService.deleteInstitution(serverRequest.pathVariable("id"))
            .flatMap(i -> ServerResponse.ok().bodyValue(i))
            .switchIfEmpty(ServerResponse.notFound().build());
    }
}
