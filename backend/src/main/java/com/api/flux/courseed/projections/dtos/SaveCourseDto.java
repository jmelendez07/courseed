package com.api.flux.courseed.projections.dtos;

import java.io.Serializable;

import com.api.flux.courseed.projections.validators.groups.FirstValidationGroup;
import com.api.flux.courseed.projections.validators.groups.SecondValidationGroup;

import jakarta.validation.GroupSequence;
import jakarta.validation.constraints.DecimalMin;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;

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

    public String getUrl() {
        return url;
    }

    public void setUrl(String url) {
        this.url = url;
    }

    public String getTitle() {
        return title;
    }

    public void setTitle(String title) {
        this.title = title;
    }

    public String getImage() {
        return image;
    }

    public void setImage(String image) {
        this.image = image;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public String getPrerequisites() {
        return prerequisites;
    }

    public void setPrerequisites(String prerequisites) {
        this.prerequisites = prerequisites;
    }

    public String getModality() {
        return modality;
    }

    public void setModality(String modality) {
        this.modality = modality;
    }

    public Double getPrice() {
        return price;
    }

    public void setPrice(Double price) {
        this.price = price;
    }

    public String getDuration() {
        return duration;
    }

    public void setDuration(String duration) {
        this.duration = duration;
    }

    public String getCategoryId() {
        return categoryId;
    }

    public void setCategoryId(String categoryId) {
        this.categoryId = categoryId;
    }

    public String getInstitutionId() {
        return institutionId;
    }

    public void setInstitutionId(String institutionId) {
        this.institutionId = institutionId;
    }
}
