package com.api.flux.courseed.projections.dtos;

import java.io.Serializable;

import com.api.flux.courseed.projections.validators.groups.FirstValidationGroup;
import com.api.flux.courseed.projections.validators.groups.SecondValidationGroup;

import jakarta.validation.GroupSequence;
import jakarta.validation.constraints.DecimalMin;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

@Data
@GroupSequence({ SaveCourseDto.class, FirstValidationGroup.class, SecondValidationGroup.class })
public class SaveCourseDto implements Serializable {

    @NotBlank(message = "Para proceder, debes completar el campo correspondiente a la URL del curso.", groups = FirstValidationGroup.class)
    private String url;

    @NotBlank(message = "Para proceder, debes completar el campo correspondiente al titulo del curso.", groups = FirstValidationGroup.class)
    private String title;

    private String image;
    private String description;
    private String prerequisites;

    @NotBlank(message = "Para proceder, debes completar el campo correspondiente a la modalidad del curso.")
    private String modality;

    @NotNull(message = "Para proceder, debes completar el campo correspondiente al precio del curso.")
    @DecimalMin(value = "0.0", message = "No podemos aceptar un precio del curso menor a 0.0, Revisa el valor ingresado.")
    private Double price;

    @NotBlank(message = "Para proceder, debes completar el campo correspondiente a la duración del curso.")
    private String duration;

    @NotBlank(message = "Es importante que selecciones una categoria antes de continuar.")
    private String categoryId;

    @NotBlank(message = "Es importante que selecciones una institución antes de continuar.")
    private String institutionId;
}
