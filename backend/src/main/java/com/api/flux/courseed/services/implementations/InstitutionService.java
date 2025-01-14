package com.api.flux.courseed.services.implementations;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.api.flux.courseed.persistence.repositories.InstitutionRepository;
import com.api.flux.courseed.projections.dtos.InstitutionDto;
import com.api.flux.courseed.projections.dtos.SaveInstitutionDto;
import com.api.flux.courseed.projections.mappers.InstitutionMapper;
import com.api.flux.courseed.services.interfaces.InterfaceInstitutionService;

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
            .map(institutionMapper::toInstitutionDto);
    }

    @Override
    public Mono<InstitutionDto> getInstitutionByName(String name) {
        return institutionRepository.findByName(name)
            .map(institutionMapper::toInstitutionDto);
    }

    @Override
    public Mono<InstitutionDto> createInstitution(SaveInstitutionDto saveInstitutionDto) {
        return institutionRepository.save(institutionMapper.toInstitution(saveInstitutionDto))
            .map(institutionMapper::toInstitutionDto);
    }

    @Override
    public Mono<InstitutionDto> updateInstitution(String id, SaveInstitutionDto saveInstitutionDto) {
        return institutionRepository.findById(id)
            .flatMap(i -> {
                i.setName(saveInstitutionDto.getName());
                return institutionRepository.save(i);
            })
            .map(institutionMapper::toInstitutionDto)
            .onErrorReturn(new InstitutionDto());
    }

    @Override
    public Mono<Void> deleteInstitution(String id) {
        return institutionRepository.deleteById(id);
    }
    
}
