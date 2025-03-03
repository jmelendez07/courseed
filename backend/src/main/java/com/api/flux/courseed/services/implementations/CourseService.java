package com.api.flux.courseed.services.implementations;
import java.util.List;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import com.api.flux.courseed.persistence.documents.Category;
import com.api.flux.courseed.persistence.documents.Content;
import com.api.flux.courseed.persistence.documents.Course;
import com.api.flux.courseed.persistence.documents.Institution;
import com.api.flux.courseed.persistence.documents.Reaction;
import com.api.flux.courseed.persistence.documents.Review;
import com.api.flux.courseed.persistence.repositories.CategoryRepository;
import com.api.flux.courseed.persistence.repositories.ContentRepository;
import com.api.flux.courseed.persistence.repositories.CourseRepository;
import com.api.flux.courseed.persistence.repositories.InstitutionRepository;
import com.api.flux.courseed.persistence.repositories.ReactionRepository;
import com.api.flux.courseed.persistence.repositories.ReviewRepository;
import com.api.flux.courseed.persistence.repositories.UserRepository;
import com.api.flux.courseed.persistence.repositories.ViewRepository;
import com.api.flux.courseed.projections.dtos.CourseDto;
import com.api.flux.courseed.projections.dtos.CourseWithRatingAvg;
import com.api.flux.courseed.projections.dtos.CourseWithReviewsCountAndReactionsCount;
import com.api.flux.courseed.projections.dtos.ReactionDto;
import com.api.flux.courseed.projections.dtos.ReviewDto;
import com.api.flux.courseed.projections.dtos.SaveCourseDto;
import com.api.flux.courseed.projections.dtos.UserDto;
import com.api.flux.courseed.projections.dtos.ViewDto;
import com.api.flux.courseed.projections.mappers.CategoryMapper;
import com.api.flux.courseed.projections.mappers.ContentMapper;
import com.api.flux.courseed.projections.mappers.CourseMapper;
import com.api.flux.courseed.projections.mappers.InstitutionMapper;
import com.api.flux.courseed.projections.mappers.ReactionMapper;
import com.api.flux.courseed.projections.mappers.ReviewMapper;
import com.api.flux.courseed.projections.mappers.ViewMapper;
import com.api.flux.courseed.services.interfaces.InterfaceCourseService;
import com.api.flux.courseed.web.exceptions.CustomWebExchangeBindException;

import reactor.core.publisher.Flux;
import reactor.core.publisher.Mono;

@Service
public class CourseService implements InterfaceCourseService {

    private CourseRepository courseRepository;
    private CategoryRepository categoryRepository;
    private InstitutionRepository institutionRepository;
    private ReactionRepository reactionRepository;
    private ContentRepository contentRepository;
    private ReviewRepository reviewRepository;
    private ViewRepository viewRepository;
    private UserRepository userRepository;
    private CourseMapper courseMapper;
    private CategoryMapper categoryMapper;
    private InstitutionMapper institutionMapper;
    private ContentMapper contentMapper;
    private ReviewMapper reviewMapper;
    private ReactionMapper reactionMapper;
    private ViewMapper viewMapper;

    public CourseService(
        CourseRepository courseRepository, CategoryRepository categoryRepository, ReactionRepository reactionRepository,
        InstitutionRepository institutionRepository, ContentRepository contentRepository, ViewRepository viewRepository,
        ReviewRepository reviewRepository, UserRepository userRepository, CourseMapper courseMapper, CategoryMapper categoryMapper,
        InstitutionMapper institutionMapper, ContentMapper contentMapper,
        ReviewMapper reviewMapper, ReactionMapper reactionMapper, ViewMapper viewMapper
    ) {
        this.courseRepository = courseRepository;
        this.categoryRepository = categoryRepository;
        this.institutionRepository = institutionRepository;
        this.contentRepository = contentRepository;
        this.reviewRepository = reviewRepository;
        this.userRepository = userRepository;
        this.reactionRepository = reactionRepository;
        this.viewRepository = viewRepository;
        this.courseMapper = courseMapper;
        this.categoryMapper = categoryMapper;
        this.institutionMapper = institutionMapper;
        this.contentMapper = contentMapper;
        this.reviewMapper = reviewMapper;
        this.reactionMapper = reactionMapper;
        this.viewMapper = viewMapper;
    }

