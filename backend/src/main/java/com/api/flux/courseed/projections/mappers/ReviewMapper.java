package com.api.flux.courseed.projections.mappers;

import org.mapstruct.Mapper;
import org.mapstruct.Mapping;

import com.api.flux.courseed.persistence.documents.Review;
import com.api.flux.courseed.projections.dtos.ReviewDto;
import com.api.flux.courseed.projections.dtos.SaveReviewDto;

@Mapper(componentModel = "spring")
public interface ReviewMapper {
    @Mapping(target = "course", ignore = true)
    @Mapping(target = "user", ignore = true)
    ReviewDto toReviewDto(Review review);

    @Mapping(target = "id", ignore = true)
    @Mapping(target = "createdAt", ignore = true)
    @Mapping(target = "updatedAt", ignore = true)
    Review toReview(SaveReviewDto saveReviewDto);
}
