package com.api.flux.courseed.projections.mappers;

import org.mapstruct.Mapper;
import org.mapstruct.Mapping;

import com.api.flux.courseed.persistence.documents.Subscription;
import com.api.flux.courseed.projections.dtos.SaveSubscriptionDto;
import com.api.flux.courseed.projections.dtos.SubscriptionDto;

@Mapper(componentModel = "spring")
public interface SubscriptionMapper {
    
    @Mapping(target = "user", ignore = true)
    SubscriptionDto toSubscriptionDto(Subscription subscription);

    Subscription toSubscription(SaveSubscriptionDto saveSubscriptionDto);
}
