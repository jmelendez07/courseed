package com.api.flux.courseed.services.implementations;

import java.security.Principal;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import com.api.flux.courseed.persistence.documents.SearchHistory;
import com.api.flux.courseed.persistence.repositories.SearchHistoryRepository;
import com.api.flux.courseed.persistence.repositories.UserRepository;
import com.api.flux.courseed.projections.dtos.SaveSearchHistoryDto;
import com.api.flux.courseed.projections.dtos.SearchHistoryDto;
import com.api.flux.courseed.projections.mappers.SearchHistoryMapper;
import com.api.flux.courseed.projections.mappers.UserMapper;
import com.api.flux.courseed.services.interfaces.InterfaceSearchHistoryService;

import reactor.core.publisher.Mono;

@Service
public class SearchHistoryService implements InterfaceSearchHistoryService {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private SearchHistoryRepository searchHistoryRepository;

    @Autowired
    private SearchHistoryMapper searchHistoryMapper;

    @Autowired
    private UserMapper userMapper;

    @Override
    public Mono<Page<SearchHistoryDto>> findByAuthUser(Principal principal, int page, int size) {
        Pageable pageable = PageRequest.of(page, size);

        return userRepository.findByEmail(principal.getName())
            .flatMap(user -> searchHistoryRepository.findByUserIdOrderByCreatedAtDesc(user.getId(), pageable)
                .map(searchHistory -> {
                    SearchHistoryDto searchHistoryDto = searchHistoryMapper.toSearchHistoryDto(searchHistory);
                    searchHistoryDto.setUser(userMapper.toUserDto(user));

                    return searchHistoryDto;
                })
                .collectList()
                .zipWith(searchHistoryRepository.count())
                .map(p -> new PageImpl<>(p.getT1(), pageable, p.getT2()))
            );
    }

    @Override
    public Mono<SearchHistoryDto> createSearchHistory(Principal principal, SaveSearchHistoryDto saveSearchHistoryDto) {
        return userRepository.findByEmail(principal.getName())
            .flatMap(user -> {
                SearchHistory searchHistory = searchHistoryMapper.toSearchHistory(saveSearchHistoryDto);
                searchHistory.setUserId(user.getId());

                return searchHistoryRepository.save(searchHistory)
                    .map(savedSearchHistory -> {
                        SearchHistoryDto searchHistoryDto = searchHistoryMapper.toSearchHistoryDto(savedSearchHistory);
                        searchHistoryDto.setUser(userMapper.toUserDto(user));

                        return searchHistoryDto;
                    });
            });
    }
    
}
