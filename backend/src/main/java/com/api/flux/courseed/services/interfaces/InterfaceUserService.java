package com.api.flux.courseed.services.interfaces;

import com.api.flux.courseed.projections.dtos.UpdateUserEmailDto;
import com.api.flux.courseed.projections.dtos.UpdateUserPasswordDto;
import com.api.flux.courseed.projections.dtos.UpdateUserRolesDto;
import com.api.flux.courseed.projections.dtos.UserDto;

import reactor.core.publisher.Flux;
import reactor.core.publisher.Mono;

public interface InterfaceUserService {
    Flux<UserDto> getAllUsers();
    Mono<UserDto> getUserById(String id);
    Mono<UserDto> getUserByEmail(String email);
    Mono<Object> updateUserEmail(String id, UpdateUserEmailDto updateUserEmailDto);
    Mono<UserDto> updateUserPassword(String id, UpdateUserPasswordDto updateUserPasswordDto);
    Mono<UserDto> updateUserRoles(String id, UpdateUserRolesDto updateUserRolesDto);
    Mono<Boolean> deleteUser(String id);
}
