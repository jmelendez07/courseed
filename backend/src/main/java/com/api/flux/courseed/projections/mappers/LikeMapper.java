package com.api.flux.courseed.projections.mappers;

import org.mapstruct.Mapper;
import org.mapstruct.Mapping;

import com.api.flux.courseed.persistence.documents.Like;
import com.api.flux.courseed.projections.dtos.LikeDto;
import com.api.flux.courseed.projections.dtos.SaveLikeDto;

@Mapper(componentModel = "spring")
public interface LikeMapper {
    @Mapping(target = "course", ignore = true)
    @Mapping(target = "user", ignore = true)
    LikeDto toLikeDto(Like like);

    @Mapping(target = "id", ignore = true)
    @Mapping(target = "createdAt", ignore = true)
    @Mapping(target = "userId", ignore = true)
    Like toLike(SaveLikeDto saveLikeDto);
}
