package com.api.flux.courseed.persistence.documents;

import java.time.LocalDateTime;

import org.springframework.data.annotation.CreatedDate;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import lombok.Data;

@Document(collection = "likes")
@Data
public class Like {
    
    @Id
    private String id;
    private String userId;
    private String courseId;

    @CreatedDate
    private LocalDateTime createdAt;
}
