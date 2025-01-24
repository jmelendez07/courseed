package com.api.flux.courseed.services.interfaces;

import java.security.Principal;

import com.api.flux.courseed.projections.dtos.LoginUserDto;
import com.api.flux.courseed.projections.dtos.RegisterUserDto;
import com.api.flux.courseed.projections.dtos.TokenDto;
import com.api.flux.courseed.projections.dtos.UpdateAuthPasswordDto;
import com.api.flux.courseed.projections.dtos.UserDto;

import reactor.core.publisher.Mono;

public interface InterfaceAuthService {
    Mono<UserDto> getAuthUser(Principal principal);
    Mono<TokenDto> login(LoginUserDto loginUserDto);
    Mono<Object> register(RegisterUserDto registerUserDto);
    Mono<UserDto> updatePassword(Principal principal, UpdateAuthPasswordDto updateAuthPasswordDto);
}
