package com.api.flux.courseed.projections.mappers;

import org.mapstruct.Mapper;

import com.api.flux.courseed.persistence.documents.User;
import com.api.flux.courseed.projections.dtos.UserDto;

@Mapper(componentModel = "spring")
public interface UserMapper {
    UserDto toUserDto(User user);
}
