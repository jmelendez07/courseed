package com.api.flux.courseed.projections.dtos;

import java.util.List;

import com.api.flux.courseed.projections.validators.groups.FirstValidationGroup;
import com.api.flux.courseed.projections.validators.groups.SecondValidationGroup;
import com.api.flux.courseed.projections.validators.groups.ThirdValidationGroup;

import jakarta.validation.GroupSequence;
import jakarta.validation.constraints.DecimalMin;
import jakarta.validation.constraints.Max;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotEmpty;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;

@GroupSequence({ SaveProfileDto.class, FirstValidationGroup.class, SecondValidationGroup.class, ThirdValidationGroup.class })
public class SaveProfileDto {

    @NotBlank(message = "Debes completar el campo correspondiente al nivel de conocimiento.", groups = FirstValidationGroup.class)
    private String knowledgeLevel;

    @NotNull(message = "Para proceder, debes completar el campo correspondiente a las horas de estudio.", groups = { FirstValidationGroup.class })
    @Min(value = 0, message = "Las horas de estudio deben ser mayores o iguales a 0.", groups = { SecondValidationGroup.class })
    @Max(value = 8, message = "Las horas de estudio deben ser menores o iguales a 8.", groups = { ThirdValidationGroup.class })
    private int availableHoursTime;

    @NotBlank(message = "Debes completar el campo correspondiente a la modalidad.", groups = FirstValidationGroup.class)
    private String platformPrefered;

    @NotNull(message = "Debes completar el campo correspondiente al presupuesto aproximado.", groups = FirstValidationGroup.class)
    @DecimalMin(value = "0.0", message = "No podemos aceptar un presupuesto aproximado menor a 0.0, Revisa el valor ingresado.", groups = SecondValidationGroup.class)
    private Double budget;

    @NotEmpty(message = "Es importante que selecciones las areas de interes antes de continuar.", groups = FirstValidationGroup.class)
    @Size(min = 1, message = "Es importante que selecciones las areas de interes antes de continuar.", groups = SecondValidationGroup.class)
    private List<@NotBlank(message = "Es importante que selecciones las areas de interes antes de continuar.", groups = ThirdValidationGroup.class) String> interests;
 
    public String getKnowledgeLevel() {
        return knowledgeLevel;
    }

    public void setKnowledgeLevel(String knowledgeLevel) {
        this.knowledgeLevel = knowledgeLevel;
    }

    public int getAvailableHoursTime() {
        return availableHoursTime;
    }

    public void setAvailableHoursTime(int availableHoursTime) {
        this.availableHoursTime = availableHoursTime;
    }

    public String getPlatformPrefered() {
        return platformPrefered;
    }

    public void setPlatformPrefered(String platformPrefered) {
        this.platformPrefered = platformPrefered;
    }

    public Double getBudget() {
        return budget;
    }

    public void setBudget(Double budget) {
        this.budget = budget;
    }

    public List<String> getInterests() {
        return interests;
    }

    public void setInterests(List<String> interests) {
        this.interests = interests;
    }
}
