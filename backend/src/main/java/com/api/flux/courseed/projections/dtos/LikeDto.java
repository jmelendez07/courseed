package com.api.flux.courseed.projections.dtos;

import java.io.Serializable;

import lombok.Data;

@Data
public class LikeDto implements Serializable {
    private String id;
    private CourseDto course;
    private UserDto user;
    private String createdAt;
}
