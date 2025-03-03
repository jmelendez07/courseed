package com.api.flux.courseed.services.interfaces;

import java.security.Principal;

import org.springframework.data.domain.Page;

import com.api.flux.courseed.projections.dtos.SaveViewDto;
import com.api.flux.courseed.projections.dtos.TotalViewsDto;
import com.api.flux.courseed.projections.dtos.ViewDto;

import reactor.core.publisher.Mono;

public interface InterfaceViewService {
    Mono<TotalViewsDto> getTotalViews();
    Mono<Page<ViewDto>> findViewsByCourseId(String courseId, int page, int size);
    Mono<Page<ViewDto>> findViewsByAuthUser(Principal principal, int page, int size);
    Mono<Object> createView(Principal principal, SaveViewDto saveViewDto);
}
