package com.api.flux.courseed.projections.dtos;

import java.io.Serializable;

import com.api.flux.courseed.projections.validators.groups.FirstValidationGroup;
import com.api.flux.courseed.projections.validators.groups.SecondValidationGroup;

import jakarta.validation.GroupSequence;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import lombok.Data;

@Data
@GroupSequence({ LoginUserDto.class, FirstValidationGroup.class, SecondValidationGroup.class })
public class LoginUserDto implements Serializable {

    @NotBlank(message = "El email del usuario no puede estar vacio", groups = FirstValidationGroup.class)
    @Email(message = "El email del usuario no es valido", groups = SecondValidationGroup.class)
    private String email;

    @NotBlank(message = "La contraseña del usuario no puede estar vacia", groups = FirstValidationGroup.class)
    private String password;
}
