package com.api.flux.courseed.projections.dtos;

import com.api.flux.courseed.projections.validators.groups.FirstValidationGroup;
import com.api.flux.courseed.projections.validators.groups.SecondValidationGroup;

import jakarta.validation.GroupSequence;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import lombok.Data;

@Data
@GroupSequence({ RegisterUserDto.class, FirstValidationGroup.class, SecondValidationGroup.class })
public class RegisterUserDto {

    @NotBlank(message = "El email del usuario no puede estar vacio", groups = FirstValidationGroup.class)
    private String email;

    @NotBlank(message = "La contraseña del usuario no puede estar vacia", groups = FirstValidationGroup.class)
    @Min(value = 8, message = "La contraseña del usuario debe tener al menos 8 caracteres", groups = SecondValidationGroup.class)
    private String password;

    @NotBlank(message = "La confirmación de la contraseña del usuario no puede estar vacia", groups = FirstValidationGroup.class)
    private String confirmPassword;
}
