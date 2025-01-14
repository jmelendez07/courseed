package com.api.flux.courseed.projections.dtos;

import java.io.Serializable;

import lombok.Data;

@Data
public class CategoryDto implements Serializable {
    private String id;
    private String name;
}
