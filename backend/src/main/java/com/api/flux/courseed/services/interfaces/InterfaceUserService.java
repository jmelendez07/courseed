package com.api.flux.courseed.services.interfaces;

import com.api.flux.courseed.persistence.documents.User;

import reactor.core.publisher.Flux;
import reactor.core.publisher.Mono;

public interface InterfaceUserService {
    Flux<User> getAllUsers();
    Mono<User> getUserById(String id);
    Mono<User> getUserByEmail(String email);
    Mono<User> createUser(User user);
    Mono<User> updateUser(String id, User user);
    Mono<Void> deleteUser(String id);
}
