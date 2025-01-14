package com.api.flux.courseed.persistence.documents;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import lombok.Data;

@Document(collection = "contents")
@Data
public class Content {
    @Id
    private String id;
    private String description;
    private String courseId;
}
