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
import com.api.flux.courseed.persistence.documents.View;
import com.api.flux.courseed.persistence.repositories.CategoryRepository;
import com.api.flux.courseed.persistence.repositories.ProfileRepository;
import com.api.flux.courseed.persistence.repositories.ReactionRepository;
import com.api.flux.courseed.persistence.repositories.ReviewRepository;
import com.api.flux.courseed.persistence.repositories.UserRepository;
import com.api.flux.courseed.persistence.repositories.ViewRepository;
import com.api.flux.courseed.projections.dtos.LoginUserDto;
import com.api.flux.courseed.projections.dtos.ProfileDto;
import com.api.flux.courseed.projections.dtos.RegisterSubscriptorDto;
import com.api.flux.courseed.projections.dtos.RegisterUserDto;
import com.api.flux.courseed.projections.dtos.TokenDto;
import com.api.flux.courseed.projections.dtos.UpdateAuthPasswordDto;
import com.api.flux.courseed.projections.dtos.UpdateProfileDto;
import com.api.flux.courseed.projections.dtos.UserDto;
import com.api.flux.courseed.projections.mappers.CategoryMapper;
import com.api.flux.courseed.projections.mappers.ProfileMapper;
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
    private ProfileMapper profileMapper;

    @Autowired
    private CategoryMapper categoryMapper;

    @Autowired
    private ReactionRepository reactionRepository;

    @Autowired
    private ViewRepository viewRepository;

    @Autowired
    private ProfileRepository profileRepository;

    @Autowired
    private CategoryRepository categoryRepository;

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
                Flux<Reaction> reactionFlux = reactionRepository.findByUserId(user.getId());
                Flux<View> viewFlux = viewRepository.findByUserId(user.getId());
                Mono<ProfileDto> profileMono = profileRepository.findByUserId(user.getId())
                    .flatMap(profile -> categoryRepository.findById(profile.getInterest()) 
                        .map(categoryMapper::toCategoryDto)
                        .map(category -> {
                            ProfileDto profileDto = profileMapper.toProfileDto(profile);
                            profileDto.setInterest(category);
                            return profileDto;
                        })
                        .defaultIfEmpty(profileMapper.toProfileDto(profile))
                    )
                    .defaultIfEmpty(new ProfileDto());

                return Mono.zip(reviewFlux.collectList(), reactionFlux.collectList(), viewFlux.collectList(), profileMono)
                    .map(tuple -> {
                        UserDto userDto = userMapper.toUserDto(user);
                        userDto.setReviews(tuple.getT1().size());
                        userDto.setReactions(tuple.getT2().size());
                        userDto.setViews(tuple.getT3().size());
                        userDto.setProfile(tuple.getT4());

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
    public Mono<TokenDto> updatePassword(Principal principal, UpdateAuthPasswordDto updateAuthPasswordDto) {
        return userRepository.findByEmail(principal.getName())
            .filter(user -> passwordEncoder.matches(updateAuthPasswordDto.getCurrentPassword(), user.getPassword()))
            .flatMap(user -> {
                if (!updateAuthPasswordDto.getNewPassword().equals(updateAuthPasswordDto.getConfirmNewPassword())) {
                    return Mono.error(new CustomWebExchangeBindException(
                        updateAuthPasswordDto.getConfirmNewPassword(), 
                        "confirmNewPassword", 
                        "La confirmación de la contraseña no coincide con la contraseña nueva. Por favor, revísalo e inténtalo de nuevo."
                    ).getWebExchangeBindException());   
                }

                user.setPassword(passwordEncoder.encode(updateAuthPasswordDto.getNewPassword()));
                return userRepository.save(user)
                    .flatMap(savedUser -> {
                        UsernamePasswordAuthenticationToken authenticationToken = new UsernamePasswordAuthenticationToken(
                            savedUser.getEmail(), 
                            savedUser.getPassword(), 
                            savedUser.getRoles().stream().map(SimpleGrantedAuthority::new).toList()
                        );
                        return reactiveAuthenticationManager.authenticate(authenticationToken)
                        .map(auth -> new TokenDto(jwtUtil.create(auth)));
                    });
            })
            .switchIfEmpty(Mono.error(
                new CustomWebExchangeBindException(
                    updateAuthPasswordDto,
                    "auth", 
                    "El correo electrónico o la contraseña proporcionados son incorrectos. Por favor, verifica tus credenciales e intenta nuevamente."
                ).getWebExchangeBindException())
            );
    }

    public Mono<UserDto> updateProfile(Principal principal, UpdateProfileDto updateProfileDto) {
        return userRepository.findByEmail(principal.getName())
            .flatMap(user -> {
                user.setAcademicLevel(updateProfileDto.getAcademicLevel());
                user.setSex(updateProfileDto.getSex());
                user.setBirthdate(updateProfileDto.getBirthdate());

                return userRepository.save(user)
                    .map(userMapper::toUserDto);
            })
            .switchIfEmpty(Mono.error(
                new CustomWebExchangeBindException(
                    updateProfileDto,
                    "auth", 
                    "El correo electrónico o la contraseña proporcionados son incorrectos. Por favor, verifica tus credenciales e intenta nuevamente."
                ).getWebExchangeBindException())
            );
    }

    @Override
    public Mono<TokenDto> subscribe(Principal principal) {
        return userRepository.findByEmail(principal.getName())
            .flatMap(user -> {
                user.setRoles(Arrays.asList(Roles.PREFIX + Roles.SUBSCRIBER));

                return userRepository.save(user)
                    .flatMap(savedUser -> {
                        UsernamePasswordAuthenticationToken authenticationToken = new UsernamePasswordAuthenticationToken(
                            savedUser.getEmail(), 
                            savedUser.getPassword(), 
                            savedUser.getRoles().stream().map(SimpleGrantedAuthority::new).toList()
                        );
                        return reactiveAuthenticationManager.authenticate(authenticationToken)
                        .map(auth -> new TokenDto(jwtUtil.create(auth)));
                    });
            });
    }

    @Override
    public Mono<Object> registerSubscriptor(RegisterSubscriptorDto registerSubscriptorDto) {
        if (!registerSubscriptorDto.getPassword().equals(registerSubscriptorDto.getConfirmPassword())) {
            return Mono.error(new CustomWebExchangeBindException(
                registerSubscriptorDto, 
                "confirmPassword", 
                "La confirmación de la contraseña no coincide con la contraseña original."
            ).getWebExchangeBindException());
        }

        return userRepository.findByEmail(registerSubscriptorDto.getEmail())
            .flatMap(existingUser -> Mono.error(
                new CustomWebExchangeBindException(
                    registerSubscriptorDto.getEmail(), 
                    "email", 
                    "El email que intentas registrar ya está asociado a otra cuenta."
                ).getWebExchangeBindException()
            ))
            .switchIfEmpty(Mono.defer(() -> {
                User user = userMapper.toUser(registerSubscriptorDto);
                user.setPassword(passwordEncoder.encode(user.getPassword()));
                user.setRoles(Arrays.asList(Roles.PREFIX + Roles.SUBSCRIBER));

                return userRepository.save(user)
                    .flatMap(savedUser -> {
                        UsernamePasswordAuthenticationToken authenticationToken = new UsernamePasswordAuthenticationToken(
                            savedUser.getEmail(), 
                            savedUser.getPassword(), 
                            savedUser.getRoles().stream().map(SimpleGrantedAuthority::new).toList()
                        );

                        return reactiveAuthenticationManager.authenticate(authenticationToken)
                            .map(auth -> new TokenDto(jwtUtil.create(auth)));
                    });
            }));
    }
}
