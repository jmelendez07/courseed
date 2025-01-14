package com.api.flux.courseed.projections.dtos;

import java.io.Serializable;

import jakarta.validation.constraints.NotBlank;
import lombok.Data;

@Data
public class SaveInstitutionDto implements Serializable {

    @NotBlank(message = "El nombre de la institucion no puede estar vacio")
    private String name;
}
