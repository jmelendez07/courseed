package com.api.flux.courseed.persistence.documents;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import lombok.Data;

@Document(collection = "roles")
@Data
public class Role {
    @Id
    private String id;
    private String name;

    public Role(String name) {
        this.name = name;
    }
}
