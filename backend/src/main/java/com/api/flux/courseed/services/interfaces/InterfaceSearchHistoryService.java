package com.api.flux.courseed.services.interfaces;

import java.security.Principal;

import org.springframework.data.domain.Page;

import com.api.flux.courseed.projections.dtos.SaveSearchHistoryDto;
import com.api.flux.courseed.projections.dtos.SearchHistoryDto;

import reactor.core.publisher.Mono;

public interface InterfaceSearchHistoryService {
    Mono<Page<SearchHistoryDto>> findByAuthUser(Principal principal, int page, int size);
    Mono<SearchHistoryDto> createSearchHistory(Principal principal, SaveSearchHistoryDto saveSearchHistoryDto);
}
