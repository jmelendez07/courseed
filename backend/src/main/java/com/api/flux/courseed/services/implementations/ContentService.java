package com.api.flux.courseed.services.implementations;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.api.flux.courseed.persistence.repositories.ContentRepository;
import com.api.flux.courseed.projections.dtos.ContentDto;
import com.api.flux.courseed.projections.dtos.SaveContentDto;
import com.api.flux.courseed.projections.mappers.ContentMapper;
import com.api.flux.courseed.services.interfaces.InterfaceContentService;

import reactor.core.publisher.Flux;
import reactor.core.publisher.Mono;

@Service
public class ContentService implements InterfaceContentService {

    @Autowired
    private ContentRepository contentRepository;

    @Autowired
    private ContentMapper contentMapper;

    @Override
    public Flux<ContentDto> getContentsByCourseId(String courseId) {
        return contentRepository.findByCourseId(courseId)
            .map(contentMapper::toContentDto); 
    }

    @Override
    public Mono<ContentDto> getContentById(String id) {
        return contentRepository.findById(id)
            .map(contentMapper::toContentDto);
    }

    @Override
    public Mono<ContentDto> createContent(SaveContentDto saveContentDto) {
        return contentRepository.save(contentMapper.toContent(saveContentDto))
            .map(contentMapper::toContentDto);
    }

    @Override
    public Mono<ContentDto> updateContent(String id, SaveContentDto saveContentDto) {
        return contentRepository.findById(id)
            .flatMap(existingContent -> {
                existingContent.setCourseId(saveContentDto.getCourseId());
                existingContent.setDescription(saveContentDto.getDescription());
                return contentRepository.save(existingContent);
            })
            .map(contentMapper::toContentDto)
            .onErrorReturn(new ContentDto());
    }

    @Override
    public Mono<Void> deleteContent(String id) {
        return contentRepository.deleteById(id);
    }

}
