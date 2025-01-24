package com.api.flux.courseed.projections.dtos;

import com.api.flux.courseed.projections.validators.groups.FirstValidationGroup;
import com.api.flux.courseed.projections.validators.groups.SecondValidationGroup;

import jakarta.validation.GroupSequence;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.Data;

@Data
@GroupSequence({ RegisterUserDto.class, FirstValidationGroup.class, SecondValidationGroup.class })
public class RegisterUserDto {

    @NotBlank(message = "Para proceder, debes completar el campo correspondiente al correo electrónico del usuario.", groups = FirstValidationGroup.class)
    @Email(message = "Asegúrate de que el correo electrónico proporcionado sea correcto y válido.", groups = SecondValidationGroup.class)
    private String email;

    @NotBlank(message = "Para proceder, debes completar el campo correspondiente a la contraseña del usuario.", groups = FirstValidationGroup.class)
    @Size(min = 8, max = 20, message = "Es necesario que la contraseña que elijas tenga un mínimo de 8 y un máximo de 20 caracteres.", groups = SecondValidationGroup.class)
    private String password;

    @NotBlank(message = "Para proceder, debes completar el campo correspondiente a la confirmación de contraseña del usuario.", groups = FirstValidationGroup.class)
    private String confirmPassword;
}
