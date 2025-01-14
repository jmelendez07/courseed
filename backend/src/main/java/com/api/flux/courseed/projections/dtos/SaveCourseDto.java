package com.api.flux.courseed.projections.dtos;

import java.io.Serializable;

import jakarta.validation.constraints.NotBlank;
import lombok.Data;

@Data
public class SaveCourseDto implements Serializable {

    @NotBlank(message = "La url del curso no puede estar vacia")
    private String url;

    @NotBlank(message = "El titulo del curso no puede estar vacio")
    private String title;

    private String image;
    private String description;
    private String prerequisites;

    @NotBlank(message = "El precio del curso no puede estar vacio")
    private Double price;

    @NotBlank(message = "La duracion del curso no puede estar vacia")
    private String duration;

    @NotBlank(message = "El id de la categoria no puede estar vacio")
    private String categoryId;

    @NotBlank(message = "El id de la institucion no puede estar vacio")
    private String institutionId;
}