    @Override
    public Mono<Page<CourseDto>> getAllCourses(int page, int size) {
        Pageable pageable = PageRequest.of(page, size);

        return courseRepository.findAllBy(pageable)
            .flatMap(course -> {
                Mono<Category> categoryMono = categoryRepository.findById(course.getCategoryId());
                Mono<Institution> institutionMono = institutionRepository.findById(course.getInstitutionId());
                Flux<Content> contentFlux = contentRepository.findByCourseId(course.getId());
                Flux<Reaction> reactionFlux = reactionRepository.findByCourseId(course.getId());
                Flux<Review> reviewFlux = reviewRepository.findByCourseId(course.getId());

                return Mono.zip(categoryMono, institutionMono, contentFlux.collectList(), reactionFlux.collectList(), reviewFlux.collectList())
                    .map(tuple -> {
                        CourseDto courseDto = courseMapper.toCourseDto(course);
                        courseDto.setCategory(categoryMapper.toCategoryDto(tuple.getT1()));
                        courseDto.setInstitution(institutionMapper.toInstitutionDto(tuple.getT2()));
                        courseDto.setContents(tuple.getT3().stream()
                            .map(contentMapper::toContentDto)
                            .toList()
                        );
                        courseDto.setReactions(tuple.getT4().stream().map(reactionMapper::toReactionDto).toList());
                        courseDto.setReviews(tuple.getT5().stream()
                            .map(reviewMapper::toReviewDto)
                            .toList()
                        );

                        return courseDto;
                    });
            })
            .collectList()
            .zipWith(courseRepository.count())
            .map(p -> new PageImpl<>(p.getT1(), pageable, p.getT2()));
    }

    @Override
    public Mono<CourseDto> getCourseById(String id) {
        return courseRepository.findById(id)
            .flatMap(course -> {
                Mono<Category> categoryMono = categoryRepository.findById(course.getCategoryId());
                Mono<Institution> institutionMono = institutionRepository.findById(course.getInstitutionId());
                Flux<Content> contentFlux = contentRepository.findByCourseId(course.getId());
                Flux<ReactionDto> reactionFlux = reactionRepository.findByCourseId(course.getId())
                    .flatMap(reaction -> userRepository.findById(reaction.getUserId())
                        .map(user -> {
                            ReactionDto reactionDto = reactionMapper.toReactionDto(reaction);
                            reactionDto.setUser(new UserDto(user.getId(), user.getEmail()));
                            return reactionDto;
                        })
                    );

                Flux<ReviewDto> reviewFlux = reviewRepository.findByCourseId(course.getId())
                    .flatMap(review -> userRepository.findById(review.getUserId())
                        .map(user -> {
                            ReviewDto reviewDto = reviewMapper.toReviewDto(review);
                            reviewDto.setUser(new UserDto(user.getId(), user.getEmail()));
                            return reviewDto;
                        })
                    );

                Flux<ViewDto> viewFlux = viewRepository.findByCourseId(course.getId())
                    .flatMap(view -> userRepository.findById(view.getUserId())
                        .map(user -> {
                            ViewDto viewDto = viewMapper.toViewDto(view);
                            viewDto.setUser(new UserDto(user.getId(), user.getEmail()));
                            return viewDto;
                        })
                    );

                return Mono.zip(categoryMono, institutionMono, contentFlux.collectList(), reactionFlux.collectList(), reviewFlux.collectList(), viewFlux.collectList())
                    .map(tuple -> {
                        CourseDto courseDto = courseMapper.toCourseDto(course);
                        courseDto.setCategory(categoryMapper.toCategoryDto(tuple.getT1()));
                        courseDto.setInstitution(institutionMapper.toInstitutionDto(tuple.getT2()));
                        courseDto.setContents(tuple.getT3().stream()
                            .map(contentMapper::toContentDto)
                            .toList()
                        );
                        courseDto.setReactions(tuple.getT4().stream().toList());
                        courseDto.setReviews(tuple.getT5().stream().toList());
                        courseDto.setViews(tuple.getT6().stream().toList());

                        return courseDto;
                    });
            })
            .switchIfEmpty(Mono.error(
                new CustomWebExchangeBindException(
                    id, 
                    "courseId", 
                    "No hemos podido encontrar el curso indicado. Te sugerimos que verifiques la información y lo intentes de nuevo."
                ).getWebExchangeBindException())
            ); 
    }

