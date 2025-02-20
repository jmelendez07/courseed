package com.api.flux.courseed.services.interfaces;

import java.util.List;

import org.springframework.data.domain.Page;

import com.api.flux.courseed.projections.dtos.InstitutionDto;
import com.api.flux.courseed.projections.dtos.InstitutionWithCoursesCountDto;
import com.api.flux.courseed.projections.dtos.SaveInstitutionDto;
import reactor.core.publisher.Mono;

public interface InterfaceInstitutionService {
    Mono<Page<InstitutionDto>> getAllInstitutions(int page, int size);
    Mono<List<InstitutionWithCoursesCountDto>> getInstitutionsWithCoursesCount(int page, int size);
    Mono<InstitutionDto> getInstitutionById(String id);
    Mono<InstitutionDto> getInstitutionByName(String name);
    Mono<Object> createInstitution(SaveInstitutionDto saveInstitutionDto);
    Mono<Object> updateInstitution(String id, SaveInstitutionDto saveInstitutionDto);
    Mono<Boolean> deleteInstitution(String id);
}
