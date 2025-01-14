package com.api.flux.courseed.projections.dtos;

import java.io.Serializable;
import java.time.LocalDateTime;

import lombok.Data;

@Data
public class ReviewDto implements Serializable {
    private String id;
    private UserDto user;
    private CourseDto course;
    private String content;
    private int rating;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
}
