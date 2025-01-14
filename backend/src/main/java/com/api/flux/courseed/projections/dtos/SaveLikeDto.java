package com.api.flux.courseed.projections.dtos;

import java.io.Serializable;

import jakarta.validation.constraints.NotBlank;
import lombok.Data;

@Data
public class SaveLikeDto implements Serializable {

    @NotBlank(message = "El id del usuario no puede estar vacio")
    private String userId;

    @NotBlank(message = "El id del curso no puede estar vacio")
    private String courseId;
}
