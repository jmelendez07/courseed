package com.api.flux.courseed.projections.mappers;

import org.mapstruct.Mapper;
import org.mapstruct.Mapping;

import com.api.flux.courseed.persistence.documents.Institution;
import com.api.flux.courseed.projections.dtos.InstitutionDto;
import com.api.flux.courseed.projections.dtos.SaveInstitutionDto;

@Mapper(componentModel = "spring")
public interface InstitutionMapper {
    InstitutionDto toInstitutionDto(Institution institution);

    @Mapping(target = "id", ignore = true)
    Institution toInstitution(SaveInstitutionDto saveInstitutionDto);
}
