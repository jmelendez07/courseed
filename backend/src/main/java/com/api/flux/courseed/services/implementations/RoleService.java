package com.api.flux.courseed.services.implementations;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.api.flux.courseed.persistence.documents.Role;
import com.api.flux.courseed.persistence.repositories.RoleRepository;
import com.api.flux.courseed.services.interfaces.InterfaceRoleService;

import reactor.core.publisher.Flux;
import reactor.core.publisher.Mono;

@Service
public class RoleService implements InterfaceRoleService {

    @Autowired
    private RoleRepository roleRepository;

    @Override
    public Flux<Role> findAll() {
        return roleRepository.findAll();
    }

    @Override
    public Mono<Role> findById(String id) {
        return roleRepository.findById(id);
    }

    @Override
    public Mono<Role> findByName(String name) {
        return roleRepository.findByName(name);
    }

    @Override
    public Mono<Role> create(Role role) {
        return roleRepository.save(role);
    }

    @Override
    public Mono<Void> deleteById(String id) {
        return roleRepository.deleteById(id);
    }

}
