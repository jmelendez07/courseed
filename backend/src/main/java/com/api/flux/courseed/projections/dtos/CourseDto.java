package com.api.flux.courseed.projections.dtos;

import java.io.Serializable;
import java.util.List;

import lombok.Data;

@Data
public class CourseDto implements Serializable {
    private String id;
    private String url;
    private String title;
    private String image;
    private String description;
    private String prerequisites;
    private Double price;
    private String duration;
    private CategoryDto category;
    private InstitutionDto institution;
    private List<ContentDto> contents;
    private List<LikeDto> likes;
    private List<ReviewDto> reviews;
}