    @Override
    public Mono<Page<CourseDto>> getCoursesByCategoryId(String categoryId, int page, int size) {

        Pageable pageable = PageRequest.of(page, size);

        return courseRepository.findByCategoryId(categoryId, pageable)
            .flatMap(course -> {
                Mono<Category> categoryMono = categoryRepository.findById(course.getCategoryId());
                Mono<Institution> institutionMono = institutionRepository.findById(course.getInstitutionId());
                Flux<Content> contentFlux = contentRepository.findByCourseId(course.getId());
                Flux<Reaction> reactionFlux = reactionRepository.findByCourseId(course.getId());
                Flux<Review> reviewFlux = reviewRepository.findByCourseId(course.getId());

                return Mono.zip(categoryMono, institutionMono, contentFlux.collectList(), reactionFlux.collectList(), reviewFlux.collectList())
                    .map(tuple -> {
                        CourseDto courseDto = courseMapper.toCourseDto(course);
                        courseDto.setCategory(categoryMapper.toCategoryDto(tuple.getT1()));
                        courseDto.setInstitution(institutionMapper.toInstitutionDto(tuple.getT2()));
                        courseDto.setContents(tuple.getT3().stream()
                            .map(contentMapper::toContentDto)
                            .toList()
                        );
                        courseDto.setReactions(tuple.getT4().stream().map(reactionMapper::toReactionDto).toList());
                        courseDto.setReviews(tuple.getT5().stream()
                            .map(reviewMapper::toReviewDto)
                            .toList()
                        );

                        return courseDto;
                    });
            })
            .switchIfEmpty(Mono.error(
                new CustomWebExchangeBindException(
                    categoryId, 
                    "categoryId", 
                    "No se encontraron cursos de la categoria indicada. Te sugerimos que verifiques la información y lo intentes de nuevo."
                ).getWebExchangeBindException())
            )
            .collectList()
            .zipWith(courseRepository.count())
            .map(p -> new PageImpl<>(p.getT1(), pageable, p.getT2()));
    }

    @Override
    public Mono<Page<CourseDto>> getCoursesByInstitutionId(String institutionId, int page, int size) {
        Pageable pageable = PageRequest.of(page, size);

        return courseRepository.findByInstitutionId(institutionId, pageable)
            .flatMap(course -> {
                Mono<Category> categoryMono = categoryRepository.findById(course.getCategoryId());
                Mono<Institution> institutionMono = institutionRepository.findById(course.getInstitutionId());
                Flux<Content> contentFlux = contentRepository.findByCourseId(course.getId());
                Flux<Reaction> reactionFlux = reactionRepository.findByCourseId(course.getId());
                Flux<Review> reviewFlux = reviewRepository.findByCourseId(course.getId());

                return Mono.zip(categoryMono, institutionMono, contentFlux.collectList(), reactionFlux.collectList(), reviewFlux.collectList())
                    .map(tuple -> {
                        CourseDto courseDto = courseMapper.toCourseDto(course);
                        courseDto.setCategory(categoryMapper.toCategoryDto(tuple.getT1()));
                        courseDto.setInstitution(institutionMapper.toInstitutionDto(tuple.getT2()));
                        courseDto.setContents(tuple.getT3().stream()
                            .map(contentMapper::toContentDto)
                            .toList()
                        );
                        courseDto.setReactions(tuple.getT4().stream()
                            .map(reactionMapper::toReactionDto)
                            .toList()
                        );
                        courseDto.setReviews(tuple.getT5().stream()
                            .map(reviewMapper::toReviewDto)
                            .toList()
                        );

                        return courseDto;
                    });
            })
            .switchIfEmpty(Mono.error(
                new CustomWebExchangeBindException(
                    institutionId, 
                    "institutionId", 
                    "No se encontraron cursos de la institución indicada. Te sugerimos que verifiques la información y lo intentes de nuevo."
                ).getWebExchangeBindException())
            )
            .collectList()
            .zipWith(courseRepository.count())
            .map(p -> new PageImpl<>(p.getT1(), pageable, p.getT2()));
    }
    
    @Override
    public Mono<Page<CourseDto>> searchCoursesByText(String text, int page, int size) {
        Pageable pageable = PageRequest.of(page, size);

        return courseRepository.searchCourses(text, pageable)
            .flatMap(course -> {
                Mono<Category> categoryMono = categoryRepository.findById(course.getCategoryId());
                Mono<Institution> institutionMono = institutionRepository.findById(course.getInstitutionId());
                Flux<Content> contentFlux = contentRepository.findByCourseId(course.getId());
                Flux<Reaction> reactionFlux = reactionRepository.findByCourseId(course.getId());
                Flux<Review> reviewFlux = reviewRepository.findByCourseId(course.getId());

                return Mono.zip(categoryMono, institutionMono, contentFlux.collectList(), reactionFlux.collectList(), reviewFlux.collectList())
                    .map(tuple -> {
                        CourseDto courseDto = courseMapper.toCourseDto(course);
                        courseDto.setCategory(categoryMapper.toCategoryDto(tuple.getT1()));
                        courseDto.setInstitution(institutionMapper.toInstitutionDto(tuple.getT2()));
                        courseDto.setContents(tuple.getT3().stream()
                            .map(contentMapper::toContentDto)
                            .toList()
                        );
                        courseDto.setReactions(tuple.getT4().stream()
                            .map(reactionMapper::toReactionDto)
                            .toList()
                        );
                        courseDto.setReviews(tuple.getT5().stream()
                            .map(reviewMapper::toReviewDto)
                            .toList()
                        );

                        return courseDto;
                    });
            })
            .collectList()
            .zipWith(courseRepository.count())
            .map(p -> new PageImpl<>(p.getT1(), pageable, p.getT2()));
    }

