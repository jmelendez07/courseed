package com.api.flux.courseed.services.implementations;

import java.security.Principal;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import com.api.flux.courseed.persistence.documents.Subscription;
import com.api.flux.courseed.persistence.repositories.SubscriptionRepository;
import com.api.flux.courseed.persistence.repositories.UserRepository;
import com.api.flux.courseed.projections.dtos.SaveSubscriptionDto;
import com.api.flux.courseed.projections.dtos.SubscriptionDto;
import com.api.flux.courseed.projections.mappers.SubscriptionMapper;
import com.api.flux.courseed.projections.mappers.UserMapper;
import com.api.flux.courseed.services.interfaces.InterfaceSubscriptionService;
import com.api.flux.courseed.web.exceptions.CustomWebExchangeBindException;

import reactor.core.publisher.Mono;

@Service
public class SubscriptionService implements InterfaceSubscriptionService {

    @Autowired
    private SubscriptionRepository subscriptionRepository;

    @Autowired
    private SubscriptionMapper subscriptionMapper;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private UserMapper userMapper;

    @Override
    public Mono<Page<SubscriptionDto>> findByAuthUser(Principal principal, int page, int size) {
        Pageable pageable = PageRequest.of(page, size);

        return userRepository.findByEmail(principal.getName())
        .flatMap(user -> 
            subscriptionRepository.findByUserIdOrderByCreatedAtDesc(user.getId(), pageable)
                .map(subscription -> {
                    SubscriptionDto subscriptionDto = subscriptionMapper.toSubscriptionDto(subscription);
                    subscriptionDto.setUser(userMapper.toUserDto(user));
                    return subscriptionDto;
                })
                .collectList()
                .zipWith(subscriptionRepository.countByUserId(user.getId()))
                .map(tuple -> new PageImpl<>(tuple.getT1(), pageable, tuple.getT2()))
        );
    }

    @Override
    public Mono<SubscriptionDto> createSubscription(SaveSubscriptionDto saveSubscriptionDto) {
        return userRepository.findById(saveSubscriptionDto.getUserId())
            .flatMap(user -> {
                Subscription subscription = subscriptionMapper.toSubscription(saveSubscriptionDto);
                return subscriptionRepository.save(subscription)
                    .map(savedSubscription -> {
                        SubscriptionDto subscriptionDto = subscriptionMapper.toSubscriptionDto(savedSubscription);
                        subscriptionDto.setUser(userMapper.toUserDto(user));
                        return subscriptionDto;
                    });
            })
            .switchIfEmpty(Mono.error(
                new CustomWebExchangeBindException(
                    saveSubscriptionDto.getUserId(), 
                    "userId", 
                    "Parece que el usuario no se encuentra en el sistema."
                ).getWebExchangeBindException()
            ));
    }
    
}
