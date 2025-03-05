package com.api.flux.courseed.web.controllers;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.reactive.function.server.ServerRequest;
import org.springframework.web.reactive.function.server.ServerResponse;

import com.api.flux.courseed.projections.dtos.LoginUserDto;
import com.api.flux.courseed.projections.dtos.RegisterUserDto;
import com.api.flux.courseed.projections.dtos.UpdateAuthPasswordDto;
import com.api.flux.courseed.projections.dtos.UpdateProfileDto;
import com.api.flux.courseed.services.implementations.AuthService;
import com.api.flux.courseed.services.implementations.ValidationService;

import reactor.core.publisher.Mono;

public class AuthController {

    @Autowired
    private AuthService authService;

    @Autowired
    private ValidationService validationService;

    public Mono<ServerResponse> getAuthUser(ServerRequest serverRequest) {
        return serverRequest.principal()
            .flatMap(principal -> authService.getAuthUser(principal)
                .flatMap(userDto -> ServerResponse.ok().bodyValue(userDto))
            )
            .switchIfEmpty(ServerResponse.notFound().build());
    }

    public Mono<ServerResponse> login(ServerRequest serverRequest) {
        return serverRequest.bodyToMono(LoginUserDto.class)
            .doOnNext(validationService::validate)
            .flatMap(loginUserDto -> authService.login(loginUserDto)
                .flatMap(tokenDto -> ServerResponse.ok().bodyValue(tokenDto))
                .switchIfEmpty(ServerResponse.notFound().build())
            );
    }

    public Mono<ServerResponse> register(ServerRequest serverRequest) {
        return serverRequest.bodyToMono(RegisterUserDto.class)
            .doOnNext(validationService::validate)
            .flatMap(registerUserDto -> authService.register(registerUserDto)
                .flatMap(userDto -> ServerResponse.ok().bodyValue(userDto))
                .switchIfEmpty(ServerResponse.notFound().build())
            );
    }

    public Mono<ServerResponse> updatePassword(ServerRequest serverRequest) {
        return serverRequest.bodyToMono(UpdateAuthPasswordDto.class)
            .doOnNext(validationService::validate)
            .flatMap(updateAuthPasswordDto -> serverRequest.principal()
                .flatMap(principal -> authService.updatePassword(principal, updateAuthPasswordDto)
                    .flatMap(tokenDto -> ServerResponse.ok().bodyValue(tokenDto))
                    .switchIfEmpty(ServerResponse.notFound().build())
                )
            );
    }

    public Mono<ServerResponse> updateProfile(ServerRequest serverRequest) {
        return serverRequest.bodyToMono(UpdateProfileDto.class)
            .doOnNext(validationService::validate)
            .flatMap(updateProfileDto -> serverRequest.principal()
                .flatMap(principal -> authService.updateProfile(principal, updateProfileDto)
                    .flatMap(userDto -> ServerResponse.ok().bodyValue(userDto))
                    .switchIfEmpty(ServerResponse.notFound().build())
                )
            );
    } 
    
}