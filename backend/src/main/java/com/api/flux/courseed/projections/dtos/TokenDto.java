package com.api.flux.courseed.projections.dtos;

import java.io.Serializable;

import lombok.AllArgsConstructor;
import lombok.Data;

@Data
@AllArgsConstructor
public class TokenDto implements Serializable {
    private String token;
}
