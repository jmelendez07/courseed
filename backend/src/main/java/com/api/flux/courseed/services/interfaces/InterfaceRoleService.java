package com.api.flux.courseed.services.interfaces;

import com.api.flux.courseed.persistence.documents.Role;

import reactor.core.publisher.Flux;
import reactor.core.publisher.Mono;

public interface InterfaceRoleService {
    public Flux<Role> findAll();
    public Mono<Role> findById(String id);
    public Mono<Role> findByName(String name);
    public Mono<Role> create(Role role);
    public Mono<Void> deleteById(String id);
}