    @Override
    public Mono<List<CourseWithReviewsCountAndReactionsCount>> getTopCoursesWithReviewsAndReactions(int page, int size) {
        return courseRepository.findAll()
            .flatMap(course -> {
                Mono<Long> reviewsCount = reviewRepository.countByCourseId(course.getId());
                Mono<Long> reactionsCount = reactionRepository.countByCourseId(course.getId());

                return Mono.zip(reviewsCount, reactionsCount)
                    .map(tuple -> new CourseWithReviewsCountAndReactionsCount(course.getId(), course.getTitle(), tuple.getT1(), tuple.getT2()));
            })
            .sort((c1, c2) -> Long.compare(c2.getTotalReactions() + c2.getTotalReviews(), c1.getTotalReactions() + c1.getTotalReviews()))
            .skip(page * size)
            .take(size)
            .collectList();
    }

    @Override
    public Mono<List<CourseWithRatingAvg>> getTopCoursesWithRatingAvg(int size) {
        return reviewRepository.findTopRatedCourses(size)
            .flatMap(reviewAvg -> courseRepository.findById(reviewAvg.getCourseId())
                .map(course -> new CourseWithRatingAvg(course.getId(), course.getTitle(), reviewAvg.getRating()))
            )
            .collectList();
    }

    @Override
    public Mono<CourseDto> createCourse(SaveCourseDto saveCourseDto) {
        return categoryRepository.findById(saveCourseDto.getCategoryId())
            .flatMap(category -> institutionRepository.findById(saveCourseDto.getInstitutionId())
                .flatMap(institution -> courseRepository.save(courseMapper.toCourse(saveCourseDto))
                    .flatMap(course -> this.getCourseById(course.getId()))
                )
                .switchIfEmpty(Mono.error(
                    new CustomWebExchangeBindException(
                        saveCourseDto.getInstitutionId(), 
                        "institutionId", 
                        "No hemos podido encontrar la institución indicada. Te sugerimos que verifiques la información y lo intentes de nuevo."
                    ).getWebExchangeBindException()
                ))
            )
            .switchIfEmpty(Mono.error(
                new CustomWebExchangeBindException(
                    saveCourseDto.getCategoryId(), 
                    "categoryId", 
                    "No hemos podido encontrar la categoría indicada. Te sugerimos que verifiques la información y lo intentes de nuevo."
                ).getWebExchangeBindException()
            ));
    }

    @Override
    public Mono<CourseDto> updateCourse(String id, SaveCourseDto saveCourseDto) {
        return courseRepository.findById(id)
            .flatMap(course -> categoryRepository.findById(saveCourseDto.getCategoryId())
                .flatMap(category -> institutionRepository.findById(saveCourseDto.getInstitutionId())
                    .flatMap(institution -> {
                        Course courseToUpdate = courseMapper.toCourse(saveCourseDto);
                        courseToUpdate.setId(course.getId());

                        return courseRepository.save(courseToUpdate)
                            .flatMap(updatedCourse -> this.getCourseById(updatedCourse.getId()));
                    })
                    .switchIfEmpty(Mono.error(
                        new CustomWebExchangeBindException(
                            saveCourseDto.getInstitutionId(), 
                            "institutionId", 
                            "No hemos podido encontrar la institución indicada. Te sugerimos que verifiques la información y lo intentes de nuevo."
                        ).getWebExchangeBindException()
                    ))    
                )
                .switchIfEmpty(Mono.error(
                    new CustomWebExchangeBindException(
                        saveCourseDto.getCategoryId(), 
                        "categoryId", 
                        "No hemos podido encontrar la categoría indicada. Te sugerimos que verifiques la información y lo intentes de nuevo."
                    ).getWebExchangeBindException()
                ))
            )
            .switchIfEmpty(Mono.error(
                new CustomWebExchangeBindException(
                    id, 
                    "courseId", 
                    "No hemos podido encontrar el curso indicado. Te sugerimos que verifiques la información y lo intentes de nuevo."
                ).getWebExchangeBindException())
            );
    }

    @Override
    public Mono<Boolean> deleteCourse(String id) {
        return courseRepository.findById(id)
            .flatMap(course -> 
                courseRepository.deleteById(id)
                    .then(Mono.just(true))
            )
            .switchIfEmpty(Mono.error(
                new CustomWebExchangeBindException(
                    id, 
                    "courseId", 
                    "No hemos podido encontrar el curso indicado. Te sugerimos que verifiques la información y lo intentes de nuevo."
                ).getWebExchangeBindException())
            );
    }
    
}
