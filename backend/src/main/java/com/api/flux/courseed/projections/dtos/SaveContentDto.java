package com.api.flux.courseed.projections.dtos;

import java.io.Serializable;
import lombok.Data;

@Data
public class SaveContentDto implements Serializable {
    private String description;
    private String courseId;   
}
