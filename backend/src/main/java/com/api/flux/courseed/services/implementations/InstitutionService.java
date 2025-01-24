package com.api.flux.courseed.services.implementations;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.api.flux.courseed.persistence.repositories.InstitutionRepository;
import com.api.flux.courseed.projections.dtos.InstitutionDto;
import com.api.flux.courseed.projections.dtos.SaveInstitutionDto;
import com.api.flux.courseed.projections.mappers.InstitutionMapper;
import com.api.flux.courseed.services.interfaces.InterfaceInstitutionService;
import com.api.flux.courseed.web.exceptions.CustomWebExchangeBindException;

import reactor.core.publisher.Flux;
import reactor.core.publisher.Mono;

@Service
public class InstitutionService implements InterfaceInstitutionService {

    @Autowired
    private InstitutionRepository institutionRepository;

    @Autowired
    private InstitutionMapper institutionMapper;    

    @Override
    public Flux<InstitutionDto> getAllInstitutions() {
        return institutionRepository.findAll()
            .map(institutionMapper::toInstitutionDto);
    }

    @Override
    public Mono<InstitutionDto> getInstitutionById(String id) {
        return institutionRepository.findById(id)
            .map(institutionMapper::toInstitutionDto)
            .switchIfEmpty(Mono.error(
                new CustomWebExchangeBindException(
                    id,
                    "institutionId", 
                    "No hemos podido encontrar la institución indicada. Te sugerimos que verifiques la información y lo intentes de nuevo."
                ).getWebExchangeBindException())
            );
    }

    @Override
    public Mono<InstitutionDto> getInstitutionByName(String name) {
        return institutionRepository.findByName(name)
            .map(institutionMapper::toInstitutionDto)
            .switchIfEmpty(Mono.error(
                new CustomWebExchangeBindException(
                    name, 
                    "name", 
                    "No hemos podido encontrar la institución indicada por su nombre. Te sugerimos que verifiques y lo intentes nuevamente."
                ).getWebExchangeBindException()
            ));
    }

    @Override
    public Mono<Object> createInstitution(SaveInstitutionDto saveInstitutionDto) {
        return institutionRepository.findByName(saveInstitutionDto.getName())
            .flatMap(institution -> Mono.error(
                new CustomWebExchangeBindException(
                    saveInstitutionDto.getName(), 
                    "name", 
                    "La institución que has mencionado ya está registrada. Asegúrate de elegir un nombre diferente e intenta nuevamente."
                ).getWebExchangeBindException()
            ))
            .switchIfEmpty(institutionRepository.save(institutionMapper.toInstitution(saveInstitutionDto))
                .map(institutionMapper::toInstitutionDto)
            );
    }

    @Override
    public Mono<Object> updateInstitution(String id, SaveInstitutionDto saveInstitutionDto) {
        return institutionRepository.findByName(saveInstitutionDto.getName())
            .flatMap(institutionByName -> Mono.error(
                new CustomWebExchangeBindException(
                    saveInstitutionDto.getName(), 
                    "name", 
                    "La institución que has mencionado ya está registrada. Asegúrate de elegir un nombre diferente e intenta nuevamente."
                ).getWebExchangeBindException()
            ))
            .switchIfEmpty(institutionRepository.findById(id)
                .flatMap(institution -> {
                    institution.setName(saveInstitutionDto.getName());
                    return institutionRepository.save(institution)
                        .map(institutionMapper::toInstitutionDto);
                })
                .switchIfEmpty(Mono.error(
                    new CustomWebExchangeBindException(
                        id, 
                        "institutionId", 
                        "No hemos podido encontrar la institución indicada. Te sugerimos que verifiques la información y lo intentes de nuevo."
                    ).getWebExchangeBindException()
                ))
            );
    }

    @Override
    public Mono<Boolean> deleteInstitution(String id) {
        return institutionRepository.findById(id)
            .flatMap(institution -> 
                institutionRepository.deleteById(id)
                    .then(Mono.just(true))
            )
            .switchIfEmpty(Mono.error(
                new CustomWebExchangeBindException(
                    id, 
                    "institutionId", 
                    "No hemos podido encontrar la institución indicada. Te sugerimos que verifiques la información y lo intentes de nuevo."
                ).getWebExchangeBindException())
            );
    }
    
}
