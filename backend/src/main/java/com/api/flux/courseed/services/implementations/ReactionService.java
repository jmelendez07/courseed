package com.api.flux.courseed.services.implementations;

import java.security.Principal;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import com.api.flux.courseed.persistence.documents.Reaction;
import com.api.flux.courseed.persistence.repositories.CourseRepository;
import com.api.flux.courseed.persistence.repositories.ReactionRepository;
import com.api.flux.courseed.persistence.repositories.UserRepository;
import com.api.flux.courseed.projections.dtos.ReactionDto;
import com.api.flux.courseed.projections.dtos.SaveReactionDto;
import com.api.flux.courseed.projections.mappers.CourseMapper;
import com.api.flux.courseed.projections.mappers.ReactionMapper;
import com.api.flux.courseed.projections.mappers.UserMapper;
import com.api.flux.courseed.services.interfaces.InterfaceReactionService;
import com.api.flux.courseed.web.exceptions.CustomWebExchangeBindException;

import reactor.core.publisher.Mono;

@Service
public class ReactionService implements InterfaceReactionService {

    @Autowired
    private ReactionRepository reactionRepository;
    
    @Autowired
    private UserRepository userRepository;

    @Autowired
    private ReactionMapper reactionMapper;

    @Autowired
    private CourseRepository courseRepository;

    @Autowired
    private CourseMapper courseMapper;

    @Autowired
    private UserMapper userMapper;

    @Override
    public Mono<Page<ReactionDto>> findReactionsByCourseId(String courseId, int page, int size) {
        Pageable pageable = PageRequest.of(page, size);

        return reactionRepository.findByCourseId(courseId, pageable)
            .map(reactionMapper::toReactionDto)
            .collectList()
            .zipWith(reactionRepository.count())
            .map(p -> new PageImpl<>(p.getT1(), pageable, p.getT2()));
    }

    @Override
    public Mono<Object> createReaction(Principal principal, SaveReactionDto saveReactionDto) {
        return userRepository.findByEmail(principal.getName())
            .flatMap(user -> courseRepository.findById(saveReactionDto.getCourseId())
                .flatMap(course -> reactionRepository.findByCourseIdAndUserId(user.getId(), course.getId())
                    .flatMap(reaction -> Mono.error(
                        new CustomWebExchangeBindException(
                            saveReactionDto.getCourseId(), 
                            "courseId",
                            "¡Genial que reacciones al curso! Ten en cuenta que solo se permite una reacción por usuario."
                        ).getWebExchangeBindException()
                    ))
                    .switchIfEmpty(Mono.defer(() -> {
                        Reaction reaction = reactionMapper.toReaction(saveReactionDto);
                        reaction.setUserId(user.getId());
                        return reactionRepository.save(reaction)
                            .flatMap(createdReaction -> {
                                ReactionDto reactionDto = reactionMapper.toReactionDto(reaction);
                                reactionDto.setCourse(courseMapper.toCourseDto(course));
                                reactionDto.setUser(userMapper.toUserDto(user));

                                return Mono.just(reactionDto);
                            });
                    }))
                )
                .switchIfEmpty(Mono.error(
                    new CustomWebExchangeBindException(
                        saveReactionDto.getCourseId(), 
                        "courseId", 
                        "No hemos podido encontrar el curso indicado. Te sugerimos que verifiques la información y lo intentes de nuevo."
                    ).getWebExchangeBindException())
                )
            )
            .switchIfEmpty(Mono.error(
                new CustomWebExchangeBindException(
                    principal.getName(), 
                    "auth", 
                    "Parece que el usuario autenticado no se encuentra en el sistema. Te recomendamos cerrar sesión y volver a ingresar."
                ).getWebExchangeBindException()
            ));
    }

    @Override
    public Mono<ReactionDto> updateReaction(Principal principal, SaveReactionDto saveReactionDto) {
        return userRepository.findByEmail(principal.getName())
            .flatMap(user -> courseRepository.findById(saveReactionDto.getCourseId())
                .flatMap(course -> reactionRepository.findByCourseIdAndUserId(course.getId(), user.getId())
                    .flatMap(reaction -> {
                        reaction.setType(saveReactionDto.getType());
                        return reactionRepository.save(reaction)
                            .map(reactionMapper::toReactionDto)
                            .map(updatedReaction -> {
                                updatedReaction.setCourse(courseMapper.toCourseDto(course));
                                updatedReaction.setUser(userMapper.toUserDto(user));
                                return updatedReaction;
                            });
                    })
                    .switchIfEmpty(Mono.error(
                        new CustomWebExchangeBindException(
                            saveReactionDto.getCourseId(), 
                            "courseId",
                            "No hemos podido encontrar la reacción indicada. Te sugerimos que verifiques la información y lo intentes de nuevo."
                        ).getWebExchangeBindException()
                    ))
                )
                .switchIfEmpty(Mono.error(
                    new CustomWebExchangeBindException(
                        saveReactionDto.getCourseId(), 
                        "courseId", 
                        "No hemos podido encontrar el curso indicado. Te sugerimos que verifiques la información y lo intentes de nuevo."
                    ).getWebExchangeBindException())
                )
            )
            .switchIfEmpty(Mono.error(
                new CustomWebExchangeBindException(
                    principal.getName(), 
                    "auth", 
                    "Parece que el usuario autenticado no se encuentra en el sistema. Te recomendamos cerrar sesión y volver a ingresar."
                ).getWebExchangeBindException()
            ));
    }

    @Override
    public Mono<Boolean> deleteReaction(Principal principal, String reactionId) {
        return userRepository.findByEmail(principal.getName())
            .flatMap(user -> reactionRepository.findById(reactionId)
                .flatMap(reaction -> {
                    if (reaction.getUserId().equals(user.getId())) {
                        return reactionRepository.deleteById(reaction.getId())
                            .then(Mono.just(true));
                    } else {
                        return Mono.error(
                            new CustomWebExchangeBindException(
                                principal.getName(), 
                                "auth", 
                                "No tiene la autorización necesaria para eliminar una reaccion que corresponde a otro usuario."
                            ).getWebExchangeBindException()
                        );
                    }
                })
                .switchIfEmpty(Mono.error(
                    new CustomWebExchangeBindException(
                        reactionId, 
                        "reactionId", 
                        "No hemos podido encontrar la reacción indicada. Te sugerimos que verifiques la información y lo intentes de nuevo."
                    ).getWebExchangeBindException()
                ))
            )
            .switchIfEmpty(Mono.error(
                new CustomWebExchangeBindException(
                    principal.getName(), 
                    "auth", 
                    "Parece que el usuario autenticado no se encuentra en el sistema. Te recomendamos cerrar sesión y volver a ingresar."
                ).getWebExchangeBindException()
            ));
    }
    
}
