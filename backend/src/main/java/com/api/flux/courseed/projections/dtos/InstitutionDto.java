package com.api.flux.courseed.projections.dtos;

import java.io.Serializable;

import lombok.Data;

@Data
public class InstitutionDto implements Serializable {
    private String id;
    private String name;
}
