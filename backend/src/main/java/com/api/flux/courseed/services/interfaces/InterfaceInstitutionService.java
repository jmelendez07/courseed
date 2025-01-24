package com.api.flux.courseed.services.interfaces;

import com.api.flux.courseed.projections.dtos.InstitutionDto;
import com.api.flux.courseed.projections.dtos.SaveInstitutionDto;

import reactor.core.publisher.Flux;
import reactor.core.publisher.Mono;

public interface InterfaceInstitutionService {
    Flux<InstitutionDto> getAllInstitutions();
    Mono<InstitutionDto> getInstitutionById(String id);
    Mono<InstitutionDto> getInstitutionByName(String name);
    Mono<Object> createInstitution(SaveInstitutionDto saveInstitutionDto);
    Mono<Object> updateInstitution(String id, SaveInstitutionDto saveInstitutionDto);
    Mono<Boolean> deleteInstitution(String id);
}
