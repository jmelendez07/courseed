package com.api.flux.courseed.projections.dtos;

import java.io.Serializable;

import jakarta.validation.constraints.NotBlank;
import lombok.Data;

@Data
public class SaveCategoryDto implements Serializable {

    @NotBlank(message = "Para proceder, debes completar el campo correspondiente al nombre de la categoria.")
    private String name;

}
