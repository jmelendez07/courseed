package com.api.flux.courseed.persistence.documents;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import lombok.Data;

@Document(collection = "courses")
@Data
public class Course {
    @Id
    private String id;
    private String url;
    private String title;
    private String image;
    private String description;
    private String prerequisites;
    private Double price;
    private String duration;
    private String modality;
    private String categoryId;
    private String institutionId;
}
