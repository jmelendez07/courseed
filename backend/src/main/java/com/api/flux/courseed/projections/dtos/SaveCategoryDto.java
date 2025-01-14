package com.api.flux.courseed.projections.dtos;

import java.io.Serializable;

import jakarta.validation.constraints.NotBlank;
import lombok.Data;

@Data
public class SaveCategoryDto implements Serializable {

    @NotBlank(message = "El nombre de la categoria no puede estar vacio")
    private String name;

}
