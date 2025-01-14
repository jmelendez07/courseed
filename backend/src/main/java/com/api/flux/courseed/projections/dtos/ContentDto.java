package com.api.flux.courseed.projections.dtos;

import java.io.Serializable;

import lombok.Data;

@Data
public class ContentDto implements Serializable {
    private String id;
    private String description;
    private String courseId;
}
