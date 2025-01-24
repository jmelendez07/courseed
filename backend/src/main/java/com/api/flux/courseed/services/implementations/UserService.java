package com.api.flux.courseed.services.implementations;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import com.api.flux.courseed.persistence.repositories.UserRepository;
import com.api.flux.courseed.projections.dtos.UpdateUserEmailDto;
import com.api.flux.courseed.projections.dtos.UpdateUserPasswordDto;
import com.api.flux.courseed.projections.dtos.UpdateUserRolesDto;
import com.api.flux.courseed.projections.dtos.UserDto;
import com.api.flux.courseed.projections.mappers.UserMapper;
import com.api.flux.courseed.services.interfaces.InterfaceUserService;
import com.api.flux.courseed.services.interfaces.Roles;
import com.api.flux.courseed.web.exceptions.CustomWebExchangeBindException;

import reactor.core.publisher.Flux;
import reactor.core.publisher.Mono;

@Service
public class UserService implements InterfaceUserService {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private UserMapper userMapper;

    @Autowired    
    private PasswordEncoder passwordEncoder;

    @Override
    public Flux<UserDto> getAllUsers() {
        return userRepository.findAll()
            .map(userMapper::toUserDto);
    }

    @Override
    public Mono<UserDto> getUserById(String id) {
        return userRepository.findById(id)
            .map(userMapper::toUserDto)
            .switchIfEmpty(Mono.error(
                new CustomWebExchangeBindException(
                    id, 
                    "userId", 
                    "No hemos podido encontrar al usuario indicado. Te sugerimos que verifiques la información y lo intentes de nuevo."
                ).getWebExchangeBindException()
            ));
    }

    @Override
    public Mono<UserDto> getUserByEmail(String email) {
        return userRepository.findByEmail(email)
            .map(userMapper::toUserDto)
            .switchIfEmpty(Mono.error(
                new CustomWebExchangeBindException(
                    email, 
                    "email", 
                    "No hemos podido encontrar al usuario indicado por su email. Te sugerimos que verifiques y lo intentes nuevamente."
                ).getWebExchangeBindException()
            ));
    }

    @Override
    public Mono<Object> updateUserEmail(String id, UpdateUserEmailDto updateUserEmailDto) {
        return userRepository.findById(id)
            .flatMap(user -> userRepository.findByEmailAndIdNot(updateUserEmailDto.getEmail(), id)
                .flatMap(existingUserWithEmail -> Mono.error(
                    new CustomWebExchangeBindException(
                        updateUserEmailDto.getEmail(), 
                        "email", 
                        "El email que intentas registrar ya está asociado a otra cuenta. Por favor, intenta con un correo electrónico diferente."
                    ).getWebExchangeBindException()
                ))
                .switchIfEmpty(Mono.defer(() -> {
                    user.setEmail(updateUserEmailDto.getEmail());

                    return userRepository.save(user)
                        .map(userMapper::toUserDto);
                }))
            )
            .switchIfEmpty(Mono.error(
                new CustomWebExchangeBindException(
                    id, 
                    "userId", 
                    "No hemos podido encontrar al usuario indicado. Te sugerimos que verifiques la información y lo intentes de nuevo."
                ).getWebExchangeBindException()
            ));
    }

    @Override
    public Mono<UserDto> updateUserPassword(String id, UpdateUserPasswordDto updateUserPasswordDto) {
        return userRepository.findById(id)
            .flatMap(user -> {
                user.setPassword(passwordEncoder.encode(updateUserPasswordDto.getPassword()));
                return userRepository.save(user)
                    .map(userMapper::toUserDto);
            })
            .switchIfEmpty(Mono.error(
                new CustomWebExchangeBindException(
                    id, 
                    "userId", 
                    "No hemos podido encontrar al usuario indicado. Te sugerimos que verifiques la información y lo intentes de nuevo."
                ).getWebExchangeBindException()
            ));
    }

    @Override
    public Mono<UserDto> updateUserRoles(String id, UpdateUserRolesDto updateUserRolesDto) {
        return userRepository.findById(id)
            .flatMap(user -> {
                List<String> newRoles = updateUserRolesDto.getRoles().stream()
                    .filter(role -> role.equals(Roles.ADMIN) || role.equals(Roles.USER))
                    .map(role -> role.startsWith(Roles.PREFIX) ? role : Roles.PREFIX + role)
                    .toList();

                if (!newRoles.isEmpty()) {
                    user.setRoles(newRoles);
                    return userRepository.save(user)
                        .map(userMapper::toUserDto);
                } else {
                    return Mono.error(
                        new CustomWebExchangeBindException(
                            updateUserRolesDto.getRoles(), 
                            "roles", 
                            "No se pueden asignar roles que no están registrados a este usuario. Te sugerimos que verifiques la información y lo intentes de nuevo."
                        ).getWebExchangeBindException()
                    );
                }
            })
            .switchIfEmpty(Mono.error(
                new CustomWebExchangeBindException(
                    id, 
                    "userId", 
                    "No hemos podido encontrar al usuario indicado. Te sugerimos que verifiques la información y lo intentes de nuevo."
                ).getWebExchangeBindException()
            ));
    }

    @Override
    public Mono<Boolean> deleteUser(String id) {
        return userRepository.findById(id)
            .flatMap(user -> 
                userRepository.deleteById(id)
                    .then(Mono.just(true))
            )
            .switchIfEmpty(Mono.error(
                new CustomWebExchangeBindException(
                    id, 
                    "userId", 
                    "No hemos podido encontrar al usuario indicado. Te sugerimos que verifiques la información y lo intentes de nuevo."
                ).getWebExchangeBindException()
            ));
    }
    
}
