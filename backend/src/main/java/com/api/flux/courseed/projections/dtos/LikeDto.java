package com.api.flux.courseed.projections.dtos;

import java.io.Serializable;
import java.time.LocalDateTime;

import lombok.Data;

@Data
public class LikeDto implements Serializable {
    private String id;
    private CourseDto course;
    private UserDto user;
    private LocalDateTime createdAt;
}
