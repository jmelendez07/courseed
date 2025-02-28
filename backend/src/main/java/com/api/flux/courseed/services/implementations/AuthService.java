package com.api.flux.courseed.services.implementations;

import java.security.Principal;
import java.util.Arrays;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.authentication.ReactiveAuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import com.api.flux.courseed.persistence.documents.Reaction;
import com.api.flux.courseed.persistence.documents.Review;
import com.api.flux.courseed.persistence.documents.User;
import com.api.flux.courseed.persistence.repositories.ReactionRepository;
import com.api.flux.courseed.persistence.repositories.ReviewRepository;
import com.api.flux.courseed.persistence.repositories.UserRepository;
import com.api.flux.courseed.projections.dtos.LoginUserDto;
import com.api.flux.courseed.projections.dtos.RegisterUserDto;
import com.api.flux.courseed.projections.dtos.TokenDto;
import com.api.flux.courseed.projections.dtos.UpdateAuthPasswordDto;
import com.api.flux.courseed.projections.dtos.UserDto;
import com.api.flux.courseed.projections.mappers.UserMapper;
import com.api.flux.courseed.services.interfaces.InterfaceAuthService;
import com.api.flux.courseed.services.interfaces.Roles;
import com.api.flux.courseed.web.config.JwtUtil;
import com.api.flux.courseed.web.exceptions.CustomWebExchangeBindException;

import reactor.core.publisher.Flux;
import reactor.core.publisher.Mono;

@Service
public class AuthService implements InterfaceAuthService {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private ReviewRepository reviewRepository;

    @Autowired
    private UserMapper userMapper;

    @Autowired
    private ReactionRepository reactionRepository;

    @Autowired
    private ReactiveAuthenticationManager reactiveAuthenticationManager;

    @Autowired
    private JwtUtil jwtUtil;

    @Autowired    
    private PasswordEncoder passwordEncoder;

    @Override
    public Mono<UserDto> getAuthUser(Principal principal) {
        return userRepository.findByEmail(principal.getName())
            .flatMap(user -> {
                Flux<Review> reviewFlux = reviewRepository.findByUserId(user.getId());
                Flux<Reaction> reactionFlux = reactionRepository.findByCourseId(user.getId());

                return Mono.zip(reviewFlux.collectList(), reactionFlux.collectList())
                    .map(tuple -> {
                        UserDto userDto = userMapper.toUserDto(user);
                        userDto.setReviews(tuple.getT1().size());
                        userDto.setReactions(tuple.getT2().size());

                        return userDto;
                    });
            })
            .switchIfEmpty(Mono.error(
                new CustomWebExchangeBindException(
                    principal.getName(), 
                    "auth", 
                    "Parece que el usuario autenticado no se encuentra en el sistema. Te recomendamos cerrar sesión y volver a ingresar."
                ).getWebExchangeBindException()
            ));
    }

    @Override
    public Mono<TokenDto> login(LoginUserDto loginUserDto) {
        return userRepository.findByEmail(loginUserDto.getEmail())
            .filter(user -> passwordEncoder.matches(loginUserDto.getPassword(), user.getPassword()))
            .flatMap(user -> {
                UsernamePasswordAuthenticationToken authenticationToken = new UsernamePasswordAuthenticationToken(
                    user.getEmail(), 
                    user.getPassword(), 
                    user.getRoles().stream().map(SimpleGrantedAuthority::new).toList()
                );
                return reactiveAuthenticationManager.authenticate(authenticationToken)
                    .map(auth -> new TokenDto(jwtUtil.create(auth)));
            })
            .switchIfEmpty(Mono.error(
                new CustomWebExchangeBindException(
                    loginUserDto, 
                    "auth", 
                    "El correo electrónico o la contraseña proporcionados son incorrectos. Por favor, verifica tus credenciales e intenta nuevamente."
                ).getWebExchangeBindException())
            ); 
            
    }

    @Override
    public Mono<Object> register(RegisterUserDto registerUserDto) {
        if (!registerUserDto.getPassword().equals(registerUserDto.getConfirmPassword())) {
            return Mono.error(new CustomWebExchangeBindException(
                registerUserDto, 
                "confirmPassword", 
                "La confirmación de la contraseña no coincide con la contraseña original. Por favor, revísalo e inténtalo de nuevo."
            ).getWebExchangeBindException());
        }

        return userRepository.findByEmail(registerUserDto.getEmail())
            .flatMap(existingUser -> Mono.error(
                new CustomWebExchangeBindException(
                    registerUserDto.getEmail(), 
                    "email", 
                    "El email que intentas registrar ya está asociado a otra cuenta. Por favor, intenta con un correo electrónico diferente."
                ).getWebExchangeBindException()
            ))
            .switchIfEmpty(Mono.defer(() -> {
                User user = userMapper.toUser(registerUserDto);
                user.setPassword(passwordEncoder.encode(user.getPassword()));
                user.setRoles(Arrays.asList(Roles.PREFIX + Roles.USER));

                return userRepository.save(user)
                    .map(savedUser -> userMapper.toUserDto(savedUser));

            }));
    }

    @Override
    public Mono<UserDto> updatePassword(Principal principal, UpdateAuthPasswordDto updateAuthPasswordDto) {
        return userRepository.findByEmail(principal.getName())
            .filter(user -> passwordEncoder.matches(updateAuthPasswordDto.getCurrentPassword(), user.getPassword()))
            .flatMap(user -> {
                if (!updateAuthPasswordDto.getNewPassword().equals(updateAuthPasswordDto.getConfirmNewPassword())) {
                    return Mono.error(new CustomWebExchangeBindException(
                        updateAuthPasswordDto.getConfirmNewPassword(), 
                        "confirmPassword", 
                        "La confirmación de la contraseña no coincide con la contraseña nueva. Por favor, revísalo e inténtalo de nuevo."
                    ).getWebExchangeBindException());   
                }

                user.setPassword(passwordEncoder.encode(updateAuthPasswordDto.getNewPassword()));
                return userRepository.save(user)
                    .map(userMapper::toUserDto);
            })
            .switchIfEmpty(Mono.error(
                new CustomWebExchangeBindException(
                    updateAuthPasswordDto,
                    "auth", 
                    "El correo electrónico o la contraseña proporcionados son incorrectos. Por favor, verifica tus credenciales e intenta nuevamente."
                ).getWebExchangeBindException())
            ); 
    }
}
