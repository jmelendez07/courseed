package com.api.flux.courseed.projections.mappers;

import org.mapstruct.Mapper;
import org.mapstruct.Mapping;

import com.api.flux.courseed.persistence.documents.Course;
import com.api.flux.courseed.projections.dtos.CourseDto;
import com.api.flux.courseed.projections.dtos.SaveCourseDto;

@Mapper(componentModel = "spring")
public interface CourseMapper {

    @Mapping(target = "id", ignore = true)
    Course toCourse(SaveCourseDto saveCourseDto);
    
    @Mapping(target = "category", ignore = true)
    @Mapping(target = "contents", ignore = true)
    @Mapping(target = "institution", ignore = true)
    @Mapping(target = "likes", ignore = true)
    @Mapping(target = "reviews", ignore = true)
    CourseDto toCourseDto(Course course);
}
