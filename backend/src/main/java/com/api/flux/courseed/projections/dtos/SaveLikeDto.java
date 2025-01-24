package com.api.flux.courseed.projections.dtos;

import java.io.Serializable;

import jakarta.validation.constraints.NotBlank;
import lombok.Data;

@Data
public class SaveLikeDto implements Serializable {
    @NotBlank(message = "Es importante que selecciones un curso antes de continuar.")
    private String courseId;
}
