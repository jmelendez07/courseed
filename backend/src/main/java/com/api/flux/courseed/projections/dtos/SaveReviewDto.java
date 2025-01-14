package com.api.flux.courseed.projections.dtos;

import java.io.Serializable;

import com.api.flux.courseed.projections.validators.groups.FirstValidationGroup;
import com.api.flux.courseed.projections.validators.groups.SecondValidationGroup;
import com.api.flux.courseed.projections.validators.groups.ThirdValidationGroup;

import jakarta.validation.GroupSequence;
import jakarta.validation.constraints.Max;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

@Data
@GroupSequence({ SaveReviewDto.class, FirstValidationGroup.class, SecondValidationGroup.class, ThirdValidationGroup.class })
public class SaveReviewDto implements Serializable {

    @NotBlank(message = "El id del usuario no puede estar vacio", groups = { FirstValidationGroup.class })
    private String userId;

    @NotBlank(message = "El id del curso no puede estar vacio", groups = { FirstValidationGroup.class })
    private String courseId;

    @NotBlank(message = "El contenido de la reseña no puede estar vacio", groups = { FirstValidationGroup.class })
    private String content;

    @NotNull(message = "La calificación no puede estar vacia", groups = { FirstValidationGroup.class })
    @Min(value = 1, message = "La calificación debe ser mayor o igual a 1", groups = { SecondValidationGroup.class })
    @Max(value = 5, message = "La calificación debe ser menor o igual a 5", groups = { ThirdValidationGroup.class })
    private int rating;
}