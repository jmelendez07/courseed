package com.api.flux.courseed.projections.dtos;

import java.io.Serializable;

import jakarta.validation.constraints.NotBlank;

public class SaveInstitutionDto implements Serializable {

    @NotBlank(message = "Para proceder, debes completar el campo correspondiente al nombre de la institución.")
    private String name;

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }
}
