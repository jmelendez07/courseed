package com.api.flux.courseed.web.controllers;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.api.flux.courseed.projections.dtos.InstitutionDto;
import com.api.flux.courseed.projections.dtos.SaveInstitutionDto;
import com.api.flux.courseed.services.implementations.InstitutionService;

import jakarta.validation.Valid;
import reactor.core.publisher.Flux;
import reactor.core.publisher.Mono;

import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.PutMapping;

@RestController
@RequestMapping("/institutions")
public class InstitutionController {

    @Autowired
    private InstitutionService institutionService;

    @GetMapping
    public Flux<InstitutionDto> getAllInstitutions() {
        return institutionService.getAllInstitutions();
    }

    @GetMapping("/{id}")
    public Mono<ResponseEntity<InstitutionDto>> getInstitutionById(@PathVariable String id) {
        return institutionService.getInstitutionById(id)
            .map(institution -> ResponseEntity.ok(institution))
            .defaultIfEmpty(ResponseEntity.notFound().build());
    }
    
    @GetMapping("/name/{name}")
    public Mono<ResponseEntity<InstitutionDto>> getInstitutionByName(@PathVariable String name) {
        return institutionService.getInstitutionByName(name)
            .map(institution -> ResponseEntity.ok(institution))
            .defaultIfEmpty(ResponseEntity.notFound().build());
    }

    @PostMapping
    public Mono<ResponseEntity<InstitutionDto>> createInstitution(@Valid @RequestBody SaveInstitutionDto saveInstitutionDto) {
        return institutionService.createInstitution(saveInstitutionDto)
            .map(i -> new ResponseEntity<>(i, HttpStatus.CREATED))
            .defaultIfEmpty(ResponseEntity.notFound().build());
    }

    @PutMapping("/{id}")
    public Mono<ResponseEntity<InstitutionDto>> updateInstitution(@PathVariable String id, @Valid @RequestBody SaveInstitutionDto saveInstitutionDto) {
        return institutionService.updateInstitution(id, saveInstitutionDto)
            .map(i -> ResponseEntity.ok(i))
            .defaultIfEmpty(ResponseEntity.notFound().build());
    }

    @DeleteMapping("/{id}")
    public Mono<ResponseEntity<Void>> deleteInstitution(@PathVariable String id) {
        return institutionService.deleteInstitution(id)
            .map(i -> ResponseEntity.ok(i));
    }
}
