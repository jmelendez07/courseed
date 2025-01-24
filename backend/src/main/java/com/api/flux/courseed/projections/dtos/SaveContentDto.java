package com.api.flux.courseed.projections.dtos;

import java.io.Serializable;

import jakarta.validation.constraints.NotBlank;
import lombok.Data;

@Data
public class SaveContentDto implements Serializable {

    @NotBlank(message = "Es importante que selecciones un curso antes de continuar.")
    private String courseId;   

    @NotBlank(message = "Para proceder, debes completar el campo correspondiente a la descripción del contenido.")
    private String description;
}
