package com.api.flux.courseed.persistence.documents;

import java.util.List;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import lombok.Data;

@Document(collection = "roles")
@Data
public class Role {
    @Id
    private String id;
    private String name;
    private List<String> usersId;
}
